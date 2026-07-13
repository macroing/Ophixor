// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useRef, useState } from "react";
import { faCancel, faTrash } from "@fortawesome/pro-solid-svg-icons";

import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import Dialog from "@/lib/web-page-builder/components/dialog/Dialog";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Icon from "@/lib/web-page-builder/components/editor/Icon";
import Link from "@/lib/web-page-builder/components/link/Link";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";

export default function InformationCard(props) {
  const collaborator = props.collaborator;
  const isCustomDomain = props.isCustomDomain;
  const onRemove = props.onRemove;
  const website = props.website;

  const dialogRef = useRef();

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  function onClickCancel(e) {
    setIsDialogVisible(false);
  }

  async function onClickRemove(e) {
    try {
      setIsDialogVisible(false);

      const { data } = await axios.delete("/api/website/" + website.code + "/collaborator?collaboratorId=" + collaborator._id.toString() + "&updateNumber=" + website.updateNumber);

      if (data.website && onRemove) {
        onRemove(data.website);
      }
    } catch (error) {}
  }

  return (
    <>
      <Card borderColor="#e5e7eb" borderRadius="16px" borderWidth="1px" boxShadow="0 1px 2px rgba(15, 23, 42, 0.04)" boxShadowHover="0 15px 35px rgba(15, 23, 42, 0.08)" paddingBody="1.5rem" transformHover="translateY(-4px)" transition="all 0.2s ease">
        {{
          slots: {
            header: [],
            body: [
              <Section alignItems="flex-start" flexDirection="column" gap="1.25rem" justifyContent="flex-start" key="content" padding="0px">
                <Section alignItems="center" flexDirection="row" justifyContent="space-between" padding="0px">
                  <Heading color="#0f172a" fontSizeLevel3="1.1rem" fontWeightLevel3="600" letterSpacingLevel3="-0.01em" level="3" margin="0" text={collaborator.platformUser.emailNormalized} />
                </Section>
                <Section flexDirection="column" gap="0.5rem" padding="0px">
                  <Text backgroundColor="rgba(15, 23, 42, 0.04)" borderRadius="8px" color="#0f172a" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="0.8rem" overflow="hidden" padding="0.45rem 0.65rem" text={`🌐 ${isCustomDomain ? "/admin" : `${process.env.NEXT_PUBLIC_PLATFORM_URL_SHORT}/website-admin/${website.code}`}/collaborators/${collaborator._id.toString()}`} textOverflow="ellipsis" title={`🌐 ${isCustomDomain ? "/admin" : `${process.env.NEXT_PUBLIC_PLATFORM_URL_SHORT}/website-admin/${website.code}`}/collaborators/${collaborator._id.toString()}`} whiteSpace="nowrap" />
                </Section>
                <Section alignItems="flex-start" flexDirection="row" justifyContent="space-between" padding="0px">
                  <Link backgroundColorHover="rgba(37, 99, 235, 0.08)" borderRadius="6px" color="#2563eb" colorHover="#1d4ed8" fontSize="0.85rem" href={(isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/collaborators/" + collaborator._id.toString()} padding="0.35rem 0.6rem" text="View" />
                  <Button backgroundColor="transparent" backgroundColorHover="rgba(220, 38, 38, 0.08)" borderColor="transparent" borderColorHover="transparent" borderRadius="6px" boxShadow="none" boxShadowHover="none" color="#dc2626" colorHover="#991b1b" fontSize="0.85rem" onClick={(e) => setIsDialogVisible(true)} padding="0.35rem 0.6rem" text="Remove" transformHover="none" />
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
              header: [<Heading color="#0f172a" key="1" level="6" text="Remove Collaborator" />],
              body: [<Text key="1" text="Are you sure you want to remove the collaborator?" />],
              footer: [
                <Button key="1" onClick={onClickCancel}>
                  <Icon icon={faCancel} size={16} style={{ color: "inherit" }} /> Cancel
                </Button>,
                <Button key="2" onClick={onClickRemove} theme="danger">
                  <Icon icon={faTrash} size={16} style={{ color: "inherit" }} /> Remove
                </Button>,
              ],
            },
          }}
        </Dialog>
      )}
    </>
  );
}
