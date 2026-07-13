// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import jwt from "jsonwebtoken";

const SECRET = process.env.WEBSITE_AUTH_SECRET || process.env.NEXTAUTH_SECRET;

export function signWebsiteToken(payload) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "30d",
  });
}

export function verifyWebsiteToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
