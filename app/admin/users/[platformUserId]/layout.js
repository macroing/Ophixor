// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { notFound } from "next/navigation";

import { VisitedPlatformUserProvider } from "@/context/visited-platform-user";
import { findPlatformUserById } from "@/lib/data/platform-user";

export default async function Layout(props) {
  const children = props.children;
  const params = await props.params;

  const visitedPlatformUserId = params.platformUserId;

  const visitedPlatformUser = await findPlatformUserById(visitedPlatformUserId);

  if (!visitedPlatformUser) {
    notFound();
  }

  const visitedPlatformUserPlain = JSON.parse(JSON.stringify(visitedPlatformUser));

  return (
    <VisitedPlatformUserProvider visitedPlatformUser={visitedPlatformUserPlain} visitedPlatformUserId={visitedPlatformUserId}>
      {children}
    </VisitedPlatformUserProvider>
  );
}
