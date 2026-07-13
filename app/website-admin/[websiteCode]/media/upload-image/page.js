// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import PlatformImageUploader from "@/components/platform/PlatformImageUploader";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useWebsite } from "@/context/website";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function UploadImagePage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const { website } = useWebsite();

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canCreate = can(permissions, "media", "create");
  const canRead = can(permissions, "media", "read");

  if (!canCreate || !canRead) {
    return (
      <Alert theme="error">
        <Heading level="3" text={platform.websiteAdmin.media.titleUploadImage[language]} />
        <Text text={platform.websiteAdmin.media.notAllowed[language]} />
      </Alert>
    );
  }

  return (
    <>
      <Heading color="#0f172a" level="1" text={platform.websiteAdmin.media.titleUploadImage[language]} />
      <PlatformImageUploader />
    </>
  );
}
