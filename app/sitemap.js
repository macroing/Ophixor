// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { headers } from "next/headers";

import { getSitemapData } from "@/lib/seo/getSitemapData";

export const revalidate = 3600;

const platformBaseUrl = process.env.NEXTAUTH_URL;

export default async function sitemap() {
  try {
    const headersList = await headers();

    const contentCode = headersList.get("x-content-code");
    const contentHost = headersList.get("x-content-host");

    const isCustomDomain = !!contentCode && !!contentHost;

    const protocol = contentHost === "localhost" || contentHost === "127.0.0.1" ? "http://" : "https://";

    const currentBaseUrl = isCustomDomain ? protocol + contentHost : platformBaseUrl;

    const data = await getSitemapData({ baseUrl: currentBaseUrl, websiteCode: isCustomDomain ? contentCode : null });

    const items = [];

    if (!isCustomDomain) {
      const lastModified = new Date(process.env.NEXT_BUILD_TIME || Date.now());

      items.push({ changeFrequency: "weekly", lastModified, priority: 1, url: currentBaseUrl });
      items.push({ changeFrequency: "weekly", lastModified, priority: 0.8, url: currentBaseUrl + "/changelog" });
      items.push({ changeFrequency: "monthly", lastModified, priority: 0.6, url: currentBaseUrl + "/cookies" });
      items.push({ changeFrequency: "weekly", lastModified, priority: 0.8, url: currentBaseUrl + "/docs" });
      items.push({ changeFrequency: "weekly", lastModified, priority: 0.9, url: currentBaseUrl + "/features" });
      items.push({ changeFrequency: "weekly", lastModified, priority: 0.9, url: currentBaseUrl + "/pricing" });
      items.push({ changeFrequency: "monthly", lastModified, priority: 0.6, url: currentBaseUrl + "/privacy" });
      items.push({ changeFrequency: "monthly", lastModified, priority: 0.6, url: currentBaseUrl + "/terms" });
    }

    items.push(...data);

    return items.map((item) => {
      let changeFrequency = item.changeFrequency || "monthly";
      let priority = item.priority || 0.8;

      if (item.isHome) {
        changeFrequency = "weekly";
        priority = 1.0;
      }

      return {
        changeFrequency,
        lastModified: item.lastModified,
        priority,
        url: item.url,
      };
    });
  } catch {
    return [];
  }
}
