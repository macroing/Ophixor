// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { headers } from "next/headers";

import CenteredColumnSection from "@/components/platform/common/CenteredColumnSection";
import GlobalBackgroundSection from "@/components/platform/global/GlobalBackgroundSection";
import GlobalMenuBar from "@/components/platform/global/GlobalMenuBar";
import { OverflowProvider } from "@/context/overflow";

export default async function Layout(props) {
  const children = props.children;

  const headersList = await headers();

  const pathname = headersList.get("x-pathname");
  const pathnameOriginal = headersList.get("x-pathname-original");

  const isCustomDomain = !!pathnameOriginal;

  const isInWebsiteAdmin = true;
  const isInWebsiteAdminNew = false;
  const isInWebsiteAdminWebsite = /^\/website-admin\/.+$/.test(pathname);

  return (
    <OverflowProvider>
      <GlobalBackgroundSection theme="website-admin">
        <GlobalMenuBar isCustomDomain={isCustomDomain} isInWebsiteAdmin={isInWebsiteAdmin} isInWebsiteAdminNew={isInWebsiteAdminNew} isInWebsiteAdminWebsite={isInWebsiteAdminWebsite} />
        <CenteredColumnSection element="main">{children}</CenteredColumnSection>
      </GlobalBackgroundSection>
    </OverflowProvider>
  );
}
