// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { headers } from "next/headers";

import { findLanguage } from "@/lib/language";

import platform from "@/definitions/platform-marketing.json" with { type: "json" };

export default function Layout({ children }) {
  return children;
}

export async function generateMetadata({ params, searchParams }, parent) {
  const headersList = await headers();

  const resolvedParent = await parent;

  const language = findLanguage(headersList);

  return {
    description: platform.marketing.pricing.metadata.description[language],
    keywords: platform.marketing.pricing.metadata.keywords[language],
    openGraph: {
      ...resolvedParent.openGraph,
      description: platform.marketing.pricing.metadata.description[language],
      title: platform.marketing.pricing.metadata.title[language],
      url: resolvedParent.openGraph.url + "/pricing",
    },
    title: platform.marketing.pricing.metadata.title[language],
  };
}
