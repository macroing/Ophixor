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
import Text from "@/lib/web-page-builder/components/text/Text";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function TemplateInformationCard(props) {
  const canDelete = props.canDelete;
  const onDelete = props.onDelete;
  const websiteComponentTemplate = props.websiteComponentTemplate;

  const { language } = useLanguage();

  const dialogRef = useRef();

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  function onClickCancel(e) {
    setIsDialogVisible(false);
  }

  async function onClickDelete(e) {
    try {
      setIsDialogVisible(false);

      const { data } = await axios.delete("/api/website-component-template/" + websiteComponentTemplate._id.toString());

      if (data.websiteComponentTemplate && onDelete) {
        onDelete(data.websiteComponentTemplate);
      }
    } catch (error) {}
  }

  return (
    <>
      <Card borderColor="#e5e7eb" borderRadius="16px" borderWidth="1px" boxShadow="0 1px 2px rgba(15, 23, 42, 0.04)" boxShadowHover="0 15px 35px rgba(15, 23, 42, 0.08)" paddingBody="1.5rem" paddingFooter="1.5rem" transformHover="translateY(-4px)" transition="all 0.2s ease">
        {{
          slots: {
            header: [],
            body: [<Heading color="#0f172a" key="1" level="3" text={websiteComponentTemplate?.componentTemplate?.label || ""} />, <Text key="2" text={websiteComponentTemplate?.componentTemplate?.description || ""} />],
            footer: [
              canDelete && (
                <Button borderRadius="8px" key="1" onClick={(e) => setIsDialogVisible(true)} theme="danger">
                  <Icon icon={faTrash} size={16} style={{ color: "inherit" }} /> {platform.websiteAdmin.templates.templateInformationCard.button[language]}
                </Button>
              ),
            ],
          },
        }}
      </Card>
      {isDialogVisible && (
        <Dialog dialogRef={dialogRef}>
          {{
            slots: {
              header: [<Heading color="#0f172a" key="1" level="6" text={platform.websiteAdmin.templates.templateInformationCard.dialogTitle[language]} />],
              body: [<Text key="1" text={platform.websiteAdmin.templates.templateInformationCard.dialogText[language]} />],
              footer: [
                <Button key="1" onClick={onClickCancel}>
                  <Icon icon={faCancel} size={16} style={{ color: "inherit" }} /> {platform.websiteAdmin.templates.templateInformationCard.dialogCancel[language]}
                </Button>,
                <Button key="2" onClick={onClickDelete} theme="danger">
                  <Icon icon={faTrash} size={16} style={{ color: "inherit" }} /> {platform.websiteAdmin.templates.templateInformationCard.dialogDelete[language]}
                </Button>,
              ],
            },
          }}
        </Dialog>
      )}
    </>
  );
}
