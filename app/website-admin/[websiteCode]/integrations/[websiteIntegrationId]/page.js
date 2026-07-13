// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import IntegrationForm from "@/components/platform/website-admin/website/integration/IntegrationForm";
import Link from "@/lib/web-page-builder/components/link/Link";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useWebsite } from "@/context/website";
import { useWebsiteIntegration } from "@/context/website-integration";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function IntegrationsIntegrationPage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const { isCustomDomain, website } = useWebsite();

  const { setWebsiteIntegration, websiteIntegration } = useWebsiteIntegration();

  const [integration, setIntegration] = useState(websiteIntegration ? { ...websiteIntegration } : null);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canRead = can(permissions, "integration", "read");
  const canUpdate = can(permissions, "integration", "update");

  async function onSubmit(integration) {
    try {
      const { data } = await axios.put("/api/website-integration/" + websiteIntegration._id.toString(), { integration, websiteId: website._id.toString() });

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

  useEffect(() => {
    if (websiteIntegration) {
      setIntegration({ ...websiteIntegration });
    }
  }, [websiteIntegration]);

  if (!canRead) {
    return (
      <>
        <div>
          <Link color="#64748b" colorHover="#2563eb" fontSize="0.9rem" href={(isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/integrations"} text={platform.websiteAdmin.integrations.backToIntegrations[language]} />
        </div>
        <Alert theme="error">
          <Heading level="3" text={platform.websiteAdmin.integrations.titleIntegration[language]} />
          <Text text={platform.websiteAdmin.integrations.notAllowed[language]} />
        </Alert>
      </>
    );
  }

  return (
    <>
      <div>
        <Link color="#64748b" colorHover="#2563eb" fontSize="0.9rem" href={(isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/integrations"} text={platform.websiteAdmin.integrations.backToIntegrations[language]} />
      </div>
      <IntegrationForm canUpdate={canUpdate} initialValue={integration} message={message} messageStatus={messageStatus} onSubmit={onSubmit} />
    </>
  );
}
