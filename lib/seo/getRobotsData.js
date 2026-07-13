// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import connect from "@/lib/database";
import Website from "@/models/Website";
import WebsitePage from "@/models/WebsitePage";

export async function getRobotsData({ websiteCode = null } = {}) {
  await connect();

  if (websiteCode) {
    const website = typeof websiteCode === "string" ? await Website.findOne({ code: websiteCode.trim() }, { status: 1, visibility: 1 }).lean(true).exec() : null;

    if (!website) {
      return {
        isWebsiteAccessible: false,
        noIndexPaths: [],
      };
    }

    const isWebsiteAccessible = website.status === "active" && website.visibility === "public";

    if (!isWebsiteAccessible) {
      return {
        isWebsiteAccessible: false,
        noIndexPaths: [],
      };
    }

    const websitePages = await WebsitePage.aggregate([
      {
        $match: {
          "seo.robots.noIndex": true,
          status: "published",
          visibility: "public",
          website: website._id,
        },
      },
      {
        $project: {
          _id: 0,
          path: 1,
        },
      },
    ]).exec();

    return {
      isWebsiteAccessible: true,
      noIndexPaths: websitePages.map((websitePage) => websitePage.path),
    };
  }

  const inaccessibleWebsites = await Website.find(
    {
      $or: [
        {
          status: { $ne: "active" },
        },
        {
          visibility: { $ne: "public" },
        },
      ],
    },
    { code: 1 },
  )
    .lean(true)
    .exec();

  const inaccessibleWebsiteCodes = inaccessibleWebsites.map((inaccessibleWebsite) => inaccessibleWebsite.code);

  const websitePages = await WebsitePage.aggregate([
    {
      $match: {
        $or: [
          {
            "seo.robots.noIndex": true,
          },
          {
            status: { $ne: "published" },
          },
          {
            visibility: { $ne: "public" },
          },
        ],
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
        path: {
          $concat: ["/website/", "$website.code", "$path"],
        },
      },
    },
  ]).exec();

  return {
    inaccessibleWebsiteCodes,
    isWebsiteAccessible: true,
    noIndexPaths: websitePages.map((websitePage) => websitePage.path),
  };
}
