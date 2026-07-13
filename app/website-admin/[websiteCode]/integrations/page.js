// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import ClickableCard from "@/components/platform/common/ClickableCard";
import Grid from "@/lib/web-page-builder/components/grid/Grid";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import IntegrationInformationCard from "@/components/platform/website-admin/website/integration/IntegrationInformationCard";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useWebsite } from "@/context/website";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function IntegrationsPage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const router = useRouter();

  const { isCustomDomain, website } = useWebsite();

  const [websiteIntegrations, setWebsiteIntegrations] = useState([]);

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canCreate = can(permissions, "integration", "create");
  const canDelete = can(permissions, "integration", "delete");
  const canRead = can(permissions, "integration", "read");

  function onClickCreateNewWebsiteIntegration(e) {
    router.push((isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/integrations-new");
  }

  function onDelete(websiteIntegration) {
    setWebsiteIntegrations([...websiteIntegrations].filter((currentWebsiteIntegration) => currentWebsiteIntegration._id.toString() !== websiteIntegration._id.toString()));
  }

  useEffect(() => {
    async function loadWebsiteIntegrations() {
      try {
        const { data } = await axios.get("/api/website-integration?websiteId=" + website._id.toString());

        if (data.websiteIntegrations) {
          setWebsiteIntegrations(data.websiteIntegrations);
        }
      } catch (error) {}
    }

    if (canRead && website) {
      loadWebsiteIntegrations();
    }
  }, [canRead, website]);

  if (!canRead) {
    return (
      <Alert theme="error">
        <Heading level="3" text={platform.websiteAdmin.integrations.title[language]} />
        <Text text={platform.websiteAdmin.integrations.notAllowed[language]} />
      </Alert>
    );
  }

  return (
    <>
      <Heading color="#0f172a" level="1" text={platform.websiteAdmin.integrations.title[language]} />
      <Text color="#64748b" element="p" text={platform.websiteAdmin.integrations.text[language]} />
      <Grid gap="1.5rem" gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))" padding="1rem 0px 0px 0px">
        {canCreate && <ClickableCard onClick={onClickCreateNewWebsiteIntegration} text={platform.websiteAdmin.integrations.createNewIntegration[language]} />}
        {websiteIntegrations.map((websiteIntegration) => (
          <IntegrationInformationCard canDelete={canDelete} isCustomDomain={isCustomDomain} key={websiteIntegration._id} onDelete={onDelete} website={website} websiteIntegration={websiteIntegration} />
        ))}
      </Grid>
    </>
  );
}
