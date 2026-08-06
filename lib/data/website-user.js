// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import connect from "@/lib/database";
import WebsiteUser from "@/models/WebsiteUser";

export async function findWebsiteUser({ websiteUserId }) {
  if (!websiteUserId) {
    return null;
  }

  await connect();

  return await WebsiteUser.findById(websiteUserId)
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

export async function findWebsiteUsers({ websiteId }) {
  if (!websiteId) {
    return [];
  }

  await connect();

  return await WebsiteUser.find({ website: websiteId }).lean(true).exec();
}
