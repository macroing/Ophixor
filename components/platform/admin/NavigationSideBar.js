// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import SideBar from "@/lib/web-page-builder/components/side-bar/SideBar";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-admin.json" with { type: "json" };

export default function NavigationSideBar(props) {
  const { language } = useLanguage();

  const pathname = usePathname();

  const pathnameDecoded = useMemo(() => decodeURI(pathname), [pathname]);

  const isInConvert = pathnameDecoded.startsWith("/admin/convert");
  const isInPlatform = pathnameDecoded.startsWith("/admin/platform");
  const isInUsers = pathnameDecoded.startsWith("/admin/users");
  const isInWebsites = pathnameDecoded.startsWith("/admin/websites");

  let page = "overview";

  if (isInConvert) {
    page = "convert";
  } else if (isInPlatform) {
    page = "platform";
  } else if (isInUsers) {
    page = "users";
  } else if (isInWebsites) {
    page = "websites";
  }

  const items = createItems(page, language);

  return <SideBar items={items} />;
}

function createItems(page, language) {
  return [
    {
      href: "/",
      isActive: false,
      label: platform.admin.navigation.backHome[language],
    },
    {
      isSeparator: true,
    },
    {
      href: "/admin",
      isActive: page === "overview",
      label: platform.admin.navigation.overview[language],
    },
    {
      href: "/admin/platform",
      isActive: page === "platform",
      label: platform.admin.navigation.platform[language],
    },
    {
      href: "/admin/users",
      isActive: page === "users",
      label: platform.admin.navigation.users[language],
    },
    {
      href: "/admin/websites",
      isActive: page === "websites",
      label: platform.admin.navigation.websites[language],
    },
    {
      href: "/admin/convert",
      isActive: page === "convert",
      label: platform.admin.navigation.convert[language],
    },
  ];
}
