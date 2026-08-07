// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useState } from "react";
import { faSave } from "@fortawesome/pro-solid-svg-icons";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Button from "@/lib/web-page-builder/components/button/Button";
import Form from "@/lib/web-page-builder/components/form/Form";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Icon from "@/lib/web-page-builder/components/editor/Icon";
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
  const [defaultLanguageTheme, setDefaultLanguageTheme] = useState("");
  const [description, setDescription] = useState(website?.description || "");
  const [descriptionTheme, setDescriptionTheme] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [name, setName] = useState(website?.name || "");
  const [nameTheme, setNameTheme] = useState("");

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
      setDefaultLanguageTheme("");
      setDescription(website.description || "");
      setDescriptionTheme("");
      setName(website.name || "");
      setNameTheme("");
    }
  }, [website]);

  useEffect(() => {
    const hasValidDefaultLanguage = defaultLanguage === "en" || defaultLanguage === "sv";
    const hasValidDescription = description.trim().length >= 0;
    const hasValidName = name.trim() !== "";

    const hasDefaultLanguageChanged = defaultLanguage !== website?.defaultLanguage;
    const hasDescriptionChanged = description.trim() !== website?.description;
    const hasNameChanged = name.trim() !== website?.name;

    const newDefaultLanguageTheme = hasValidDefaultLanguage ? (hasDefaultLanguageChanged ? "success" : "") : "danger";
    const newDescriptionTheme = hasValidDescription ? (hasDescriptionChanged ? "success" : "") : "danger";
    const newNameTheme = hasValidName ? (hasNameChanged ? "success" : "") : "danger";

    const enabled = hasValidDefaultLanguage && hasValidDescription && hasValidName && (hasDefaultLanguageChanged || hasDescriptionChanged || hasNameChanged);

    setDisabled(!enabled);

    setDefaultLanguageTheme(newDefaultLanguageTheme);
    setDescriptionTheme(newDescriptionTheme);
    setNameTheme(newNameTheme);
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
        <Label htmlFor="website-name" text={platform.websiteAdmin.generalSettingsForm.name[language]} theme={nameTheme} />
        <Input id="website-name" isDebounceDisabled={true} onChange={(e) => setName(e.target.value)} placeholder={platform.websiteAdmin.generalSettingsForm.namePlaceholder[language]} theme={nameTheme} type="text" value={name} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-description" text={platform.websiteAdmin.generalSettingsForm.description[language]} theme={descriptionTheme} />
        <TextArea id="website-description" isDebounceDisabled={true} onChange={(e) => setDescription(e.target.value)} placeholder={platform.websiteAdmin.generalSettingsForm.descriptionPlaceholder[language]} rows={5} theme={descriptionTheme} value={description} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-default-language" text={platform.websiteAdmin.generalSettingsForm.defaultLanguage[language]} theme={defaultLanguageTheme} />
        <Select
          id="website-default-language"
          onChange={(e) => setDefaultLanguage(e.target.value)}
          options={[
            { label: platform.websiteAdmin.generalSettingsForm.english[language], value: "en" },
            { label: platform.websiteAdmin.generalSettingsForm.swedish[language], value: "sv" },
          ]}
          theme={defaultLanguageTheme}
          value={defaultLanguage}
        />
      </Section>
      <Section alignItems="flex-start" flexDirection="row" gap="0.5rem" justifyContent="flex-start" padding="0px">
        <Button borderRadius="8px" disabled={disabled || isSubmitting} theme="primary">
          <Icon icon={faSave} size={16} style={{ color: "inherit" }} /> {isSubmitting ? platform.websiteAdmin.generalSettingsForm.saving[language] : platform.websiteAdmin.generalSettingsForm.save[language]}
        </Button>
      </Section>
    </Form>
  );
}
