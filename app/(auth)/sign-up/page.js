// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";

import SignUpForm from "@/components/platform/auth/SignUpForm";
import { generateJsonLdPlatformGraph } from "@/definitions/platform";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-auth.json" with { type: "json" };

export default function SignUpPage(props) {
  const { language } = useLanguage();

  const jsonLd = useMemo(
    () =>
      JSON.stringify(
        generateJsonLdPlatformGraph({
          description: platform.auth.sign_up.metadata.description[language],
          language,
          name: platform.auth.sign_up.metadata.title[language],
          url: platform.url + "/sign-up",
        }),
      ).replace(/</g, "\\u003c"),
    [language],
  );

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: jsonLd,
        }}
        type="application/ld+json"
      />
      <SignUpForm translation={platform?.auth?.sign_up?.form} />
    </>
  );
}
