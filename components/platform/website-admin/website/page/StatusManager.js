// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useState } from "react";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useLanguage } from "@/context/language";
import { useViewport } from "@/hooks/useViewport";
import { useWebsitePage } from "@/context/website-page";
import { equals } from "@/lib/web-page-builder/transform/core/equals";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function StatusManager() {
  const { language } = useLanguage();

  const { saveWebsitePage, websitePage } = useWebsitePage();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");

  const { isMobile } = useViewport();

  const status = websitePage?.status || "draft";
  const hasDraftVersion = !!websitePage?.websitePageDataDraft?.page;
  const hasPublishedVersion = !!websitePage?.websitePageDataPublished?.page;
  const isPublished = status === "published";
  const isArchived = status === "archived";

  const hasDraftChangedFromPublished = hasDraftVersion && hasPublishedVersion && !equals(stripMetadata(websitePage.websitePageDataDraft.page), stripMetadata(websitePage.websitePageDataPublished.page));

  const isFirstPublish = hasDraftVersion && !hasPublishedVersion;
  const isRepublish = hasDraftChangedFromPublished;

  const canPublish = isFirstPublish || isRepublish;

  function getText() {
    switch (status) {
      case "archived":
        return platform.websiteAdmin.pages.statusManager.archived[language];
      case "draft":
        return platform.websiteAdmin.pages.statusManager.draft[language];
      case "published":
        return platform.websiteAdmin.pages.statusManager.published[language];
      default:
        return "";
    }
  }

  async function handleArchive() {
    try {
      setIsSubmitting(true);

      const { error, message } = await saveWebsitePage({
        status: "archived",
        visibility: "private",
      });

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

  async function handlePublish() {
    try {
      setIsSubmitting(true);

      if (!hasDraftVersion) {
        throw new Error(platform.websiteAdmin.pages.statusManager.nothingToPublish[language]);
      }

      const { error, message } = await saveWebsitePage({ status: "published" });

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

  async function handleUnpublish() {
    try {
      setIsSubmitting(true);

      const { error, message } = await saveWebsitePage({
        status: "draft",
        visibility: "private",
      });

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

  function stripMetadata(page) {
    const { metadata, ...rest } = page;

    return rest;
  }

  return (
    <Card gapBody="2rem">
      {{
        slots: {
          header: [],
          body: [
            <Heading color="#0f172a" key="1" level="3" text={platform.websiteAdmin.pages.statusManager.title[language]} />,
            <Section gap="0.5rem" key="2" padding="0px">
              <Text element="p" text={getText()} />
            </Section>,
            message && (
              <Alert key="3" theme={messageStatus === "failure" ? "error" : "success"}>
                <Text text={message} />
              </Alert>
            ),
            <Section alignItems="flex-start" flexDirection={isMobile ? "column" : "row"} gap="1rem" justifyContent="flex-start" key="4" padding="0px">
              {!isArchived && <Button disabled={isSubmitting || !canPublish} onClick={handlePublish} text={!hasPublishedVersion ? platform.websiteAdmin.pages.statusManager.publish[language] : hasDraftChangedFromPublished ? platform.websiteAdmin.pages.statusManager.publishChanges[language] : platform.websiteAdmin.pages.statusManager.publishChanges[language]} theme="primary" width={isMobile ? "100%" : "auto"} />}
              {isPublished && <Button disabled={isSubmitting} onClick={handleUnpublish} text={platform.websiteAdmin.pages.statusManager.unpublish[language]} width={isMobile ? "100%" : "auto"} />}
              {!isArchived && <Button disabled={isSubmitting} onClick={handleArchive} text={platform.websiteAdmin.pages.statusManager.archive[language]} theme="danger" width={isMobile ? "100%" : "auto"} />}
            </Section>,
          ],
          footer: [],
        },
      }}
    </Card>
  );
}
