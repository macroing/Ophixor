// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

import connect from "@/lib/database";
import { can, getPermissions } from "@/lib/services/permissions";
import Website from "@/models/Website";
import WebsiteComponentTemplate from "@/models/WebsiteComponentTemplate";
import { canCreateWebsiteComponentTemplate } from "@/lib/services/plan-services";
import { createPageSchema } from "@/lib/web-page-builder/components/page/PageSchema";
import { validateTemplate } from "@/lib/web-page-builder/validation/validators";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const allowedSortFields = ["createdAt", "updatedAt"];

    const url = new URL(req.url);

    const requestedSort = url.searchParams.get("sort") || "createdAt";
    const requestedSortOrder = url.searchParams.get("sortOrder") || "desc";

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

    const canRead = can(permissions, "componentTemplate", "read");

    if (!canRead) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const select = "";

    const params = {
      website: website._id,
    };

    const websiteComponentTemplateCount = await WebsiteComponentTemplate.countDocuments(params);

    const pageResults = doGetPageResults(url);
    const page = doGetPage(url, websiteComponentTemplateCount);
    const pages = doGetPages(url, websiteComponentTemplateCount);

    const query = WebsiteComponentTemplate.find(params)
      .sort([[sort, sortOrder]])
      .limit(pageResults)
      .skip(skip + pageResults * page);

    if (select) {
      query.select(select);
    }

    const websiteComponentTemplates = await query.lean(true).exec();

    return NextResponse.json({ message: "Templates could be found.", page: page + 1, pages, websiteComponentTemplates }, { status: 200 });
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

    const { componentTemplate, websiteId } = data;

    if (typeof componentTemplate !== "object" || !componentTemplate) {
      return NextResponse.json({ message: "A valid template is required." }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(websiteId)) {
      return NextResponse.json({ message: "A valid website ID is required." }, { status: 400 });
    }

    let validatedComponentTemplate = null;

    try {
      validatedComponentTemplate = validateTemplate(componentTemplate, createPageSchema());
    } catch (error) {
      return NextResponse.json({ message: "A valid template is required." }, { status: 400 });
    }

    if (!validatedComponentTemplate) {
      return NextResponse.json({ message: "A valid template is required." }, { status: 400 });
    }

    await connect();

    const website = await Website.findById(websiteId).select("collaborators name owner status visibility").populate("owner", "plan").lean(true).exec();

    if (!website) {
      return NextResponse.json({ message: "A website for that ID could not be found." }, { status: 404 });
    }

    const permissions = getPermissions(currentPlatformUser, website);

    const canCreate = can(permissions, "componentTemplate", "create");

    if (!canCreate) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    if (!(await canCreateWebsiteComponentTemplate(currentPlatformUser, website))) {
      return NextResponse.json({ message: "You have already exceeded your template limit for this website." }, { status: 400 });
    }

    const websiteComponentTemplate = await WebsiteComponentTemplate.create({
      componentTemplate: validatedComponentTemplate,
      createdBy: currentPlatformUser._id,
      website: website._id,
    });

    if (websiteComponentTemplate) {
      return NextResponse.json({ message: "Your template was successfully created!", websiteComponentTemplate }, { status: 201 });
    }

    return NextResponse.json({ message: "Your template could not be created." }, { status: 400 });
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
