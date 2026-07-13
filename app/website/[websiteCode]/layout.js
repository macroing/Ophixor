// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { getToken } from "next-auth/jwt";

import { CurrentWebsiteUserProvider } from "@/context/current-website-user";
import { SocketProvider } from "@/context/socket";
import { WebsitePageProvider } from "@/context/website-page";
import { WebsiteProvider } from "@/context/website";
import { findWebsiteModelDatas } from "@/lib/data/website-model-data";
import { findWebsiteModels } from "@/lib/data/website-model";
import { getWebsiteForPlatformUser } from "@/lib/services/website-services";
import { getWebsitePageForPlatformUser } from "@/lib/services/website-page-services";
import { getWebsiteUser } from "@/lib/auth/getWebsiteUser";
import { isLocalhost } from "@/lib/host";

export default async function Layout(props) {
  const children = props.children;

  const [headersList, cookiesList, params] = await Promise.all([headers(), cookies(), props.params]);

  const websiteCode = decodeURIComponent(params.websiteCode);

  const token = await getToken({
    req: {
      cookies: Object.fromEntries(cookiesList.getAll().map((cookie) => [cookie.name, cookie.value])),
    },
    secret: process.env.NEXTAUTH_SECRET,
  });

  const platformUser = token?.platformUser || null;

  const pathname = headersList.get("x-pathname");

  const contentCode = headersList.get("x-content-code");
  const contentHost = headersList.get("x-content-host");

  const isCustomDomain = !!contentCode && !!contentHost;

  let path = "/";

  if (typeof pathname === "string" && pathname.startsWith("/website/" + websiteCode)) {
    path = pathname.substring(("/website/" + websiteCode).length);

    if (path === "") {
      path = "/";
    }
  }

  const website = await getWebsiteForPlatformUser({ platformUser, websiteCode });

  if (!website) {
    notFound();
  }

  const [websitePage, websiteModels, websiteModelDatas] = await Promise.all([getWebsitePageForPlatformUser({ isIncludingDraft: false, path, platformUser, website }), findWebsiteModels({ websiteId: website._id.toString() }), findWebsiteModelDatas({ websiteId: website._id.toString() })]);

  if (!websitePage) {
    notFound();
  }

  const websiteUser = await getWebsiteUser();

  const models = buildRuntimeModels(websiteModels);
  const pageData = buildRuntimeData(websiteModels, websiteModelDatas);

  const websitePlain = JSON.parse(JSON.stringify(website));
  const websitePagePlain = JSON.parse(JSON.stringify(websitePage));
  const websiteUserPlain = websiteUser ? JSON.parse(JSON.stringify(websiteUser)) : null;

  return (
    <WebsiteProvider code={websiteCode} isCustomDomain={isCustomDomain} website={websitePlain}>
      <CurrentWebsiteUserProvider websiteCode={websiteCode} websiteUser={websiteUserPlain}>
        <WebsitePageProvider isSwitchingPage={true} models={models} pageData={pageData} path={path} websitePage={websitePagePlain}>
          <SocketProvider>{children}</SocketProvider>
        </WebsitePageProvider>
      </CurrentWebsiteUserProvider>
    </WebsiteProvider>
  );
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

function buildRuntimeData(models, dataEntries) {
  const result = {};

  const modelMap = {};

  for (const model of models) {
    modelMap[model._id.toString()] = normalizeModelName(model.name);
  }

  for (const entry of dataEntries) {
    const modelKey = modelMap[entry.websiteModel.toString()];

    if (!modelKey) {
      continue;
    }

    if (!result[modelKey]) {
      result[modelKey] = [];
    }

    result[modelKey].push({
      id: entry._id.toString(),
      createdAt: new Date(entry.createdAt).toISOString(),
      updatedAt: new Date(entry.updatedAt).toISOString(),
      ...entry.data,
    });
  }

  return result;
}

function buildRuntimeModels(models) {
  const result = {};

  for (const model of models) {
    const key = normalizeModelName(model.name);

    result[key] = {
      type: model.type || "collection",
      fields: model.fields || {},
    };
  }

  return result;
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

function normalizeModelName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "_");
}
