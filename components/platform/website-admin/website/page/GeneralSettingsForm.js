// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useState } from "react";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Button from "@/lib/web-page-builder/components/button/Button";
import Form from "@/lib/web-page-builder/components/form/Form";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Input from "@/lib/web-page-builder/components/input/Input";
import Label from "@/lib/web-page-builder/components/label/Label";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useLanguage } from "@/context/language";
import { useWebsitePage } from "@/context/website-page";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function GeneralSettingsForm(props) {
  const { language } = useLanguage();

  const { saveWebsitePage, websitePage } = useWebsitePage();

  const [description, setDescription] = useState(websitePage?.description || "");
  const [disabled, setDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [name, setName] = useState(websitePage?.name || "");

  async function onSubmit(e) {
    try {
      e.preventDefault();

      setIsSubmitting(true);

      const { error, message } = await saveWebsitePage({ description, name });

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
      setDescription(websitePage.description || "");
      setName(websitePage.name || "");
    }
  }, [websitePage]);

  useEffect(() => {
    const hasValidDescription = description.trim().length >= 0;
    const hasValidName = name.trim() !== "";

    const hasDescriptionChanged = description.trim() !== websitePage?.description;
    const hasNameChanged = name.trim() !== websitePage?.name;

    const enabled = hasValidDescription && hasValidName && (hasDescriptionChanged || hasNameChanged);

    setDisabled(!enabled);
  }, [description, messageStatus, name, websitePage]);

  useEffect(() => {
    setMessage("");
    setMessageStatus("");
  }, [description, name]);

  return (
    <Form gap="2rem" onSubmit={onSubmit}>
      <Heading color="#0f172a" level="3" text={platform.websiteAdmin.pages.generalSettingsForm.title[language]} />
      {message && messageStatus && (
        <Alert theme={messageStatus === "failure" ? "error" : "success"}>
          <Text text={message} />
        </Alert>
      )}
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-name" text={platform.websiteAdmin.pages.generalSettingsForm.name[language]} />
        <Input id="website-page-name" isDebounceDisabled={true} onChange={(e) => setName(e.target.value)} placeholder={platform.websiteAdmin.pages.generalSettingsForm.namePlaceholder[language]} type="text" value={name} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-description" text={platform.websiteAdmin.pages.generalSettingsForm.description[language]} />
        <Input id="website-page-description" isDebounceDisabled={true} onChange={(e) => setDescription(e.target.value)} placeholder={platform.websiteAdmin.pages.generalSettingsForm.descriptionPlaceholder[language]} value={description} />
      </Section>
      <Section alignItems="flex-start" flexDirection="row" gap="0.5rem" justifyContent="flex-start" padding="0px">
        <Button borderRadius="8px" disabled={disabled || isSubmitting} text={isSubmitting ? platform.websiteAdmin.pages.generalSettingsForm.saving[language] : platform.websiteAdmin.pages.generalSettingsForm.save[language]} theme="primary" />
      </Section>
    </Form>
  );
}
