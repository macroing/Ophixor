// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import Badge from "@/lib/web-page-builder/components/badge/Badge";
import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Text from "@/lib/web-page-builder/components/text/Text";
import { createButtonThemeForBrushedMetal } from "@/lib/web-page-builder/theme/component-themes";
import { useLanguage } from "@/context/language";

import importedStyles from "./PlanCard.module.css";

export default function PlanCard(props) {
  const badgeText = props.badgeText;
  const buttonText = props.buttonText;
  const description = props.description;
  const idealForText = props.idealForText;
  const idealForTitle = props.idealForTitle;
  const includes = props.includes;
  const includesTitle = props.includesTitle;
  const isDark = props.isDark;
  const perMonth = props.perMonth;
  const pricePerMonth = props.pricePerMonth;
  const subtitle = props.subtitle;
  const styles = props.styles || importedStyles;
  const theme = props.theme;
  const title = props.title;

  const { language } = useLanguage();

  const colorText = "#f9fafb";
  const colorTitle = "#f3f4f6";

  const shadow = theme === "blue" ? "0px 2px 2px #172554ee" : theme === "gold" ? "0px 2px 2px #422006ee" : "0px 2px 2px #020617ee";

  return (
    <Card {...createCardProps(isDark, theme)}>
      {{
        slots: {
          header: [],
          body: [
            <Badge {...createBadgeProps(theme)} key="0" text={badgeText} />,
            <Heading color={colorTitle} key="1" level="3" text={title} textShadow={shadow} />,
            <Text color={colorText} element="p" fontSize="3rem" fontWeight="800" key="2" text={pricePerMonth} textShadow={shadow}>
              <Text color={colorTitle} element="span" fontSize="1rem" text={perMonth} textShadow={shadow} />
            </Text>,
            <Heading color={colorTitle} customClassName={styles.subtitle} fontSizeLevel4="clamp(1.125rem, 1.8vw, 1.375rem)" fontWeightLevel4="500" key="3" level="4" lineHeightLevel4="1.35" minHeight="0px" text={subtitle} textShadow={shadow} />,
            <Text color={colorText} customClassName={styles.description + (language === "sv" ? " " + styles.description_sv : "")} element="p" key="4" minHeight="0px" text={description} textShadow={shadow} />,
            Array.isArray(includes) && includes.length > 0 && <Text color={colorText} fontSize="clamp(1.125rem, 1.8vw, 1.375rem)" fontWeight="500" key="5" letterSpacing="0em" lineHeight="1.35" text={includesTitle} textShadow={shadow} />,
            Array.isArray(includes) && includes.length > 0 && (
              <ul className={styles.list + (isDark ? " " + styles.list_dark : "") + (theme === "blue" ? " " + styles.list_blue : "") + (theme === "gold" ? " " + styles.list_gold : "")} key="6">
                {includes.map((currentInclude, currentIncludeIndex) => (
                  <li key={"current-include-" + currentIncludeIndex}>
                    <Text color={colorText} element="span" text={currentInclude} textShadow={shadow} />
                  </li>
                ))}
              </ul>
            ),
            idealForText && (
              <Text color={isDark ? "#e5e7eb" : "#475569"} customClassName={styles.ideal_for + (language === "sv" ? " " + styles.ideal_for_sv : "")} element="p" fontSize="1rem" key="7" minHeight="0px" text="">
                <Text color={colorText} element="span" fontWeight="600" text={idealForTitle} textShadow={shadow} />
                <Text color={colorText} element="span" text={idealForText} textShadow={shadow} />
              </Text>
            ),
            <Button borderRadius="8px" disabled={true} fontSize={language === "sv" ? "14px" : undefined} fontWeight="600" key="8" letterSpacing="0.02em" padding="clamp(0.25rem, 3vw, 1rem) clamp(0.5rem, 3vw, 2rem)" transformActive="translateY(0)" transformHover="translateY(-2px)" width="100%" {...createButtonThemeForBrushedMetal(theme)}>
              {buttonText}
            </Button>,
          ],
          footer: [],
        },
      }}
    </Card>
  );
}

function createBadgeProps(theme) {
  return {
    background: theme === "blue" ? "linear-gradient(0deg, #1e40af, #2563eb)" : theme === "gold" ? "linear-gradient(0deg, #b45309, #fbbf24)" : "linear-gradient(0deg, #334155, #475569)",
    backgroundColor: "transparent",
    borderColor: theme === "blue" ? "#60a5fa" : theme === "gold" ? "#facc15" : "#94a3b8",
    borderWidth: "0px",
    boxShadow: theme === "blue" ? "inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 4px 12px rgba(37, 99, 235, 0.25)" : theme === "gold" ? "inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 4px 12px rgba(180, 83, 9, 0.25)" : "inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 4px 12px rgba(71, 85, 105, 0.25)",
    color: theme === "blue" ? "#eff6ff" : theme === "gold" ? "#fffdf5" : "#f8fafc",
    fontSize: "0.8rem",
    fontWeight: "600",
    left: "40px",
    padding: "6px 14px",
    position: "absolute",
    textShadow: theme === "blue" ? "0px 2px 2px #172554ee" : theme === "gold" ? "0px 2px 2px #422006ee" : "0px 2px 2px #020617ee",
    top: "-14px",
  };
}

function createCardProps(isDark, theme) {
  return {
    alignItemsBody: "flex-start",
    backgroundBefore: theme === "blue" ? "linear-gradient(135deg, rgba(37, 99, 235, 0.8), rgba(37, 99, 235, 0.8))" : theme === "gold" ? "linear-gradient(135deg, rgba(251, 191, 36, 0.8), rgba(180, 83, 9, 0.8))" : "linear-gradient(135deg, rgba(71, 85, 105, 0.8), rgba(71, 85, 105, 0.8))",
    backgroundColor: theme === "blue" ? "transparent" : theme === "gold" ? "transparent" : "transparent",
    backgroundColorBody: theme === "blue" ? "transparent" : theme === "gold" ? "transparent" : "transparent",
    backgroundColorBodyHover: theme === "blue" ? "transparent" : theme === "gold" ? "transparent" : "transparent",
    backgroundImage: theme === "blue" ? (isDark ? "linear-gradient(160deg, #1f2937, #334155)" : "linear-gradient(160deg, var(--pc-semantic-surface-base), #f8fafc)") : theme === "gold" ? (isDark ? "linear-gradient(160deg, #1f2937, #3f3320)" : "linear-gradient(160deg, var(--pc-semantic-surface-base), #fffbeb)") : "linear-gradient(160deg, var(--pc-semantic-surface-base), #f8fafc)",
    borderColor: theme === "blue" ? "rgba(37, 99, 235, 0.35)" : theme === "gold" ? "rgba(180, 83, 9, 0.35)" : "rgba(71, 85, 105, 0.35)",
    borderColorHover: theme === "blue" ? "rgba(37, 99, 235, 0.35)" : theme === "gold" ? "rgba(180, 83, 9, 0.35)" : "rgba(71, 85, 105, 0.35)",
    borderWidth: theme === "blue" ? "1px" : theme === "gold" ? "1px" : "1px",
    boxShadow: theme === "blue" ? "0 20px 60px rgba(37, 99, 235, 0.15), inset 0 0px 0 rgba(37, 99, 235, 0.6)" : theme === "gold" ? "0 20px 60px rgba(180, 83, 9, 0.15), inset 0 0px 0 rgba(180, 83, 9, 0.6)" : "0 20px 60px rgba(71, 85, 105, 0.15), inset 0 0px 0 rgba(71, 85, 105, 0.6)",
    boxShadowHover: "0 40px 120px rgba(15, 23, 42, 0.18)",
    gapBody: "2rem",
    height: "100%",
    justifyContentBody: "flex-start",
    paddingBefore: theme === "blue" ? "1px" : theme === "gold" ? "1px" : "1px",
    paddingBody: "3rem 2rem 2rem 2rem",
    transformHover: "translateY(-8px)",
    transition: "all 0.3s ease",
  };
}
