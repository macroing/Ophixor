// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { getToken } from "next-auth/jwt";

import { SocketProvider } from "@/context/socket";
import { WebsitePageProvider } from "@/context/website-page";
import { getWebsiteForPlatformUser } from "@/lib/services/website-services";
import { getWebsitePageForPlatformUser } from "@/lib/services/website-page-services";

export default async function Layout(props) {
  const children = props.children;
  const params = await props.params;

  const websiteCode = decodeURIComponent(params.websiteCode);

  const headersList = await headers();

  const cookiesList = await cookies();

  const token = await getToken({
    req: {
      cookies: Object.fromEntries(cookiesList.getAll().map((cookie) => [cookie.name, cookie.value])),
    },
    secret: process.env.NEXTAUTH_SECRET,
  });

  const platformUser = token?.platformUser || null;

  const pathname = headersList.get("x-pathname");

  let path = "/";

  if (typeof pathname === "string" && pathname.startsWith("/website-admin/" + websiteCode + "/pages/home")) {
    path = pathname.substring(("/website-admin/" + websiteCode + "/pages/home").length);

    if (path === "") {
      path = "/";
    }
  }

  const website = await getWebsiteForPlatformUser({ isAdmin: true, platformUser, websiteCode });

  if (!website) {
    notFound();
  }

  const websitePage = await getWebsitePageForPlatformUser({ isAdmin: true, isIncludingDraft: true, path, platformUser, website });

  if (!websitePage) {
    notFound();
  }

  const websitePagePlain = JSON.parse(JSON.stringify(websitePage));

  return (
    <WebsitePageProvider path={path} websitePage={websitePagePlain}>
      <SocketProvider>{children}</SocketProvider>
    </WebsitePageProvider>
  );
}
