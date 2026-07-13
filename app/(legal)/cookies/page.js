// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";
import Link from "next/link";

import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import List from "@/lib/web-page-builder/components/list/List";
import ListItem from "@/lib/web-page-builder/components/list-item/ListItem";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { generateJsonLdPlatformGraph } from "@/definitions/platform";
import { useConsent } from "@/lib/web-page-builder/components/runtime/privacy/useConsent";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-legal.json" with { type: "json" };

export default function CookiesPage(props) {
  const { language } = useLanguage();

  const jsonLd = useMemo(
    () =>
      JSON.stringify(
        generateJsonLdPlatformGraph({
          description: platform.legal.cookies.metadata.description[language],
          language,
          name: platform.legal.cookies.metadata.title[language],
          url: platform.url + "/cookies",
        }),
      ).replace(/</g, "\\u003c"),
    [language],
  );

  const { isVisible, setIsVisible } = useConsent();

  function onClickShowCookieBanner(e) {
    setIsVisible((currentIsVisible) => !currentIsVisible);
  }

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
                <Heading color="#0f172a" key="h1" level="1" text={platform.legal.cookies.title[language]} />,
                <Text color="#64748b" key="date" text={`${platform.legal.cookies.lastUpdated[language]}: ${new Date(language === "sv" ? "2026-06-25" : "2026-04-14").toLocaleDateString("sv-SE")}`} />,
                <Heading color="#0f172a" key="h2-1" level="2" text={platform.legal.cookies.whatAreCookiesTitle[language]} />,
                <Text color="#475569" key="t-1" text={platform.legal.cookies.whatAreCookiesText[language]} />,
                <Heading color="#0f172a" key="h2-2" level="2" text={platform.legal.cookies.cookieTypesTitle[language]} />,
                <Text color="#475569" key="t-2" text={platform.legal.cookies.cookieTypesText[language]} />,
                <List key="list" margin="0px" padding="0px">
                  <ListItem>
                    <Text color="#475569" text={platform.legal.cookies.cookieTypeNecessary[language]} />
                  </ListItem>
                  <ListItem>
                    <Text color="#475569" text={platform.legal.cookies.cookieTypeAnalytics[language]} />
                  </ListItem>
                  <ListItem>
                    <Text color="#475569" text={platform.legal.cookies.cookieTypeMarketing[language]} />
                  </ListItem>
                </List>,
                <Heading color="#0f172a" key="h2-3" level="2" text={platform.legal.cookies.legalBasisTitle[language]} />,
                <Text color="#475569" key="t-3" text={platform.legal.cookies.legalBasisText[language]} />,
                <Heading color="#0f172a" key="h2-4" level="2" text={platform.legal.cookies.preferencesTitle[language]} />,
                <Text color="#475569" key="t-4" text={platform.legal.cookies.preferencesText[language]} />,
                <Button alignSelf="flex-start" key="b-1" onClick={onClickShowCookieBanner} theme="primary">
                  {isVisible ? platform.legal.cookies.hideSettings[language] : platform.legal.cookies.showSettings[language]}
                </Button>,
                <Heading color="#0f172a" key="h2-5" level="2" text={platform.legal.cookies.contactTitle[language]} />,
                <Text color="#475569" key="t-5">
                  {platform.legal.cookies.contactText[language]}: <Link href={`mailto:${process.env.NEXT_PUBLIC_PLATFORM_E_MAIL}`}>{process.env.NEXT_PUBLIC_PLATFORM_E_MAIL}</Link>.
                </Text>,
              ],
            },
          }}
        </Card>
      </Section>
    </>
  );
}
