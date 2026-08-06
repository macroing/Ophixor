// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query") || "nature";
    const page = toNumber(searchParams.get("page"));

    const perPage = 12;

    const API_KEY = process.env.PIXABAY_API_KEY;
    const PIXABAY_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&page=${page}&per_page=${perPage}`;

    const response = await fetch(PIXABAY_URL, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from Pixabay!");
    }

    const data = await response.json();

    const totalHits = data.totalHits;
    const hits = data.hits;

    const pages = Math.ceil(totalHits / perPage);

    return NextResponse.json(
      { images: hits, page, pages },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=60",
        },
      },
    );
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

function toNumber(value, minimum = 1, maximum = 1000) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value >= minimum && value <= maximum ? value : value < minimum ? minimum : maximum;
  } else if (typeof value === "string") {
    const valueNumber = Number(value);

    if (Number.isFinite(valueNumber)) {
      return valueNumber >= minimum && valueNumber <= maximum ? valueNumber : valueNumber < minimum ? minimum : maximum;
    } else {
      return minimum;
    }
  } else {
    return minimum;
  }
}
