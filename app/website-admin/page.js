// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ClickableCard from "@/components/platform/common/ClickableCard";
import Grid from "@/lib/web-page-builder/components/grid/Grid";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import InformationCard from "@/components/platform/website-admin/website/InformationCard";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function WebsitesPage(props) {
  const { language } = useLanguage();

  const router = useRouter();

  const { platformUser } = useCurrentPlatformUser();

  const [websites, setWebsites] = useState([]);

  function onClickCreateNewWebsite(e) {
    router.push("/website-admin-new");
  }

  useEffect(() => {
    async function loadWebsites() {
      try {
        const { data } = await axios.get("/api/website?isAdmin=true");

        if (data.websites) {
          setWebsites(data.websites);
        }
      } catch (error) {}
    }

    if (platformUser) {
      loadWebsites();
    }
  }, [platformUser]);

  return (
    <>
      <Heading color="#0f172a" fontSizeLevel1="1.75rem" level="1" text={platform.websiteAdmin.overview.title[language]} />
      <Text color="#64748b" element="p" text={platform.websiteAdmin.overview.text[language]} />
      <Grid gap="1.5rem" gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))" padding="1rem 0px 0px 0px" width="100%">
        <ClickableCard onClick={onClickCreateNewWebsite} text={platform.websiteAdmin.overview.create[language]} />
        {websites.map((website) => (
          <InformationCard key={website._id} website={website} />
        ))}
      </Grid>
    </>
  );
}
