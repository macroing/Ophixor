// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { WEBSITE_DEMO } from "@/lib/data/website-demo";

export const WEBSITE_PAGE_DEMO = {
  _id: "ophixor",
  createdAt: new Date().toISOString(),
  createdBy: null,
  description: "This is a demo page.",
  firstPublishedAt: null,
  isHome: true,
  isSocketConnectingAutomatically: false,
  isSocketEnabled: true,
  name: "Home",
  passwordHash: "",
  parentWebsitePage: null,
  path: "/",
  publishedAt: null,
  seo: {
    canonicalUrl: "/",
    description: "",
    keywords: [],
    og: {
      description: "",
      image: "",
      title: "",
    },
    robots: {
      noFollow: true,
      noIndex: true,
    },
    title: "",
  },
  slug: "",
  status: "published",
  type: "landing",
  updateNumber: 0,
  updatedAt: new Date().toISOString(),
  visibility: "public",
  website: WEBSITE_DEMO,
  websitePageDataDraft: null,
  websitePageDataPublished: null,
  websitePageDataVersions: [],
};
