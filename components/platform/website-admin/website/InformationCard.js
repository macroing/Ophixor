// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import Badge from "@/lib/web-page-builder/components/badge/Badge";
import Card from "@/lib/web-page-builder/components/card/Card";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Link from "@/lib/web-page-builder/components/link/Link";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { formatRelativeTime } from "@/lib/date-time";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function InformationCard(props) {
  const website = props.website;

  const { language } = useLanguage();

  function getStatus() {
    switch (website?.status || "") {
      case "active":
        return platform.websiteAdmin.overview.informationCard.active[language];
      case "disabled":
        return platform.websiteAdmin.overview.informationCard.disabled[language];
      case "draft":
        return platform.websiteAdmin.overview.informationCard.draft[language];
      default:
        return platform.websiteAdmin.overview.informationCard.unknown[language];
    }
  }

  return (
    <Card borderColor="#e5e7eb" borderRadius="16px" borderWidth="1px" boxShadow="0 1px 2px rgba(15, 23, 42, 0.04)" boxShadowHover="0 15px 35px rgba(15, 23, 42, 0.08)" paddingBody="1.5rem" transformHover="translateY(-4px)" transition="all 0.2s ease">
      {{
        slots: {
          header: [],
          body: [
            <Section alignItems="flex-start" flexDirection="column" gap="1.25rem" justifyContent="flex-start" key="content" padding="0px">
              <Section alignItems="flex-start" flexDirection="row" justifyContent="space-between" padding="0px">
                <Heading color="#0f172a" fontSizeLevel3="1.1rem" fontWeightLevel3="600" letterSpacingLevel3="-0.01em" level="3" margin="0" text={website.name} />
                <Badge {...createBadgeProps(website.status)} borderRadius="6px" fontSize="0.7rem" fontWeight="500" padding="0.25rem 0.6rem" text={getStatus()} />
              </Section>
              <Section flexDirection="column" gap="0.5rem" padding="0px">
                <Text backgroundColor="rgba(15, 23, 42, 0.04)" borderRadius="8px" color="#0f172a" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="0.8rem" overflow="hidden" padding="0.45rem 0.65rem" text={`🌐 ${process.env.NEXT_PUBLIC_PLATFORM_URL_SHORT}/website-admin/${website.code}`} textOverflow="ellipsis" title={`🌐 ${process.env.NEXT_PUBLIC_PLATFORM_URL_SHORT}/website-admin/${website.code}`} whiteSpace="nowrap" />
                <Text color="#64748b" fontSize="0.75rem" text={`${platform.websiteAdmin.overview.informationCard.lastUpdated[language]} ${formatRelativeTime(website.updatedAt, language)}`} />
              </Section>
              <Section alignItems="flex-start" flexDirection="row" justifyContent="space-between" padding="0px">
                <Link backgroundColorHover="rgba(37, 99, 235, 0.08)" borderRadius="6px" color="#2563eb" colorHover="#1d4ed8" fontSize="0.85rem" href={"/website-admin/" + website.code} padding="0.35rem 0.6rem" text={platform.websiteAdmin.overview.informationCard.open[language]} />
                <Link backgroundColorHover="rgba(37, 99, 235, 0.08)" borderRadius="6px" color="#2563eb" colorHover="#1d4ed8" fontSize="0.85rem" href={"/website-admin/" + website.code + "/settings"} padding="0.35rem 0.6rem" text={platform.websiteAdmin.overview.informationCard.settings[language]} />
              </Section>
            </Section>,
          ],
          footer: [],
        },
      }}
    </Card>
  );
}

function createBadgeProps(state) {
  switch (state) {
    case "active":
      return { backgroundColor: "rgba(22, 163, 74, 0.12)", color: "#16a34a" };
    case "disabled":
      return { backgroundColor: "rgba(220, 38, 38, 0.12)", color: "#dc2626" };
    case "draft":
      return { backgroundColor: "rgba(217, 119, 6, 0.12)", color: "#d97706" };
    default:
      return {};
  }
}
