// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { cookies, headers } from "next/headers";
import { getToken } from "next-auth/jwt";

import { getWebsiteForPlatformUser } from "@/lib/services/website-services";
import { getWebsitePageForPlatformUser } from "@/lib/services/website-page-services";
import { isLocalhost } from "@/lib/host";

export default async function Layout(props) {
  const children = props.children;

  return <>{children}</>;
}

export async function generateMetadata({ params }) {
  const [headersList, cookiesList, awaitedParams] = await Promise.all([headers(), cookies(), params]);

  const websiteCode = decodeURIComponent(awaitedParams.websiteCode);

  const host = headersList.get("host");
  const pathname = headersList.get("x-pathname");
  const pathnameOriginal = headersList.get("x-pathname-original");
  const referer = headersList.get("referer");

  const metadataBaseUrl = getMetadataBaseUrl(host, pathnameOriginal, referer);

  const token = await getToken({
    req: {
      cookies: Object.fromEntries(cookiesList.getAll().map((c) => [c.name, c.value])),
    },
    secret: process.env.NEXTAUTH_SECRET,
  });

  const platformUser = token?.platformUser || null;

  let path = "/";

  if (typeof pathname === "string" && pathname.startsWith("/website/" + websiteCode)) {
    path = pathname.substring(("/website/" + websiteCode).length);

    if (path === "") {
      path = "/";
    }
  }

  const website = await getWebsiteForPlatformUser({
    platformUser,
    websiteCode,
  });

  if (!website) {
    return { title: "" };
  }

  const websitePage = await getWebsitePageForPlatformUser({
    isIncludingDraft: false,
    path,
    platformUser,
    website,
  });

  if (!websitePage) {
    return { title: website?.name || "" };
  }

  const seo = websitePage.seo || {};

  const title = seo.title || websitePage.name || website.name;

  const description = seo.description || website.description || "";

  const canonical = seo.canonicalUrl || `${metadataBaseUrl}${host === process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, "") ? `/website/${website.code}${path === "/" ? "" : path}` : path}`;

  const ogImage = seo.og?.image ? absoluteUrl(seo.og.image, metadataBaseUrl) : null;

  const keywords = Array.isArray(seo.keywords) ? seo.keywords.join(", ") : "";

  return {
    alternates: {
      canonical,
    },
    description,
    keywords,
    metadataBase: new URL(metadataBaseUrl),
    openGraph: {
      description: seo.og?.description || description,
      images: ogImage
        ? [
            {
              height: 630,
              url: ogImage,
              width: 1200,
            },
          ]
        : undefined,
      siteName: website.name,
      title: seo.og?.title || title,
      type: "website",
      url: canonical,
    },
    robots: {
      follow: !seo.robots?.noFollow,
      index: !seo.robots?.noIndex,
    },
    title,
  };
}

function absoluteUrl(url, base) {
  if (!url) {
    return null;
  }

  if (url.startsWith("http")) {
    return url;
  }

  return base + url;
}

function getMetadataBaseUrl(host, pathnameOriginal, referer) {
  const baseUrl = process.env.NEXTAUTH_URL;

  if (typeof pathnameOriginal === "string") {
    let protocol = "https";

    if ((typeof referer === "string" && referer.startsWith("http:")) || isLocalhost(host)) {
      protocol = "http";
    }

    if (typeof host === "string") {
      return `${protocol}://${host}`;
    }
  }

  return baseUrl;
}
