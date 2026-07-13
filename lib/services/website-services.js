// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { findWebsiteByCode } from "@/lib/data/website";
import { getPermissions } from "@/lib/services/permissions";
import { PLAN_FREE, PLAN_PRO_GOLD } from "@/definitions/plan-definitions";

export async function getWebsiteForPlatformUser({ isAdmin = false, platformUser, websiteCode }) {
  const website = await findWebsiteByCode(websiteCode, isAdmin);

  if (!website) {
    return null;
  }

  if (website.status === "active" && website.visibility === "public") {
    if (!isAdmin) {
      return website;
    }
  }

  if (!platformUser || typeof platformUser !== "object" || Array.isArray(platformUser)) {
    return null;
  }

  if (platformUser.isPlatformAdmin) {
    return website;
  }

  if ((website.owner?._id && website.owner._id?.toString() === platformUser._id?.toString()) || (website.owner && website.owner?.toString() === platformUser._id?.toString())) {
    return website;
  }

  if (isAdmin) {
    const permissions = getPermissions(platformUser, website);

    const isCollaborator = permissions?.isCollaborator ? true : false;

    const plan = isCollaborator ? PLAN_PRO_GOLD : platformUser?.plan || PLAN_FREE;

    const hasProGold = plan === PLAN_PRO_GOLD;

    return hasProGold ? website : null;
  }

  return null;
}

export function resolveWebsiteContext(headersList) {
  const contentCode = headersList.get("x-content-code");

  if (contentCode) {
    return {
      code: decodeURIComponent(contentCode),
      source: "custom-domain",
    };
  }

  const pathname = headersList.get("x-pathname");

  const matchWebsite = pathname?.match(/^\/website\/([^/]+)/);

  if (matchWebsite) {
    return {
      code: decodeURIComponent(matchWebsite[1]),
      source: "platform",
    };
  }

  const matchWebsiteAdmin = pathname?.match(/^\/website-admin\/([^/]+)/);

  if (matchWebsiteAdmin) {
    return {
      code: decodeURIComponent(matchWebsiteAdmin[1]),
      source: "platform",
    };
  }

  return null;
}
