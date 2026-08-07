// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Button from "@/lib/web-page-builder/components/button/Button";
import Form from "@/lib/web-page-builder/components/form/Form";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Icon from "@/lib/web-page-builder/components/editor/Icon";
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
  const [codeTheme, setCodeTheme] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionTheme, setDescriptionTheme] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [hasCreatedWebsite, setHasCreatedWebsite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [nameTheme, setNameTheme] = useState("");
  const [url, setUrl] = useState("");
  const [urlTheme, setUrlTheme] = useState("");

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

    const newCodeTheme = code.length > 0 ? "success" : nameTrimmed === "" ? "" : "danger";
    const newDescriptionTheme = code.length > 0 && nameTrimmed !== "" ? "success" : "";
    const newNameTheme = nameTrimmed !== "" ? "success" : "";
    const newUrlTheme = url !== "" ? "success" : "";

    const enabled = hasValidName;

    setCode(code);
    setCodeTheme(newCodeTheme);

    setDescriptionTheme(newDescriptionTheme);

    setNameTheme(newNameTheme);

    setUrl(url);
    setUrlTheme(newUrlTheme);

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
        <Label htmlFor="name" text={platform.websiteAdmin.createForm.name[language]} theme={nameTheme} />
        <Input id="name" isDebounceDisabled={true} onChange={(e) => setName(e.target.value)} placeholder={platform.websiteAdmin.createForm.namePlaceholder[language]} theme={nameTheme} type="text" value={name} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="description" text={platform.websiteAdmin.createForm.description[language]} theme={descriptionTheme} />
        <Input id="description" isDebounceDisabled={true} onChange={(e) => setDescription(e.target.value)} placeholder={platform.websiteAdmin.createForm.descriptionPlaceholder[language]} theme={descriptionTheme} type="text" value={description} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="code" text={platform.websiteAdmin.createForm.code[language]} theme={codeTheme} />
        <Input id="code" isDebounceDisabled={true} onChange={(e) => setCode(e.target.value)} placeholder={platform.websiteAdmin.createForm.codePlaceholder[language]} readOnly={true} theme={codeTheme} type="text" value={code} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="url" text={platform.websiteAdmin.createForm.url[language]} theme={urlTheme} />
        <Input id="url" isDebounceDisabled={true} onChange={(e) => setUrl(e.target.value)} placeholder={platform.websiteAdmin.createForm.urlPlaceholder[language]} readOnly={true} theme={urlTheme} type="text" value={url} />
      </Section>
      <Section alignItems="flex-start" flexDirection="row" gap="0.5rem" justifyContent="flex-end" padding="0px">
        <Button disabled={disabled || isSubmitting} theme="primary">
          <Icon icon={faPlus} size={16} style={{ color: "inherit" }} /> {isSubmitting ? platform.websiteAdmin.createForm.creating[language] : platform.websiteAdmin.createForm.create[language]}
        </Button>
      </Section>
    </Form>
  );
}
