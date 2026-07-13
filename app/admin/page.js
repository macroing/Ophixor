// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import Link from "next/link";

import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-admin.json" with { type: "json" };

export default function AdminPage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  return (
    <>
      <Heading color="#0f172a" level="1" text={platform.admin.overview.title[language]} />
      <Text color="#475569">
        {platform.admin.overview.textA[language]} <strong>{platformUser.email}</strong>.
      </Text>
      <Text color="#475569">
        {platform.admin.overview.textB[language]} <Link href={"/admin/users"}>{platform.admin.overview.textC[language]}</Link> {platform.admin.overview.textD[language]} <Link href={"/admin/websites"}>{platform.admin.overview.textE[language]}</Link>.
      </Text>
    </>
  );
}
