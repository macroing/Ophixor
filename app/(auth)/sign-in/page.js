// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";

import SignInForm from "@/components/platform/auth/SignInForm";
import { generateJsonLdPlatformGraph } from "@/definitions/platform";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-auth.json" with { type: "json" };

export default function SignInPage(props) {
  const { language } = useLanguage();

  const jsonLd = useMemo(
    () =>
      JSON.stringify(
        generateJsonLdPlatformGraph({
          description: platform.auth.sign_in.metadata.description[language],
          language,
          name: platform.auth.sign_in.metadata.title[language],
          url: platform.url + "/sign-in",
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
      <SignInForm translation={platform?.auth?.sign_in?.form} />
    </>
  );
}
