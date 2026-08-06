// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getToken } from "next-auth/jwt";

import { WebsiteUserProvider } from "@/context/website-user";
import { getWebsiteUserForPlatformUser } from "@/lib/services/website-user-services";

export default async function Layout(props) {
  const children = props.children;
  const params = await props.params;

  const websiteUserId = params.websiteUserId;

  const cookiesList = await cookies();

  const token = await getToken({
    req: {
      cookies: Object.fromEntries(cookiesList.getAll().map((cookie) => [cookie.name, cookie.value])),
    },
    secret: process.env.NEXTAUTH_SECRET,
  });

  const platformUser = token?.platformUser || null;

  const websiteUser = await getWebsiteUserForPlatformUser({ platformUser, websiteUserId });

  if (!websiteUser) {
    notFound();
  }

  const websiteUserPlain = JSON.parse(JSON.stringify(websiteUser));

  return (
    <WebsiteUserProvider websiteUser={websiteUserPlain} websiteUserId={websiteUserId}>
      {children}
    </WebsiteUserProvider>
  );
}
