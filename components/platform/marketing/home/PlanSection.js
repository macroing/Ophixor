// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import Grid from "@/lib/web-page-builder/components/grid/Grid";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import PlanCard from "./PlanCard";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useLanguage } from "@/context/language";
import { useViewport } from "@/hooks/useViewport";

import platform from "@/definitions/platform-marketing.json" with { type: "json" };

export default function PlanSection(props) {
  const { language } = useLanguage();

  const planTitle = platform.marketing.home.planTitle[language];
  const planDescription = platform.marketing.home.planDescription[language];
  const planIdealForTitle = platform.marketing.home.planIdealForTitle[language];
  const planIncludesTitle = platform.marketing.home.planIncludesTitle[language];
  const planPerMonth = platform.marketing.home.planPerMonth[language];
  const plans = platform.marketing.home.plans[language];

  const { isDesktop, isTablet } = useViewport();

  const isDark = false;
  const isDarkHalf = true;

  return (
    <Section element="section" flexDirection="column" gap="2rem" padding="clamp(1rem, 3vw, 4rem)">
      <Heading color={isDark ? "#cbd5e1" : isDarkHalf ? "#e2e8f0" : "#0f172a"} level="2" text={planTitle} textShadow="0px 2px 4px var(--pc-foundation-color-primary-950)" />
      <Text color={isDark ? "#e5e7eb" : isDarkHalf ? "#f3f4f6" : "#475569"} element="p" maxWidth="600px" text={planDescription} textShadow="0px 2px 4px var(--pc-foundation-color-primary-950)" />
      <Grid gap={isDesktop ? "0.5rem" : "3rem"} gridTemplateColumns={isDesktop ? "repeat(3, 1fr)" : isTablet ? "repeat(2, 1fr)" : "1fr"} margin="1rem 0px 0px 0px" padding="0px">
        {plans.map((plan, planIndex) => (
          <PlanCard badgeText={plan.badgeText} buttonText={plan.buttonText} description={plan.description} idealForText={plan.idealForText} idealForTitle={planIdealForTitle} includes={plan.includes} includesTitle={planIncludesTitle} isDark={isDark} key={"plan-" + planIndex} perMonth={planPerMonth} pricePerMonth={plan.pricePerMonth} subtitle={plan.subtitle} theme={plan.theme} title={plan.title} />
        ))}
      </Grid>
    </Section>
  );
}
