// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Link from "@/lib/web-page-builder/components/link/Link";
import ModelDataEditor from "@/components/platform/website-admin/website/model/ModelDataEditor";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useWebsite } from "@/context/website";
import { useWebsiteModel } from "@/context/website-model";

export default function ModelsModelDataNewPage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { isCustomDomain, website } = useWebsite();

  const { websiteModel } = useWebsiteModel();

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canCreateData = can(permissions, "modelData", "create");
  const canRead = can(permissions, "model", "read");
  const canReadData = can(permissions, "modelData", "read");

  if (!canCreateData || !canRead || !canReadData) {
    return (
      <>
        <div>
          <Link color="#64748b" colorHover="#2563eb" fontSize="0.9rem" href={(isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/models/" + websiteModel._id.toString()} text="← Back to Model" />
        </div>
        <Alert theme="error">
          <Heading level="3" text="Create Data" />
          <Text text="You do not have permission to view this page." />
        </Alert>
      </>
    );
  }

  return (
    <>
      <div>
        <Link color="#64748b" colorHover="#2563eb" fontSize="0.9rem" href={(isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/models/" + websiteModel._id.toString()} text="← Back to Model" />
      </div>
      <ModelDataEditor websiteModel={websiteModel} />
    </>
  );
}
