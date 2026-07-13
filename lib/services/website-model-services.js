// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { findWebsiteModel } from "@/lib/data/website-model";
import { can, getPermissions } from "@/lib/services/permissions";

export async function getWebsiteModelForPlatformUser({ platformUser, websiteModelId }) {
  if (!websiteModelId) {
    return null;
  }

  const websiteModel = await findWebsiteModel({
    websiteModelId,
  });

  if (!websiteModel) {
    return null;
  }

  if (!platformUser) {
    return null;
  }

  if (platformUser.isPlatformAdmin) {
    return websiteModel;
  }

  const website = websiteModel.website;

  if ((website?.owner?._id && website.owner._id?.toString() === platformUser._id.toString()) || (website?.owner && website.owner?.toString() === platformUser._id.toString())) {
    return websiteModel;
  }

  const permissions = getPermissions(platformUser, website);

  const isCollaborator = permissions?.isCollaborator ? true : false;

  if (isCollaborator) {
    return can(permissions, "model", "read") ? websiteModel : null;
  }

  return null;
}
