// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { findWebsiteIntegration } from "@/lib/data/website-integration";
import { can, getPermissions } from "@/lib/services/permissions";

export async function getWebsiteIntegrationForPlatformUser({ platformUser, websiteIntegrationId }) {
  if (!websiteIntegrationId) {
    return null;
  }

  const websiteIntegration = await findWebsiteIntegration({
    websiteIntegrationId,
  });

  if (!websiteIntegration) {
    return null;
  }

  if (!platformUser) {
    return null;
  }

  if (platformUser.isPlatformAdmin) {
    return websiteIntegration;
  }

  const website = websiteIntegration.website;

  if ((website?.owner?._id && website.owner._id?.toString() === platformUser._id.toString()) || (website?.owner && website.owner?.toString() === platformUser._id.toString())) {
    return websiteIntegration;
  }

  const permissions = getPermissions(platformUser, website);

  const isCollaborator = permissions?.isCollaborator ? true : false;

  if (isCollaborator) {
    return can(permissions, "integration", "read") ? websiteIntegration : null;
  }

  return null;
}
