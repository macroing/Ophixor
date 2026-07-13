// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getToken } from "next-auth/jwt";

import { WebsiteModelProvider } from "@/context/website-model";
import { getWebsiteModelForPlatformUser } from "@/lib/services/website-model-services";

export default async function Layout(props) {
  const children = props.children;
  const params = await props.params;

  const websiteModelId = params.websiteModelId;

  const cookiesList = await cookies();

  const token = await getToken({
    req: {
      cookies: Object.fromEntries(cookiesList.getAll().map((cookie) => [cookie.name, cookie.value])),
    },
    secret: process.env.NEXTAUTH_SECRET,
  });

  const platformUser = token?.platformUser || null;

  const websiteModel = await getWebsiteModelForPlatformUser({ platformUser, websiteModelId });

  if (!websiteModel) {
    notFound();
  }

  const websiteModelPlain = JSON.parse(JSON.stringify(websiteModel));

  return (
    <WebsiteModelProvider websiteModel={websiteModelPlain} websiteModelId={websiteModelId}>
      {children}
    </WebsiteModelProvider>
  );
}
