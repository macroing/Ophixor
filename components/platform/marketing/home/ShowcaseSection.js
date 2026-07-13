// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Image from "@/lib/web-page-builder/components/image/Image";
import Section from "@/lib/web-page-builder/components/section/Section";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-marketing.json" with { type: "json" };

const showcase = platform.marketing.home.showcase;

export default function ShowcaseSection(props) {
  const { language } = useLanguage();

  const isDark = true;

  return (
    <Section flexDirection="column" gap="2rem">
      <Heading color={isDark ? "#cbd5e1" : "#0f172a"} level="2" text={showcase.title[language]} textShadow="0px 2px 4px var(--pc-foundation-color-primary-950)" />
      <Image alt={showcase.editor[language]} height="208" sizes="(50px <= width <= 60px) 50px, (100px <= width < 200px) 100px, (200px <= width < 300px) 200px, (300px <= width < 400px) 300px, (400px <= width < 500px) 400px, (width < 600px) 500px" src="/images/editor.webp" width="600" />
      <Image alt={showcase.workflowEditor[language]} height="314" sizes="(50px <= width <= 60px) 50px, (100px <= width < 200px) 100px, (200px <= width < 300px) 200px, (300px <= width < 400px) 300px, (400px <= width < 500px) 400px, (width < 600px) 500px" src="/images/workflow-editor.webp" width="600" />
    </Section>
  );
}
