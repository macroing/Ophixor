// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import connect from "@/lib/database";
import Platform from "@/models/Platform";
import { PLANS } from "@/definitions/plan-definitions";

export const runtime = "nodejs";

export async function DELETE(req) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser || !currentPlatformUser.isPlatformAdmin) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 401 });
    }

    await connect();

    await Platform.deleteMany({}).exec();

    return NextResponse.json({ message: "The platform has been successfully deleted." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connect();

    let platform = await Platform.findOne({}).lean(true).exec();

    if (!platform) {
      platform = await Platform.create({});
    }

    return NextResponse.json({ message: "A platform could be found.", platform }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();

    const defaultPlan = data.defaultPlan;

    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser || !currentPlatformUser.isPlatformAdmin) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 401 });
    }

    await connect();

    let platform = await Platform.findOne({}).exec();

    if (!platform) {
      platform = await Platform.create({});
    }

    if (platform) {
      if (typeof defaultPlan === "string" && PLANS.includes(defaultPlan)) {
        platform.defaultPlan = defaultPlan;
      }

      const hasSaved = await platform.save();

      if (hasSaved) {
        return NextResponse.json({ message: "The platform has been saved.", platform }, { status: 200 });
      } else {
        return NextResponse.json({ message: "The platform could not be saved." }, { status: 400 });
      }
    }
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}
