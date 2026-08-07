// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { faCancel, faTrash } from "@fortawesome/pro-solid-svg-icons";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import Dialog from "@/lib/web-page-builder/components/dialog/Dialog";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Icon from "@/lib/web-page-builder/components/editor/Icon";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useLanguage } from "@/context/language";
import { useWebsite } from "@/context/website";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function DeleteForm(props) {
  const { language } = useLanguage();

  const dialogRef = useRef();

  const router = useRouter();

  const { isCustomDomain, website } = useWebsite();

  const [isShowingDialog, setIsShowingDialog] = useState(false);
  const [message, setMessage] = useState("");

  function onClickCancel(e) {
    setIsShowingDialog(false);
  }

  async function onClickDelete(e) {
    try {
      setIsShowingDialog(false);

      const { data } = await axios.delete("/api/website/" + website.code);

      setMessage("");

      router.push("/website-admin");
    } catch (error) {
      setMessage(error?.response?.data?.message || "");
    }
  }

  function onSubmit(e) {
    e.preventDefault();

    setMessage("");

    setIsShowingDialog(true);
  }

  useEffect(() => {
    if (isShowingDialog) {
      dialogRef?.current?.showModal();
    } else {
      dialogRef?.current?.close();
    }
  }, [isShowingDialog]);

  if (isCustomDomain) {
    return null;
  }

  return (
    <>
      <Card alignItemsBody="flex-start" backgroundColor="var(--pc-semantic-status-danger-bg)" backgroundColorBody="transparent" backgroundColorBodyHover="transparent" backgroundColorHover="var(--pc-semantic-status-danger-bg)" borderColor="var(--pc-semantic-status-danger)" borderColorHover="var(--pc-semantic-status-danger)" element="form" flexGrow="0" gapBody="2rem" justifyContentBody="flex-start" onSubmit={onSubmit}>
        {{
          slots: {
            header: [],
            body: [
              <Heading color="var(--pc-semantic-status-danger-text)" key="1" level="3" text={platform.websiteAdmin.deleteForm.title[language]} />,
              message && (
                <Alert key="2" theme="error">
                  <Text text={message} />
                </Alert>
              ),
              <Text color="var(--pc-semantic-status-danger-text)" key="3" text={platform.websiteAdmin.deleteForm.text[language]} />,
              <Button borderRadius="8px" disabled={isShowingDialog} key="4" theme="danger">
                <Icon icon={faTrash} size={16} style={{ color: "inherit" }} /> {platform.websiteAdmin.deleteForm.button[language]}
              </Button>,
            ],
            footer: [],
          },
        }}
      </Card>
      {isShowingDialog && (
        <Dialog dialogRef={dialogRef}>
          {{
            slots: {
              header: [<Heading color="#0f172a" key="1" level="5" text={platform.websiteAdmin.deleteForm.dialogTitle[language]} />],
              body: [<Text key="1" text={platform.websiteAdmin.deleteForm.dialogText[language]} />],
              footer: [
                <Button key="1" onClick={onClickCancel}>
                  <Icon icon={faCancel} size={16} style={{ color: "inherit" }} /> {platform.websiteAdmin.deleteForm.dialogCancel[language]}
                </Button>,
                <Button key="2" onClick={onClickDelete} theme="danger">
                  <Icon icon={faTrash} size={16} style={{ color: "inherit" }} /> {platform.websiteAdmin.deleteForm.dialogDelete[language]}
                </Button>,
              ],
            },
          }}
        </Dialog>
      )}
    </>
  );
}
