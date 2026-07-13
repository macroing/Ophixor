// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import connect from "@/lib/database";
import PlatformUser from "@/models/PlatformUser";

export async function findPlatformUserById(id) {
  if (!id) {
    return null;
  }

  await connect();

  return await PlatformUser.findById(id, {
    _id: 1,
    createdAt: 1,
    updatedAt: 1,
    activatedAt: 1,
    email: 1,
    isPlatformAdmin: 1,
    lastActiveAt: 1,
    plan: 1,
  })
    .lean(true)
    .exec();
}
