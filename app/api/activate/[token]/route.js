// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import connect from "@/lib/database";
import PlatformUser from "@/models/PlatformUser";

import api from "@/definitions/api.json" with { type: "json" };

export const runtime = "nodejs";

export async function PUT(req, { params }) {
  let language = "en";

  try {
    const url = new URL(req.url);

    const providedLanguage = url.searchParams.get("language") || "en";

    if (api.languages.includes(providedLanguage)) {
      language = providedLanguage;
    }

    const token = (await params).token;

    const decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET);

    await connect();

    const platformUser = await PlatformUser.findById(decodedToken._id).select("activatedAt activationToken").exec();

    if (!platformUser) {
      return NextResponse.json({ message: api.activate.couldNotBeActivated[language] }, { status: 400 });
    }

    if (platformUser.activationToken === "") {
      return NextResponse.json({ message: api.activate.hasAlreadyBeenActivated[language] }, { status: 200 });
    }

    platformUser.activationToken = "";
    platformUser.activatedAt = new Date();

    const hasSaved = await platformUser.save();

    if (hasSaved) {
      return NextResponse.json({ message: api.activate.hasBeenActivated[language] }, { status: 200 });
    } else {
      return NextResponse.json({ message: api.activate.couldNotBeActivated[language] }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ message: api.activate.invalidLink[language] }, { status: 400 });
  }
}
