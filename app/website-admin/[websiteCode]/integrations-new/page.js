// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useMemo, useState } from "react";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import IntegrationForm from "@/components/platform/website-admin/website/integration/IntegrationForm";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useWebsite } from "@/context/website";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function IntegrationsNewPage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const { website } = useWebsite();

  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [websiteIntegration, setWebsiteIntegration] = useState(null);

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canCreate = can(permissions, "integration", "create");
  const canRead = can(permissions, "integration", "read");

  async function onSubmit(integration) {
    try {
      const { data } = await axios.post("/api/website-integration", { integration, websiteId: website._id.toString() });

      if (data.websiteIntegration) {
        setWebsiteIntegration(data.websiteIntegration);
      }

      setMessage(data.message || "");
      setMessageStatus("success");
    } catch (error) {
      setMessage(error?.response?.data?.message || "");
      setMessageStatus("failure");
    }
  }

  if (!canCreate || !canRead) {
    return (
      <Alert theme="error">
        <Heading level="3" text={platform.websiteAdmin.integrationsNew.title[language]} />
        <Text text={platform.websiteAdmin.integrationsNew.notAllowed[language]} />
      </Alert>
    );
  }

  return (
    <>
      <Heading color="#0f172a" level="1" text={platform.websiteAdmin.integrationsNew.title[language]} />
      <Text color="#64748b" element="p" text={platform.websiteAdmin.integrationsNew.text[language]} />
      <IntegrationForm canUpdate={canCreate} initialValue={websiteIntegration} message={message} messageStatus={messageStatus} onSubmit={onSubmit} />
    </>
  );
}
