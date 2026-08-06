// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Link from "@/lib/web-page-builder/components/link/Link";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useWebsite } from "@/context/website";
import { useWebsiteUser } from "@/context/website-user";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function UsersUserPage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const { isCustomDomain, website } = useWebsite();

  const { websiteUser } = useWebsiteUser();

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canRead = can(permissions, "user", "read");

  if (!canRead) {
    return (
      <>
        <div>
          <Link color="#64748b" colorHover="#2563eb" fontSize="0.9rem" href={(isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/users"} text={platform.websiteAdmin.users.backToUsers[language]} />
        </div>
        <Alert theme="error">
          <Heading level="3" text={platform.websiteAdmin.users.titleUser[language]} />
          <Text text={platform.websiteAdmin.users.notAllowed[language]} />
        </Alert>
      </>
    );
  }

  return (
    <>
      <div>
        <Link color="#64748b" colorHover="#2563eb" fontSize="0.9rem" href={(isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/users"} text={platform.websiteAdmin.users.backToUsers[language]} />
      </div>
      <div>{websiteUser?.name}</div>
    </>
  );
}
