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

export default function PrivacyPage(props) {
  const { language } = useLanguage();

  const jsonLd = useMemo(
    () =>
      JSON.stringify(
        generateJsonLdPlatformGraph({
          description: platform.legal.privacy.metadata.description[language],
          language,
          name: platform.legal.privacy.metadata.title[language],
          url: platform.url + "/privacy",
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
                <Heading color="#0f172a" key="h1" level="1" text={platform.legal.privacy.title[language]} />,
                <Text color="#64748b" key="date" text={`${platform.legal.privacy.lastUpdated[language]}: ${new Date(language === "sv" ? "2026-06-25" : "2026-04-14").toLocaleDateString("sv-SE")}`} />,
                <Heading color="#0f172a" key="h2-1" level="2" text={platform.legal.privacy.dataControllerTitle[language]} />,
                <Text color="#475569" key="t-1">
                  {platform.legal.privacy.dataControllerText[language]}: {platform.name}, {platform.legal.privacy.dataControllerTextContact[language]}: <Link href={`mailto:${process.env.NEXT_PUBLIC_PLATFORM_E_MAIL}`}>{process.env.NEXT_PUBLIC_PLATFORM_E_MAIL}</Link>.
                </Text>,
                <Heading color="#0f172a" key="h2-2" level="2" text={platform.legal.privacy.personalDataTitle[language]} />,
                <Text color="#475569" key="t-2" text={platform.legal.privacy.personalDataText[language]} />,
                <List key="list-1" margin="0px" padding="0px">
                  <ListItem>
                    <Text color="#475569" text={platform.legal.privacy.personalDataAccountInformation[language]} />
                  </ListItem>
                  <ListItem>
                    <Text color="#475569" text={platform.legal.privacy.personalDataUsageData[language]} />
                  </ListItem>
                  <ListItem>
                    <Text color="#475569" text={platform.legal.privacy.personalDataTechnicalData[language]} />
                  </ListItem>
                </List>,
                <Heading color="#0f172a" key="h2-3" level="2" text={platform.legal.privacy.purposeTitle[language]} />,
                <Text color="#475569" key="t-3" text={platform.legal.privacy.purposeText[language]} />,
                <Heading color="#0f172a" key="h2-4" level="2" text={platform.legal.privacy.legalBasisTitle[language]} />,
                <Text color="#475569" key="t-4" text={platform.legal.privacy.legalBasisText[language]} />,
                <List key="list-2" margin="0px" padding="0px">
                  <ListItem>
                    <Text color="#475569" text={platform.legal.privacy.legalBasisConsent[language]} />
                  </ListItem>
                  <ListItem>
                    <Text color="#475569" text={platform.legal.privacy.legalBasisContract[language]} />
                  </ListItem>
                  <ListItem>
                    <Text color="#475569" text={platform.legal.privacy.legalBasisLegitimateInterest[language]} />
                  </ListItem>
                </List>,
                <Heading color="#0f172a" key="h2-5" level="2" text={platform.legal.privacy.dataRetentionTitle[language]} />,
                <Text color="#475569" key="t-5" text={platform.legal.privacy.dataRetentionText[language]} />,
                <Heading color="#0f172a" key="h2-6" level="2" text={platform.legal.privacy.yourRights[language]} />,
                <List key="list-3" margin="0px" padding="0px">
                  <ListItem>
                    <Text color="#475569" text={platform.legal.privacy.accessData[language]} />
                  </ListItem>
                  <ListItem>
                    <Text color="#475569" text={platform.legal.privacy.request[language]} />
                  </ListItem>
                  <ListItem>
                    <Text color="#475569" text={platform.legal.privacy.restrict[language]} />
                  </ListItem>
                  <ListItem>
                    <Text color="#475569" text={platform.legal.privacy.portability[language]} />
                  </ListItem>
                  <ListItem>
                    <Text color="#475569" text={platform.legal.privacy.withdraw[language]} />
                  </ListItem>
                </List>,
                <Heading color="#0f172a" key="h2-7" level="2" text={platform.legal.privacy.thirdPartiesTitle[language]} />,
                <Text color="#475569" key="t-6" text={platform.legal.privacy.thirdPartiesText[language]} />,
                <Heading color="#0f172a" key="h2-8" level="2" text={platform.legal.privacy.internationalTransfersTitle[language]} />,
                <Text color="#475569" key="t-7" text={platform.legal.privacy.internationalTransfersText[language]} />,
                <Heading color="#0f172a" key="h2-9" level="2" text={platform.legal.privacy.contactAndComplaintsTitle[language]} />,
                <Text color="#475569" key="t-8">
                  {platform.legal.privacy.contactAndComplaintsTextA[language]} <Link href={`mailto:${process.env.NEXT_PUBLIC_PLATFORM_E_MAIL}`}>{process.env.NEXT_PUBLIC_PLATFORM_E_MAIL}</Link>. {platform.legal.privacy.contactAndComplaintsTextB[language]}
                </Text>,
              ],
            },
          }}
        </Card>
      </Section>
    </>
  );
}
