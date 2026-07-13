// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

import connect from "@/lib/database";
import { can, getPermissions } from "@/lib/services/permissions";
import Website from "@/models/Website";
import WebsitePage from "@/models/WebsitePage";
import WebsitePageData from "@/models/WebsitePageData";
import { canCreateWebsitePage } from "@/lib/services/plan-services";
import { createDefaultPage, createPageSchema } from "@/lib/web-page-builder/components/page/PageSchema";
import { validatePage } from "@/lib/web-page-builder/validation/validators";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const allowedSortFields = ["createdAt", "updatedAt", "name", "status"];

    const url = new URL(req.url);

    const requestedSort = url.searchParams.get("sort") || "createdAt";
    const requestedSortOrder = url.searchParams.get("sortOrder") || "desc";

    const isIncludingDraft = url.searchParams.get("isIncludingDraft") === "true";
    const path = url.searchParams.has("path") ? url.searchParams.get("path") || "" : "";
    const skip = Number.parseInt(url.searchParams.get("skip")) || 0;
    const sort = allowedSortFields.includes(requestedSort) ? requestedSort : "createdAt";
    const sortOrder = requestedSortOrder === "asc" ? 1 : -1;
    const websiteCode = url.searchParams.get("websiteCode") || "";
    const websiteId = url.searchParams.get("websiteId") || "";

    if (!mongoose.Types.ObjectId.isValid(websiteId) && typeof websiteCode !== "string") {
      return NextResponse.json({ message: "A valid website ID or code is required." }, { status: 400 });
    }

    await connect();

    const website = await Website.findOne(mongoose.Types.ObjectId.isValid(websiteId) ? { _id: websiteId } : { code: websiteCode })
      .select("collaborators owner status visibility")
      .lean(true)
      .exec();

    if (!website) {
      return NextResponse.json({ message: "A website for that ID could not be found." }, { status: 404 });
    }

    const permissions = getPermissions(currentPlatformUser, website);

    const canRead = can(permissions, "page", "read");

    if ((website.status === "draft" || website.status === "disabled" || website.visibility === "private" || website.visibility === "unlisted") && !canRead) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const select = "createdAt description isHome name path seo slug status updatedAt visibility" + (typeof path === "string" && path.trim() !== "" && isIncludingDraft ? " websitePageDataDraft" : "") + (typeof path === "string" && path.trim() !== "" ? " websitePageDataPublished" : "");

    const visibilityFilter = {
      $or: [
        {
          status: {
            $nin: ["archived", "draft"],
          },
          visibility: {
            $nin: ["private"],
          },
        },
        {
          createdBy: currentPlatformUser._id,
        },
        ...(canRead ? [{}] : []),
      ],
    };

    const params = {
      website: website._id,
      ...visibilityFilter,
    };

    if (typeof path === "string" && path.trim() !== "") {
      params.path = path;
    }

    const websitePageCount = await WebsitePage.countDocuments(params);

    const pageResults = doGetPageResults(url);
    const page = doGetPage(url, websitePageCount);
    const pages = doGetPages(url, websitePageCount);

    const query = WebsitePage.find(params)
      .sort([[sort, sortOrder]])
      .limit(pageResults)
      .skip(skip + pageResults * page);

    if (select) {
      query.select(select);
    }

    const websitePages = await query.lean(true).exec();

    if (typeof path === "string" && path.trim() !== "" && isIncludingDraft && websitePages?.length === 1 && websitePages[0]?.websitePageDataDraft) {
      const websitePageDataDraft = await WebsitePageData.findById(websitePages[0].websitePageDataDraft).lean(true).exec();

      if (websitePageDataDraft) {
        websitePages[0].websitePageDataDraft = websitePageDataDraft;
      }
    }

    if (typeof path === "string" && path.trim() !== "" && websitePages?.length === 1 && websitePages[0]?.websitePageDataPublished) {
      const websitePageDataPublished = await WebsitePageData.findById(websitePages[0].websitePageDataPublished).lean(true).exec();

      if (websitePageDataPublished) {
        websitePages[0].websitePageDataPublished = websitePageDataPublished;
      }
    }

    return NextResponse.json({ message: "Pages could be found.", page: page + 1, pages, websitePages }, { status: 200 });
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

    const { description, name, parentWebsitePageId, slug, websiteId } = data;

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ message: "A valid name is required." }, { status: 400 });
    }

    if (typeof description !== "string") {
      return NextResponse.json({ message: "A description is required." }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(parentWebsitePageId)) {
      return NextResponse.json({ message: "A valid page ID is required." }, { status: 400 });
    }

    if (typeof slug !== "string") {
      return NextResponse.json({ message: "A slug is required." }, { status: 400 });
    }

    const formattedSlug = slug
      .trim()
      .replace(/[^a-zA-Z0-9åäöÅÄÖ]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    if (formattedSlug !== slug) {
      return NextResponse.json({ message: "A valid slug is required." }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(websiteId)) {
      return NextResponse.json({ message: "A valid website ID is required." }, { status: 400 });
    }

    await connect();

    const website = await Website.findById(websiteId).select("collaborators name owner status visibility").populate("owner", "plan").lean(true).exec();

    if (!website) {
      return NextResponse.json({ message: "A website for that ID could not be found." }, { status: 404 });
    }

    const permissions = getPermissions(currentPlatformUser, website);

    const canCreate = can(permissions, "page", "create");

    if (!canCreate) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    if (!(await canCreateWebsitePage(currentPlatformUser, website))) {
      return NextResponse.json({ message: "You have already exceeded your page limit for this website." }, { status: 400 });
    }

    const visibilityFilter = {
      $or: [
        {
          status: {
            $nin: ["archived", "draft"],
          },
          visibility: {
            $nin: ["private"],
          },
        },
        {
          createdBy: currentPlatformUser._id,
        },
        ...(canCreate ? [{}] : []),
      ],
    };

    const params = {
      _id: parentWebsitePageId,
      website: website._id,
      ...visibilityFilter,
    };

    const parentWebsitePage = await WebsitePage.findOne(params).select("path").lean(true).exec();

    if (!parentWebsitePage) {
      return NextResponse.json({ message: "A page for that ID could not be found given your permissions." }, { status: 404 });
    }

    const path = parentWebsitePage.path + (parentWebsitePage.path === "/" ? "" : "/") + slug;

    const nameTrimmed = name.trim();

    const descriptionTrimmed = description.trim();

    const page = validatePage(createDefaultPage(website.name, nameTrimmed), createPageSchema());

    const session = await mongoose.startSession();

    try {
      let createdWebsitePage;

      await session.withTransaction(async () => {
        const websitePage = await WebsitePage.create([{ createdBy: currentPlatformUser._id, description: descriptionTrimmed, isHome: false, name: nameTrimmed, passwordHash: "", parentWebsitePage: parentWebsitePage._id, path, seo: { canonicalUrl: "", description: "", keywords: "", og: { description: "", image: "", title: "" }, robots: { noFollow: false, noIndex: false }, title: "" }, slug, status: "draft", type: "standard", visibility: "private", website: website._id, websitePageDataDraft: null, websitePageDataPublished: null, websitePageDataVersions: [] }], { session });

        createdWebsitePage = websitePage[0];

        const websitePageData = await WebsitePageData.create([{ createdBy: currentPlatformUser._id, page, website: website._id, websitePage: createdWebsitePage._id }], { session });

        createdWebsitePage.websitePageDataDraft = websitePageData[0]._id;

        //createdWebsitePage.websitePageDataPublished = websitePageData[0]._id;
        //createdWebsitePage.websitePageDataVersions.push({ createdAt: new Date(), createdBy: currentPlatformUser._id, websitePageData: websitePageData[0]._id });

        await createdWebsitePage.save();
      });

      return NextResponse.json({ message: "Your page was successfully created!", websitePage: createdWebsitePage }, { status: 201 });
    } catch (error) {
      if (error?.code === 11000) {
        return NextResponse.json({ message: "A page with that path already exists in your website." }, { status: 409 });
      }

      return NextResponse.json({ message: "Your page could not be created." }, { status: 500 });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
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
