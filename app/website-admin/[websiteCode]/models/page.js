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
import ModelInformationCard from "@/components/platform/website-admin/website/model/ModelInformationCard";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useWebsite } from "@/context/website";

export default function ModelsPage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const router = useRouter();

  const { isCustomDomain, website } = useWebsite();

  const [websiteModels, setWebsiteModels] = useState([]);

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canCreate = can(permissions, "model", "create");
  const canDelete = can(permissions, "model", "delete");
  const canRead = can(permissions, "model", "read");

  function onClickCreateNewWebsiteModel(e) {
    router.push((isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/models-new");
  }

  function onDelete(websiteModel) {
    setWebsiteModels([...websiteModels].filter((currentWebsiteModel) => currentWebsiteModel._id.toString() !== websiteModel._id.toString()));
  }

  useEffect(() => {
    async function loadWebsiteModels() {
      try {
        const { data } = await axios.get("/api/website-model?websiteId=" + website._id.toString());

        if (data.websiteModels) {
          setWebsiteModels(data.websiteModels);
        }
      } catch (error) {}
    }

    if (canRead && website) {
      loadWebsiteModels();
    }
  }, [canRead, website]);

  if (!canRead) {
    return (
      <Alert theme="error">
        <Heading level="3" text="Models" />
        <Text text="You do not have permission to view this page." />
      </Alert>
    );
  }

  return (
    <>
      <Heading color="#0f172a" level="1" text="Models" />
      <Text color="#64748b" element="p" text="Manage your models." />
      <Grid gap="1.5rem" gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))" padding="1rem 0px 0px 0px">
        {canCreate && <ClickableCard onClick={onClickCreateNewWebsiteModel} text="+ Create New Model" />}
        {websiteModels.map((websiteModel) => (
          <ModelInformationCard canDelete={canDelete} isCustomDomain={isCustomDomain} key={websiteModel._id} onDelete={onDelete} website={website} websiteModel={websiteModel} />
        ))}
      </Grid>
    </>
  );
}
