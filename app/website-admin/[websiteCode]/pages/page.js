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
import InformationCard from "@/components/platform/website-admin/website/page/InformationCard";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useWebsite } from "@/context/website";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function WebsitesWebsitePagesPage(props) {
  const { language } = useLanguage();

  const router = useRouter();

  const { platformUser } = useCurrentPlatformUser();

  const { isCustomDomain, website } = useWebsite();

  const [websitePages, setWebsitePages] = useState([]);

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canCreate = can(permissions, "page", "create");
  const canRead = can(permissions, "page", "read");

  function onClickCreateNewWebsitePage(e) {
    router.push((isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/pages-new");
  }

  useEffect(() => {
    async function loadWebsitePages() {
      try {
        const { data } = await axios.get("/api/website-page?websiteId=" + website._id.toString());

        if (data.websitePages) {
          setWebsitePages(data.websitePages);
        }
      } catch (error) {}
    }

    if (canRead && platformUser && website) {
      loadWebsitePages();
    }
  }, [canRead, platformUser, website]);

  if (!canRead) {
    return (
      <Alert theme="error">
        <Heading level="3" text={platform.websiteAdmin.pages.title[language]} />
        <Text text={platform.websiteAdmin.pages.notAllowed[language]} />
      </Alert>
    );
  }

  return (
    <>
      <Heading color="#0f172a" level="1" text={platform.websiteAdmin.pages.title[language]} />
      <Text color="#64748b" element="p" text={platform.websiteAdmin.pages.text[language]} />
      <Grid gap="1.5rem" gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))" padding="1rem 0px 0px 0px">
        {canCreate && <ClickableCard onClick={onClickCreateNewWebsitePage} text={platform.websiteAdmin.pages.createNewPage[language]} />}
        {websitePages.map((websitePage) => (
          <InformationCard isCustomDomain={isCustomDomain} key={websitePage._id} website={website} websitePage={websitePage} />
        ))}
      </Grid>
    </>
  );
}
