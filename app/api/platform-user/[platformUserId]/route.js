// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { getToken } from "next-auth/jwt";

import connect from "@/lib/database";
import PlatformUser from "@/models/PlatformUser";
import { PLANS } from "@/definitions/plan-definitions";

export const runtime = "nodejs";

export async function DELETE(req, { params }) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 400 });
    }

    const awaitedParams = await params;

    const id = awaitedParams.platformUserId;

    if (!id) {
      return NextResponse.json({ message: "An ID is required." }, { status: 400 });
    }

    await connect();

    const platformUser = await PlatformUser.findById(id).select("-passwordHash").exec();

    if (!platformUser) {
      return NextResponse.json({ message: "No user for the supplied ID could be found." }, { status: 400 });
    }

    if (!currentPlatformUser.isPlatformAdmin && currentPlatformUser._id.toString() !== platformUser._id.toString()) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 400 });
    }

    await PlatformUser.deleteOne({ _id: platformUser._id }).exec();

    return NextResponse.json({ message: currentPlatformUser?._id?.toString() === platformUser?._id?.toString() ? "Your user account was successfully deleted!" : "The user account was successfully deleted.", platformUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 400 });
    }

    const awaitedParams = await params;

    const id = awaitedParams.platformUserId;

    if (!id) {
      return NextResponse.json({ message: "An ID is required." }, { status: 400 });
    }

    await connect();

    const platformUser = await PlatformUser.findById(id).select("-passwordHash").exec();

    if (!platformUser) {
      return NextResponse.json({ message: "No user for the supplied ID could be found." }, { status: 400 });
    }

    if (!currentPlatformUser.isPlatformAdmin) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 400 });
    }

    return NextResponse.json({ message: "A user could be found.", platformUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 400 });
    }

    const awaitedParams = await params;

    const id = awaitedParams.platformUserId;

    if (!id) {
      return NextResponse.json({ message: "An ID is required." }, { status: 400 });
    }

    const data = await req.json();

    const { activate, isPlatformAdmin, passwordNew, passwordOld, plan } = data;

    await connect();

    const platformUser = await PlatformUser.findById(id).exec();

    if (!platformUser) {
      return NextResponse.json({ message: "No user for the supplied ID could be found." }, { status: 400 });
    }

    if (!currentPlatformUser.isPlatformAdmin && currentPlatformUser._id.toString() !== platformUser._id.toString()) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 400 });
    }

    if (typeof passwordNew === "string") {
      const passwordNewTrimmed = passwordNew.trim();

      if (passwordNewTrimmed.length < 6) {
        return NextResponse.json({ message: "Your new password has to be at least 6 characters long." }, { status: 400 });
      }

      if (typeof passwordOld === "string") {
        const passwordOldTrimmed = passwordOld.trim();

        if (passwordOldTrimmed.length < 6) {
          return NextResponse.json({ message: "Your old password has to be at least 6 characters long." }, { status: 400 });
        }

        if (!(await compare(passwordOldTrimmed, platformUser.passwordHash))) {
          return NextResponse.json({ message: "You have supplied the wrong password." }, { status: 400 });
        }

        const passwordHash = await hash(passwordNewTrimmed, 12);

        platformUser.passwordHash = passwordHash;
      } else if (currentPlatformUser.isPlatformAdmin) {
        const passwordHash = await hash(passwordNewTrimmed, 12);

        platformUser.passwordHash = passwordHash;
      } else {
        return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 400 });
      }
    }

    if (typeof activate === "boolean") {
      if (currentPlatformUser.isPlatformAdmin) {
        if (activate) {
          platformUser.activationToken = "";
          platformUser.activatedAt = platformUser.activatedAt || new Date();
        } else {
          platformUser.activationToken = "";
          platformUser.activatedAt = null;
        }
      } else {
        return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 400 });
      }
    }

    if (typeof isPlatformAdmin === "boolean") {
      if (currentPlatformUser.isPlatformAdmin) {
        platformUser.isPlatformAdmin = isPlatformAdmin;
      } else {
        return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 400 });
      }
    }

    if (typeof plan === "string" && PLANS.includes(plan)) {
      if (currentPlatformUser.isPlatformAdmin) {
        platformUser.plan = plan;
      } else {
        return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 400 });
      }
    }

    await platformUser.save();

    delete platformUser.activationToken;
    delete platformUser.passwordHash;
    delete platformUser.passwordResetToken;

    return NextResponse.json({ message: currentPlatformUser?._id?.toString() === platformUser?._id?.toString() ? "Your user account was successfully saved!" : "The user account was successfully saved.", platformUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}
