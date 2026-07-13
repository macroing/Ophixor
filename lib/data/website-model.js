// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import connect from "@/lib/database";
import WebsiteModel from "@/models/WebsiteModel";

export async function findWebsiteModel({ websiteModelId }) {
  if (!websiteModelId) {
    return null;
  }

  await connect();

  return await WebsiteModel.findById(websiteModelId)
    .populate({
      path: "website",
      populate: {
        path: "owner",
        select: "plan",
      },
    })
    .lean(true)
    .exec();
}

export async function findWebsiteModels({ websiteId }) {
  if (!websiteId) {
    return [];
  }

  await connect();

  return await WebsiteModel.find({ website: websiteId }).lean(true).exec();
}
