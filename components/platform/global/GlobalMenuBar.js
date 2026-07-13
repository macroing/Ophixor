// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

import Avatar from "../common/Avatar";
import MenuBar from "@/lib/web-page-builder/components/menu-bar/MenuBar";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform.json" with { type: "json" };

export default function GlobalMenuBar(props) {
  const isCustomDomain = props.isCustomDomain || false;

  const defaultUrl = isCustomDomain ? process.env.NEXT_PUBLIC_PLATFORM_URL : "/";

  const { language } = useLanguage();

  const pathname = usePathname();

  const pathnameDecoded = useMemo(() => decodeURI(pathname), [pathname]);

  const [isInWebsiteAdmin, setIsInWebsiteAdmin] = useState(props.isInWebsiteAdmin || false);
  const [isInWebsiteAdminNew, setIsInWebsiteAdminNew] = useState(props.isInWebsiteAdminNew || false);
  const [isInWebsiteAdminWebsite, setIsInWebsiteAdminWebsite] = useState(props.isInWebsiteAdminWebsite || false);

  const currentPlatformUser = useCurrentPlatformUser();

  const platformUser = currentPlatformUser?.platformUser;

  const isDark = pathnameDecoded === "/";

  const items = useMemo(() => createItems(isCustomDomain, isDark, isInWebsiteAdmin, isInWebsiteAdminNew, isInWebsiteAdminWebsite, language, platformUser), [isCustomDomain, isDark, isInWebsiteAdmin, isInWebsiteAdminNew, isInWebsiteAdminWebsite, language, pathname, platformUser]);

  useEffect(() => {
    const isInWebsiteAdmin = isCustomDomain ? pathnameDecoded === "/admin" || pathnameDecoded.startsWith("/admin") : pathnameDecoded === "/website-admin" || pathnameDecoded.startsWith("/website-admin/");
    const isInWebsiteAdminNew = isCustomDomain ? false : pathnameDecoded === "/website-admin-new" || pathnameDecoded.startsWith("/website-admin-new/");
    const isInWebsiteAdminWebsite = isCustomDomain ? /^\/admin\/.+$/.test(pathnameDecoded) : /^\/website-admin\/.+$/.test(pathnameDecoded);

    setIsInWebsiteAdmin(isInWebsiteAdmin);
    setIsInWebsiteAdminNew(isInWebsiteAdminNew);
    setIsInWebsiteAdminWebsite(isInWebsiteAdminWebsite);
  }, [isCustomDomain, pathnameDecoded]);

  if (isDark) {
    return <MenuBar backdropFilter="blur(20px)" backgroundColor="rgba(17, 24, 39, 0.8)" backgroundColorItemPrimary="#2563eb" backgroundColorItemPrimaryHover="#2563eb" backgroundColorLineHover="transparent" backgroundColorMobileMenu="rgba(17, 24, 39, 0.8)" backgroundColorSubMenu="rgba(17, 24, 39, 1)" backgroundColorSubMenuItemHover="#2563eb" backgroundColorSubMenuItemPrimary="#2563eb" backgroundColorSubMenuItemPrimaryHover="#2563eb" borderColor="rgba(45, 55, 72, 0.8)" color="#e5e7eb" colorHover="#f1f5f9" colorIconLetter="#e5e7eb" colorItem="#e5e7eb" colorItemHover="#f1f5f9" colorItemPrimary="#e5e7eb" colorItemPrimaryHover="#f1f5f9" colorSubMenuItem="#e5e7eb" colorSubMenuItemHover="#f1f5f9" colorSubMenuItemPrimary="#e5e7eb" colorSubMenuItemPrimaryHover="#f1f5f9" defaultUrl={defaultUrl} iconImageAlt={platform.name} iconImageSrc="/images/logo.webp" items={items} position="fixed" title={platform.name} top="0px" />;
  }

  return <MenuBar backdropFilter="blur(20px)" backgroundColor="var(--pc-semantic-surface-overlay-2)" backgroundColorIconLetter="var(--pc-semantic-status-primary)" backgroundColorLineHover="var(--pc-semantic-interactive-primary)" borderColor="rgba(15, 23, 42, 0.06)" color="var(--pc-foundation-color-slate-800)" colorHover="var(--pc-semantic-text-primary)" colorItem="var(--pc-foundation-color-slate-800)" colorItemHover="var(--pc-semantic-text-primary)" defaultUrl={defaultUrl} iconImageAlt={platform.name} iconImageSrc="/images/logo.webp" items={items} position="fixed" title={platform.name} top="0px" />;
}

function createItems(isCustomDomain, isDark, isInWebsiteAdmin, isInWebsiteAdminNew, isInWebsiteAdminWebsite, language, platformUser) {
  const items = [];

  if (!isInWebsiteAdmin && !isCustomDomain) {
    items.push({ href: "/features", label: platform.menuBar.features[language], type: "link" });
    //items.push({ href: "/pricing", label: platform.menuBar.pricing[language], type: "link" });
    items.push({ href: "/docs", label: platform.menuBar.documentation[language], type: "link" });
  }

  if (platformUser) {
    if (isInWebsiteAdmin) {
      if (!isInWebsiteAdminNew && !isInWebsiteAdminWebsite && !isCustomDomain) {
        items.push({ href: "/website-admin-new", label: platform.menuBar.newWebsite[language], theme: "primary", type: "link" });
      }
    } else if (!isCustomDomain) {
      items.push({ href: "/website-admin", label: platform.menuBar.websites[language], theme: "primary", type: "link" });
    }

    const platformUserItems = [];

    if (platformUser.isPlatformAdmin && !isCustomDomain) {
      platformUserItems.push({
        href: "/admin",
        label: platform.menuBar.admin[language],
        type: "link",
      });

      platformUserItems.push({
        type: "divider",
      });
    }

    if (!isCustomDomain) {
      platformUserItems.push({
        href: "/account",
        label: platform.menuBar.account[language],
        type: "link",
      });

      platformUserItems.push({
        type: "divider",
      });
    }

    platformUserItems.push({
      label: platform.menuBar.signOut[language],
      onClick: (e) => signOut({ callbackUrl: "/" }),
      type: "button",
    });

    if (platformUserItems.length > 0) {
      items.push({
        items: platformUserItems,
        label: <Avatar email={platformUser.email} isDark={isDark} />,
      });
    }
  } else if (!isCustomDomain) {
    items.push({ href: "/sign-in", label: platform.menuBar.signIn[language], type: "link" });
  }

  return items;
}
