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
import Switch from "@/lib/web-page-builder/components/switch/Switch";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useLanguage } from "@/context/language";
import { useWebsitePage } from "@/context/website-page";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function SEOSettingsForm(props) {
  const { language } = useLanguage();

  const { saveWebsitePage, websitePage } = useWebsitePage();

  const [canonicalUrl, setCanonicalUrl] = useState(websitePage?.seo?.canonicalUrl || "");
  const [description, setDescription] = useState(websitePage?.seo?.description || "");
  const [disabled, setDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keywords, setKeywords] = useState(websitePage?.seo?.keywords?.join(", ") || "");
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [ogDescription, setOgDescription] = useState(websitePage?.seo?.og?.description || "");
  const [ogImage, setOgImage] = useState(websitePage?.seo?.og?.image || "");
  const [ogTitle, setOgTitle] = useState(websitePage?.seo?.og?.title || "");
  const [robotsNoFollow, setRobotsNoFollow] = useState(websitePage?.seo?.robots?.noFollow || false);
  const [robotsNoIndex, setRobotsNoIndex] = useState(websitePage?.seo?.robots?.noIndex || false);
  const [title, setTitle] = useState(websitePage?.seo?.title || "");

  async function onSubmit(e) {
    try {
      e.preventDefault();

      setIsSubmitting(true);

      const { error, message } = await saveWebsitePage({ seoCanonicalUrl: canonicalUrl, seoDescription: description, seoKeywords: keywords, seoOgDescription: ogDescription, seoOgImage: ogImage, seoOgTitle: ogTitle, seoRobotsNoFollow: robotsNoFollow, seoRobotsNoIndex: robotsNoIndex, seoTitle: title });

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
      setCanonicalUrl(websitePage?.seo?.canonicalUrl || "");
      setDescription(websitePage?.seo?.description || "");
      setKeywords(websitePage?.seo?.keywords?.join(", ") || "");
      setOgDescription(websitePage?.seo?.og?.description || "");
      setOgImage(websitePage?.seo?.og?.image || "");
      setOgTitle(websitePage?.seo?.og?.title || "");
      setRobotsNoFollow(websitePage?.seo?.robots?.noFollow || false);
      setRobotsNoIndex(websitePage?.seo?.robots?.noIndex || false);
      setTitle(websitePage?.seo?.title || "");
    }
  }, [websitePage]);

  useEffect(() => {
    const hasCanonicalUrlChanged = canonicalUrl.trim() !== websitePage?.seo?.canonicalUrl;
    const hasDescriptionChanged = description.trim() !== websitePage?.seo?.description;
    const hasKeywordsChanged = keywords.trim() !== websitePage?.seo?.keywords?.join(", ");
    const hasOgDescriptionChanged = ogDescription.trim() !== websitePage?.seo?.og?.description;
    const hasOgImageChanged = ogImage.trim() !== websitePage?.seo?.og?.image;
    const hasOgTitleChanged = ogTitle.trim() !== websitePage?.seo?.og?.title;
    const hasRobotsNoFollowChanged = robotsNoFollow !== websitePage?.seo?.robots?.noFollow;
    const hasRobotsNoIndexChanged = robotsNoIndex !== websitePage?.seo?.robots?.noIndex;
    const hasTitleChanged = title.trim() !== websitePage?.seo?.title;

    const enabled = hasCanonicalUrlChanged || hasDescriptionChanged || hasKeywordsChanged || hasOgDescriptionChanged || hasOgImageChanged || hasOgTitleChanged || hasRobotsNoFollowChanged || hasRobotsNoIndexChanged || hasTitleChanged;

    setDisabled(!enabled);
  }, [canonicalUrl, description, keywords, ogDescription, ogImage, ogTitle, robotsNoFollow, robotsNoIndex, title, websitePage]);

  useEffect(() => {
    setMessage("");
    setMessageStatus("");
  }, [canonicalUrl, description, keywords, ogDescription, ogImage, ogTitle, robotsNoFollow, robotsNoIndex, title]);

  return (
    <Form gap="2rem" onSubmit={onSubmit}>
      <Heading color="#0f172a" level="3" text={platform.websiteAdmin.pages.seoSettingsForm.title[language]} />
      {message && messageStatus && (
        <Alert theme={messageStatus === "failure" ? "error" : "success"}>
          <Text text={message} />
        </Alert>
      )}
      <Heading color="#0f172a" level="4" text={platform.websiteAdmin.pages.seoSettingsForm.basicSeoTitle[language]} />
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-seo-title" text={platform.websiteAdmin.pages.seoSettingsForm.seoTitle[language]} />
        <Input id="website-page-seo-title" isDebounceDisabled={true} onChange={(e) => setTitle(e.target.value)} placeholder="" type="text" value={title} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-seo-description" text={platform.websiteAdmin.pages.seoSettingsForm.seoDescription[language]} />
        <Input id="website-page-seo-description" isDebounceDisabled={true} onChange={(e) => setDescription(e.target.value)} placeholder="" value={description} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-seo-canonical-url" text={platform.websiteAdmin.pages.seoSettingsForm.canonicalUrl[language]} />
        <Input id="website-page-seo-canonical-url" isDebounceDisabled={true} onChange={(e) => setCanonicalUrl(e.target.value)} placeholder="" value={canonicalUrl} />
      </Section>
      <Heading color="#0f172a" level="4" text={platform.websiteAdmin.pages.seoSettingsForm.visibilityTitle[language]} />
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-seo-robots-no-index" text={platform.websiteAdmin.pages.seoSettingsForm.noIndex[language]} />
        <Switch checked={robotsNoIndex} id="website-page-seo-robots-no-index" onChange={(e) => setRobotsNoIndex(e.target.checked)} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-seo-robots-no-follow" text={platform.websiteAdmin.pages.seoSettingsForm.noFollow[language]} />
        <Switch checked={robotsNoFollow} id="website-page-seo-robots-no-follow" onChange={(e) => setRobotsNoFollow(e.target.checked)} />
      </Section>
      <Heading color="#0f172a" level="4" text={platform.websiteAdmin.pages.seoSettingsForm.socialSharingTitle[language]} />
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-seo-og-title" text={platform.websiteAdmin.pages.seoSettingsForm.ogTitle[language]} />
        <Input id="website-page-seo-og-title" isDebounceDisabled={true} onChange={(e) => setOgTitle(e.target.value)} placeholder="" value={ogTitle} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-seo-og-description" text={platform.websiteAdmin.pages.seoSettingsForm.ogDescription[language]} />
        <Input id="website-page-seo-og-description" isDebounceDisabled={true} onChange={(e) => setOgDescription(e.target.value)} placeholder="" value={ogDescription} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-seo-og-image" text={platform.websiteAdmin.pages.seoSettingsForm.ogImage[language]} />
        <Input id="website-page-seo-og-image" isDebounceDisabled={true} onChange={(e) => setOgImage(e.target.value)} placeholder="" value={ogImage} />
      </Section>
      <Heading color="#0f172a" level="4" text={platform.websiteAdmin.pages.seoSettingsForm.advancedTitle[language]} />
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-seo-keywords" text={platform.websiteAdmin.pages.seoSettingsForm.keywords[language]} />
        <Input id="website-page-seo-keywords" isDebounceDisabled={true} onChange={(e) => setKeywords(e.target.value)} placeholder="" value={keywords} />
      </Section>
      <Section alignItems="flex-start" flexDirection="row" gap="0.5rem" justifyContent="flex-start" padding="0px">
        <Button borderRadius="8px" disabled={disabled || isSubmitting} text={isSubmitting ? platform.websiteAdmin.pages.seoSettingsForm.saving[language] : platform.websiteAdmin.pages.seoSettingsForm.save[language]} theme="primary" />
      </Section>
    </Form>
  );
}
