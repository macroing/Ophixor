// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { findWebsiteModelData } from "@/lib/data/website-model-data";
import { can, getPermissions } from "@/lib/services/permissions";

export async function getWebsiteModelDataForPlatformUser({ platformUser, websiteModelDataId }) {
  if (!websiteModelDataId) {
    return null;
  }

  const websiteModelData = await findWebsiteModelData({
    websiteModelDataId,
  });

  if (!websiteModelData) {
    return null;
  }

  if (!platformUser) {
    return null;
  }

  if (platformUser.isPlatformAdmin) {
    return websiteModelData;
  }

  const website = websiteModelData.website;

  if ((website?.owner?._id && website.owner._id?.toString() === platformUser._id.toString()) || (website?.owner && website.owner?.toString() === platformUser._id.toString())) {
    return websiteModelData;
  }

  const permissions = getPermissions(platformUser, website);

  const isCollaborator = permissions?.isCollaborator ? true : false;

  if (isCollaborator) {
    return can(permissions, "modelData", "read") ? websiteModelData : null;
  }

  return null;
}
