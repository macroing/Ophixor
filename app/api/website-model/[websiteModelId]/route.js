// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

import connect from "@/lib/database";
import { HttpError } from "@/lib/error";
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

    const websiteModelId = awaitedParams.websiteModelId;

    if (!mongoose.Types.ObjectId.isValid(websiteModelId)) {
      return NextResponse.json({ message: "A valid model ID is required." }, { status: 400 });
    }

    await connect();

    let websiteModelDeleted = null;

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const websiteModel = await WebsiteModel.findById(websiteModelId).session(session).select("createdBy website").populate("website", "collaborators owner").exec();

        if (!websiteModel) {
          throw new HttpError("A model for that ID could not be found.", 404);
        }

        websiteModelDeleted = websiteModel;

        if (!websiteModel.website) {
          throw new HttpError("The website associated with that model could not be found.", 404);
        }

        const website = websiteModel.website;

        const permissions = getPermissions(currentPlatformUser, website);

        const canDelete = can(permissions, "model", "delete");

        if (!canDelete) {
          throw new HttpError("You do not have permission to perform this operation.", 403);
        }

        await WebsiteModelData.deleteMany({ websiteModel: websiteModel._id }).session(session);

        await WebsiteModel.deleteOne({ _id: websiteModel._id }).session(session);
      });

      return NextResponse.json({ message: "The model has been successfully deleted.", websiteModel: websiteModelDeleted }, { status: 200 });
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "The model could not be deleted.";
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

    const websiteModelId = awaitedParams.websiteModelId;

    if (!mongoose.Types.ObjectId.isValid(websiteModelId)) {
      return NextResponse.json({ message: "A valid model ID is required." }, { status: 400 });
    }

    await connect();

    const websiteModel = await WebsiteModel.findById(websiteModelId).populate("website", "collaborators owner").lean(true).exec();

    if (!websiteModel) {
      return NextResponse.json({ message: "A model for that ID could not be found." }, { status: 404 });
    }

    if (!websiteModel.website) {
      return NextResponse.json({ message: "The website associated with that model could not be found." }, { status: 404 });
    }

    const website = websiteModel.website;

    const permissions = getPermissions(currentPlatformUser, website);

    const canRead = can(permissions, "model", "read");

    if (!canRead) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    return NextResponse.json({ message: "A model could be found.", websiteModel }, { status: 200 });
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

    const websiteModelId = awaitedParams.websiteModelId;

    if (!mongoose.Types.ObjectId.isValid(websiteModelId)) {
      return NextResponse.json({ message: "A valid model ID is required." }, { status: 400 });
    }

    const data = await req.json();

    const { fields, name } = data;

    if (typeof fields !== "object" || !fields) {
      return NextResponse.json({ message: "Valid fields are required." }, { status: 400 });
    }

    if (typeof name !== "string") {
      return NextResponse.json({ message: "A valid name is required." }, { status: 400 });
    }

    await connect();

    const websiteModel = await WebsiteModel.findById(websiteModelId).populate("website", "collaborators owner").exec();

    if (!websiteModel) {
      return NextResponse.json({ message: "A model for that ID could not be found." }, { status: 404 });
    }

    if (!websiteModel.website) {
      return NextResponse.json({ message: "The website associated with that model could not be found." }, { status: 404 });
    }

    const website = websiteModel.website;

    const permissions = getPermissions(currentPlatformUser, website);

    const canUpdate = can(permissions, "model", "update");

    if (!canUpdate) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    websiteModel.fields = fields;
    websiteModel.name = name;

    await websiteModel.save();

    return NextResponse.json({ message: "The model has been saved.", websiteModel }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}
