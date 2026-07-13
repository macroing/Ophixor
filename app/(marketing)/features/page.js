// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";

import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { generateJsonLdPlatformGraph } from "@/definitions/platform";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-marketing.json" with { type: "json" };

export default function FeaturesPage(props) {
  const { language } = useLanguage();

  const jsonLd = useMemo(
    () =>
      JSON.stringify(
        generateJsonLdPlatformGraph({
          description: platform.marketing.features.metadata.description[language],
          language,
          name: platform.marketing.features.metadata.title[language],
          url: platform.url + "/features",
        }),
      ).replace(/</g, "\\u003c"),
    [language],
  );

  const title = platform.marketing.features.title[language];
  const description = platform.marketing.features.description[language];
  const sections = platform.marketing.features.sections;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: jsonLd,
        }}
        type="application/ld+json"
      />
      <Heading color="#0f172a" level="1" text={title} />
      <Text color="#64748b" text={description} />
      {sections.map((section, sectionIndex) => (
        <Section key={"section-" + sectionIndex} padding="0px">
          <Heading color="#0f172a" level="2" text={section.title[language]} />
          {section.text[language].split(/\n+/).map((paragraph, paragraphIndex) => (
            <Text color="#64748b" key={"section-" + sectionIndex + "-paragraph-" + paragraphIndex} text={paragraph} />
          ))}
        </Section>
      ))}
    </>
  );
}
