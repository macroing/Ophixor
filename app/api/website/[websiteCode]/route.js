// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

import connect from "@/lib/database";
import { HttpError } from "@/lib/error";
import { can, getPermissions } from "@/lib/services/permissions";
import Website from "@/models/Website";
import WebsiteComponentTemplate from "@/models/WebsiteComponentTemplate";
import WebsiteIntegration from "@/models/WebsiteIntegration";
import WebsiteMedia from "@/models/WebsiteMedia";
import WebsiteModel from "@/models/WebsiteModel";
import WebsiteModelData from "@/models/WebsiteModelData";
import WebsitePage from "@/models/WebsitePage";
import WebsitePageData from "@/models/WebsitePageData";
import WebsiteUser from "@/models/WebsiteUser";

export const runtime = "nodejs";

export async function DELETE(req, { params }) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const awaitedParams = await params;

    const code = awaitedParams.websiteCode;

    if (!code) {
      return NextResponse.json({ message: "A code is required." }, { status: 400 });
    }

    await connect();

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const website = await Website.findOne({ code }).session(session).select("owner permissions").exec();

        if (!website) {
          throw new HttpError("A website for that code could not be found.", 404);
        }

        const permissions = getPermissions(currentPlatformUser, website);

        const canDelete = can(permissions, "website", "delete");

        if (!canDelete) {
          throw new HttpError("You do not have permission to perform this operation.", 403);
        }

        await WebsiteComponentTemplate.deleteMany({ website: website._id }).session(session);

        await WebsiteIntegration.deleteMany({ website: website._id }).session(session);

        await WebsiteMedia.deleteMany({ website: website._id }).session(session);

        await WebsiteModel.deleteMany({ website: website._id }).session(session);

        await WebsiteModelData.deleteMany({ website: website._id }).session(session);

        await WebsitePage.deleteMany({ website: website._id }).session(session);

        await WebsitePageData.deleteMany({ website: website._id }).session(session);

        await WebsiteUser.deleteMany({ website: website._id }).session(session);

        await Website.deleteOne({ _id: website._id }).session(session);
      });

      return NextResponse.json({ message: "The website has been successfully deleted." }, { status: 200 });
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "The website could not be deleted.";
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

    const url = new URL(req.url);

    const requestedIsAdmin = url.searchParams.get("isAdmin");

    const isAdmin = requestedIsAdmin === "true";

    const awaitedParams = await params;

    const code = awaitedParams.websiteCode;

    if (!code) {
      return NextResponse.json({ message: "A code is required." }, { status: 400 });
    }

    await connect();

    const website = await Website.findOne({ code }).populate("collaborators.platformUser", "emailNormalized").populate("owner", "emailNormalized plan").lean(true).exec();

    if (!website) {
      return NextResponse.json({ message: "A website for that code could not be found." }, { status: 404 });
    }

    let isRemovingData = true;

    if (["disabled", "draft", ...(isAdmin ? ["active"] : [])].includes(website.status) || ["private", "unlisted", ...(isAdmin ? ["public"] : [])].includes(website.visibility)) {
      if (!currentPlatformUser) {
        return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
      }

      const isPlatformAdmin = currentPlatformUser.isPlatformAdmin;
      const isWebsiteOwner = currentPlatformUser._id.toString() === website.owner?._id?.toString();
      const isWebsiteCollaborator = (website.collaborators || []).some((collaborator) => collaborator?.platformUser?._id?.toString() === currentPlatformUser._id.toString());

      if (!isPlatformAdmin && !isWebsiteOwner && !isWebsiteCollaborator) {
        return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
      }

      isRemovingData = false;
    }

    if (isRemovingData) {
      delete website.collaborators;
      delete website.owner;
      delete website.settings;
    }

    return NextResponse.json({ message: "A website was found.", website }, { status: 200 });
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

    const { defaultLanguage, description, name, status, theme, updateNumber, visibility } = data;

    const awaitedParams = await params;

    const code = awaitedParams.websiteCode;

    if (!code) {
      return NextResponse.json({ message: "A code is required." }, { status: 400 });
    }

    if (typeof updateNumber !== "number") {
      return NextResponse.json({ message: "A valid update number is required." }, { status: 400 });
    }

    await connect();

    const session = await mongoose.startSession();

    try {
      let website = null;

      await session.withTransaction(async () => {
        website = await Website.findOne({ code }).session(session).populate("collaborators.platformUser", "emailNormalized").populate("owner", "emailNormalized plan").exec();

        if (!website) {
          throw new HttpError("A website for that code could not be found.", 404);
        }

        const permissions = getPermissions(currentPlatformUser, website);

        const canUpdateAccessibility = can(permissions, "website", "updateAccessibility");
        const canUpdateInformation = can(permissions, "website", "updateInformation");
        const canUpdateTheme = can(permissions, "website", "updateTheme");

        if (!canUpdateAccessibility && !canUpdateInformation) {
          throw new HttpError("You do not have permission to perform this operation.", 403);
        }

        if (website.updateNumber === null || website.updateNumber === undefined) {
          website.updateNumber = 0;
        }

        if (website.updateNumber !== updateNumber) {
          throw new HttpError("Someone else has updated the website already.", 409);
        }

        website.updateNumber = website.updateNumber + 1;

        if (typeof defaultLanguage === "string" && canUpdateInformation) {
          website.defaultLanguage = defaultLanguage;
        }

        if (typeof description === "string" && canUpdateInformation) {
          website.description = description;
        }

        if (typeof name === "string" && name.trim() !== "" && canUpdateInformation) {
          website.name = name.trim();
        }

        if ((status === "active" || status === "disabled" || status === "draft") && canUpdateAccessibility) {
          if (status === "active") {
            const now = new Date();

            if (!website.firstPublishedAt) {
              website.firstPublishedAt = website.publishedAt || now;
            }

            website.publishedAt = now;
          }

          website.status = status;
        }

        if (theme && typeof theme === "object" && !Array.isArray(theme) && canUpdateTheme) {
          if (!website.theme || typeof website.theme !== "object" || Array.isArray(website.theme)) {
            website.theme = {};
          }
        }

        if ((visibility === "private" || visibility === "public" || visibility === "unlisted") && canUpdateAccessibility) {
          website.visibility = visibility;
        }

        if (website.publishedAt && !website.firstPublishedAt) {
          website.firstPublishedAt = website.publishedAt;
        }

        await website.save({ session });
      });

      return NextResponse.json({ message: "Your website has been successfully saved!", website }, { status: 200 });
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "Your website could not be saved.";
      const status = error?.status || 500;

      return NextResponse.json({ message }, { status });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}
