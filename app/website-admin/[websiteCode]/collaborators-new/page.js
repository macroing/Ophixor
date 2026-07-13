// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";

import AddCollaboratorForm from "@/components/platform/website-admin/website/collaborator/AddCollaboratorForm";
import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useWebsite } from "@/context/website";

export default function CollaboratorsNewPage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { website } = useWebsite();

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canUpdateCollaborators = can(permissions, "website", "updateCollaborators");

  if (!canUpdateCollaborators) {
    return (
      <Alert theme="error">
        <Heading level="1" text="Add Collaborator" />
        <Text text="You do not have permission to view this page." />
      </Alert>
    );
  }

  return (
    <>
      <Heading color="#0f172a" level="1" text="Add Collaborator" />
      <Text color="#64748b" element="p" text="Add a new collaborator by filling in the fields below." />
      <AddCollaboratorForm />
    </>
  );
}
