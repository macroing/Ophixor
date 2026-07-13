// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useState } from "react";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Button from "@/lib/web-page-builder/components/button/Button";
import Form from "@/lib/web-page-builder/components/form/Form";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Label from "@/lib/web-page-builder/components/label/Label";
import Section from "@/lib/web-page-builder/components/section/Section";
import Select from "@/lib/web-page-builder/components/select/Select";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useLanguage } from "@/context/language";
import { useWebsitePage } from "@/context/website-page";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function AccessibilitySettingsForm(props) {
  const { language } = useLanguage();

  const { saveWebsitePage, websitePage } = useWebsitePage();

  const [disabled, setDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [status, setStatus] = useState(websitePage?.status || "draft");
  const [visibility, setVisibility] = useState(websitePage?.visibility || "private");

  async function onSubmit(e) {
    try {
      e.preventDefault();

      setIsSubmitting(true);

      const { error, message } = await saveWebsitePage({ status, visibility });

      if (!error) {
        setMessage(message);
        setMessageStatus("success");
      } else {
        setMessage(message);
        setMessageStatus("failure");
      }
    } catch (error) {
      setMessage(error?.message || "");
      setMessageStatus("failure");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (websitePage) {
      setStatus(websitePage.status || "draft");
      setVisibility(websitePage.visibility || "private");
    }
  }, [websitePage]);

  useEffect(() => {
    const hasValidStatus = status === "archived" || status === "draft" || status === "published";
    const hasValidVisibility = visibility === "password" || visibility === "private" || visibility === "public";

    const hasStatusChanged = status !== websitePage?.status;
    const hasVisibilityChanged = visibility !== websitePage?.visibility;

    const enabled = hasValidStatus && hasValidVisibility && (hasStatusChanged || hasVisibilityChanged);

    setDisabled(!enabled);
  }, [status, visibility, websitePage]);

  return (
    <Form gap="2rem" onSubmit={onSubmit}>
      <Heading color="#0f172a" level="3" text={platform.websiteAdmin.pages.accessibilitySettingsForm.title[language]} />
      {message && messageStatus && (
        <Alert theme={messageStatus === "failure" ? "error" : "success"}>
          <Text text={message} />
        </Alert>
      )}
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-status" text={platform.websiteAdmin.pages.accessibilitySettingsForm.status[language]} />
        <Select
          id="website-page-status"
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { label: platform.websiteAdmin.pages.accessibilitySettingsForm.archived[language], value: "archived" },
            { label: platform.websiteAdmin.pages.accessibilitySettingsForm.draft[language], value: "draft" },
            { label: platform.websiteAdmin.pages.accessibilitySettingsForm.published[language], value: "published" },
          ]}
          value={status}
        />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-visibility" text={platform.websiteAdmin.pages.accessibilitySettingsForm.visibility[language]} />
        <Select
          id="website-page-visibility"
          onChange={(e) => setVisibility(e.target.value)}
          options={[
            { label: platform.websiteAdmin.pages.accessibilitySettingsForm.password[language], value: "password" },
            { label: platform.websiteAdmin.pages.accessibilitySettingsForm.private[language], value: "private" },
            { label: platform.websiteAdmin.pages.accessibilitySettingsForm.public[language], value: "public" },
          ]}
          value={visibility}
        />
      </Section>
      <Section alignItems="flex-start" flexDirection="row" gap="0.5rem" justifyContent="flex-start" padding="0px">
        <Button borderRadius="8px" disabled={disabled || isSubmitting} text={isSubmitting ? platform.websiteAdmin.pages.accessibilitySettingsForm.saving[language] : platform.websiteAdmin.pages.accessibilitySettingsForm.save[language]} theme="primary" />
      </Section>
    </Form>
  );
}
