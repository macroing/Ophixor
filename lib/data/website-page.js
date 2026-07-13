// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import connect from "@/lib/database";
import WebsitePage from "@/models/WebsitePage";
import WebsitePageData from "@/models/WebsitePageData";

export async function findWebsitePage({ isIncludingDraft = false, path, websiteId }) {
  if (!path || !websiteId) {
    return null;
  }

  await connect();

  const match = {
    path,
    website: websiteId,
  };

  if (!isIncludingDraft) {
    match.status = "published";
    //match.visibility = "public";
  }

  return await WebsitePage.findOne(match).populate("websitePageDataDraft websitePageDataPublished").lean(true).exec();
}
