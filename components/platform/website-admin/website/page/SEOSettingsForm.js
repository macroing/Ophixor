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
  const [canonicalUrlTheme, setCanonicalUrlTheme] = useState("");
  const [description, setDescription] = useState(websitePage?.seo?.description || "");
  const [descriptionTheme, setDescriptionTheme] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keywords, setKeywords] = useState(websitePage?.seo?.keywords?.join(", ") || "");
  const [keywordsTheme, setKeywordsTheme] = useState("");
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [ogDescription, setOgDescription] = useState(websitePage?.seo?.og?.description || "");
  const [ogDescriptionTheme, setOgDescriptionTheme] = useState("");
  const [ogImage, setOgImage] = useState(websitePage?.seo?.og?.image || "");
  const [ogImageTheme, setOgImageTheme] = useState("");
  const [ogTitle, setOgTitle] = useState(websitePage?.seo?.og?.title || "");
  const [ogTitleTheme, setOgTitleTheme] = useState("");
  const [robotsNoFollow, setRobotsNoFollow] = useState(websitePage?.seo?.robots?.noFollow || false);
  const [robotsNoFollowTheme, setRobotsNoFollowTheme] = useState("");
  const [robotsNoIndex, setRobotsNoIndex] = useState(websitePage?.seo?.robots?.noIndex || false);
  const [robotsNoIndexTheme, setRobotsNoIndexTheme] = useState("");
  const [title, setTitle] = useState(websitePage?.seo?.title || "");
  const [titleTheme, setTitleTheme] = useState("");

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
      setCanonicalUrlTheme("");
      setDescription(websitePage?.seo?.description || "");
      setDescriptionTheme("");
      setKeywords(websitePage?.seo?.keywords?.join(", ") || "");
      setKeywordsTheme("");
      setOgDescription(websitePage?.seo?.og?.description || "");
      setOgDescriptionTheme("");
      setOgImage(websitePage?.seo?.og?.image || "");
      setOgImageTheme("");
      setOgTitle(websitePage?.seo?.og?.title || "");
      setOgTitleTheme("");
      setRobotsNoFollow(websitePage?.seo?.robots?.noFollow || false);
      setRobotsNoFollowTheme("");
      setRobotsNoIndex(websitePage?.seo?.robots?.noIndex || false);
      setRobotsNoIndexTheme("");
      setTitle(websitePage?.seo?.title || "");
      setTitleTheme("");
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

    const newCanonicalUrlTheme = hasCanonicalUrlChanged ? "success" : "";
    const newDescriptionTheme = hasDescriptionChanged ? "success" : "";
    const newKeywordsTheme = hasKeywordsChanged ? "success" : "";
    const newOgDescriptionTheme = hasOgDescriptionChanged ? "success" : "";
    const newOgImageTheme = hasOgImageChanged ? "success" : "";
    const newOgTitleTheme = hasOgTitleChanged ? "success" : "";
    const newRobotsNoFollowTheme = hasRobotsNoFollowChanged ? "success" : "";
    const newRobotsNoIndexTheme = hasRobotsNoIndexChanged ? "success" : "";
    const newTitleTheme = hasTitleChanged ? "success" : "";

    setDisabled(!enabled);

    setCanonicalUrlTheme(newCanonicalUrlTheme);
    setDescriptionTheme(newDescriptionTheme);
    setKeywordsTheme(newKeywordsTheme);
    setOgDescriptionTheme(newOgDescriptionTheme);
    setOgImageTheme(newOgImageTheme);
    setOgTitleTheme(newOgTitleTheme);
    setRobotsNoFollowTheme(newRobotsNoFollowTheme);
    setRobotsNoIndexTheme(newRobotsNoIndexTheme);
    setTitleTheme(newTitleTheme);
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
        <Label htmlFor="website-page-seo-title" text={platform.websiteAdmin.pages.seoSettingsForm.seoTitle[language]} theme={titleTheme} />
        <Input id="website-page-seo-title" isDebounceDisabled={true} onChange={(e) => setTitle(e.target.value)} placeholder="" theme={titleTheme} type="text" value={title} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-seo-description" text={platform.websiteAdmin.pages.seoSettingsForm.seoDescription[language]} theme={descriptionTheme} />
        <Input id="website-page-seo-description" isDebounceDisabled={true} onChange={(e) => setDescription(e.target.value)} placeholder="" theme={descriptionTheme} value={description} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-seo-canonical-url" text={platform.websiteAdmin.pages.seoSettingsForm.canonicalUrl[language]} theme={canonicalUrlTheme} />
        <Input id="website-page-seo-canonical-url" isDebounceDisabled={true} onChange={(e) => setCanonicalUrl(e.target.value)} placeholder="" theme={canonicalUrlTheme} value={canonicalUrl} />
      </Section>
      <Heading color="#0f172a" level="4" text={platform.websiteAdmin.pages.seoSettingsForm.visibilityTitle[language]} />
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-seo-robots-no-index" text={platform.websiteAdmin.pages.seoSettingsForm.noIndex[language]} theme={robotsNoIndexTheme} />
        <Switch checked={robotsNoIndex} id="website-page-seo-robots-no-index" onChange={(e) => setRobotsNoIndex(e.target.checked)} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-seo-robots-no-follow" text={platform.websiteAdmin.pages.seoSettingsForm.noFollow[language]} theme={robotsNoFollowTheme} />
        <Switch checked={robotsNoFollow} id="website-page-seo-robots-no-follow" onChange={(e) => setRobotsNoFollow(e.target.checked)} />
      </Section>
      <Heading color="#0f172a" level="4" text={platform.websiteAdmin.pages.seoSettingsForm.socialSharingTitle[language]} />
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-seo-og-title" text={platform.websiteAdmin.pages.seoSettingsForm.ogTitle[language]} theme={ogTitleTheme} />
        <Input id="website-page-seo-og-title" isDebounceDisabled={true} onChange={(e) => setOgTitle(e.target.value)} placeholder="" theme={ogTitleTheme} value={ogTitle} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-seo-og-description" text={platform.websiteAdmin.pages.seoSettingsForm.ogDescription[language]} theme={ogDescriptionTheme} />
        <Input id="website-page-seo-og-description" isDebounceDisabled={true} onChange={(e) => setOgDescription(e.target.value)} placeholder="" theme={ogDescriptionTheme} value={ogDescription} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-seo-og-image" text={platform.websiteAdmin.pages.seoSettingsForm.ogImage[language]} theme={ogImageTheme} />
        <Input id="website-page-seo-og-image" isDebounceDisabled={true} onChange={(e) => setOgImage(e.target.value)} placeholder="" theme={ogImageTheme} value={ogImage} />
      </Section>
      <Heading color="#0f172a" level="4" text={platform.websiteAdmin.pages.seoSettingsForm.advancedTitle[language]} />
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-seo-keywords" text={platform.websiteAdmin.pages.seoSettingsForm.keywords[language]} theme={keywordsTheme} />
        <Input id="website-page-seo-keywords" isDebounceDisabled={true} onChange={(e) => setKeywords(e.target.value)} placeholder="" theme={keywordsTheme} value={keywords} />
      </Section>
      <Section alignItems="flex-start" flexDirection="row" gap="0.5rem" justifyContent="flex-start" padding="0px">
        <Button borderRadius="8px" disabled={disabled || isSubmitting} text={isSubmitting ? platform.websiteAdmin.pages.seoSettingsForm.saving[language] : platform.websiteAdmin.pages.seoSettingsForm.save[language]} theme="primary" />
      </Section>
    </Form>
  );
}
