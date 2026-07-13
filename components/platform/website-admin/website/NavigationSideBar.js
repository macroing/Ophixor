// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import SideBar from "@/lib/web-page-builder/components/side-bar/SideBar";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useWebsite } from "@/context/website";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function NavigationSideBar(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const pathname = usePathname();

  const pathnameDecoded = useMemo(() => decodeURI(pathname), [pathname]);

  const { isCustomDomain, website } = useWebsite();

  const prefix = isCustomDomain ? "/admin" : "/website-admin/" + website.code;

  const isInAnalytics = pathnameDecoded.startsWith(prefix + "/analytics");
  const isInCollaborators = pathnameDecoded.startsWith(prefix + "/collaborators");
  const isInIntegrations = pathnameDecoded.startsWith(prefix + "/integrations");
  const isInMedia = pathnameDecoded.startsWith(prefix + "/media");
  const isInModels = pathnameDecoded.startsWith(prefix + "/models");
  const isInPages = pathnameDecoded.startsWith(prefix + "/pages");
  const isInSettings = pathnameDecoded.startsWith(prefix + "/settings");
  const isInTemplates = pathnameDecoded.startsWith(prefix + "/templates");

  let page = "overview";

  if (isInAnalytics) {
    page = "analytics";
  } else if (isInCollaborators) {
    page = "collaborators";
  } else if (isInIntegrations) {
    page = "integrations";
  } else if (isInMedia) {
    page = "media";
  } else if (isInModels) {
    page = "models";
  } else if (isInPages) {
    page = "pages";
  } else if (isInSettings) {
    page = "settings";
  } else if (isInTemplates) {
    page = "templates";
  }

  const items = useMemo(() => createItems(isCustomDomain, language, platformUser, page, website), [isCustomDomain, language, page, pathname, platformUser, website]);

  return <SideBar backdropFilter="blur(20px)" backgroundColor="rgba(255, 255, 255, 0.6)" borderColor="rgba(15, 23, 42, 0.06)" items={items} />;
}

function createItems(isCustomDomain, language, platformUser, page, website) {
  const prefix = isCustomDomain ? "/admin" : "/website-admin/" + website.code;

  const permissions = getPermissions(platformUser, website);

  const canDeleteWebsite = can(permissions, "website", "delete");
  const canReadComponentTemplate = can(permissions, "componentTemplate", "read");
  const canReadIntegration = can(permissions, "integration", "read");
  const canReadPage = can(permissions, "page", "read");
  const canReadMedia = can(permissions, "media", "read");
  const canReadModel = can(permissions, "model", "read");
  const canUpdateAccessibility = can(permissions, "website", "updateAccessibility");
  const canUpdateAnalytics = can(permissions, "website", "updateAnalytics");
  const canUpdateCollaborators = can(permissions, "website", "updateCollaborators");
  const canUpdateInformation = can(permissions, "website", "updateInformation");
  const canUpdateTheme = can(permissions, "website", "updateTheme");

  const items = [];

  if (!isCustomDomain) {
    items.push({
      href: "/website-admin/",
      isActive: false,
      label: platform.websiteAdmin.backToWebsites[language],
    });

    items.push({
      isSeparator: true,
    });
  }

  items.push({
    href: prefix,
    isActive: page === "overview",
    label: platform.websiteAdmin.navigation.overview[language],
  });

  if (canReadPage) {
    items.push({
      href: prefix + "/pages",
      isActive: page === "pages",
      label: platform.websiteAdmin.navigation.pages[language],
    });
  }

  if (canReadMedia) {
    items.push({
      href: prefix + "/media",
      isActive: page === "media",
      label: platform.websiteAdmin.navigation.media[language],
    });
  }

  if (canReadComponentTemplate) {
    items.push({
      href: prefix + "/templates",
      isActive: page === "templates",
      label: platform.websiteAdmin.navigation.templates[language],
    });
  }

  if (canReadModel) {
    items.push({
      href: prefix + "/models",
      isActive: page === "models",
      label: platform.websiteAdmin.navigation.models[language],
    });
  }

  if (canReadIntegration) {
    items.push({
      href: prefix + "/integrations",
      isActive: page === "integrations",
      label: platform.websiteAdmin.navigation.integrations[language],
    });
  }

  if (canUpdateCollaborators) {
    items.push({
      href: prefix + "/collaborators",
      isActive: page === "collaborators",
      label: platform.websiteAdmin.navigation.collaborators[language],
    });
  }

  /*
  if (canUpdateAnalytics) {
    items.push({
      href: prefix + "/analytics",
      isActive: page === "analytics",
      label: platform.websiteAdmin.navigation.analytics[language],
    });
  }
  */

  if (canDeleteWebsite || canUpdateAccessibility || canUpdateInformation || canUpdateTheme) {
    items.push({
      href: prefix + "/settings",
      isActive: page === "settings",
      label: platform.websiteAdmin.navigation.settings[language],
    });
  }

  return items;
}
