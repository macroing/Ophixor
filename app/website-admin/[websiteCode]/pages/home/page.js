// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import DeleteForm from "@/components/platform/website-admin/website/page/DeleteForm";
import GeneralSettingsForm from "@/components/platform/website-admin/website/page/GeneralSettingsForm";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import OperationsCard from "@/components/platform/website-admin/website/page/OperationsCard";
import SEOSettingsForm from "@/components/platform/website-admin/website/page/SEOSettingsForm";
import SocketSettingsForm from "@/components/platform/website-admin/website/page/SocketSettingsForm";
import StatusManager from "@/components/platform/website-admin/website/page/StatusManager";
import Text from "@/lib/web-page-builder/components/text/Text";
import VisibilityForm from "@/components/platform/website-admin/website/page/VisibilityForm";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useWebsite } from "@/context/website";

export default function WebsitesWebsitePagesPageHomePage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { website } = useWebsite();

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canDelete = can(permissions, "page", "delete");
  const canPublish = can(permissions, "page", "publish");
  const canRead = can(permissions, "page", "read");
  const canUpdate = can(permissions, "page", "update");

  if (!canRead || !(canDelete || canPublish || canUpdate)) {
    return (
      <Alert theme="error">
        <Heading level="3" text="Pages" />
        <Text text="You do not have permission to view this page." />
      </Alert>
    );
  }

  return (
    <>
      {canUpdate && <OperationsCard />}
      {canUpdate && <GeneralSettingsForm />}
      {canUpdate && canPublish && <StatusManager />}
      {canUpdate && <VisibilityForm />}
      {canUpdate && <SEOSettingsForm />}
      {canUpdate && <SocketSettingsForm />}
      {canDelete && <DeleteForm />}
    </>
  );
}
