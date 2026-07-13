// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Grid from "@/lib/web-page-builder/components/grid/Grid";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import TemplateInformationCard from "@/components/platform/website-admin/website/page/TemplateInformationCard";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useWebsite } from "@/context/website";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function TemplatesPage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const { website } = useWebsite();

  const [websiteComponentTemplates, setWebsiteComponentTemplates] = useState([]);

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canDelete = can(permissions, "componentTemplate", "delete");
  const canRead = can(permissions, "componentTemplate", "read");

  function onDelete(websiteComponentTemplate) {
    setWebsiteComponentTemplates([...websiteComponentTemplates].filter((currentWebsiteComponentTemplate) => currentWebsiteComponentTemplate._id.toString() !== websiteComponentTemplate._id.toString()));
  }

  useEffect(() => {
    async function loadWebsiteComponentTemplates() {
      try {
        const { data } = await axios.get("/api/website-component-template?websiteId=" + website._id.toString());

        if (data.websiteComponentTemplates) {
          setWebsiteComponentTemplates(data.websiteComponentTemplates);
        }
      } catch (error) {}
    }

    if (canRead && website) {
      loadWebsiteComponentTemplates();
    }
  }, [canRead, website]);

  if (!canRead) {
    return (
      <Alert theme="error">
        <Heading level="3" text={platform.websiteAdmin.templates.title[language]} />
        <Text text={platform.websiteAdmin.templates.notAllowed[language]} />
      </Alert>
    );
  }

  return (
    <>
      <Heading color="#0f172a" level="1" text={platform.websiteAdmin.templates.title[language]} />
      <Text color="#64748b" element="p" text={platform.websiteAdmin.templates.text[language]} />
      <Grid gap="1.5rem" gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))" padding="1rem 0px 0px 0px">
        {websiteComponentTemplates.map((websiteComponentTemplate) => (
          <TemplateInformationCard canDelete={canDelete} key={websiteComponentTemplate._id} onDelete={onDelete} websiteComponentTemplate={websiteComponentTemplate} />
        ))}
      </Grid>
    </>
  );
}
