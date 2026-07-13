// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useRef, useState } from "react";
import { faCancel, faTrash } from "@fortawesome/pro-solid-svg-icons";

import Badge from "@/lib/web-page-builder/components/badge/Badge";
import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import Dialog from "@/lib/web-page-builder/components/dialog/Dialog";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Icon from "@/lib/web-page-builder/components/editor/Icon";
import Link from "@/lib/web-page-builder/components/link/Link";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { formatRelativeTime } from "@/lib/date-time";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function IntegrationInformationCard(props) {
  const canDelete = props.canDelete;
  const isCustomDomain = props.isCustomDomain || false;
  const onDelete = props.onDelete;
  const website = props.website;
  const websiteIntegration = props.websiteIntegration;

  const { language } = useLanguage();

  const dialogRef = useRef();

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  function onClickCancel(e) {
    setIsDialogVisible(false);
  }

  async function onClickDelete(e) {
    try {
      setIsDialogVisible(false);

      const { data } = await axios.delete("/api/website-integration/" + websiteIntegration._id.toString());

      if (data.websiteIntegration && onDelete) {
        onDelete(data.websiteIntegration);
      }
    } catch (error) {}
  }

  return (
    <>
      <Card borderColor="#e5e7eb" borderRadius="16px" borderWidth="1px" boxShadow="0 1px 2px rgba(15, 23, 42, 0.04)" boxShadowHover="0 15px 35px rgba(15, 23, 42, 0.08)" paddingBody="1.5rem" paddingFooter="1.5rem" transformHover="translateY(-4px)" transition="all 0.2s ease">
        {{
          slots: {
            header: [],
            body: [
              <Section alignItems="flex-start" flexDirection="column" gap="1.25rem" justifyContent="flex-start" key="content" padding="0px">
                <Section alignItems="center" flexDirection="row" justifyContent="space-between" padding="0px">
                  <Heading color="#0f172a" fontSizeLevel3="1.1rem" fontWeightLevel3="600" letterSpacingLevel3="-0.01em" level="3" margin="0" text={websiteIntegration.name || ""} />
                  <Badge {...createBadgeProps("active")} borderRadius="6px" fontSize="0.7rem" fontWeight="500" padding="0.25rem 0.6rem" text={platform.websiteAdmin.integrations.integrationInformationCard.active[language]} />
                </Section>
                <Section flexDirection="column" gap="0.5rem" padding="0px">
                  <Text backgroundColor="rgba(15, 23, 42, 0.04)" borderRadius="8px" color="#0f172a" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="0.8rem" overflow="hidden" padding="0.45rem 0.65rem" text={`🌐 ${isCustomDomain ? "/admin" : `${process.env.NEXT_PUBLIC_PLATFORM_URL_SHORT}/website-admin/${website.code}`}/integrations/${websiteIntegration._id.toString()}`} textOverflow="ellipsis" title={`🌐 ${isCustomDomain ? "/admin" : `${process.env.NEXT_PUBLIC_PLATFORM_URL_SHORT}/website-admin/${website.code}`}/integrations/${websiteIntegration._id.toString()}`} whiteSpace="nowrap" />
                  <Text color="#64748b" fontSize="0.75rem" text={`${platform.websiteAdmin.integrations.integrationInformationCard.lastUpdated[language]} ${formatRelativeTime(websiteIntegration.updatedAt, language)}`} />
                </Section>
                <Section alignItems="center" flexDirection="row" justifyContent="space-between" padding="0px">
                  <Link backgroundColorHover="rgba(37, 99, 235, 0.08)" borderRadius="6px" color="#2563eb" colorHover="#1d4ed8" fontSize="0.85rem" href={(isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/integrations/" + websiteIntegration._id.toString()} padding="0.35rem 0.6rem" text={platform.websiteAdmin.integrations.integrationInformationCard.open[language]} />
                  {canDelete && <Button backgroundColor="transparent" backgroundColorHover="rgba(220, 38, 38, 0.08)" borderColor="transparent" borderColorHover="transparent" borderRadius="6px" boxShadow="none" boxShadowHover="none" color="#dc2626" colorHover="#991b1b" fontSize="0.85rem" onClick={(e) => setIsDialogVisible(true)} padding="0.35rem 0.6rem" text={platform.websiteAdmin.integrations.integrationInformationCard.delete[language]} transformHover="none" />}
                </Section>
              </Section>,
            ],
            footer: [],
          },
        }}
      </Card>
      {isDialogVisible && (
        <Dialog dialogRef={dialogRef}>
          {{
            slots: {
              header: [<Heading color="#0f172a" key="1" level="6" text={platform.websiteAdmin.integrations.integrationInformationCard.dialogTitle[language]} />],
              body: [<Text key="1" text={platform.websiteAdmin.integrations.integrationInformationCard.dialogText[language]} />],
              footer: [
                <Button key="1" onClick={onClickCancel}>
                  <Icon icon={faCancel} size={16} style={{ color: "inherit" }} /> {platform.websiteAdmin.integrations.integrationInformationCard.dialogCancel[language]}
                </Button>,
                <Button key="2" onClick={onClickDelete} theme="danger">
                  <Icon icon={faTrash} size={16} style={{ color: "inherit" }} /> {platform.websiteAdmin.integrations.integrationInformationCard.dialogDelete[language]}
                </Button>,
              ],
            },
          }}
        </Dialog>
      )}
    </>
  );
}

function createBadgeProps(state) {
  switch (state) {
    case "active":
      return { backgroundColor: "rgba(22, 163, 74, 0.12)", color: "#16a34a" };
    default:
      return {};
  }
}
