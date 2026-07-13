// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import CenteredColumnSection from "@/components/platform/common/CenteredColumnSection";
import GlobalBackgroundSection from "@/components/platform/global/GlobalBackgroundSection";
import GlobalFooter from "@/components/platform/global/GlobalFooter";
import GlobalMenuBar from "@/components/platform/global/GlobalMenuBar";

export default function Layout(props) {
  const children = props.children;

  return (
    <GlobalBackgroundSection theme="account">
      <GlobalMenuBar />
      <CenteredColumnSection element="main">{children}</CenteredColumnSection>
      <GlobalFooter />
    </GlobalBackgroundSection>
  );
}
