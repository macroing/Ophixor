// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export const WEBSITE_DEMO = {
  _id: "ophixor",
  code: "ophixor",
  collaborators: [],
  createdAt: new Date().toISOString(),
  defaultLanguage: "en",
  description: "This is a demo website.",
  firstPublishedAt: null,
  name: "Ophixor",
  owner: null,
  publishedAt: null,
  settings: {},
  status: "active",
  updateNumber: 0,
  updatedAt: new Date().toISOString(),
  visibility: "public",
};

export function createWebsiteDemo(language = "en") {
  const websiteDemo = { ...WEBSITE_DEMO };

  websiteDemo.defaultLanguage = language;

  return websiteDemo;
}
