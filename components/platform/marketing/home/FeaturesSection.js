// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { faBolt, faCloud, faCubes, faDatabase, faDiagramProject, faFileExport, faGaugeHigh, faLayerGroup, faSquareRootVariable } from "@fortawesome/pro-solid-svg-icons";

import Card from "@/lib/web-page-builder/components/card/Card";
import Grid from "@/lib/web-page-builder/components/grid/Grid";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Icon from "@/lib/web-page-builder/components/editor/Icon";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useLanguage } from "@/context/language";
import { useViewport } from "@/hooks/useViewport";

import platform from "@/definitions/platform-marketing.json" with { type: "json" };

import importedStyles from "./FeaturesSection.module.css";

const features = platform.marketing.home.features;

export default function FeaturesSection(props) {
  const styles = props.styles || importedStyles;

  const { language } = useLanguage();

  const { isDesktop, isTablet } = useViewport();

  const isDark = false;
  const isDarkHalf = true;

  return (
    <div className={styles.features_section_container}>
      <Section flexDirection="column" gap="2rem" padding="0px">
        <Heading color={isDark || isDarkHalf ? "#cbd5e1" : "#0f172a"} level="2" text={features.title[language]} textShadow="0px 2px 4px var(--pc-foundation-color-slate-950)" />
        <Text color={isDark || isDarkHalf ? "#e5e7eb" : "#475569"} element="p" maxWidth="600px" text={features.text[language]} textShadow="0px 2px 4px var(--pc-foundation-color-slate-950)" />
        <Grid gap="2rem" gridTemplateColumns={isDesktop ? "repeat(3, 1fr)" : isTablet ? "repeat(2, 1fr)" : "1fr"} margin="0px" padding="0px">
          {features.items.map((item, itemIndex) => (
            <FeatureCard icon={item.icon} isDark={isDark} isGlass={true} key={"item-" + itemIndex} text={item.text[language]} title={item.title[language]} />
          ))}
        </Grid>
      </Section>
    </div>
  );
}

function FeatureCard(props) {
  const icon = props.icon;
  const isDark = props.isDark;
  const isGlass = props.isGlass || false;
  const text = props.text;
  const title = props.title;

  return (
    <Card backgroundColor={isDark ? "#1f2937" : undefined} backgroundColorBody={isDark ? "transparent" : undefined} backgroundColorBodyHover={isDark ? "transparent" : undefined} backgroundColorHover={isDark ? "#1f2937" : undefined} backgroundImage={isDark ? "linear-gradient(180deg, #2563eb, #1e40af)" : undefined} borderColor={isDark ? "#374151" : undefined} borderColorHover={isDark ? "#374151" : undefined} boxShadow={isGlass ? "0 10px 30px rgba(15, 23, 42, 0.1)" : "0 2px 8px rgba(15, 23, 42, 0.04)"} boxShadowHover="0 20px 40px rgba(15, 23, 42, 0.5)" paddingBody="1.5rem" transformHover="translateY(-4px)" transition="all 0.25s ease" zIndex="2">
      {{
        slots: {
          header: [],
          body: [
            <Section flexDirection="column" gap="1rem" key="1" padding="0px">
              <Section alignItems="center" backgroundColor="#2563eb" backgroundImage="linear-gradient(180deg, #4f8dff, #2563eb)" borderColor="#4f8dff" borderRadius="12px" borderWidth="1px" boxShadow="inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 12px rgba(37, 99, 235, 0.35)" height="48px" justifyContent="center" textShadow="0 1px 0 rgba(255, 255, 255, 0.2), 0 -1px 1px rgba(0, 0, 0, 0.4)" width="48px">
                <Icon icon={getIcon(icon)} isResponsive={true} size={64} sizeMin={16} style={{ color: "var(--pc-semantic-text-inverse)" }} />
              </Section>
              <Heading color={isDark ? "#cbd5e1" : "#0f172a"} fontSizeLevel3="1.1rem" fontWeightLevel3="600" level="3" text={title} />
              <Text color={isDark ? "#e5e7eb" : "#475569"} lineHeight="1.6" text={text} />
            </Section>,
          ],
          footer: [],
        },
      }}
    </Card>
  );
}

function getIcon(type) {
  switch (type) {
    case "bolt":
      return faBolt;
    case "cloud":
      return faCloud;
    case "cubes":
      return faCubes;
    case "database":
      return faDatabase;
    case "diagramProject":
      return faDiagramProject;
    case "fileExport":
      return faFileExport;
    case "gaugeHigh":
      return faGaugeHigh;
    case "layerGroup":
      return faLayerGroup;
    case "squareRootVariable":
      return faSquareRootVariable;
    default:
      return null;
  }
}
