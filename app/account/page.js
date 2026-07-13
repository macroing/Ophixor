// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import Dialog from "@/lib/web-page-builder/components/dialog/Dialog";
import Form from "@/lib/web-page-builder/components/form/Form";
import Grid from "@/lib/web-page-builder/components/grid/Grid";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Input from "@/lib/web-page-builder/components/input/Input";
import Label from "@/lib/web-page-builder/components/label/Label";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-account.json" with { type: "json" };

import importedStyles from "./page.module.css";

export default function AccountPage(props) {
  const styles = props.styles || importedStyles;

  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const dialogRef = useRef();

  const [isShowingDialog, setIsShowingDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [passwordOld, setPasswordOld] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordNewConfirm, setPasswordNewConfirm] = useState("");

  const isPasswordFormDisabled = !(passwordOld.trim().length >= 6 && passwordNew.trim().length >= 6 && passwordNew.trim() === passwordNewConfirm.trim());

  const email = platformUser?.email || "";
  const plan = platformUser?.plan || "";

  function onClickCancel(e) {
    setIsShowingDialog(false);
  }

  async function onClickDelete(e) {
    try {
      setIsShowingDialog(false);

      const { data } = await axios.delete("/api/platform-user/" + platformUser?._id?.toString());

      signOut({ callbackUrl: "/" });
    } catch (error) {}
  }

  function onSubmitDelete(e) {
    e.preventDefault();

    setMessage("");
    setMessageStatus("");

    setIsShowingDialog(true);
  }

  async function onSubmitUpdatePassword(e) {
    try {
      e.preventDefault();

      setIsSubmitting(true);

      const { data } = await axios.put("/api/platform-user/" + platformUser?._id?.toString(), { passwordNew, passwordOld });

      setPasswordNew("");
      setPasswordNewConfirm("");
      setPasswordOld("");

      setMessage(data.message || "");
      setMessageStatus("success");
    } catch (error) {
      setMessage(error?.response?.data?.message || "");
      setMessageStatus("failure");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (isShowingDialog) {
      dialogRef?.current?.showModal();
    } else {
      dialogRef?.current?.close();
    }
  }, [isShowingDialog]);

  return (
    <Section flexDirection="column" gap="2rem" padding="2rem">
      <Section alignItems="flex-start" customClassName={styles.header} flexDirection="column" justifyContent="flex-start" padding="0px">
        <Heading color="#1e293b" fontSizeLevel1="clamp(1.5rem, 3vw, 2.125rem)" fontWeightLevel1="600" letterSpacingLevel1="-0.01em" level="1" lineHeightLevel1="1.2" text={platform.account.title[language]} />
        <Text color="#64748b" text={email} />
      </Section>
      <Grid customClassName={styles.grid} gap="2rem" gridTemplateColumns="1fr" padding="0px" width="100%">
        <Card gapBody="1rem">
          {{
            slots: {
              header: [],
              body: [
                <Heading color="#1e293b" fontSizeLevel2="clamp(1.25rem, 2.2vw, 1.625rem)" fontWeightLevel2="600" letterSpacingLevel2="0em" level="2" lineHeightLevel2="1.3" key="1" text={platform.account.accountInformation[language]} />,
                <Section flexDirection="column" gap="1rem" key="2" overflow="hidden" padding="0px">
                  <Section flexDirection="column" gap="0px" padding="0px">
                    <Text color="#64748b" text={platform.account.email[language]} />
                    <Text color="#1e293b" overflowWrap="anywhere" text={email} />
                  </Section>
                  <Section flexDirection="column" gap="0px" padding="0px">
                    <Text color="#64748b" text={platform.account.plan[language]} />
                    <Text color="#1e293b" text={plan} />
                  </Section>
                </Section>,
              ],
              footer: [],
            },
          }}
        </Card>
        <Card gapBody="1rem">
          {{
            slots: {
              header: [],
              body: [
                <Heading color="#1e293b" fontSizeLevel2="clamp(1.25rem, 2.2vw, 1.625rem)" fontWeightLevel2="600" letterSpacingLevel2="0em" level="2" lineHeightLevel2="1.3" key="1" text={platform.account.changePasswordTitle[language]} />,
                <Form backgroundColor="transparent" borderColor="transparent" boxShadow="none" gap="1rem" key="2" onSubmit={onSubmitUpdatePassword} padding="0px">
                  <Section flexDirection="column" gap="0.25rem" padding="0px">
                    <Label htmlFor="current-password" text={platform.account.currentPassword[language]} />
                    <Input id="current-password" onChange={(e) => setPasswordOld(e.target.value)} type="password" value={passwordOld} />
                  </Section>
                  <Section flexDirection="column" gap="0.25rem" padding="0px">
                    <Label htmlFor="new-password" text={platform.account.newPassword[language]} />
                    <Input id="new-password" onChange={(e) => setPasswordNew(e.target.value)} type="password" value={passwordNew} />
                  </Section>
                  <Section flexDirection="column" gap="0.25rem" padding="0px">
                    <Label htmlFor="confirm-new-password" text={platform.account.newPasswordConfirm[language]} />
                    <Input id="confirm-new-password" onChange={(e) => setPasswordNewConfirm(e.target.value)} type="password" value={passwordNewConfirm} />
                  </Section>
                  {message && (
                    <Alert theme={messageStatus === "failure" ? "error" : messageStatus === "success" ? "success" : undefined}>
                      <Text text={message} textAlign="center" />
                    </Alert>
                  )}
                  <Button disabled={isPasswordFormDisabled || isSubmitting} text={platform.account.changePasswordSubmit[language]} theme="primary" />
                </Form>,
              ],
              footer: [],
            },
          }}
        </Card>
        <Card borderColor="#fecaca" borderColorHover="#fecaca" element="form" gapBody="1rem" onSubmit={onSubmitDelete}>
          {{
            slots: {
              header: [],
              body: [<Heading color="#b91c1c" fontSizeLevel2="clamp(1.25rem, 2.2vw, 1.625rem)" fontWeightLevel2="600" key="1" letterSpacingLevel2="0em" level="2" lineHeightLevel2="1.3" text={platform.account.deleteAccountTitle[language]} />, <Text color="#b91c1c" fontSize="1rem" key="2" text={platform.account.deleteAccountText[language]} />, <Button disabled={isShowingDialog} key="3" text={platform.account.deleteAccountButton[language]} theme="danger" />],
              footer: [],
            },
          }}
        </Card>
        {isShowingDialog && (
          <Dialog dialogRef={dialogRef}>
            {{
              slots: {
                header: [<Heading color="#0f172a" fontSizeLevel3="clamp(1.125rem, 1.8vw, 1.375rem)" fontWeightLevel3="500" key="1" letterSpacingLevel3="0em" level="3" lineHeightLevel3="1.35" text={platform.account.deleteAccountDialogTitle[language]} />],
                body: [<Text color="#1e293b" key="1" text={platform.account.deleteAccountDialogText[language]} />],
                footer: [
                  <Button key="1" onClick={onClickCancel}>
                    {platform.account.deleteAccountDialogCancel[language]}
                  </Button>,
                  <Button key="2" onClick={onClickDelete} theme="danger">
                    {platform.account.deleteAccountDialogDelete[language]}
                  </Button>,
                ],
              },
            }}
          </Dialog>
        )}
      </Grid>
    </Section>
  );
}
