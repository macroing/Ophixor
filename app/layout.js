// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { userAgentFromString } from "next/server";
import { Inter } from "next/font/google";

import CookieBanner from "@/components/platform/legal/CookieBanner";
import { ConsentProvider } from "@/lib/web-page-builder/components/runtime/privacy/ConsentProvider";
import { NextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import NextAuthProvider from "@/components/provider/NextAuthProvider";
import { CurrentPlatformUserProvider } from "@/context/current-platform-user";
import { LanguageProvider } from "@/context/language";
import { ViewportProvider } from "@/hooks/ViewportProvider";
import { findLanguage } from "@/lib/language";
import { findWebsiteDefaultLanguageAndThemeByCode } from "@/lib/data/website";
import { isLocalhost } from "@/lib/host";
import { resolveWebsiteContext } from "@/lib/services/website-services";

import platform from "@/definitions/platform-marketing.json" with { type: "json" };

import "@/lib/web-page-builder/theme/editor-tokens.css";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export default async function RootLayout({ children }) {
  const headersList = await headers();

  const host = headersList.get("host");
  const pathname = headersList.get("x-pathname");
  const pathnameOriginal = headersList.get("x-pathname-original");
  const referer = headersList.get("referer");

  const { device } = userAgentFromString(headersList.get("user-agent") || "");

  const type = device?.type || "desktop";

  const fonts = [inter];

  const session = await getServerSession(NextAuthOptions);

  const context = resolveWebsiteContext(headersList);

  const initialLanguage = findLanguage(headersList);

  let language = initialLanguage;

  if (context?.code) {
    const data = await findWebsiteDefaultLanguageAndThemeByCode(context.code);

    const defaultLanguage = data?.defaultLanguage;

    if (defaultLanguage === "en" || defaultLanguage === "sv") {
      language = defaultLanguage;
    }
  }

  return (
    <html className={fonts.map((font) => font.variable).join(" ")} lang={language}>
      <body>
        <LanguageProvider initialLanguage={initialLanguage} language={language}>
          <ViewportProvider type={type}>
            <ConsentProvider>
              <CookieBanner />
              <NextAuthProvider session={session}>
                <CurrentPlatformUserProvider>{children}</CurrentPlatformUserProvider>
              </NextAuthProvider>
            </ConsentProvider>
          </ViewportProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

export async function generateMetadata({ params, searchParams }, parent) {
  const headersList = await headers();

  const host = headersList.get("host");
  const pathname = headersList.get("x-pathname");
  const pathnameOriginal = headersList.get("x-pathname-original");
  const referer = headersList.get("referer");

  const metadataBaseUrl = getMetadataBaseUrl(host, pathnameOriginal, referer);

  const context = resolveWebsiteContext(headersList);

  let language = findLanguage(headersList);

  if (context?.code) {
    const data = await findWebsiteDefaultLanguageAndThemeByCode(context.code);

    const defaultLanguage = data?.defaultLanguage;

    if (defaultLanguage === "en" || defaultLanguage === "sv") {
      language = defaultLanguage;
    }
  }

  try {
    return {
      alternates: {
        canonical: "./",
      },
      description: platform.marketing.home.metadata.description[language],
      icons: {
        icon: metadataBaseUrl + "/favicon-32x32.png",
        shortcut: metadataBaseUrl + "/favicon-32x32.png",
        apple: metadataBaseUrl + "/apple-touch-icon.png",
        other: {
          rel: "apple-touch-icon-precomposed",
          url: metadataBaseUrl + "/apple-touch-icon.png",
        },
      },
      keywords: platform.marketing.home.metadata.keywords[language],
      metadataBase: new URL(metadataBaseUrl),
      openGraph: {
        description: platform.marketing.home.metadata.description[language],
        images: [
          {
            alt: platform.marketing.home.metadata.openGraph.image.alt[language],
            height: platform.marketing.home.metadata.openGraph.image.height,
            url: metadataBaseUrl + platform.marketing.home.metadata.openGraph.image.src,
            width: platform.marketing.home.metadata.openGraph.image.width,
          },
        ],
        siteName: platform.marketing.home.metadata.openGraph.siteName[language],
        title: platform.marketing.home.metadata.title[language],
        type: "website",
        url: metadataBaseUrl,
      },
      title: platform.marketing.home.metadata.title[language],
    };
  } catch (error) {
    return {
      alternates: {
        canonical: "./",
      },
      description: platform.marketing.home.metadata.description[language],
      icons: {
        icon: metadataBaseUrl + "/favicon-32x32.png",
        shortcut: metadataBaseUrl + "/favicon-32x32.png",
        apple: metadataBaseUrl + "/apple-touch-icon.png",
        other: {
          rel: "apple-touch-icon-precomposed",
          url: metadataBaseUrl + "/apple-touch-icon.png",
        },
      },
      keywords: platform.marketing.home.metadata.keywords[language],
      metadataBase: new URL(metadataBaseUrl),
      title: platform.marketing.home.metadata.title[language],
    };
  }
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

    return baseUrl;
  } else {
    return baseUrl;
  }
}
