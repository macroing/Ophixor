// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import connect from "@/lib/database";
import WebsiteModelData from "@/models/WebsiteModelData";

export async function findWebsiteModelData({ websiteModelDataId }) {
  if (!websiteModelDataId) {
    return null;
  }

  await connect();

  return await WebsiteModelData.findById(websiteModelDataId)
    .populate({
      path: "website",
      populate: {
        path: "owner",
        select: "plan",
      },
    })
    .populate("websiteModel", "createdBy")
    .lean(true)
    .exec();
}

export async function findWebsiteModelDatas({ websiteId }) {
  if (!websiteId) {
    return [];
  }

  await connect();

  return await WebsiteModelData.find({ website: websiteId }).lean(true).exec();
}
