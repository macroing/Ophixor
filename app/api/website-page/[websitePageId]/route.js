// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

import connect from "@/lib/database";
import { HttpError } from "@/lib/error";
import { can, getPermissions } from "@/lib/services/permissions";
import WebsitePage from "@/models/WebsitePage";
import WebsitePageData from "@/models/WebsitePageData";
import { createPageSchema } from "@/lib/web-page-builder/components/page/PageSchema";
import { validatePage } from "@/lib/web-page-builder/validation/validators";

export const runtime = "nodejs";

export async function DELETE(req, { params }) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const awaitedParams = await params;

    const websitePageId = awaitedParams.websitePageId;

    if (!mongoose.Types.ObjectId.isValid(websitePageId)) {
      return NextResponse.json({ message: "A valid page ID is required." }, { status: 400 });
    }

    await connect();

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const websitePage = await WebsitePage.findById(websitePageId).session(session).select("createdBy isHome path website").populate("website", "collaborators owner").exec();

        if (!websitePage) {
          throw new HttpError("A page for that ID could not be found.", 404);
        }

        if (!websitePage.website) {
          throw new HttpError("The website associated with that page could not be found.", 404);
        }

        if (websitePage.isHome || websitePage.path === "/") {
          throw new HttpError("You are not allowed to delete the home page.", 403);
        }

        const exists = await WebsitePage.exists({ parentWebsitePage: websitePage._id }, { session });

        if (exists) {
          throw new HttpError("You are not allowed to delete the parent page of other pages.", 403);
        }

        const website = websitePage.website;

        const permissions = getPermissions(currentPlatformUser, website);

        const canDelete = can(permissions, "page", "delete");

        if (!canDelete) {
          throw new HttpError("You do not have permission to perform this operation.", 403);
        }

        await WebsitePageData.deleteMany({ websitePage: websitePage._id }).session(session);

        await WebsitePage.deleteOne({ _id: websitePage._id }).session(session);
      });

      return NextResponse.json({ message: "The page has been successfully deleted." }, { status: 200 });
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "The page could not be deleted.";
      const status = error?.status || 500;

      return NextResponse.json({ message }, { status });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const awaitedParams = await params;

    const websitePageId = awaitedParams.websitePageId;

    if (!mongoose.Types.ObjectId.isValid(websitePageId)) {
      return NextResponse.json({ message: "A valid page ID is required." }, { status: 400 });
    }

    await connect();

    const websitePage = await WebsitePage.findById(websitePageId).populate("website", "collaborators owner").lean(true).exec();

    if (!websitePage) {
      return NextResponse.json({ message: "A page for that ID could not be found." }, { status: 404 });
    }

    if (!websitePage.website) {
      return NextResponse.json({ message: "The website associated with that page could not be found." }, { status: 404 });
    }

    const permissions = getPermissions(currentPlatformUser, websitePage.website);

    const canRead = can(permissions, "page", "read");

    if (!canRead) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    return NextResponse.json({ message: "A page was found.", websitePage }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const data = await req.json();

    const { description, isSocketConnectingAutomatically, isSocketEnabled, name, pageDraft, seoCanonicalUrl, seoDescription, seoKeywords, seoOgDescription, seoOgImage, seoOgTitle, seoRobotsNoFollow, seoRobotsNoIndex, seoTitle, status, updateNumber, visibility } = data;

    const awaitedParams = await params;

    const websitePageId = awaitedParams.websitePageId;

    if (!mongoose.Types.ObjectId.isValid(websitePageId)) {
      return NextResponse.json({ message: "A valid page ID is required." }, { status: 400 });
    }

    if (typeof updateNumber !== "number") {
      return NextResponse.json({ message: "A valid update number is required." }, { status: 400 });
    }

    await connect();

    let shouldRevalidate = false;

    const session = await mongoose.startSession();

    try {
      let websitePage = null;

      await session.withTransaction(async () => {
        websitePage = await WebsitePage.findById(websitePageId).session(session).populate("website", "code collaborators owner").exec();

        if (!websitePage) {
          throw new HttpError("A page for that ID could not be found.", 404);
        }

        if (!websitePage.website) {
          throw new HttpError("The website associated with that page could not be found.", 404);
        }

        const website = websitePage.website;

        const permissions = getPermissions(currentPlatformUser, website);

        const canUpdate = can(permissions, "page", "update");

        if (!canUpdate) {
          throw new HttpError("You do not have permission to perform this operation.", 403);
        }

        if (websitePage.updateNumber === null || websitePage.updateNumber === undefined) {
          websitePage.updateNumber = 0;
        }

        if (websitePage.updateNumber !== updateNumber) {
          throw new HttpError("Someone else has updated the page already.", 409);
        }

        websitePage.updateNumber = websitePage.updateNumber + 1;

        if (typeof description === "string") {
          websitePage.description = description;
        }

        if (typeof isSocketConnectingAutomatically === "boolean") {
          websitePage.isSocketConnectingAutomatically = isSocketConnectingAutomatically;
        }

        if (typeof isSocketEnabled === "boolean") {
          websitePage.isSocketEnabled = isSocketEnabled;
        }

        if (typeof name === "string" && name.trim()) {
          websitePage.name = name;
        }

        if (typeof pageDraft === "object" && pageDraft && !Array.isArray(pageDraft)) {
          const validatedPageDraft = validatePage(pageDraft, createPageSchema());

          if (validatedPageDraft) {
            shouldRevalidate = true;

            const websitePageData = await WebsitePageData.create([{ createdBy: currentPlatformUser._id, page: validatedPageDraft, website: website._id, websitePage: websitePage._id }], { session });

            websitePage.websitePageDataDraft = websitePageData[0]._id;
          }
        }

        if (!websitePage.seo || typeof websitePage.seo !== "object") {
          websitePage.seo = {
            canonicalUrl: "",
            description: "",
            keywords: [],
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
          };
        } else {
          if (!websitePage.seo.og || typeof websitePage.seo.og !== "object") {
            websitePage.seo.og = {
              description: "",
              image: "",
              title: "",
            };
          }

          if (!websitePage.seo.robots || typeof websitePage.seo.robots !== "object") {
            websitePage.seo.robots = {
              noFollow: false,
              noIndex: false,
            };
          }
        }

        if (typeof seoCanonicalUrl === "string") {
          websitePage.seo.canonicalUrl = validateCanonicalUrl(seoCanonicalUrl.trim(), websitePage.website);
        }

        if (typeof seoDescription === "string") {
          websitePage.seo.description = seoDescription;
        }

        if (typeof seoKeywords === "string") {
          const keywords = seoKeywords
            .split(",")
            .map((keyword) => keyword?.trim())
            .filter(Boolean);

          websitePage.seo.keywords = keywords;
        }

        if (typeof seoOgDescription === "string") {
          websitePage.seo.og.description = seoOgDescription;
        }

        if (typeof seoOgImage === "string") {
          websitePage.seo.og.image = seoOgImage;
        }

        if (typeof seoOgTitle === "string") {
          websitePage.seo.og.title = seoOgTitle;
        }

        if (typeof seoRobotsNoFollow === "boolean") {
          websitePage.seo.robots.noFollow = seoRobotsNoFollow;
        }

        if (typeof seoRobotsNoIndex === "boolean") {
          websitePage.seo.robots.noIndex = seoRobotsNoIndex;
        }

        if (typeof seoTitle === "string") {
          websitePage.seo.title = seoTitle;
        }

        if (websitePage.status === "draft" && websitePage.websitePageDataPublished) {
          websitePage.websitePageDataPublished = null;
        }

        if (status === "archived" || status === "draft" || status === "published") {
          if (status === "archived" && (websitePage.isHome || websitePage.path === "/")) {
            throw new HttpError("You are not allowed to archive the home page.", 403);
          }

          if (status === "draft" && websitePage.status === "published") {
            websitePage.websitePageDataPublished = null;
          }

          if (status === "published") {
            if (!websitePage.websitePageDataDraft) {
              throw new HttpError("You cannot publish a page without draft content.", 400);
            }

            const now = new Date();

            websitePage.websitePageDataPublished = websitePage.websitePageDataDraft;

            websitePage.websitePageDataVersions.push({
              createdAt: now,
              createdBy: currentPlatformUser._id,
              websitePageData: websitePage.websitePageDataDraft,
            });

            if (!websitePage.firstPublishedAt) {
              websitePage.firstPublishedAt = websitePage.publishedAt || now;
            }

            websitePage.publishedAt = now;
          }

          shouldRevalidate = true;

          websitePage.status = status;
        }

        if (visibility === "password" || visibility === "private" || visibility === "public") {
          shouldRevalidate = true;

          websitePage.visibility = visibility;
        }

        if (websitePage.status === "archived" && websitePage.visibility !== "private") {
          shouldRevalidate = true;

          websitePage.visibility = "private";
        }

        if (websitePage.visibility === "public" && websitePage.status !== "published") {
          throw new HttpError("You cannot make a page public unless it is published.", 400);
        }

        if (websitePage.publishedAt && !websitePage.firstPublishedAt) {
          websitePage.firstPublishedAt = websitePage.publishedAt;
        }

        await websitePage.save({ session });

        await cleanupWebsitePageData(websitePage, session);

        await websitePage.populate(["websitePageDataDraft", "websitePageDataPublished"]);
      });

      if (shouldRevalidate) {
        revalidatePath(`/website/${websitePage.website.code}`);

        if (!websitePage.isHome) {
          revalidatePath(`/website/${websitePage.website.code}${websitePage.path}`);
        }
      }

      return NextResponse.json({ message: "The page has been successfully saved!", websitePage }, { status: 200 });
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "The page could not be saved.";
      const status = error?.status || 500;

      return NextResponse.json({ message }, { status });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

async function cleanupWebsitePageData(websitePage, session) {
  const referencedIds = new Set();

  function add(id) {
    if (!id) {
      return;
    }

    referencedIds.add(id.toString());
  }

  add(websitePage.websitePageDataDraft);

  add(websitePage.websitePageDataPublished);

  for (const version of websitePage.websitePageDataVersions || []) {
    add(version?.websitePageData);
  }

  const deleteResult = await WebsitePageData.deleteMany(
    {
      websitePage: new mongoose.Types.ObjectId(websitePage._id),
      _id: {
        $nin: [...referencedIds].map((id) => new mongoose.Types.ObjectId(id)),
      },
    },
    { session },
  );
}

function validateCanonicalUrl(value, website) {
  if (!value) {
    return "";
  }

  let url;

  try {
    url = new URL(value);
  } catch {
    throw new HttpError("Canonical URL must be a valid absolute URL.", 400);
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new HttpError("Canonical URL must use HTTP or HTTPS.", 400);
  }

  //if (website.customDomain) {
  //if (url.hostname !== website.customDomain) {
  //throw new HttpError("Canonical URL must match website domain.", 400);
  //}
  //}

  return url.toString();
}
