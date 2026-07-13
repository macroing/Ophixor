// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import Footer from "@/lib/web-page-builder/components/footer/Footer";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform.json" with { type: "json" };

export default function GlobalFooter(props) {
  const { language } = useLanguage();

  const description = platform.footer.description[language];
  const items = createItems(language);
  const textBottomLeft = platform.footer.textBottomLeft[language];
  const textBottomRight = platform.footer.textBottomRight[language];
  const title = platform.footer.title[language];

  return <Footer description={description} items={items} textBottomLeft={textBottomLeft} textBottomRight={textBottomRight} title={title} />;
}

function createItems(language) {
  return [
    {
      items: [
        { href: "/features", label: platform.footer.features[language] },
        /*{ href: "/pricing", label: platform.footer.pricing[language] },*/
      ],
      label: platform.footer.product[language],
    },
    {
      items: [
        { href: "/docs", label: platform.footer.documentation[language] },
        { href: "/changelog", label: platform.footer.changelog[language] },
      ],
      label: platform.footer.resources[language],
    },
    {
      items: [
        { href: "/privacy", label: platform.footer.privacy[language] },
        { href: "/terms", label: platform.footer.terms[language] },
        { href: "/cookies", label: platform.footer.cookies[language] },
      ],
      label: platform.footer.legal[language],
    },
  ];
}
