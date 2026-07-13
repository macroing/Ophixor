// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";
import Link from "next/link";

import Card from "@/lib/web-page-builder/components/card/Card";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import List from "@/lib/web-page-builder/components/list/List";
import ListItem from "@/lib/web-page-builder/components/list-item/ListItem";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { generateJsonLdPlatformGraph } from "@/definitions/platform";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-legal.json" with { type: "json" };

export default function TermsPage(props) {
  const { language } = useLanguage();

  const jsonLd = useMemo(
    () =>
      JSON.stringify(
        generateJsonLdPlatformGraph({
          description: platform.legal.terms.metadata.description[language],
          language,
          name: platform.legal.terms.metadata.title[language],
          url: platform.url + "/terms",
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
      <Section alignItems="center" flexDirection="column" padding="4rem 1rem">
        <Card maxWidth="800px" paddingBody="2rem">
          {{
            slots: {
              body: [
                <Heading color="#0f172a" key="h1" level="1" text={platform.legal.terms.title[language]} />,
                <Text color="#64748b" key="date" text={`${platform.legal.terms.lastUpdated[language]}: ${new Date(language === "sv" ? "2026-06-25" : "2026-04-14").toLocaleDateString("sv-SE")}`} />,
                <Heading color="#0f172a" key="h2-1" level="2" text={platform.legal.terms.acceptanceTitle[language]} />,
                <Text color="#475569" key="t-1" text={platform.legal.terms.acceptanceText[language]} />,
                <Heading color="#0f172a" key="h2-2" level="2" text={platform.legal.terms.useTitle[language]} />,
                <List key="list" margin="0px" padding="0px">
                  <ListItem>
                    <Text color="#475569" text={platform.legal.terms.useTextA[language]} />
                  </ListItem>
                  <ListItem>
                    <Text color="#475569" text={platform.legal.terms.useTextB[language]} />
                  </ListItem>
                </List>,
                <Heading color="#0f172a" key="h2-3" level="2" text={platform.legal.terms.accountsTitle[language]} />,
                <Text color="#475569" key="t-2" text={platform.legal.terms.accountsText[language]} />,
                <Heading color="#0f172a" key="h2-4" level="2" text={platform.legal.terms.intellectualPropertyTitle[language]} />,
                <Text color="#475569" key="t-3" text={platform.legal.terms.intellectualPropertyText[language]} />,
                <Heading color="#0f172a" key="h2-5" level="2" text={platform.legal.terms.terminationTitle[language]} />,
                <Text color="#475569" key="t-4" text={platform.legal.terms.terminationText[language]} />,
                <Heading color="#0f172a" key="h2-6" level="2" text={platform.legal.terms.limitationOfLiabilityTitle[language]} />,
                <Text color="#475569" key="t-5" text={platform.legal.terms.limitationOfLiabilityText[language]} />,
                <Heading color="#0f172a" key="h2-7" level="2" text={platform.legal.terms.changesToTermsTitle[language]} />,
                <Text color="#475569" key="t-6" text={platform.legal.terms.changesToTermsText[language]} />,
                <Heading color="#0f172a" key="h2-8" level="2" text={platform.legal.terms.governingLawTitle[language]} />,
                <Text color="#475569" key="t-7" text={platform.legal.terms.governingLawText[language]} />,
                <Heading color="#0f172a" key="h2-9" level="2" text={platform.legal.terms.contactTitle[language]} />,
                <Text color="#475569" key="t-8">
                  {platform.legal.terms.contactText[language]}: <Link href={`mailto:${process.env.NEXT_PUBLIC_PLATFORM_E_MAIL}`}>{process.env.NEXT_PUBLIC_PLATFORM_E_MAIL}</Link>.
                </Text>,
              ],
            },
          }}
        </Card>
      </Section>
    </>
  );
}
