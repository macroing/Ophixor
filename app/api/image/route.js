// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query") || "nature";

    const API_KEY = process.env.PIXABAY_API_KEY;
    const PIXABAY_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=12`;

    const response = await fetch(PIXABAY_URL, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from Pixabay!");
    }

    const data = await response.json();

    return NextResponse.json(data.hits, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}
