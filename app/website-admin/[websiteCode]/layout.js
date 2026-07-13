// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { getToken } from "next-auth/jwt";

import CenteredColumnSection from "@/components/platform/common/CenteredColumnSection";
import NavigationSideBar from "@/components/platform/website-admin/website/NavigationSideBar";
import SignInForm from "@/components/platform/auth/SignInForm";
import { CurrentWebsiteUserProvider } from "@/context/current-website-user";
import { WebsiteProvider } from "@/context/website";
import { getWebsiteForPlatformUser } from "@/lib/services/website-services";
import { getWebsiteUser } from "@/lib/auth/getWebsiteUser";

export default async function Layout(props) {
  const children = props.children;
  const params = await props.params;

  const websiteCode = decodeURIComponent(params.websiteCode);

  const headersList = await headers();

  const pathname = headersList.get("x-pathname");
  const pathnameOriginal = headersList.get("x-pathname-original");

  const isCustomDomain = !!pathnameOriginal;

  const cookiesList = await cookies();

  const token = await getToken({
    req: {
      cookies: Object.fromEntries(cookiesList.getAll().map((cookie) => [cookie.name, cookie.value])),
    },
    secret: process.env.NEXTAUTH_SECRET,
  });

  const platformUser = token?.platformUser || null;

  if (pathnameOriginal && !platformUser) {
    return (
      <CenteredColumnSection isCenteringWithin={true}>
        <SignInForm isCustomDomain={isCustomDomain} />
      </CenteredColumnSection>
    );
  }

  const website = await getWebsiteForPlatformUser({ isAdmin: true, platformUser, websiteCode });

  if (!website) {
    notFound();
  }

  const websiteUser = await getWebsiteUser();

  const websitePlain = JSON.parse(JSON.stringify(website));
  const websiteUserPlain = websiteUser ? JSON.parse(JSON.stringify(websiteUser)) : null;

  return (
    <WebsiteProvider code={websiteCode} isCustomDomain={isCustomDomain} website={websitePlain}>
      <CurrentWebsiteUserProvider websiteCode={websiteCode} websiteUser={websiteUserPlain}>
        <NavigationSideBar />
        {children}
      </CurrentWebsiteUserProvider>
    </WebsiteProvider>
  );
}
