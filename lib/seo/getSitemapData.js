// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import connect from "@/lib/database";
import Website from "@/models/Website";
import WebsitePage from "@/models/WebsitePage";

export async function getSitemapData({ baseUrl, websiteCode = null }) {
  await connect();

  if (websiteCode) {
    const website = typeof websiteCode === "string" ? await Website.findOne({ code: websiteCode.trim(), status: "active", visibility: "public" }, { _id: 1 }).lean(true).exec() : null;

    if (!website) {
      return [];
    }

    const websitePages = await WebsitePage.aggregate([
      {
        $match: {
          "seo.robots.noIndex": { $ne: true },
          status: "published",
          visibility: "public",
          website: website._id,
        },
      },
      {
        $project: {
          _id: 0,
          isHome: 1,
          lastModified: "$updatedAt",
          path: 1,
        },
      },
      { $sort: { path: 1 } },
    ]).exec();

    return websitePages.map((websitePage) => ({
      lastModified: websitePage.lastModified,
      url: `${baseUrl}${websitePage.path}`,
    }));
  }

  const websitePages = await WebsitePage.aggregate([
    {
      $match: {
        "seo.robots.noIndex": { $ne: true },
        status: "published",
        visibility: "public",
      },
    },
    {
      $lookup: {
        as: "website",
        foreignField: "_id",
        from: "websites",
        localField: "website",
      },
    },
    { $unwind: "$website" },
    {
      $match: {
        "website.status": "active",
        "website.visibility": "public",
      },
    },
    {
      $project: {
        _id: 0,
        isHome: 1,
        url: {
          $concat: [baseUrl, "/website/", "$website.code", "$path"],
        },
        lastModified: "$updatedAt",
      },
    },
    { $sort: { url: 1 } },
  ]);

  return websitePages;
}
