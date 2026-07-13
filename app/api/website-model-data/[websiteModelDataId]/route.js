// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

import connect from "@/lib/database";
import { can, getPermissions } from "@/lib/services/permissions";
import WebsiteModel from "@/models/WebsiteModel";
import WebsiteModelData from "@/models/WebsiteModelData";

export const runtime = "nodejs";

export async function DELETE(req, { params }) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const awaitedParams = await params;

    const websiteModelDataId = awaitedParams.websiteModelDataId;

    if (!mongoose.Types.ObjectId.isValid(websiteModelDataId)) {
      return NextResponse.json({ message: "A valid model data ID is required." }, { status: 400 });
    }

    await connect();

    const websiteModelData = await WebsiteModelData.findById(websiteModelDataId).select("website websiteModel").populate("website", "collaborators owner").populate("websiteModel", "createdBy").exec();

    if (!websiteModelData) {
      return NextResponse.json({ message: "Model data for that ID could not be found." }, { status: 404 });
    }

    if (!websiteModelData.website) {
      return NextResponse.json({ message: "The website associated with the model data could not be found." }, { status: 404 });
    }

    if (!websiteModelData.websiteModel) {
      return NextResponse.json({ message: "The model associated with the model data could not be found." }, { status: 404 });
    }

    const website = websiteModelData.website;

    const permissions = getPermissions(currentPlatformUser, website);

    const canDelete = can(permissions, "modelData", "delete");

    if (!canDelete) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    await WebsiteModelData.deleteOne({ _id: websiteModelData._id }).exec();

    return NextResponse.json({ message: "The model data has been successfully deleted.", websiteModelData }, { status: 200 });
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

    const websiteModelDataId = awaitedParams.websiteModelDataId;

    if (!mongoose.Types.ObjectId.isValid(websiteModelDataId)) {
      return NextResponse.json({ message: "A valid model data ID is required." }, { status: 400 });
    }

    await connect();

    const websiteModelData = await WebsiteModelData.findById(websiteModelDataId).select("website websiteModel").populate("website", "collaborators owner").populate("websiteModel", "createdBy").lean(true).exec();

    if (!websiteModelData) {
      return NextResponse.json({ message: "Model data for that ID could not be found." }, { status: 404 });
    }

    if (!websiteModelData.website) {
      return NextResponse.json({ message: "The website associated with the model data could not be found." }, { status: 404 });
    }

    if (!websiteModelData.websiteModel) {
      return NextResponse.json({ message: "The model associated with the model data could not be found." }, { status: 404 });
    }

    const website = websiteModelData.website;

    const permissions = getPermissions(currentPlatformUser, website);

    const canRead = can(permissions, "modelData", "read");

    if (!canRead) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    return NextResponse.json({ message: "Model data could be found.", websiteModelData }, { status: 200 });
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

    const awaitedParams = await params;

    const websiteModelDataId = awaitedParams.websiteModelDataId;

    if (!mongoose.Types.ObjectId.isValid(websiteModelDataId)) {
      return NextResponse.json({ message: "A valid model data ID is required." }, { status: 400 });
    }

    const { data } = await req.json();

    if (typeof data !== "object" || !data) {
      return NextResponse.json({ message: "Valid data is required." }, { status: 400 });
    }

    await connect();

    const websiteModelData = await WebsiteModelData.findById(websiteModelDataId).select("website websiteModel").populate("website", "collaborators owner").populate("websiteModel", "createdBy").exec();

    if (!websiteModelData) {
      return NextResponse.json({ message: "Model data for that ID could not be found." }, { status: 404 });
    }

    if (!websiteModelData.website) {
      return NextResponse.json({ message: "The website associated with the model data could not be found." }, { status: 404 });
    }

    if (!websiteModelData.websiteModel) {
      return NextResponse.json({ message: "The model associated with the model data could not be found." }, { status: 404 });
    }

    const website = websiteModelData.website;

    const permissions = getPermissions(currentPlatformUser, website);

    const canUpdate = can(permissions, "modelData", "update");

    if (!canUpdate) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    websiteModelData.data = data;

    await websiteModelData.save();

    return NextResponse.json({ message: "The model data has been saved.", websiteModelData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}
