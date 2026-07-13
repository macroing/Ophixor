// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import ModelEditor from "@/components/platform/website-admin/website/model/ModelEditor";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useWebsite } from "@/context/website";

export default function ModelsNewPage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { website } = useWebsite();

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canCreate = can(permissions, "model", "create");
  const canRead = can(permissions, "model", "read");

  if (!canCreate || !canRead) {
    return (
      <Alert theme="error">
        <Heading level="3" text="Create New Model" />
        <Text text="You do not have permission to view this page." />
      </Alert>
    );
  }

  return <ModelEditor />;
}
