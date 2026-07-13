// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Button from "@/lib/web-page-builder/components/button/Button";
import Form from "@/lib/web-page-builder/components/form/Form";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Input from "@/lib/web-page-builder/components/input/Input";
import Label from "@/lib/web-page-builder/components/label/Label";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function CreateForm(props) {
  const { language } = useLanguage();

  const router = useRouter();

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [hasCreatedWebsite, setHasCreatedWebsite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  async function onSubmit(e) {
    try {
      e.preventDefault();

      setIsSubmitting(true);

      const { data } = await axios.post("/api/website", { description, language, name });

      if (data?.website?.code) {
        router.push("/website-admin/" + data.website.code);
      }

      setDescription("");
      setName("");

      setHasCreatedWebsite(true);

      setMessage(data.message || "");
    } catch (error) {
      setHasCreatedWebsite(false);

      setMessage(error?.response?.data?.message || "");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const nameTrimmed = name.trim();

    const code = nameTrimmed
      .replace(/[^a-zA-Z0-9åäöÅÄÖ]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    const url = code.length > 0 ? process.env.NEXT_PUBLIC_PLATFORM_URL + "/website-admin/" + code : "";

    const hasValidName = nameTrimmed !== "";

    const enabled = hasValidName;

    setCode(code);

    setUrl(url);

    setDisabled(!enabled);

    if (!hasCreatedWebsite) {
      setMessage("");
    }
  }, [hasCreatedWebsite, name]);

  return (
    <Form gap="2rem" maxWidth="600px" onSubmit={onSubmit}>
      <Heading color="#0f172a" level="3" text={platform.websiteAdmin.createForm.title[language]} />
      <Text element="p" text={platform.websiteAdmin.createForm.text[language]} />
      {message && (
        <Alert theme={hasCreatedWebsite ? "success" : "error"}>
          <Text text={message} />
        </Alert>
      )}
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="name" text={platform.websiteAdmin.createForm.name[language]} />
        <Input id="name" isDebounceDisabled={true} onChange={(e) => setName(e.target.value)} placeholder={platform.websiteAdmin.createForm.namePlaceholder[language]} type="text" value={name} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="description" text={platform.websiteAdmin.createForm.description[language]} />
        <Input id="description" isDebounceDisabled={true} onChange={(e) => setDescription(e.target.value)} placeholder={platform.websiteAdmin.createForm.descriptionPlaceholder[language]} type="text" value={description} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="code" text={platform.websiteAdmin.createForm.code[language]} />
        <Input id="code" isDebounceDisabled={true} onChange={(e) => setCode(e.target.value)} placeholder={platform.websiteAdmin.createForm.codePlaceholder[language]} readOnly={true} type="text" value={code} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="url" text={platform.websiteAdmin.createForm.url[language]} />
        <Input id="url" isDebounceDisabled={true} onChange={(e) => setUrl(e.target.value)} placeholder={platform.websiteAdmin.createForm.urlPlaceholder[language]} readOnly={true} type="text" value={url} />
      </Section>
      <Section alignItems="flex-start" flexDirection="row" gap="0.5rem" justifyContent="flex-end" padding="0px">
        <Button disabled={disabled || isSubmitting} text={isSubmitting ? platform.websiteAdmin.createForm.creating[language] : platform.websiteAdmin.createForm.create[language]} theme="primary" />
      </Section>
    </Form>
  );
}
