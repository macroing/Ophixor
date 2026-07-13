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
import Select from "@/lib/web-page-builder/components/select/Select";
import Text from "@/lib/web-page-builder/components/text/Text";
import TextArea from "@/lib/web-page-builder/components/text-area/TextArea";
import { useLanguage } from "@/context/language";
import { useWebsite } from "@/context/website";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function GeneralSettingsForm(props) {
  const { language } = useLanguage();

  const { saveWebsite, website } = useWebsite();

  const [defaultLanguage, setDefaultLanguage] = useState(website?.defaultLanguage || "en");
  const [description, setDescription] = useState(website?.description || "");
  const [disabled, setDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [name, setName] = useState(website?.name || "");

  async function onSubmit(e) {
    try {
      e.preventDefault();

      setIsSubmitting(true);

      const hasSaved = await saveWebsite({ defaultLanguage, description, name });

      if (hasSaved) {
        setMessage(platform.websiteAdmin.generalSettingsForm.saveSuccess[language]);
        setMessageStatus("success");
      } else {
        setMessage(platform.websiteAdmin.generalSettingsForm.saveFailure[language]);
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
      setDefaultLanguage(website.defaultLanguage || "en");
      setDescription(website.description || "");
      setName(website.name || "");
    }
  }, [website]);

  useEffect(() => {
    const hasValidDefaultLanguage = defaultLanguage === "en" || defaultLanguage === "sv";
    const hasValidDescription = description.trim().length >= 0;
    const hasValidName = name.trim() !== "";

    const hasDefaultLanguageChanged = defaultLanguage !== website?.defaultLanguage;
    const hasDescriptionChanged = description.trim() !== website?.description;
    const hasNameChanged = name.trim() !== website?.name;

    const enabled = hasValidDefaultLanguage && hasValidDescription && hasValidName && (hasDefaultLanguageChanged || hasDescriptionChanged || hasNameChanged);

    setDisabled(!enabled);
  }, [defaultLanguage, description, messageStatus, name, website]);

  useEffect(() => {
    setMessage("");
    setMessageStatus("");
  }, [defaultLanguage, description, name]);

  return (
    <Form gap="2rem" onSubmit={onSubmit}>
      <Heading color="#0f172a" level="3" text={platform.websiteAdmin.generalSettingsForm.title[language]} />
      {message && messageStatus && (
        <Alert theme={messageStatus === "failure" ? "error" : "success"}>
          <Text text={message} />
        </Alert>
      )}
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-name" text={platform.websiteAdmin.generalSettingsForm.name[language]} />
        <Input id="website-name" isDebounceDisabled={true} onChange={(e) => setName(e.target.value)} placeholder={platform.websiteAdmin.generalSettingsForm.namePlaceholder[language]} type="text" value={name} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-description" text={platform.websiteAdmin.generalSettingsForm.description[language]} />
        <TextArea id="website-description" isDebounceDisabled={true} onChange={(e) => setDescription(e.target.value)} placeholder={platform.websiteAdmin.generalSettingsForm.descriptionPlaceholder[language]} rows={5} value={description} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-default-language" text={platform.websiteAdmin.generalSettingsForm.defaultLanguage[language]} />
        <Select
          id="website-default-language"
          onChange={(e) => setDefaultLanguage(e.target.value)}
          options={[
            { label: platform.websiteAdmin.generalSettingsForm.english[language], value: "en" },
            { label: platform.websiteAdmin.generalSettingsForm.swedish[language], value: "sv" },
          ]}
          value={defaultLanguage}
        />
      </Section>
      <Section alignItems="flex-start" flexDirection="row" gap="0.5rem" justifyContent="flex-start" padding="0px">
        <Button borderRadius="8px" disabled={disabled || isSubmitting} text={isSubmitting ? platform.websiteAdmin.generalSettingsForm.saving[language] : platform.websiteAdmin.generalSettingsForm.save[language]} theme="primary" />
      </Section>
    </Form>
  );
}
