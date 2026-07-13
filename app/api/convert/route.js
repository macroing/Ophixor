// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { scrapeAndConvert } from "@/lib/web-page-builder/page/converter/html-converter";

import api from "@/definitions/api.json" with { type: "json" };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  let language = "en";

  try {
    const data = await req.json();

    const providedLanguage = data.language || "en";

    if (platform.languages.includes(providedLanguage)) {
      language = providedLanguage;
    }

    const url = data.url;

    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser || !currentPlatformUser.isPlatformAdmin) {
      return NextResponse.json({ message: api.permissionDenied[language] }, { status: 403 });
    }

    if (!url) {
      return NextResponse.json({ message: api.convert.missingUrl[language] }, { status: 400 });
    }

    const result = await scrapeAndConvert(url);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: api.convert.failedToImport[language] }, { status: 500 });
  }
}
