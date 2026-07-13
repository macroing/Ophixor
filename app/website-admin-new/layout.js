// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import CenteredColumnSection from "@/components/platform/common/CenteredColumnSection";
import GlobalBackgroundSection from "@/components/platform/global/GlobalBackgroundSection";
import GlobalMenuBar from "@/components/platform/global/GlobalMenuBar";

export default function Layout(props) {
  const children = props.children;

  const isInWebsiteAdmin = true;
  const isInWebsiteAdminNew = true;
  const isInWebsiteAdminWebsite = false;

  return (
    <GlobalBackgroundSection theme="website-admin">
      <GlobalMenuBar isInWebsiteAdmin={isInWebsiteAdmin} isInWebsiteAdminNew={isInWebsiteAdminNew} isInWebsiteAdminWebsite={isInWebsiteAdminWebsite} />
      <CenteredColumnSection element="main">{children}</CenteredColumnSection>
    </GlobalBackgroundSection>
  );
}
