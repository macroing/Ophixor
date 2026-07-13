// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import connect from "@/lib/database";
import WebsiteIntegration from "@/models/WebsiteIntegration";

export async function findWebsiteIntegration({ websiteIntegrationId }) {
  if (!websiteIntegrationId) {
    return null;
  }

  await connect();

  return await WebsiteIntegration.findById(websiteIntegrationId)
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

export async function findWebsiteIntegrations({ websiteId }) {
  if (!websiteId) {
    return [];
  }

  await connect();

  return await WebsiteIntegration.find({ website: websiteId }).lean(true).exec();
}
