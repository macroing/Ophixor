// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

import connect from "@/lib/database";
import { HttpError } from "@/lib/error";
import { can, getPermissions } from "@/lib/services/permissions";
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

    const websiteUserId = awaitedParams.websiteUserId;

    if (!mongoose.Types.ObjectId.isValid(websiteUserId)) {
      return NextResponse.json({ message: "A valid user ID is required." }, { status: 400 });
    }

    await connect();

    let websiteUserDeleted = null;

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const websiteUser = await WebsiteUser.findById(websiteUserId).session(session).select("website").populate("website", "collaborators owner").exec();

        if (!websiteUser) {
          throw new HttpError("A user for that ID could not be found.", 404);
        }

        websiteUserDeleted = websiteUser;

        if (!websiteUser.website) {
          throw new HttpError("The website associated with that user could not be found.", 404);
        }

        const website = websiteUser.website;

        const permissions = getPermissions(currentPlatformUser, website);

        const canDelete = can(permissions, "user", "delete");

        if (!canDelete) {
          throw new HttpError("You do not have permission to perform this operation.", 403);
        }

        await WebsiteUser.deleteOne({ _id: websiteUser._id }).session(session);
      });

      return NextResponse.json({ message: "The user has been successfully deleted.", websiteUser: websiteUserDeleted }, { status: 200 });
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "The user could not be deleted.";
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

    const websiteUserId = awaitedParams.websiteUserId;

    if (!mongoose.Types.ObjectId.isValid(websiteUserId)) {
      return NextResponse.json({ message: "A valid user ID is required." }, { status: 400 });
    }

    await connect();

    const websiteUser = await WebsiteUser.findById(websiteUserId).populate("website", "collaborators owner").lean(true).exec();

    if (!websiteUser) {
      return NextResponse.json({ message: "A user for that ID could not be found." }, { status: 404 });
    }

    if (!websiteUser.website) {
      return NextResponse.json({ message: "The website associated with that user could not be found." }, { status: 404 });
    }

    const website = websiteUser.website;

    const permissions = getPermissions(currentPlatformUser, website);

    const canRead = can(permissions, "user", "read");

    if (!canRead) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const output = websiteUser.toObject();

    delete output.passwordHash;
    delete output.activationToken;
    delete output.passwordResetToken;

    return NextResponse.json({ message: "A user could be found.", websiteUser: output }, { status: 200 });
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

    const websiteUserId = awaitedParams.websiteUserId;

    if (!mongoose.Types.ObjectId.isValid(websiteUserId)) {
      return NextResponse.json({ message: "A valid user ID is required." }, { status: 400 });
    }

    const data = await req.json();

    const { name } = data;

    if (typeof name !== "string") {
      return NextResponse.json({ message: "A valid name is required." }, { status: 400 });
    }

    await connect();

    const websiteUser = await WebsiteUser.findById(websiteUserId).populate("website", "collaborators owner").exec();

    if (!websiteUser) {
      return NextResponse.json({ message: "A user for that ID could not be found." }, { status: 404 });
    }

    if (!websiteUser.website) {
      return NextResponse.json({ message: "The website associated with that user could not be found." }, { status: 404 });
    }

    const website = websiteUser.website;

    const permissions = getPermissions(currentPlatformUser, website);

    const canUpdate = can(permissions, "user", "update");

    if (!canUpdate) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    websiteUser.name = name;

    await websiteUser.save();

    const output = websiteUser.toObject();

    delete output.passwordHash;
    delete output.activationToken;
    delete output.passwordResetToken;

    return NextResponse.json({ message: "The user has been saved.", websiteUser: output }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}
