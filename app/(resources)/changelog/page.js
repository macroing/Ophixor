// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";
import { faRocketLaunch, faSparkles, faTrash, faTriangleExclamation, faWrench } from "@fortawesome/pro-solid-svg-icons";

import Badge from "@/lib/web-page-builder/components/badge/Badge";
import Card from "@/lib/web-page-builder/components/card/Card";
import Grid from "@/lib/web-page-builder/components/grid/Grid";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Icon from "@/lib/web-page-builder/components/editor/Icon";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { generateJsonLdPlatformGraph } from "@/definitions/platform";
import { useLanguage } from "@/context/language";

import changeLog from "@/ChangeLog.json" with { type: "json" };
import platform from "@/definitions/platform-resources.json" with { type: "json" };

import importedStyles from "./page.module.css";

export default function ChangeLogPage(props) {
  const styles = props.styles || importedStyles;

  const { language } = useLanguage();

  const jsonLd = useMemo(
    () =>
      JSON.stringify(
        generateJsonLdPlatformGraph({
          description: platform.resources.changelog.metadata.description[language],
          language,
          name: platform.resources.changelog.metadata.title[language],
          url: platform.url + "/changelog",
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
      <Section flexDirection="column" margin="0 auto" maxWidth="900px" padding="4rem 1.5rem">
        <Heading color="#0f172a" level="1" margin="0 0 0.5rem 0" text={platform.resources.changelog.title[language]} />
        <Text color="#475569" margin="0 0 3rem 0" text={platform.resources.changelog.description[language]} />
        <Section flexDirection="column" gap="2rem" padding="0px">
          {changeLog.map((day, dayIndex) => (
            <Section flexDirection="column" gap="1rem" key={day.date} margin={dayIndex > 0 ? "2rem 0px 0px 0px" : "0px"} padding="0px">
              <Heading color="#0f172a" level="3" margin="0" text={formatDate(day.date, day.version, language)} />
              <Grid gap="1rem" gridTemplateColumns="1fr" padding="0px">
                {day.entries.map((entry) => (
                  <Card backgroundColor="var(--pc-semantic-surface-base)" borderColor="#e5e7eb" borderRadius="12px" borderWidth="1px" boxShadow="0 1px 2px rgba(15, 23, 42, 0.04)" boxShadowHover="0 1px 2px rgba(15, 23, 42, 0.04)" key={entry.id} paddingBody="1.25rem">
                    {{
                      slots: {
                        body: [
                          <Section flexDirection="column" gap="0.5rem" key="content" padding="0">
                            <Section alignItems="flex-start" customClassName={styles.section} flexDirection="column" gap="0.5rem" justifyContent="flex-start" padding="0">
                              <Text fontWeight="600" text={entry.title?.[language] ?? entry.title} />
                              <Badge fontSize="0.7rem" theme={getBadgeTheme(entry.type)}>
                                <Icon icon={getBadgeIcon(entry.type)} size={11} style={{ color: "inherit" }} /> {getBadgeText(entry.type, language)}
                              </Badge>
                            </Section>
                            {entry.component && <Text color="#64748b" fontSize="0.85rem" text={entry.component?.[language] ?? entry.component} />}
                            <Text color="#475569" text={entry.description?.[language] ?? entry.description} />
                            {entry.meta?.actions && (
                              <Section flexDirection="row" flexWrap="wrap" gap="0.4rem" padding="0.5rem 0 0 0">
                                {entry.meta.actions.map((action) => (
                                  <Badge backgroundColor="#e0f2fe" color="#0369a1" fontSize="0.7rem" key={action?.[language] ?? action} text={action?.[language] ?? action} />
                                ))}
                              </Section>
                            )}
                            {entry.meta?.expressions && (
                              <Section flexDirection="row" flexWrap="wrap" gap="0.4rem" padding="0.5rem 0 0 0">
                                {entry.meta.expressions.map((expression) => (
                                  <Badge backgroundColor="#e0f2fe" color="#0369a1" fontSize="0.7rem" key={expression?.[language] ?? expression} text={expression?.[language] ?? expression} />
                                ))}
                              </Section>
                            )}
                            {entry.meta?.props && (
                              <Section flexDirection="row" flexWrap="wrap" gap="0.4rem" padding="0.5rem 0 0 0">
                                {entry.meta.props.map((prop) => (
                                  <Badge backgroundColor="#f1f5f9" color="#334155" fontSize="0.7rem" key={prop?.[language] ?? prop} text={prop?.[language] ?? prop} />
                                ))}
                              </Section>
                            )}
                            {entry.meta?.variants && (
                              <Section flexDirection="row" flexWrap="wrap" gap="0.4rem" padding="0.5rem 0 0 0">
                                {entry.meta.variants.map((variant) => (
                                  <Badge backgroundColor="#eef2ff" color="#3730a3" fontSize="0.7rem" key={variant?.[language] ?? variant} text={variant?.[language] ?? variant} />
                                ))}
                              </Section>
                            )}
                          </Section>,
                        ],
                      },
                    }}
                  </Card>
                ))}
              </Grid>
            </Section>
          ))}
        </Section>
      </Section>
    </>
  );
}

function formatDate(date, version, language) {
  const d = new Date(date);

  const formatted = d.toLocaleDateString(language === "sv" ? "sv-SE" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (version) {
    return `${formatted} - v${version}`;
  }

  return formatted;
}

function getBadgeIcon(type) {
  switch (type) {
    case "feature":
      return faSparkles;
    case "release":
      return faRocketLaunch;
    case "remove":
      return faTrash;
    case "fix":
      return faWrench;
    case "change":
      return faTriangleExclamation;
    default:
      return null;
  }
}

function getBadgeText(type, language) {
  switch (type) {
    case "feature":
      return platform.resources.changelog.feature[language];
    case "release":
      return platform.resources.changelog.release[language];
    case "remove":
      return platform.resources.changelog.remove[language];
    case "fix":
      return platform.resources.changelog.fix[language];
    case "change":
      return platform.resources.changelog.change[language];
    default:
      return type;
  }
}

function getBadgeTheme(type) {
  switch (type) {
    case "feature":
      return "success";
    case "fix":
      return "primary";
    case "change":
      return "warning";
    case "release":
      return "success";
    case "remove":
      return "danger";
    default:
      return "";
  }
}
