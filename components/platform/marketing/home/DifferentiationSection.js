// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { faCheck } from "@fortawesome/pro-solid-svg-icons";

import Grid from "@/lib/web-page-builder/components/grid/Grid";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Icon from "@/lib/web-page-builder/components/editor/Icon";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-marketing.json" with { type: "json" };

export default function DifferentiationSection(props) {
  const data = platform.marketing.home.differentiation;

  const isDark = true;

  const { language } = useLanguage();

  return (
    <Section element="section" flexDirection="column" gap="2rem" padding="clamp(0rem, 3vw, 4rem)">
      <Heading color={isDark ? "#cbd5e1" : "#0f172a"} level="2" text={data.title[language]} textShadow="0px 2px 4px var(--pc-foundation-color-slate-950)" />
      <Grid gap="1.25rem" gridTemplateColumns="1fr" padding="0px">
        {data.items[language].map((item, index) => (
          <Section alignItems="center" flexDirection="row" gap="1rem" justifyContent="flex-start" key={"differentiation-" + index} padding="0px">
            <Icon icon={faCheck} size={16} style={{ color: "#22c55e" }} />
            <Text color={isDark ? "#e5e7eb" : "#334155"} element="span" text={""} textShadow="0px 2px 4px var(--pc-foundation-color-slate-950)">
              {item}
            </Text>
          </Section>
        ))}
      </Grid>
    </Section>
  );
}
