// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import Dialog from "@/lib/web-page-builder/components/dialog/Dialog";
import Form from "@/lib/web-page-builder/components/form/Form";
import Grid from "@/lib/web-page-builder/components/grid/Grid";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Input from "@/lib/web-page-builder/components/input/Input";
import Label from "@/lib/web-page-builder/components/label/Label";
import Link from "@/lib/web-page-builder/components/link/Link";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useViewport } from "@/hooks/useViewport";
import { useWebsite } from "@/context/website";
import { useWebsiteUser } from "@/context/website-user";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

import importedStyles from "./page.module.css";

export default function UsersUserPage(props) {
  const styles = props.styles || importedStyles;

  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const dialogRef = useRef();

  const router = useRouter();

  const { isMobile } = useViewport();

  const { isCustomDomain, website } = useWebsite();

  const { setWebsiteUser, websiteUser } = useWebsiteUser();

  const [isShowingDialog, setIsShowingDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [name, setName] = useState(websiteUser?.name || "");

  const isNameFormDisabled = name.trim() === "" || name.trim() === websiteUser?.name;

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canRead = can(permissions, "user", "read");

  function onClickCancel(e) {
    setIsShowingDialog(false);
  }

  async function onClickDelete(e) {
    try {
      setIsShowingDialog(false);

      const { data } = await axios.delete("/api/website-user/" + websiteUser?._id?.toString());

      router.push((isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/users");
    } catch (error) {}
  }

  function onSubmitDelete(e) {
    e.preventDefault();

    setMessage("");
    setMessageStatus("");

    setIsShowingDialog(true);
  }

  async function onSubmitUpdateName(e) {
    try {
      e.preventDefault();

      setIsSubmitting(true);

      const { data } = await axios.put("/api/website-user/" + websiteUser?._id?.toString(), { name: name.trim() });

      if (data.websiteUser) {
        setWebsiteUser(data.websiteUser);
      }

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

  useEffect(() => {
    if (websiteUser) {
      setName(websiteUser.name || "");
    }
  }, [websiteUser]);

  if (!canRead) {
    return (
      <>
        <div>
          <Link color="#64748b" colorHover="#2563eb" fontSize="0.9rem" href={(isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/users"} text={platform.websiteAdmin.users.backToUsers[language]} />
        </div>
        <Alert theme="error">
          <Heading level="3" text={platform.websiteAdmin.users.titleUser[language]} />
          <Text text={platform.websiteAdmin.users.notAllowed[language]} />
        </Alert>
      </>
    );
  }

  return (
    <>
      <div>
        <Link color="#64748b" colorHover="#2563eb" fontSize="0.9rem" href={(isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/users"} text={platform.websiteAdmin.users.backToUsers[language]} />
      </div>
      <Section flexDirection="column" gap="2rem" padding="0px" width="100%">
        <Section alignItems="flex-start" customClassName={styles.header} flexDirection="column" justifyContent="flex-start" padding="0px" width="100%">
          <Heading color="#1e293b" fontSizeLevel1="clamp(1.5rem, 3vw, 2.125rem)" fontWeightLevel1="600" letterSpacingLevel1="-0.01em" level="1" lineHeightLevel1="1.2" text={platform.websiteAdmin.users.user.title[language]} />
          <Text color="#64748b" text={websiteUser?.email || ""} />
        </Section>
        <Grid customClassName={styles.grid} gap="2rem" gridTemplateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"} padding="0px" width="100%">
          <Card gapBody="1rem" width="auto">
            {{
              slots: {
                header: [],
                body: [
                  <Heading color="#1e293b" fontSizeLevel2="clamp(1.25rem, 2.2vw, 1.625rem)" fontWeightLevel2="600" key="account-information-1" letterSpacingLevel2="0em" level="2" lineHeightLevel2="1.3" text={platform.websiteAdmin.users.user.accountInformation[language]} />,
                  <Section flexDirection="column" gap="1rem" key="account-information-2" overflow="hidden" padding="0px">
                    <Section flexDirection="column" gap="0px" padding="0px">
                      <Text color="#64748b" text={platform.websiteAdmin.users.user.email[language]} />
                      <Text color="#1e293b" overflowWrap="anywhere" text={websiteUser?.email || ""} />
                    </Section>
                    <Section flexDirection="column" gap="0px" padding="0px">
                      <Text color="#64748b" text={platform.websiteAdmin.users.user.name[language]} />
                      <Text color="#1e293b" text={websiteUser?.name || ""} />
                    </Section>
                    <Section flexDirection="column" gap="0px" padding="0px">
                      <Text color="#64748b" text={platform.websiteAdmin.users.user.createdAt[language]} />
                      <Text color="#1e293b" text={new Date(websiteUser.createdAt).toLocaleString(language === "sv" ? "sv-SE" : "en-US")} />
                    </Section>
                    <Section flexDirection="column" gap="0px" padding="0px">
                      <Text color="#64748b" text={platform.websiteAdmin.users.user.updatedAt[language]} />
                      <Text color="#1e293b" text={new Date(websiteUser.updatedAt).toLocaleString(language === "sv" ? "sv-SE" : "en-US")} />
                    </Section>
                  </Section>,
                ],
                footer: [],
              },
            }}
          </Card>
          <Card gapBody="1rem" width="auto">
            {{
              slots: {
                header: [],
                body: [
                  <Heading color="#1e293b" fontSizeLevel2="clamp(1.25rem, 2.2vw, 1.625rem)" fontWeightLevel2="600" letterSpacingLevel2="0em" level="2" lineHeightLevel2="1.3" key="1" text={platform.websiteAdmin.users.user.changeNameTitle[language]} />,
                  <Form backgroundColor="transparent" borderColor="transparent" boxShadow="none" flexGrow="1" gap="1rem" key="2" onSubmit={onSubmitUpdateName} padding="0px">
                    <Section flexDirection="column" flexGrow="1" gap="0.25rem" padding="0px">
                      <Label htmlFor="name" text={platform.websiteAdmin.users.user.name[language]} />
                      <Input id="name" onChange={(e) => setName(e.target.value)} value={name} />
                    </Section>
                    {message && (
                      <Alert theme={messageStatus === "failure" ? "error" : messageStatus === "success" ? "success" : undefined}>
                        <Text text={message} textAlign="center" />
                      </Alert>
                    )}
                    <Button disabled={isNameFormDisabled || isSubmitting} text={platform.websiteAdmin.users.user.changeNameSubmit[language]} theme="primary" />
                  </Form>,
                ],
                footer: [],
              },
            }}
          </Card>
          <Card borderColor="#fecaca" borderColorHover="#fecaca" element="form" gapBody="1rem" onSubmit={onSubmitDelete} width="auto">
            {{
              slots: {
                header: [],
                body: [<Heading color="#b91c1c" fontSizeLevel2="clamp(1.25rem, 2.2vw, 1.625rem)" fontWeightLevel2="600" key="1" letterSpacingLevel2="0em" level="2" lineHeightLevel2="1.3" text={platform.websiteAdmin.users.user.deleteAccountTitle[language]} />, <Text color="#b91c1c" fontSize="1rem" key="2" text={platform.websiteAdmin.users.user.deleteAccountText[language]} />, <Button disabled={isShowingDialog} key="3" text={platform.websiteAdmin.users.user.deleteAccountButton[language]} theme="danger" />],
                footer: [],
              },
            }}
          </Card>
          {isShowingDialog && (
            <Dialog dialogRef={dialogRef}>
              {{
                slots: {
                  header: [<Heading color="#0f172a" fontSizeLevel3="clamp(1.125rem, 1.8vw, 1.375rem)" fontWeightLevel3="500" key="1" letterSpacingLevel3="0em" level="3" lineHeightLevel3="1.35" text={platform.websiteAdmin.users.user.deleteAccountDialogTitle[language]} />],
                  body: [<Text color="#1e293b" key="1" text={platform.websiteAdmin.users.user.deleteAccountDialogText[language]} />],
                  footer: [
                    <Button key="1" onClick={onClickCancel}>
                      {platform.websiteAdmin.users.user.deleteAccountDialogCancel[language]}
                    </Button>,
                    <Button key="2" onClick={onClickDelete} theme="danger">
                      {platform.websiteAdmin.users.user.deleteAccountDialogDelete[language]}
                    </Button>,
                  ],
                },
              }}
            </Dialog>
          )}
        </Grid>
      </Section>
    </>
  );
}
