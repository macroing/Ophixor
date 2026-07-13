// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { findWebsitePage } from "@/lib/data/website-page";
import { can, getPermissions } from "@/lib/services/permissions";

export async function getWebsitePageForPlatformUser({ isAdmin = false, isIncludingDraft = false, path, platformUser, website }) {
  if (!website) {
    return null;
  }

  const websitePage = await findWebsitePage({
    isIncludingDraft,
    path,
    websiteId: website._id,
  });

  if (!websitePage) {
    return null;
  }

  if (websitePage.status === "published" && websitePage.visibility === "public") {
    if (!isAdmin) {
      return websitePage;
    }
  }

  if (!platformUser) {
    return null;
  }

  if (platformUser.isPlatformAdmin) {
    return websitePage;
  }

  if ((website.owner?._id && website.owner._id?.toString() === platformUser._id.toString()) || (website.owner && website.owner?.toString() === platformUser._id.toString())) {
    return websitePage;
  }

  if (isAdmin) {
    const permissions = getPermissions(platformUser, website);

    const isCollaborator = permissions?.isCollaborator ? true : false;

    if (isCollaborator) {
      return can(permissions, "page", "read") ? websitePage : null;
    }
  }

  return null;
}
