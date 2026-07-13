// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { headers } from "next/headers";

import { getRobotsData } from "@/lib/seo/getRobotsData";

const platformBaseUrl = process.env.NEXTAUTH_URL;

export default async function robots() {
  try {
    const headersList = await headers();

    const contentCode = headersList.get("x-content-code");
    const contentHost = headersList.get("x-content-host");

    const isCustomDomain = !!contentCode && !!contentHost;

    const protocol = contentHost === "localhost" || contentHost === "127.0.0.1" ? "http://" : "https://";

    const currentBaseUrl = isCustomDomain ? protocol + contentHost : platformBaseUrl;

    const { inaccessibleWebsiteCodes, isWebsiteAccessible, noIndexPaths } = await getRobotsData({ websiteCode: isCustomDomain ? contentCode : null });

    if (isCustomDomain && !isWebsiteAccessible) {
      return {
        rules: {
          disallow: "/",
          userAgent: "*",
        },
      };
    }

    const disallow = [];

    if (!isCustomDomain) {
      disallow.push("/account/", "/activate/", "/admin/", "/website-admin/", "/website-admin-new/");

      for (const code of inaccessibleWebsiteCodes) {
        disallow.push(`/website/${code}/`);
      }
    } else {
      disallow.push("/admin/");
    }

    disallow.push(...noIndexPaths);

    return {
      rules: {
        allow: "/",
        disallow,
        userAgent: "*",
      },
      sitemap: `${currentBaseUrl}/sitemap.xml`,
    };
  } catch (error) {
    return {
      rules: {
        disallow: "/",
        userAgent: "*",
      },
    };
  }
}
