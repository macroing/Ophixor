// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";

import CenteredSection from "@/components/platform/common/CenteredSection";
import DifferentiationSection from "@/components/platform/marketing/home/DifferentiationSection";
import FeaturesSection from "@/components/platform/marketing/home/FeaturesSection";
import HeroSection from "@/components/platform/marketing/home/HeroSection";
import PlanSection from "@/components/platform/marketing/home/PlanSection";
import ShowcaseSection from "@/components/platform/marketing/home/ShowcaseSection";
import { generateJsonLdPlatformGraph } from "@/definitions/platform";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-marketing.json" with { type: "json" };

export default function HomePage(props) {
  const { language } = useLanguage();

  const jsonLd = useMemo(
    () =>
      JSON.stringify(
        generateJsonLdPlatformGraph({
          description: platform.marketing.home.metadata.description[language],
          language,
          name: platform.marketing.home.metadata.title[language],
          url: platform.url,
        }),
      ).replace(/</g, "\\u003c"),
    [language],
  );

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: jsonLd,
        }}
        type="application/ld+json"
      />
      <HeroSection />
      <CenteredSection padding="0px">
        <DifferentiationSection />
      </CenteredSection>
      <CenteredSection padding="0px">
        <FeaturesSection />
      </CenteredSection>
      {/*
      <CenteredSection padding="0px">
        <ShowcaseSection />
      </CenteredSection>
      */}
      <CenteredSection padding="0px">
        <PlanSection />
      </CenteredSection>
    </>
  );
}
