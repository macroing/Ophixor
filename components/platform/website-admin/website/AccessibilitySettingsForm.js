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
import { useWebsite } from "@/context/website";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function AccessibilitySettingsForm(props) {
  const { language } = useLanguage();

  const { saveWebsite, website } = useWebsite();

  const [disabled, setDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [status, setStatus] = useState(website?.status || "draft");
  const [visibility, setVisibility] = useState(website?.visibility || "private");

  async function onSubmit(e) {
    try {
      e.preventDefault();

      setIsSubmitting(true);

      const hasSaved = await saveWebsite({ status, visibility });

      if (hasSaved) {
        setMessage(platform.websiteAdmin.accessibilitySettingsForm.saveSuccess[language]);
        setMessageStatus("success");
      } else {
        setMessage(platform.websiteAdmin.accessibilitySettingsForm.saveFailure[language]);
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
    if (website) {
      setStatus(website.status || "draft");
      setVisibility(website.visibility || "private");
    }
  }, [website]);

  useEffect(() => {
    const hasValidStatus = status === "active" || status === "disabled" || status === "draft";
    const hasValidVisibility = visibility === "private" || visibility === "public" || visibility === "unlisted";

    const hasStatusChanged = status !== website?.status;
    const hasVisibilityChanged = visibility !== website?.visibility;

    const enabled = hasValidStatus && hasValidVisibility && (hasStatusChanged || hasVisibilityChanged);

    setDisabled(!enabled);

    if (messageStatus !== "success") {
      setMessage("");
      setMessageStatus("");
    }
  }, [messageStatus, status, visibility, website]);

  useEffect(() => {
    setMessage("");
    setMessageStatus("");
  }, [status, visibility]);

  return (
    <Form gap="2rem" onSubmit={onSubmit}>
      <Heading color="#0f172a" level="3" text={platform.websiteAdmin.accessibilitySettingsForm.title[language]} />
      {message && messageStatus && (
        <Alert theme={messageStatus === "failure" ? "error" : "success"}>
          <Text text={message} />
        </Alert>
      )}
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-status" text={platform.websiteAdmin.accessibilitySettingsForm.status[language]} />
        <Select
          id="website-status"
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { label: platform.websiteAdmin.accessibilitySettingsForm.active[language], value: "active" },
            { label: platform.websiteAdmin.accessibilitySettingsForm.disabled[language], value: "disabled" },
            { label: platform.websiteAdmin.accessibilitySettingsForm.draft[language], value: "draft" },
          ]}
          value={status}
        />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-visibility" text={platform.websiteAdmin.accessibilitySettingsForm.visibility[language]} />
        <Select
          id="website-visibility"
          onChange={(e) => setVisibility(e.target.value)}
          options={[
            { label: platform.websiteAdmin.accessibilitySettingsForm.private[language], value: "private" },
            { label: platform.websiteAdmin.accessibilitySettingsForm.public[language], value: "public" },
            { label: platform.websiteAdmin.accessibilitySettingsForm.unlisted[language], value: "unlisted" },
          ]}
          value={visibility}
        />
      </Section>
      <Section alignItems="flex-start" flexDirection="row" gap="0.5rem" justifyContent="flex-start" padding="0px">
        <Button borderRadius="8px" disabled={disabled || isSubmitting} text={isSubmitting ? platform.websiteAdmin.accessibilitySettingsForm.saving[language] : platform.websiteAdmin.accessibilitySettingsForm.save[language]} theme="primary" />
      </Section>
    </Form>
  );
}
