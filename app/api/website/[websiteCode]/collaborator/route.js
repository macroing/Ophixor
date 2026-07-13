// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import { isEmail } from "validator";

import connect from "@/lib/database";
import { HttpError } from "@/lib/error";
import { can, getPermissions, isValid } from "@/lib/services/permissions";
import Website from "@/models/Website";
import PlatformUser from "@/models/PlatformUser";

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

    const url = new URL(req.url);

    const collaboratorIdSupplied = url.searchParams.get("collaboratorId");
    const updateNumberSupplied = url.searchParams.get("updateNumber");

    if (typeof collaboratorIdSupplied !== "string" || !mongoose.Types.ObjectId.isValid(collaboratorIdSupplied)) {
      return NextResponse.json({ message: "A valid collaborator ID is required." }, { status: 400 });
    }

    const collaboratorId = collaboratorIdSupplied;

    if (typeof updateNumberSupplied !== "string") {
      return NextResponse.json({ message: "A valid update number is required." }, { status: 400 });
    }

    const updateNumber = Number.parseInt(updateNumberSupplied);

    if (!Number.isFinite(updateNumber)) {
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

        const canUpdateCollaborators = can(permissions, "website", "updateCollaborators");

        if (!canUpdateCollaborators) {
          throw new HttpError("You do not have permission to perform this operation.", 403);
        }

        if (website.updateNumber === null || website.updateNumber === undefined) {
          website.updateNumber = 0;
        }

        if (website.updateNumber !== updateNumber) {
          throw new HttpError("Someone else has updated the website already.", 409);
        }

        if (Array.isArray(website.collaborators)) {
          for (let i = website.collaborators.length - 1; i >= 0; i--) {
            if (website.collaborators[i]?._id?.toString() === collaboratorId) {
              website.collaborators.splice(i, 1);
            }
          }
        }

        await website.save({ session });
      });

      return NextResponse.json({ message: "Your collaborator has been successfully removed!", website }, { status: 200 });
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "Your collaborator could not be removed.";
      const status = error?.status || 500;

      return NextResponse.json({ message }, { status });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
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

    const data = await req.json();

    const { email, permissions, updateNumber } = data;

    if (typeof email !== "string" || !isEmail(email.trim())) {
      return NextResponse.json({ message: "A valid e-mail address is required." }, { status: 400 });
    }

    if (!isValid(permissions)) {
      return NextResponse.json({ message: "Valid permissions are required." }, { status: 400 });
    }

    if (typeof updateNumber !== "number" || !Number.isFinite(updateNumber)) {
      return NextResponse.json({ message: "A valid update number is required." }, { status: 400 });
    }

    await connect();

    const platformUser = await PlatformUser.findOne({ emailNormalized: email.trim().toLowerCase() }).select("emailNormalized").lean(true).exec();

    if (!platformUser) {
      return NextResponse.json({ message: "A user with that e-mail address could not be found." }, { status: 400 });
    }

    const session = await mongoose.startSession();

    try {
      let website = null;

      await session.withTransaction(async () => {
        website = await Website.findOne({ code }).session(session).populate("collaborators.platformUser", "emailNormalized").populate("owner", "emailNormalized plan").exec();

        if (!website) {
          throw new HttpError("A website for that code could not be found.", 404);
        }

        const permissions = getPermissions(currentPlatformUser, website);

        const canUpdateCollaborators = can(permissions, "website", "updateCollaborators");

        if (!canUpdateCollaborators) {
          throw new HttpError("You do not have permission to perform this operation.", 403);
        }

        if (website.updateNumber === null || website.updateNumber === undefined) {
          website.updateNumber = 0;
        }

        if (website.updateNumber !== updateNumber) {
          throw new HttpError("Someone else has updated the website already.", 409);
        }

        website.updateNumber = website.updateNumber + 1;

        if (!Array.isArray(website.collaborators)) {
          website.collaborators = [];
        }

        if (website.owner?.emailNormalized === platformUser.emailNormalized) {
          throw new HttpError("The user with the provided e-mail address is the owner of the website.", 400);
        } else {
          let isCollaborator = false;

          for (let i = 0; i < website.collaborators.length; i++) {
            if (website.collaborators[i].platformUser?.emailNormalized === platformUser.emailNormalized) {
              isCollaborator = true;

              break;
            }
          }

          if (isCollaborator) {
            throw new HttpError("The user with the provided e-mail address is already a collaborator of the website.", 400);
          }
        }

        website.collaborators.push({ permissions, platformUser: platformUser._id });

        await website.save({ session });
      });

      return NextResponse.json({ message: "Your collaborator has been successfully added!", website }, { status: 200 });
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "Your collaborator could not be added.";
      const status = error?.status || 500;

      return NextResponse.json({ message }, { status });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}
