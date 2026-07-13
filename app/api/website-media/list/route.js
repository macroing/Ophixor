// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

import connect from "@/lib/database";
import { can, getPermissions } from "@/lib/services/permissions";
import Website from "@/models/Website";
import WebsiteMedia from "@/models/WebsiteMedia";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 401 });
    }

    const allowedOrders = ["asc", "desc"];
    const allowedSortFields = ["createdAt", "name", "size", "type"];
    const allowedTypes = ["audio", "document", "image", "other", "video"];

    const url = new URL(req.url);

    const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "50", 10), 1), 200);
    const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
    const websiteId = url.searchParams.get("websiteId");

    const searchRaw = url.searchParams.get("search");
    const search = typeof searchRaw === "string" && searchRaw.length <= 100 ? escapeRegex(searchRaw.trim()) : null;

    const typeRequested = url.searchParams.get("type");
    const type = allowedTypes.includes(typeRequested) ? typeRequested : null;

    const sortRequested = url.searchParams.get("sort");
    const sort = allowedSortFields.includes(sortRequested) ? sortRequested : "createdAt";

    const orderRequested = url.searchParams.get("order");
    const order = allowedOrders.includes(orderRequested) ? (orderRequested === "asc" ? 1 : -1) : -1;

    if (!websiteId || !mongoose.Types.ObjectId.isValid(websiteId)) {
      return NextResponse.json({ message: "A valid website ID is required." }, { status: 400 });
    }

    await connect();

    const website = await Website.findOne({ _id: websiteId, owner: currentPlatformUser._id }).select("collaborators owner").lean(true).exec();

    if (!website) {
      return NextResponse.json({ message: "Website not found or access denied." }, { status: 404 });
    }

    const permissions = getPermissions(currentPlatformUser, website);

    const canRead = can(permissions, "media", "read");

    if (!canRead) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const query = {
      deletedAt: null,
      website: website._id,
    };

    if (type && allowedTypes.includes(type)) {
      query.type = type;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const [websiteMedias, total] = await Promise.all([
      WebsiteMedia.find(query)
        .sort({ [sort]: order })
        .skip(skip)
        .limit(limit)
        .select({
          _id: 1,
          alt: 1,
          createdAt: 1,
          height: 1,
          mimeType: 1,
          name: 1,
          size: 1,
          type: 1,
          width: 1,
        })
        .lean(true),
      WebsiteMedia.countDocuments(query),
    ]);

    if (websiteMedias?.length > 0) {
      for (let i = 0; i < websiteMedias.length; i++) {
        if (websiteMedias[i]) {
          websiteMedias[i].url = `/api/website-media/${websiteMedias[i]._id.toString()}`;
        }
      }
    }

    return NextResponse.json({
      pagination: {
        limit,
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
      websiteMedias,
    });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
