// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { headers } from "next/headers";

import { findLanguage } from "@/lib/language";

import platform from "@/definitions/platform-legal.json" with { type: "json" };

export default function Layout({ children }) {
  return children;
}

export async function generateMetadata({ params, searchParams }, parent) {
  const headersList = await headers();

  const resolvedParent = await parent;

  const language = findLanguage(headersList);

  return {
    description: platform.legal.terms.metadata.description[language],
    keywords: platform.legal.terms.metadata.keywords[language],
    openGraph: {
      ...resolvedParent.openGraph,
      description: platform.legal.terms.metadata.description[language],
      title: platform.legal.terms.metadata.title[language],
      url: resolvedParent.openGraph.url + "/terms",
    },
    title: platform.legal.terms.metadata.title[language],
  };
}
