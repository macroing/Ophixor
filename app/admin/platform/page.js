// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import GeneralSettingsForm from "@/components/platform/admin/GeneralSettingsForm";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import { useLanguage } from "@/context/language";

import platformAdmin from "@/definitions/platform-admin.json" with { type: "json" };

export default function AdminPlatformPage(props) {
  const { language } = useLanguage();

  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    async function loadPlatform() {
      try {
        const { data } = await axios.get("/api/platform");

        if (data?.platform) {
          setPlatform(data.platform);
        }
      } catch (error) {}
    }

    loadPlatform();
  }, []);

  return (
    <>
      <Heading color="#0f172a" level="1" text={platformAdmin.admin.platform.title[language]} />
      {platform && <GeneralSettingsForm platform={platform} />}
    </>
  );
}
