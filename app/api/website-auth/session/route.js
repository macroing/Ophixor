// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";

import { getWebsiteUser } from "@/lib/auth/getWebsiteUser";

export const runtime = "nodejs";

export async function GET(req) {
  const websiteUser = await getWebsiteUser(req);

  return NextResponse.json({
    websiteUser: websiteUser ?? null,
  });
}
