// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { notFound } from "next/navigation";

import CenteredColumnSection from "@/components/platform/common/CenteredColumnSection";
import GlobalBackgroundSection from "@/components/platform/global/GlobalBackgroundSection";
import GlobalMenuBar from "@/components/platform/global/GlobalMenuBar";
import NavigationSideBar from "@/components/platform/admin/NavigationSideBar";
import { useCurrentPlatformUser } from "@/context/current-platform-user";

export default function Layout(props) {
  const children = props.children;

  const { platformUser } = useCurrentPlatformUser();

  if (!platformUser?.isPlatformAdmin) {
    notFound();
  }

  return (
    <GlobalBackgroundSection theme="admin">
      <GlobalMenuBar />
      <CenteredColumnSection element="main">
        <NavigationSideBar />
        {children}
      </CenteredColumnSection>
    </GlobalBackgroundSection>
  );
}
