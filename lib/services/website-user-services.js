// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { findWebsiteUser } from "@/lib/data/website-user";
import { can, getPermissions } from "@/lib/services/permissions";

export async function getWebsiteUserForPlatformUser({ platformUser, websiteUserId }) {
  if (!websiteUserId) {
    return null;
  }

  const websiteUser = await findWebsiteUser({
    websiteUserId,
  });

  if (!websiteUser) {
    return null;
  }

  if (!platformUser) {
    return null;
  }

  if (platformUser.isPlatformAdmin) {
    return websiteUser;
  }

  const website = websiteUser.website;

  if ((website?.owner?._id && website.owner._id?.toString() === platformUser._id.toString()) || (website?.owner && website.owner?.toString() === platformUser._id.toString())) {
    return websiteUser;
  }

  const permissions = getPermissions(platformUser, website);

  const isCollaborator = permissions?.isCollaborator ? true : false;

  if (isCollaborator) {
    return can(permissions, "user", "read") ? websiteUser : null;
  }

  return null;
}
