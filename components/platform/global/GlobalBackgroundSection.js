// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import Section from "@/lib/web-page-builder/components/section/Section";
import { useOverflow } from "@/context/overflow";

export default function GlobalBackgroundSection(props) {
  const children = props.children;
  const theme = props.theme;

  const overflow = useOverflow();

  const pathname = usePathname();

  const pathnameDecoded = useMemo(() => decodeURI(pathname), [pathname]);

  return (
    <Section {...createProps(theme, pathnameDecoded)} {...(overflow?.isOverflowHidden ? { maxHeight: "100vh", overflow: "hidden" } : {})}>
      {children}
    </Section>
  );
}

function createBackgroundImage(theme, pathname, isDark = false) {
  switch (theme) {
    case "account":
      return "radial-gradient(1200px 600px at 80% -100px, var(--pc-foundation-color-primary-bg), transparent), radial-gradient(800px 400px at 0% 0%, var(--pc-foundation-color-primary-bg-2), transparent), linear-gradient(180deg, var(--pc-foundation-color-primary-100) 0%, var(--pc-foundation-color-primary-50) 100%)";
    case "auth":
      return "linear-gradient(180deg, var(--pc-foundation-color-primary-100) 0%, var(--pc-foundation-color-primary-50) 100%)";
    case "legal":
      return "radial-gradient(1200px 600px at 80% -100px, var(--pc-foundation-color-primary-bg), transparent), radial-gradient(800px 400px at 0% 0%, var(--pc-foundation-color-primary-bg-2), transparent), linear-gradient(180deg, var(--pc-foundation-color-primary-100) 0%, var(--pc-foundation-color-primary-50) 100%)";
    case "marketing":
      return isDark ? "linear-gradient(180deg, var(--pc-foundation-color-slate-800), var(--pc-foundation-color-slate-700))" : pathname === "/" ? "linear-gradient(180deg, var(--pc-foundation-color-slate-800), var(--pc-foundation-color-primary-300))" : "radial-gradient(1200px 600px at 80% -100px, var(--pc-foundation-color-primary-bg), transparent), radial-gradient(800px 400px at 0% 0%, var(--pc-foundation-color-primary-bg-2), transparent), linear-gradient(180deg, var(--pc-foundation-color-primary-100) 0%, var(--pc-foundation-color-primary-50) 100%)";
    case "resources":
      return "radial-gradient(1200px 600px at 80% -100px, var(--pc-foundation-color-primary-bg), transparent), radial-gradient(800px 400px at 0% 0%, var(--pc-foundation-color-primary-bg-2), transparent), linear-gradient(180deg, var(--pc-foundation-color-primary-100) 0%, var(--pc-foundation-color-primary-50) 100%)";
    case "website-admin":
      return "radial-gradient(1200px 600px at 80% -100px, var(--pc-foundation-color-primary-bg), transparent), linear-gradient(180deg, var(--pc-foundation-color-primary-100) 0%, var(--pc-foundation-color-primary-50) 100%)";
    default:
      return "none";
  }
}

function createProps(theme, pathname) {
  return {
    backgroundImage: createBackgroundImage(theme, pathname),
    borderWidth: "0px",
    flexDirection: "column",
    flexWrap: "wrap",
    minHeight: "100vh",
    padding: "0px",
    width: "100%",
  };
}
