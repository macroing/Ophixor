// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import Button from "@/lib/web-page-builder/components/button/Button";
import Grid from "@/lib/web-page-builder/components/grid/Grid";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Image from "@/lib/web-page-builder/components/image/Image";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { createButtonThemeForBrushedMetal } from "@/lib/web-page-builder/theme/component-themes";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useViewport } from "@/hooks/useViewport";
import { PLAN_FREE } from "@/definitions/plan-definitions";

import platform from "@/definitions/platform-marketing.json" with { type: "json" };

import importedStyles from "./HeroSection.module.css";

const hero = platform.marketing.home.hero;

const DynamicDemo = dynamic(() => import("./Demo"), {
  loading: () => <></>,
});

export default function HeroSection(props) {
  const styles = props.styles || importedStyles;

  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const [isVisible, setIsVisible] = useState(false);

  const { isDesktop } = useViewport();

  const isDark = true;
  const isPlatformAdmin = platformUser?.isPlatformAdmin ? true : false;
  const isSignedIn = platformUser !== null && platformUser !== undefined;
  const isSignedInFree = platformUser?.plan === PLAN_FREE || platformUser?.plan === null || platformUser?.plan === undefined;

  function onClick(e) {
    setIsVisible(true);
  }

  return (
    <Section element="section" justifyContent="center" minHeight="calc(100vh - calc(66px + clamp(1rem, 3vw, 4rem)) - clamp(1rem, 3vw, 4rem))" padding="0px">
      <Grid alignContent="center" alignItems="center" gap="2rem" gridTemplateColumns={isDesktop ? "1.2fr 0.8fr" : "1fr"} justifyContent="center" justifyItems="center" padding="0px">
        <Section alignItems="flex-start" flexDirection="column" justifyContent="center">
          <Heading color={isDark ? "#fff6a9" : "#0f172a"} level="1" margin="0px 0px 2rem 0px" text={hero.title[language]} textShadow="0px 0px 5px #ffa500, 0px 0px 15px #ffa500, 0px 0px 20px #ffa500, 0px 0px 40px #ffa500, 0px 0px 60px #ff0000, 0px 0px 10px #ff8d00, 0px 0px 98px #ff0000" />
          <Text color={isDark ? "#e5e7eb" : "#475569"} element="p" margin="0px 0px 3rem 0px" text={hero.text[language]} textShadow="0px 2px 4px var(--pc-foundation-color-slate-950)" />
          <Section alignItems={isDesktop ? "center" : "flex-start"} flexDirection={isDesktop ? "row" : "column"} justifyContent={isDesktop ? "flex-start" : "center"} padding="0px">
            <Button borderRadius="8px" fontWeight="600" href={isSignedIn && (isPlatformAdmin || !isSignedInFree) ? "/website-admin-new" : undefined} onClick={!(isSignedIn && (isPlatformAdmin || !isSignedInFree)) ? onClick : undefined} letterSpacing="0.02em" padding="1rem 2.5rem" transformActive="translateY(0)" transformHover="translateY(-2px)" {...createButtonThemeForBrushedMetal("blue")} textShadow="0px 2px 4px var(--pc-foundation-color-primary-950)" textShadowHover="0px 2px 4px var(--pc-foundation-color-primary-950)">
              {isSignedIn ? (isPlatformAdmin || !isSignedInFree ? hero.callToAction.signedIn[language] : hero.callToAction.signedInFree[language]) : hero.callToAction.signedOut[language]}
            </Button>
            {process.env.NEXT_PUBLIC_PLATFORM_DEMO_WEBSITE_CODE && (
              <Text color={isDark ? "#e5e7eb" : "#475569"} textShadow="0px 2px 4px var(--pc-foundation-color-slate-950)">
                {hero.orSeeA[language]}
                <Link className={styles.link} href={`/website/${process.env.NEXT_PUBLIC_PLATFORM_DEMO_WEBSITE_CODE}`}>
                  {hero.demo[language]}
                </Link>
              </Text>
            )}
          </Section>
        </Section>
        {isDesktop && (
          <Section padding="0px">
            <Image alt={hero.logo[language]} backgroundColor="transparent" borderColor="#fff6a9" borderRadius="50%" boxShadow="0px 0px 1px #ffa500, 0px 0px 3px #ffa500, 0px 0px 5px #ffa500, 0px 0px 10px #ffa500, 0px 0px 15px #ff0000, 0px 0px 2px #ff8d00, 0px 0px 25px #ff0000" fetchPriority="high" height={"300px"} objectFit="cover" priority={true} sizes="(50px <= width <= 60px) 50px, (100px <= width < 200px) 100px, (200px <= width < 300px) 200px, (300px <= width < 400px) 300px" src="/images/logo.webp" width={"300px"} />
          </Section>
        )}
      </Grid>
      {isVisible && <DynamicDemo isVisible={isVisible} setIsVisible={setIsVisible} />}
    </Section>
  );
}
