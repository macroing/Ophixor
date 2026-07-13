// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Text from "@/lib/web-page-builder/components/text/Text";

export default function AnalyticsPage(props) {
  return (
    <>
      <Heading color="#0f172a" level="1" text="Analytics" />
      <Text color="#64748b" element="p" text="Manage your analytics. This feature will come soon." />
    </>
  );
}
