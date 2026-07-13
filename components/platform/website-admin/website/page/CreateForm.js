// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
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
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useWebsite } from "@/context/website";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function CreateForm(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const [description, setDescription] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [hasCreatedWebsitePage, setHasCreatedWebsitePage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [parentWebsitePage, setParentWebsitePage] = useState("/");
  const [parentWebsitePageOptions, setParentWebsitePageOptions] = useState([]);
  const [path, setPath] = useState("");
  const [slug, setSlug] = useState("");
  const [url, setUrl] = useState("");
  const [websitePages, setWebsitePages] = useState([]);

  const { isCustomDomain, website } = useWebsite();

  function createPath(parentWebsitePage, slug) {
    return parentWebsitePage + (parentWebsitePage.endsWith("/") ? "" : "/") + slug;
  }

  function formatSlug(newSlug) {
    return newSlug
      .trim()
      .replace(/[^a-zA-Z0-9åäöÅÄÖ]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
  }

  async function onSubmit(e) {
    try {
      e.preventDefault();

      setIsSubmitting(true);

      let parentWebsitePageId = "";

      for (let i = 0; i < websitePages.length; i++) {
        if (parentWebsitePage === websitePages[i].path) {
          parentWebsitePageId = websitePages[i]._id.toString();

          break;
        }
      }

      const { data } = await axios.post("/api/website-page", { description, name, parentWebsitePageId, slug, websiteId: website._id.toString() });

      setDescription("");
      setName("");
      setParentWebsitePage("");
      setPath("");
      setSlug("");

      setHasCreatedWebsitePage(true);

      setMessage(data.message || "");
    } catch (error) {
      setHasCreatedWebsitePage(false);

      setMessage(error?.response?.data?.message || "");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const newPath = createPath(parentWebsitePage, slug);

    setPath(newPath === "/" ? "" : newPath);
  }, [parentWebsitePage, slug]);

  useEffect(() => {
    const nameTrimmed = name.trim();

    const pathTrimmed = path.trim();

    const slugTrimmed = slug.trim();

    const url = pathTrimmed.length > 0 ? (isCustomDomain ? "/admin" + pathTrimmed : process.env.NEXT_PUBLIC_PLATFORM_URL + "/website-admin/" + website.code + pathTrimmed) : "";

    const hasValidName = nameTrimmed !== "";
    const hasValidPath = pathTrimmed !== "";
    const hasValidSlug = slugTrimmed !== "";

    const enabled = hasValidName && hasValidPath && hasValidSlug;

    setUrl(url);

    setDisabled(!enabled);

    if (!hasCreatedWebsitePage) {
      setMessage("");
    }
  }, [hasCreatedWebsitePage, name, parentWebsitePage, path, slug, website]);

  useEffect(() => {
    async function loadWebsitePages() {
      try {
        const { data } = await axios.get("/api/website-page?websiteId=" + website._id.toString());

        if (data.websitePages) {
          setWebsitePages(data.websitePages);
        }
      } catch (error) {}
    }

    if (platformUser && website) {
      loadWebsitePages();
    }
  }, [platformUser, website]);

  useEffect(() => {
    const newParentWebsitePageOptions = [];

    for (let i = 0; i < websitePages.length; i++) {
      newParentWebsitePageOptions.push({ label: websitePages[i].name, value: websitePages[i].path });
    }

    setParentWebsitePageOptions(newParentWebsitePageOptions);
  }, [websitePages]);

  return (
    <Form gap="2rem" onSubmit={onSubmit}>
      <Heading color="#0f172a" level="3" text={platform.websiteAdmin.pages.createForm.title[language]} />
      {message && (
        <Alert theme={hasCreatedWebsitePage ? "success" : "error"}>
          <Text text={message} />
        </Alert>
      )}
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="name" text={platform.websiteAdmin.pages.createForm.name[language]} />
        <Input id="name" isDebounceDisabled={true} onChange={(e) => setName(e.target.value)} placeholder={platform.websiteAdmin.pages.createForm.namePlaceholder[language]} type="text" value={name} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="description" text={platform.websiteAdmin.pages.createForm.description[language]} />
        <Input id="description" isDebounceDisabled={true} onChange={(e) => setDescription(e.target.value)} placeholder={platform.websiteAdmin.pages.createForm.descriptionPlaceholder[language]} type="text" value={description} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="parent-website-page" text={platform.websiteAdmin.pages.createForm.parentPage[language]} />
        <Select id="parent-website-page" onChange={(e) => setParentWebsitePage(e.target.value)} options={parentWebsitePageOptions} value={parentWebsitePage} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="slug" text={platform.websiteAdmin.pages.createForm.slug[language]} />
        <Input id="slug" isDebounceDisabled={true} onChange={(e) => setSlug(formatSlug(e.target.value))} placeholder={platform.websiteAdmin.pages.createForm.slugPlaceholder[language]} type="text" value={slug} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="path" text={platform.websiteAdmin.pages.createForm.path[language]} />
        <Input id="path" isDebounceDisabled={true} onChange={(e) => setPath(e.target.value)} placeholder={platform.websiteAdmin.pages.createForm.pathPlaceholder[language]} readOnly={true} type="text" value={path} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="url" text={platform.websiteAdmin.pages.createForm.url[language]} />
        <Input id="url" isDebounceDisabled={true} onChange={(e) => setUrl(e.target.value)} placeholder={(isCustomDomain ? "/admin" : process.env.NEXT_PUBLIC_PLATFORM_URL + "/website-admin/" + website.code) + platform.websiteAdmin.pages.createForm.urlPlaceholder[language]} readOnly={true} type="text" value={url} />
      </Section>
      <Section alignItems="flex-end" gap="0.5rem" justifyContent="flex-end" padding="0px">
        <Button disabled={disabled || isSubmitting} text={isSubmitting ? platform.websiteAdmin.pages.createForm.creating[language] : platform.websiteAdmin.pages.createForm.create[language]} theme="primary" />
      </Section>
    </Form>
  );
}
