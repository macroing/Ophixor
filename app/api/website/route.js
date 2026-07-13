// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

import connect from "@/lib/database";
import Website from "@/models/Website";
import WebsitePage from "@/models/WebsitePage";
import WebsitePageData from "@/models/WebsitePageData";
import { canCreateWebsite } from "@/lib/services/plan-services";
import { createDefaultPage, createPageSchema } from "@/lib/web-page-builder/components/page/PageSchema";
import { validatePage } from "@/lib/web-page-builder/validation/validators";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 401 });
    }

    const allowedSortFields = ["createdAt", "updatedAt", "name", "status"];

    const url = new URL(req.url);

    const requestedIsAdmin = url.searchParams.get("isAdmin");
    const requestedSort = url.searchParams.get("sort") || "createdAt";
    const requestedSortOrder = url.searchParams.get("sortOrder") || "desc";

    const isAdmin = requestedIsAdmin === "true";
    const skip = Number.parseInt(url.searchParams.get("skip")) || 0;
    const sort = allowedSortFields.includes(requestedSort) ? requestedSort : "createdAt";
    const sortOrder = requestedSortOrder === "asc" ? 1 : -1;

    const select = "";

    const isPlatformAdmin = currentPlatformUser.isPlatformAdmin;

    const visibilityFilter = {
      $or: [
        {
          status: {
            $nin: ["disabled", "draft", ...(isAdmin ? ["active"] : [])],
          },
          visibility: {
            $nin: ["private", "unlisted", ...(isAdmin ? ["public"] : [])],
          },
        },
        {
          owner: currentPlatformUser._id,
        },
        {
          "collaborators.platformUser": currentPlatformUser._id,
        },
        ...(isPlatformAdmin ? [{}] : []),
      ],
    };

    const params = {
      ...visibilityFilter,
    };

    await connect();

    const websiteCount = await Website.countDocuments(params);

    const pageResults = doGetPageResults(url);
    const page = doGetPage(url, websiteCount);
    const pages = doGetPages(url, websiteCount);

    const query = Website.find(params)
      .sort([[sort, sortOrder]])
      .limit(pageResults)
      .skip(skip + pageResults * page);

    if (select) {
      query.select(select);
    }

    const websites = await query.lean(true).exec();

    return NextResponse.json({ message: "Websites could be found.", page: page + 1, pages, websites }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const data = await req.json();

    const { description, language, name } = data;

    if (typeof description !== "string") {
      return NextResponse.json({ message: "A description is required." }, { status: 400 });
    }

    if (typeof language !== "string") {
      return NextResponse.json({ message: "A language is required." }, { status: 400 });
    }

    if (language !== "en" && language !== "sv") {
      return NextResponse.json({ message: "A valid language is required." }, { status: 400 });
    }

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ message: "A valid name is required." }, { status: 400 });
    }

    await connect();

    if (!(await canCreateWebsite(currentPlatformUser))) {
      return NextResponse.json({ message: "You have already exceeded your website limit." }, { status: 400 });
    }

    const nameTrimmed = name.trim();

    const baseCode = doGenerateBaseCode(nameTrimmed);

    const descriptionTrimmed = description.trim();

    const page = validatePage(createDefaultPage(nameTrimmed, language === "sv" ? "Hem" : "Home", language), createPageSchema());

    const session = await mongoose.startSession();

    try {
      let createdWebsite;

      await session.withTransaction(async () => {
        const code = await doGenerateUniqueCode(baseCode, session);

        const website = await Website.create(
          [
            {
              code,
              collaborators: [],
              defaultLanguage: language,
              description: descriptionTrimmed,
              name: nameTrimmed,
              owner: currentPlatformUser._id,
              status: "draft",
            },
          ],
          { session },
        );

        createdWebsite = website[0];

        const websitePage = await WebsitePage.create(
          [
            {
              createdBy: currentPlatformUser._id,
              description: language === "sv" ? "Detta är din förstasida." : "This is your home page.",
              isHome: true,
              name: language === "sv" ? "Hem" : "Home",
              passwordHash: "",
              parentWebsitePage: null,
              path: "/",
              seo: {
                canonicalUrl: "",
                description: "",
                keywords: "",
                og: {
                  description: "",
                  image: "",
                  title: "",
                },
                robots: {
                  noFollow: false,
                  noIndex: false,
                },
                title: "",
              },
              slug: "",
              status: "draft",
              type: "standard",
              visibility: "private",
              website: createdWebsite._id,
              websitePageDataDraft: null,
              websitePageDataPublished: null,
              websitePageDataVersions: [],
            },
          ],
          { session },
        );

        const websitePageData = await WebsitePageData.create(
          [
            {
              createdBy: currentPlatformUser._id,
              page,
              website: createdWebsite._id,
              websitePage: websitePage[0]._id,
            },
          ],
          { session },
        );

        websitePage[0].websitePageDataDraft = websitePageData[0]._id;

        //websitePage[0].websitePageDataPublished = websitePageData[0]._id;
        //websitePage[0].websitePageDataVersions.push({ createdAt: new Date(), createdBy: currentPlatformUser._id, websitePageData: websitePageData[0]._id });

        await websitePage[0].save();
      });

      return NextResponse.json({ message: "Your website was successfully created!", website: createdWebsite }, { status: 201 });
    } catch (error) {
      if (error?.code === 11000) {
        return NextResponse.json({ message: "A website with that name already exists." }, { status: 409 });
      }

      return NextResponse.json({ message: "Your website could not be created." }, { status: 500 });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

function doGenerateBaseCode(name) {
  return name
    .replace(/[^a-zA-Z0-9åäöÅÄÖ]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

async function doGenerateUniqueCode(baseCode, session) {
  let code = baseCode;
  let counter = 1;

  while (true) {
    const exists = await Website.exists({ code }, { session });

    if (!exists) {
      return code;
    }

    counter++;

    code = `${baseCode}-${counter}`;
  }
}

function doGetPage(url, count) {
  /*
   * The external form of page is in the interval [1, N].
   * The internal form of page is in the interval [0, N).
   */

  const pageExternalDefault = 1;
  const pageExternalMaximum = doGetPages(url, count);
  const pageExternalMinimum = 1;

  let pageExternal = pageExternalDefault;

  if (url.searchParams.get("page")) {
    pageExternal = parseInt(url.searchParams.get("page"), 10) || pageExternalDefault;
  }

  pageExternal = Math.max(pageExternal, pageExternalMinimum);
  pageExternal = Math.min(pageExternal, pageExternalMaximum);

  const pageInternal = pageExternal - 1;

  return pageInternal;
}

function doGetPages(url, count) {
  return Math.max(Math.ceil(count / doGetPageResults(url)), 1);
}

function doGetPageResults(url) {
  /*
   * The results for each page is in the interval [1, 250].
   */

  const pageResultsDefault = 50;
  const pageResultsMaximum = 250;
  const pageResultsMinimum = 1;

  let pageResults = pageResultsDefault;

  if (url.searchParams.get("pageResults")) {
    pageResults = parseInt(url.searchParams.get("pageResults"), 10) || pageResultsDefault;
  }

  pageResults = Math.max(pageResults, pageResultsMinimum);
  pageResults = Math.min(pageResults, pageResultsMaximum);

  return pageResults;
}
