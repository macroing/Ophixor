// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { faChevronCircleLeft, faExchange, faGauge, faGlobe, faServer, faUsers } from "@fortawesome/pro-solid-svg-icons";

import Icon from "@/lib/web-page-builder/components/editor/Icon";
import SideBar from "@/lib/web-page-builder/components/side-bar/SideBar";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-admin.json" with { type: "json" };

import importedStyles from "./NavigationSideBar.module.css";

export default function NavigationSideBar(props) {
  const styles = props.styles || importedStyles;

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

  const items = createItems(page, language, styles);

  return <SideBar items={items} />;
}

function Item(props) {
  const icon = props.icon;
  const isActive = props.isActive;
  const styles = props.styles || importedStyles;
  const text = props.text;

  return (
    <div className={styles.item + (isActive ? " " + styles.item_active : "")}>
      <Icon icon={icon} size={16} /> {text}
    </div>
  );
}

function createItems(page, language, styles) {
  return [
    {
      href: "/",
      isActive: false,
      label: <Item icon={faChevronCircleLeft} isActive={false} styles={styles} text={platform.admin.navigation.backHome[language]} />,
    },
    {
      isSeparator: true,
    },
    {
      href: "/admin",
      isActive: page === "overview",
      label: <Item icon={faGauge} isActive={page === "overview"} styles={styles} text={platform.admin.navigation.overview[language]} />,
    },
    {
      href: "/admin/platform",
      isActive: page === "platform",
      label: <Item icon={faServer} isActive={page === "platform"} styles={styles} text={platform.admin.navigation.platform[language]} />,
    },
    {
      href: "/admin/users",
      isActive: page === "users",
      label: <Item icon={faUsers} isActive={page === "users"} styles={styles} text={platform.admin.navigation.users[language]} />,
    },
    {
      href: "/admin/websites",
      isActive: page === "websites",
      label: <Item icon={faGlobe} isActive={page === "websites"} styles={styles} text={platform.admin.navigation.websites[language]} />,
    },
    {
      href: "/admin/convert",
      isActive: page === "convert",
      label: <Item icon={faExchange} isActive={page === "convert"} styles={styles} text={platform.admin.navigation.convert[language]} />,
    },
  ];
}
