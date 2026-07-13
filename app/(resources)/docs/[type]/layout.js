// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { findLanguage } from "@/lib/language";

import platform from "@/definitions/platform-resources.json" with { type: "json" };

export default function Layout({ children }) {
  return children;
}

export async function generateMetadata({ params, searchParams }, parent) {
  const headersList = await headers();

  const resolvedParams = await params;
  const resolvedParent = await parent;

  const language = findLanguage(headersList);

  const rawType = resolvedParams?.type;

  const type = Array.isArray(rawType) ? rawType[0]?.toLowerCase() : rawType?.toLowerCase();

  let descriptionToUse = "";
  let keywordsToUse = "";
  let titleToUse = "";
  let urlToUse = resolvedParent.openGraph.url + "/docs";

  if (typeof type === "string" && typeof name === "string") {
    urlToUse += `/${type}`;
  }

  if (type === "action") {
    descriptionToUse = platform.resources.docs.metadata.descriptionActions[language];
    titleToUse = platform.resources.docs.metadata.titleActions[language];
  } else if (type === "component") {
    descriptionToUse = platform.resources.docs.metadata.descriptionComponents[language];
    titleToUse = platform.resources.docs.metadata.titleComponents[language];
  } else if (type === "expression") {
    descriptionToUse = platform.resources.docs.metadata.descriptionExpressions[language];
    titleToUse = platform.resources.docs.metadata.titleExpressions[language];
  } else {
    notFound();
  }

  return {
    description: descriptionToUse,
    keywords: keywordsToUse,
    openGraph: {
      ...resolvedParent.openGraph,
      description: descriptionToUse,
      title: titleToUse,
      url: urlToUse,
    },
    title: titleToUse,
  };
}
