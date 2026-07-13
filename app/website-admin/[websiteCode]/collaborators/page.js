// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import ClickableCard from "@/components/platform/common/ClickableCard";
import Grid from "@/lib/web-page-builder/components/grid/Grid";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import InformationCard from "@/components/platform/website-admin/website/collaborator/InformationCard";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useWebsite } from "@/context/website";

export default function CollaboratorsPage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const router = useRouter();

  const { isCustomDomain, setWebsite, website } = useWebsite();

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canUpdateCollaborators = can(permissions, "website", "updateCollaborators");

  function onClickAddNewCollaborator(e) {
    router.push((isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/collaborators-new");
  }

  function onRemove(newWebsite) {
    setWebsite(newWebsite);
  }

  if (!canUpdateCollaborators) {
    return (
      <Alert theme="error">
        <Heading level="3" text="Collaborators" />
        <Text text="You do not have permission to view this page." />
      </Alert>
    );
  }

  return (
    <>
      <Heading color="#0f172a" level="1" text="Collaborators" />
      <Text color="#64748b" element="p" text="Manage your collaborators." />
      <Grid gap="1.5rem" gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))" padding="1rem 0px 0px 0px">
        <ClickableCard onClick={onClickAddNewCollaborator} text="+ Add New Collaborator" />
        {(website?.collaborators || []).map((collaborator) => (
          <InformationCard collaborator={collaborator} isCustomDomain={isCustomDomain} key={collaborator._id.toString()} onRemove={onRemove} website={website} />
        ))}
      </Grid>
    </>
  );
}
