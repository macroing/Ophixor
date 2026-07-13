// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import CreateForm from "@/components/platform/website-admin/website/CreateForm";
import Link from "@/lib/web-page-builder/components/link/Link";
import Section from "@/lib/web-page-builder/components/section/Section";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function WebsitesNewPage(props) {
  const { language } = useLanguage();

  return (
    <Section alignItems="center" flexDirection="column" gap="1.5rem" justifyContent="flex-start">
      <Section maxWidth="600px" padding="0px">
        <Link color="#64748b" colorHover="#2563eb" fontSize="0.9rem" href="/website-admin" text={platform.websiteAdmin.backToWebsites[language]} />
      </Section>
      <CreateForm />
    </Section>
  );
}
