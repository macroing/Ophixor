// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { cookies } from "next/headers";

import connect from "@/lib/database";
import WebsiteUser from "@/models/WebsiteUser";
import { verifyWebsiteToken } from "./website-token";

export async function getWebsiteUser(req = null) {
  let token = null;

  if (req) {
    token = req.cookies.get("website_token")?.value;
  } else {
    token = (await cookies()).get("website_token")?.value;
  }

  if (!token) {
    return null;
  }

  const decoded = verifyWebsiteToken(token);

  if (!decoded) {
    return null;
  }

  await connect();

  return WebsiteUser.findOne({
    _id: decoded.websiteUserId,
    website: decoded.websiteId,
  })
    .select("-passwordHash -activationToken -passwordResetToken")
    .lean()
    .exec();
}
