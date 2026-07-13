// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { isEmail } from "validator";

import Button from "@/lib/web-page-builder/components/button/Button";
import Form from "@/lib/web-page-builder/components/form/Form";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Input from "@/lib/web-page-builder/components/input/Input";
import Label from "@/lib/web-page-builder/components/label/Label";
import Section from "@/lib/web-page-builder/components/section/Section";
import Switch from "@/lib/web-page-builder/components/switch/Switch";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useWebsite } from "@/context/website";

export default function AddCollaboratorForm(props) {
  const [disabled, setDisabled] = useState(true);
  const [email, setEmail] = useState("");
  const [isAllowedToCreateComponentTemplate, setIsAllowedToCreateComponentTemplate] = useState(false);
  const [isAllowedToCreateIntegration, setIsAllowedToCreateIntegration] = useState(false);
  const [isAllowedToCreateMedia, setIsAllowedToCreateMedia] = useState(true);
  const [isAllowedToCreateModel, setIsAllowedToCreateModel] = useState(false);
  const [isAllowedToCreateModelData, setIsAllowedToCreateModelData] = useState(false);
  const [isAllowedToCreatePage, setIsAllowedToCreatePage] = useState(false);
  const [isAllowedToDeleteComponentTemplate, setIsAllowedToDeleteComponentTemplate] = useState(false);
  const [isAllowedToDeleteIntegration, setIsAllowedToDeleteIntegration] = useState(false);
  const [isAllowedToDeleteMedia, setIsAllowedToDeleteMedia] = useState(false);
  const [isAllowedToDeleteModel, setIsAllowedToDeleteModel] = useState(false);
  const [isAllowedToDeleteModelData, setIsAllowedToDeleteModelData] = useState(false);
  const [isAllowedToDeletePage, setIsAllowedToDeletePage] = useState(false);
  const [isAllowedToDeleteWebsite, setIsAllowedToDeleteWebsite] = useState(false);
  const [isAllowedToPublishPage, setIsAllowedToPublishPage] = useState(false);
  const [isAllowedToReadComponentTemplate, setIsAllowedToReadComponentTemplate] = useState(true);
  const [isAllowedToReadIntegration, setIsAllowedToReadIntegration] = useState(true);
  const [isAllowedToReadMedia, setIsAllowedToReadMedia] = useState(true);
  const [isAllowedToReadModel, setIsAllowedToReadModel] = useState(true);
  const [isAllowedToReadModelData, setIsAllowedToReadModelData] = useState(true);
  const [isAllowedToReadPage, setIsAllowedToReadPage] = useState(true);
  const [isAllowedToUpdateAccessibility, setIsAllowedToUpdateAccessibility] = useState(false);
  const [isAllowedToUpdateAnalytics, setIsAllowedToUpdateAnalytics] = useState(false);
  const [isAllowedToUpdateCollaborators, setIsAllowedToUpdateCollaborators] = useState(false);
  const [isAllowedToUpdateInformation, setIsAllowedToUpdateInformation] = useState(false);
  const [isAllowedToUpdateIntegration, setIsAllowedToUpdateIntegration] = useState(false);
  const [isAllowedToUpdateModel, setIsAllowedToUpdateModel] = useState(false);
  const [isAllowedToUpdateModelData, setIsAllowedToUpdateModelData] = useState(false);
  const [isAllowedToUpdatePage, setIsAllowedToUpdatePage] = useState(false);
  const [isAllowedToUpdateTheme, setIsAllowedToUpdateTheme] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");

  const { setWebsite, website } = useWebsite();

  async function onSubmit(integration) {
    try {
      setIsSubmitting(true);

      const permissions = {
        componentTemplate: {
          create: isAllowedToCreateComponentTemplate,
          delete: isAllowedToDeleteComponentTemplate,
          read: isAllowedToReadComponentTemplate,
        },
        integration: {
          create: isAllowedToCreateIntegration,
          delete: isAllowedToDeleteIntegration,
          read: isAllowedToReadIntegration,
          update: isAllowedToUpdateIntegration,
        },
        media: {
          create: isAllowedToCreateMedia,
          delete: isAllowedToDeleteMedia,
          read: isAllowedToReadMedia,
        },
        model: {
          create: isAllowedToCreateModel,
          delete: isAllowedToDeleteModel,
          read: isAllowedToReadModel,
          update: isAllowedToUpdateModel,
        },
        modelData: {
          create: isAllowedToCreateModelData,
          delete: isAllowedToDeleteModelData,
          read: isAllowedToReadModelData,
          update: isAllowedToUpdateModelData,
        },
        page: {
          create: isAllowedToCreatePage,
          delete: isAllowedToDeletePage,
          publish: isAllowedToPublishPage,
          read: isAllowedToReadPage,
          update: isAllowedToUpdatePage,
        },
        website: {
          delete: isAllowedToDeleteWebsite,
          updateAccessibility: isAllowedToUpdateAccessibility,
          updateAnalytics: isAllowedToUpdateAnalytics,
          updateCollaborators: isAllowedToUpdateCollaborators,
          updateInformation: isAllowedToUpdateInformation,
          updateTheme: isAllowedToUpdateTheme,
        },
      };

      const { data } = await axios.post("/api/website/" + website.code + "/collaborator", { email, permissions, updateNumber: website.updateNumber });

      if (data.website) {
        setWebsite(data.website);
      }

      setEmail("");

      setMessage(data.message || "");
      setMessageStatus("success");
    } catch (error) {
      setMessage(error?.response?.data?.message || "");
      setMessageStatus("failure");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const emailTrimmed = email.trim();

    const hasValidEmail = isEmail(emailTrimmed);

    let hasCollision = false;

    if (website.owner) {
      const emailNormalized = emailTrimmed.toLowerCase();

      if (website.owner?.emailNormalized === emailNormalized) {
        hasCollision = true;
      }
    }

    if (!hasCollision && Array.isArray(website.collaborators)) {
      const emailNormalized = emailTrimmed.toLowerCase();

      for (let i = 0; i < website.collaborators.length; i++) {
        if (website.collaborators[i]?.platformUser?.emailNormalized === emailNormalized) {
          hasCollision = true;

          break;
        }
      }
    }

    const enabled = hasValidEmail && !hasCollision;

    setDisabled(!enabled);
  }, [email, website]);

  return (
    <Form gap="2rem" onSubmit={onSubmit}>
      <Heading color="#0f172a" level="2" text="Collaborator" />
      {message && messageStatus === "failure" && (
        <Section backgroundColor="rgba(239, 68, 68, 0.08)" borderColor="rgba(239, 68, 68, 0.3)" borderRadius="14px" borderWidth="1px" padding="1rem">
          <Text color="#b91c1c" element="p" text={message} />
        </Section>
      )}
      {message && messageStatus === "success" && (
        <Section backgroundColor="rgba(34, 197, 94, 0.08)" borderColor="rgba(34, 197, 94, 0.3)" borderRadius="14px" borderWidth="1px" padding="1rem">
          <Text color="#166534" element="p" text={message} />
        </Section>
      )}
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="email" text="E-mail address" />
        <Input id="email" isDebounceDisabled={true} onChange={(e) => setEmail(e.target.value)} placeholder="john.doe@example.com" type="email" value={email} />
      </Section>
      <Heading color="#0f172a" level="2" text="Permissions" />
      <Heading color="#0f172a" level="3" text="Component Templates" />
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="component-template-create" text="Create" />
        <Switch checked={isAllowedToCreateComponentTemplate} id="component-template-create" onChange={(e) => setIsAllowedToCreateComponentTemplate(e.target.checked)} text="Is allowed to create component templates." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="component-template-delete" text="Delete" />
        <Switch checked={isAllowedToDeleteComponentTemplate} id="component-template-delete" onChange={(e) => setIsAllowedToDeleteComponentTemplate(e.target.checked)} text="Is allowed to delete component templates." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="component-template-read" text="Use" />
        <Switch checked={isAllowedToReadComponentTemplate} id="component-template-read" onChange={(e) => setIsAllowedToReadComponentTemplate(e.target.checked)} text="Is allowed to use component templates." />
      </Section>
      <Heading color="#0f172a" level="3" text="Integrations" />
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="integration-create" text="Create" />
        <Switch checked={isAllowedToCreateIntegration} id="integration-create" onChange={(e) => setIsAllowedToCreateIntegration(e.target.checked)} text="Is allowed to create integrations." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="integration-delete" text="Delete" />
        <Switch checked={isAllowedToDeleteIntegration} id="integration-delete" onChange={(e) => setIsAllowedToDeleteIntegration(e.target.checked)} text="Is allowed to delete integrations." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="integration-read" text="Use" />
        <Switch checked={isAllowedToReadIntegration} id="integration-read" onChange={(e) => setIsAllowedToReadIntegration(e.target.checked)} text="Is allowed to use integrations." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="integration-update" text="Update" />
        <Switch checked={isAllowedToUpdateIntegration} id="integration-update" onChange={(e) => setIsAllowedToUpdateIntegration(e.target.checked)} text="Is allowed to update integrations." />
      </Section>
      <Heading color="#0f172a" level="3" text="Media" />
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="media-create" text="Create" />
        <Switch checked={isAllowedToCreateMedia} id="media-create" onChange={(e) => setIsAllowedToCreateMedia(e.target.checked)} text="Is allowed to create media." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="media-delete" text="Delete" />
        <Switch checked={isAllowedToDeleteMedia} id="media-delete" onChange={(e) => setIsAllowedToDeleteMedia(e.target.checked)} text="Is allowed to delete media." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="media-read" text="Use" />
        <Switch checked={isAllowedToReadMedia} id="media-read" onChange={(e) => setIsAllowedToReadMedia(e.target.checked)} text="Is allowed to use media." />
      </Section>
      <Heading color="#0f172a" level="3" text="Models" />
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="model-create" text="Create" />
        <Switch checked={isAllowedToCreateModel} id="model-create" onChange={(e) => setIsAllowedToCreateModel(e.target.checked)} text="Is allowed to create models." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="model-delete" text="Delete" />
        <Switch checked={isAllowedToDeleteModel} id="model-delete" onChange={(e) => setIsAllowedToDeleteModel(e.target.checked)} text="Is allowed to delete models." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="model-read" text="Use" />
        <Switch checked={isAllowedToReadModel} id="model-read" onChange={(e) => setIsAllowedToReadModel(e.target.checked)} text="Is allowed to use models." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="model-update" text="Update" />
        <Switch checked={isAllowedToUpdateModel} id="model-update" onChange={(e) => setIsAllowedToUpdateModel(e.target.checked)} text="Is allowed to update models." />
      </Section>
      <Heading color="#0f172a" level="3" text="Model Data" />
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="model-data-create" text="Create" />
        <Switch checked={isAllowedToCreateModelData} id="model-data-create" onChange={(e) => setIsAllowedToCreateModelData(e.target.checked)} text="Is allowed to create model data." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="model-data-delete" text="Delete" />
        <Switch checked={isAllowedToDeleteModelData} id="model-data-delete" onChange={(e) => setIsAllowedToDeleteModelData(e.target.checked)} text="Is allowed to delete model data." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="model-data-read" text="Use" />
        <Switch checked={isAllowedToReadModelData} id="model-data-read" onChange={(e) => setIsAllowedToReadModelData(e.target.checked)} text="Is allowed to use model data." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="model-data-update" text="Update" />
        <Switch checked={isAllowedToUpdateModelData} id="model-data-update" onChange={(e) => setIsAllowedToUpdateModelData(e.target.checked)} text="Is allowed to update model data." />
      </Section>
      <Heading color="#0f172a" level="3" text="Pages" />
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="page-create" text="Create" />
        <Switch checked={isAllowedToCreatePage} id="page-create" onChange={(e) => setIsAllowedToCreatePage(e.target.checked)} text="Is allowed to create pages." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="page-delete" text="Delete" />
        <Switch checked={isAllowedToDeletePage} id="page-delete" onChange={(e) => setIsAllowedToDeletePage(e.target.checked)} text="Is allowed to delete pages." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="page-publish" text="Publish" />
        <Switch checked={isAllowedToPublishPage} id="page-publish" onChange={(e) => setIsAllowedToPublishPage(e.target.checked)} text="Is allowed to publish pages." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="page-read" text="View" />
        <Switch checked={isAllowedToReadPage} id="page-read" onChange={(e) => setIsAllowedToReadPage(e.target.checked)} text="Is allowed to view pages." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="page-update" text="Update" />
        <Switch checked={isAllowedToUpdatePage} id="page-update" onChange={(e) => setIsAllowedToUpdatePage(e.target.checked)} text="Is allowed to update pages." />
      </Section>
      <Heading color="#0f172a" level="3" text="Website" />
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-delete" text="Delete" />
        <Switch checked={isAllowedToDeleteWebsite} id="website-delete" onChange={(e) => setIsAllowedToDeleteWebsite(e.target.checked)} text="Is allowed to delete website." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-update-accessibility" text="Update Accessibility" />
        <Switch checked={isAllowedToUpdateAccessibility} id="website-update-accessibility" onChange={(e) => setIsAllowedToUpdateAccessibility(e.target.checked)} text="Is allowed to update accessibility." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-update-analytics" text="Update Analytics" />
        <Switch checked={isAllowedToUpdateAnalytics} id="website-update-analytics" onChange={(e) => setIsAllowedToUpdateAnalytics(e.target.checked)} text="Is allowed to update analytics." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-update-collaborators" text="Update Collaborators" />
        <Switch checked={isAllowedToUpdateCollaborators} id="website-update-collaborators" onChange={(e) => setIsAllowedToUpdateCollaborators(e.target.checked)} text="Is allowed to update collaborators." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-update-information" text="Update Information" />
        <Switch checked={isAllowedToUpdateInformation} id="website-update-information" onChange={(e) => setIsAllowedToUpdateInformation(e.target.checked)} text="Is allowed to update information." />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-update-theme" text="Update Theme" />
        <Switch checked={isAllowedToUpdateTheme} id="website-update-theme" onChange={(e) => setIsAllowedToUpdateTheme(e.target.checked)} text="Is allowed to update theme." />
      </Section>
      <Section alignItems="flex-end" gap="0.5rem" justifyContent="flex-end" padding="0px">
        <Button disabled={disabled || isSubmitting} text={isSubmitting ? "Adding..." : "Add"} theme="primary" />
      </Section>
    </Form>
  );
}
