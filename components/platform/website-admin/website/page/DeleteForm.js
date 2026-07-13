// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import Dialog from "@/lib/web-page-builder/components/dialog/Dialog";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useLanguage } from "@/context/language";
import { useWebsite } from "@/context/website";
import { useWebsitePage } from "@/context/website-page";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function DeleteForm(props) {
  const { language } = useLanguage();

  const dialogRef = useRef();

  const router = useRouter();

  const { isCustomDomain, website } = useWebsite();

  const { websitePage } = useWebsitePage();

  const [isShowingDialog, setIsShowingDialog] = useState(false);
  const [message, setMessage] = useState("");

  function onClickCancel(e) {
    setIsShowingDialog(false);
  }

  async function onClickDelete(e) {
    try {
      setIsShowingDialog(false);

      const { data } = await axios.delete("/api/website-page/" + websitePage._id.toString());

      setMessage("");

      router.push((isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/pages");
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

  return (
    <>
      <Card alignItemsBody="flex-start" backgroundColor="rgba(220, 38, 38, 0.03)" backgroundColorBody="transparent" backgroundColorBodyHover="transparent" backgroundColorHover="rgba(220, 38, 38, 0.03)" borderColor="rgba(220, 38, 38, 0.2)" borderColorHover="rgba(220, 38, 38, 0.2)" element="form" flexGrow="0" gapBody="2rem" justifyContentBody="flex-start" onSubmit={onSubmit}>
        {{
          slots: {
            header: [],
            body: [
              <Heading color="#0f172a" key="1" level="3" text={platform.websiteAdmin.pages.deleteForm.title[language]} />,
              message && (
                <Alert key="2" theme="error">
                  <Text text={message} />
                </Alert>
              ),
              <Text color="#64748b" key="3" text={platform.websiteAdmin.pages.deleteForm.text[language]} />,
              <Button borderRadius="8px" disabled={isShowingDialog} key="4" theme="danger">
                {platform.websiteAdmin.pages.deleteForm.button[language]}
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
              header: [<Heading color="#0f172a" key="1" level="5" text={platform.websiteAdmin.pages.deleteForm.dialogTitle[language]} />],
              body: [<Text key="1" text={platform.websiteAdmin.pages.deleteForm.dialogText[language]} />],
              footer: [
                <Button key="1" onClick={onClickCancel}>
                  {platform.websiteAdmin.pages.deleteForm.dialogCancel[language]}
                </Button>,
                <Button key="2" onClick={onClickDelete} theme="danger">
                  {platform.websiteAdmin.pages.deleteForm.dialogDelete[language]}
                </Button>,
              ],
            },
          }}
        </Dialog>
      )}
    </>
  );
}
