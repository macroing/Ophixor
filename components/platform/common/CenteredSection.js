// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import Section from "@/lib/web-page-builder/components/section/Section";

export default function CenteredSection(props) {
  const children = props.children;
  const padding = props.padding || "0px clamp(1rem, 3vw, 4rem)";

  return (
    <Section margin="0px auto" maxWidth="1200px" padding={padding} width="100%">
      {children}
    </Section>
  );
}
