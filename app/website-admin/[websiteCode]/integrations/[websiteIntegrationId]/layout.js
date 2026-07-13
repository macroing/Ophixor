// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getToken } from "next-auth/jwt";

import { WebsiteIntegrationProvider } from "@/context/website-integration";
import { getWebsiteIntegrationForPlatformUser } from "@/lib/services/website-integration-services";

export default async function Layout(props) {
  const children = props.children;
  const params = await props.params;

  const websiteIntegrationId = params.websiteIntegrationId;

  const cookiesList = await cookies();

  const token = await getToken({
    req: {
      cookies: Object.fromEntries(cookiesList.getAll().map((cookie) => [cookie.name, cookie.value])),
    },
    secret: process.env.NEXTAUTH_SECRET,
  });

  const platformUser = token?.platformUser || null;

  const websiteIntegration = await getWebsiteIntegrationForPlatformUser({ platformUser, websiteIntegrationId });

  if (!websiteIntegration) {
    notFound();
  }

  const websiteIntegrationPlain = JSON.parse(JSON.stringify(websiteIntegration));

  return (
    <WebsiteIntegrationProvider websiteIntegration={websiteIntegrationPlain} websiteIntegrationId={websiteIntegrationId}>
      {children}
    </WebsiteIntegrationProvider>
  );
}
