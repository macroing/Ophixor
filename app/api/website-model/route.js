// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

import connect from "@/lib/database";
import { can, getPermissions } from "@/lib/services/permissions";
import Website from "@/models/Website";
import WebsiteModel from "@/models/WebsiteModel";
import { canCreateWebsiteModel } from "@/lib/services/plan-services";

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

    const canRead = can(permissions, "model", "read");

    if (!canRead) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const select = "";

    const params = {
      website: website._id,
    };

    const query = WebsiteModel.find(params).sort([[sort, sortOrder]]);

    if (select) {
      query.select(select);
    }

    const websiteModels = await query.lean(true).exec();

    return NextResponse.json({ message: "Models could be found.", websiteModels }, { status: 200 });
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

    const { fields, name, websiteId } = data;

    if (typeof fields !== "object" || !fields) {
      return NextResponse.json({ message: "Valid fields are required." }, { status: 400 });
    }

    if (typeof name !== "string") {
      return NextResponse.json({ message: "A valid name is required." }, { status: 400 });
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

    const canCreate = can(permissions, "model", "create");

    if (!canCreate) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    if (!(await canCreateWebsiteModel(currentPlatformUser, website))) {
      return NextResponse.json({ message: "You have already exceeded your model limit for this website." }, { status: 400 });
    }

    const websiteModel = await WebsiteModel.create({ createdBy: currentPlatformUser._id, fields, name, type: "collection", website: website._id });

    if (websiteModel) {
      return NextResponse.json({ message: "Your model was successfully created!", websiteModel }, { status: 201 });
    }

    return NextResponse.json({ message: "Your model could not be created." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}
