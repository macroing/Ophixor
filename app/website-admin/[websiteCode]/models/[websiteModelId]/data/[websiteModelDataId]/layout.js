// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { getToken } from "next-auth/jwt";

import { WebsiteModelDataProvider } from "@/context/website-model-data";
import { getWebsiteModelDataForPlatformUser } from "@/lib/services/website-model-data-services";

export default async function Layout(props) {
  const children = props.children;
  const params = await props.params;

  const websiteCode = decodeURIComponent(params.websiteCode);
  const websiteModelDataId = params.websiteModelDataId;

  const headersList = await headers();

  const cookiesList = await cookies();

  const token = await getToken({
    req: {
      cookies: Object.fromEntries(cookiesList.getAll().map((cookie) => [cookie.name, cookie.value])),
    },
    secret: process.env.NEXTAUTH_SECRET,
  });

  const platformUser = token?.platformUser || null;

  const websiteModelData = await getWebsiteModelDataForPlatformUser({ platformUser, websiteModelDataId });

  if (!websiteModelData) {
    notFound();
  }

  const websiteModelDataPlain = JSON.parse(JSON.stringify(websiteModelData));

  return (
    <WebsiteModelDataProvider websiteModelData={websiteModelDataPlain} websiteModelDataId={websiteModelDataId}>
      {children}
    </WebsiteModelDataProvider>
  );
}
