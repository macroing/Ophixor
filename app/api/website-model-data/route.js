// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

import connect from "@/lib/database";
import { can, getPermissions } from "@/lib/services/permissions";
import Website from "@/models/Website";
import WebsiteModel from "@/models/WebsiteModel";
import WebsiteModelData from "@/models/WebsiteModelData";
import { canCreateWebsiteModelData } from "@/lib/services/plan-services";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    const allowedSortFields = ["createdAt", "updatedAt"];

    const url = new URL(req.url);

    const requestedSort = url.searchParams.get("sort") || "createdAt";
    const requestedSortOrder = url.searchParams.get("sortOrder") || "desc";

    const sort = allowedSortFields.includes(requestedSort) ? requestedSort : "createdAt";
    const sortOrder = requestedSortOrder === "asc" ? 1 : -1;
    const websiteId = url.searchParams.get("websiteId") || "";
    const websiteModelId = url.searchParams.get("websiteModelId") || "";

    if (!mongoose.Types.ObjectId.isValid(websiteId) && !mongoose.Types.ObjectId.isValid(websiteModelId)) {
      return NextResponse.json({ message: "A valid website or model ID is required." }, { status: 400 });
    }

    await connect();

    const websiteModel = websiteModelId ? await WebsiteModel.findById(websiteModelId).select("website").populate("website", "collaborators owner status visibility").lean(true).exec() : null;

    if (websiteModelId && !websiteModel) {
      return NextResponse.json({ message: "A model for that ID could not be found." }, { status: 404 });
    }

    if (websiteModelId && !websiteModel.website) {
      return NextResponse.json({ message: "The website associated with that model could not be found." }, { status: 404 });
    }

    const website = websiteModelId ? websiteModel.website : await Website.findById(websiteId).select("collaborators owner status visibility").lean(true).exec();

    if (websiteId && !website) {
      return NextResponse.json({ message: "A website for that ID could not be found." }, { status: 404 });
    }

    const permissions = getPermissions(currentPlatformUser, website);

    const canRead = can(permissions, "modelData", "read");

    if (!canRead && website.status !== "active" && website.visibility !== "public") {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const select = "";

    const params = {
      website: website._id,
    };

    if (websiteModel) {
      params.websiteModel = websiteModel._id;
    }

    const query = WebsiteModelData.find(params).sort([[sort, sortOrder]]);

    if (select) {
      query.select(select);
    }

    const websiteModelDatas = await query.lean(true).exec();

    return NextResponse.json({ message: "Model data could be found.", websiteModelDatas }, { status: 200 });
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

    const { data, websiteModelId } = await req.json();

    if (typeof data !== "object" || !data) {
      return NextResponse.json({ message: "Valid data is required." }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(websiteModelId)) {
      return NextResponse.json({ message: "A valid model ID is required." }, { status: 400 });
    }

    await connect();

    const websiteModel = await WebsiteModel.findById(websiteModelId)
      .populate({
        path: "website",
        populate: {
          path: "owner",
          select: "plan",
        },
      })
      .lean(true)
      .exec();

    if (!websiteModel) {
      return NextResponse.json({ message: "A model for that ID could not be found." }, { status: 404 });
    }

    if (!websiteModel.website) {
      return NextResponse.json({ message: "The website associated with that model could not be found." }, { status: 404 });
    }

    const website = websiteModel.website;

    const permissions = getPermissions(currentPlatformUser, website);

    const canCreate = can(permissions, "modelData", "create");

    if (!canCreate) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    if (!(await canCreateWebsiteModelData(currentPlatformUser, website, websiteModel))) {
      return NextResponse.json({ message: "You have already exceeded your model data limit for this website." }, { status: 400 });
    }

    const websiteModelData = await WebsiteModelData.create({ data, website: website._id, websiteModel: websiteModel._id });

    if (websiteModelData) {
      return NextResponse.json({ message: "Your model data was successfully created!", websiteModelData }, { status: 201 });
    }

    return NextResponse.json({ message: "Your model data could not be created." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}
