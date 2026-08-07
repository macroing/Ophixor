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
import Label from "@/lib/web-page-builder/components/label/Label";
import Section from "@/lib/web-page-builder/components/section/Section";
import Select from "@/lib/web-page-builder/components/select/Select";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useLanguage } from "@/context/language";
import { useWebsitePage } from "@/context/website-page";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function VisibilityForm(props) {
  const { language } = useLanguage();

  const { saveWebsitePage, websitePage } = useWebsitePage();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [visibilityTheme, setVisibilityTheme] = useState("");

  const status = websitePage?.status || "draft";
  const isPublished = status === "published";

  useEffect(() => {
    const hasVisibilityChanged = visibility !== websitePage?.visibility;

    const newVisibilityTheme = hasVisibilityChanged ? "success" : "";

    setVisibilityTheme(newVisibilityTheme);
  }, [visibility, websitePage]);

  useEffect(() => {
    if (websitePage) {
      setVisibility(websitePage.visibility || "private");
      setVisibilityTheme("");
    }
  }, [websitePage]);

  async function onSubmit(e) {
    try {
      e.preventDefault();

      setIsSubmitting(true);

      if (visibility === "public" && !isPublished) {
        throw new Error(platform.websiteAdmin.pages.visibilityForm.publishBeforePublic[language]);
      }

      const { error, message } = await saveWebsitePage({ visibility });

      if (error) {
        throw new Error(message);
      }

      setMessage(message);
      setMessageStatus("success");
    } catch (error) {
      setMessage(error.message);
      setMessageStatus("failure");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form gap="2rem" onSubmit={onSubmit}>
      <Heading color="#0f172a" level="3" text={platform.websiteAdmin.pages.visibilityForm.title[language]} />
      {message && (
        <Alert theme={messageStatus === "failure" ? "error" : "success"}>
          <Text text={message} />
        </Alert>
      )}
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label text={platform.websiteAdmin.pages.visibilityForm.visibility[language]} theme={visibilityTheme} />
        <Select
          onChange={(e) => setVisibility(e.target.value)}
          options={[
            { label: platform.websiteAdmin.pages.visibilityForm.private[language], value: "private" },
            { label: platform.websiteAdmin.pages.visibilityForm.public[language], value: "public" },
          ]}
          theme={visibilityTheme}
          value={visibility}
        />
      </Section>
      <Section alignItems="flex-start" flexDirection="row" gap="0.5rem" justifyContent="flex-start" padding="0px">
        <Button disabled={isSubmitting || visibility === websitePage?.visibility} theme="primary">
          <Icon icon={faSave} size={16} style={{ color: "inherit" }} /> {isSubmitting ? platform.websiteAdmin.pages.visibilityForm.saving[language] : platform.websiteAdmin.pages.visibilityForm.save[language]}
        </Button>
      </Section>
    </Form>
  );
}
