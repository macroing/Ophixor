// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import connect from "@/lib/database";
import Website from "@/models/Website";

export async function findWebsiteByCode(code, isAdmin = false) {
  if (!code || typeof code !== "string") {
    return null;
  }

  await connect();

  if (isAdmin) {
    return await Website.findOne(
      { code: code.trim() },
      {
        _id: 1,
        code: 1,
        collaborators: 1,
        defaultLanguage: 1,
        description: 1,
        name: 1,
        owner: 1,
        publishedAt: 1,
        settings: 1,
        status: 1,
        theme: 1,
        updateNumber: 1,
        visibility: 1,
      },
    )
      .populate("collaborators.platformUser", "emailNormalized")
      .populate("owner", "emailNormalized plan")
      .lean(true)
      .exec();
  }

  return await Website.findOne(
    { code: code.trim() },
    {
      _id: 1,
      code: 1,
      defaultLanguage: 1,
      description: 1,
      name: 1,
      owner: 1,
      publishedAt: 1,
      settings: 1,
      status: 1,
      theme: 1,
      visibility: 1,
    },
  )
    .populate("owner", "plan")
    .lean(true)
    .exec();
}

export async function findWebsiteDefaultLanguageAndThemeByCode(code) {
  if (!code || typeof code !== "string") {
    return null;
  }

  await connect();

  const website = await Website.findOne(
    { code: code.trim() },
    {
      defaultLanguage: 1,
      theme: 1,
    },
  )
    .lean(true)
    .exec();

  return {
    defaultLanguage: website?.defaultLanguage ?? "en",
    theme: website?.theme ?? {},
  };
}
