// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { headers } from "next/headers";

import { findLanguage } from "@/lib/language";

import platform from "@/definitions/platform-auth.json" with { type: "json" };

export default function Layout({ children }) {
  return children;
}

export async function generateMetadata({ params, searchParams }, parent) {
  const headersList = await headers();

  const resolvedParent = await parent;

  const language = findLanguage(headersList);

  return {
    description: platform.auth.sign_up.metadata.description[language],
    keywords: platform.auth.sign_up.metadata.keywords[language],
    openGraph: {
      ...resolvedParent.openGraph,
      description: platform.auth.sign_up.metadata.description[language],
      title: platform.auth.sign_up.metadata.title[language],
      url: resolvedParent.openGraph.url + "/sign-up",
    },
    title: platform.auth.sign_up.metadata.title[language],
  };
}
