// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";

import AccessibilitySettingsForm from "@/components/platform/website-admin/website/AccessibilitySettingsForm";
import Alert from "@/lib/web-page-builder/components/alert/Alert";
import DeleteForm from "@/components/platform/website-admin/website/DeleteForm";
import GeneralSettingsForm from "@/components/platform/website-admin/website/GeneralSettingsForm";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useWebsite } from "@/context/website";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function WebsitesCodeSettingsPage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const { website } = useWebsite();

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canDelete = can(permissions, "website", "delete");
  const canUpdateAccessibility = can(permissions, "website", "updateAccessibility");
  const canUpdateInformation = can(permissions, "website", "updateInformation");
  const canUpdateTheme = can(permissions, "website", "updateTheme");

  if (!canDelete && !canUpdateAccessibility && !canUpdateInformation) {
    return (
      <Alert theme="error">
        <Heading level="3" text={platform.websiteAdmin.settings.title[language]} />
        <Text text={platform.websiteAdmin.settings.notAllowed[language]} />
      </Alert>
    );
  }

  return (
    <>
      {canUpdateInformation && <GeneralSettingsForm />}
      {canUpdateAccessibility && <AccessibilitySettingsForm />}
      {canDelete && <DeleteForm />}
    </>
  );
}
