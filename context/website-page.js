// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "./current-platform-user";
import { useWebsite } from "./website";

const WebsitePageContext = createContext(null);

export function WebsitePageProvider(props) {
  const children = props.children;
  const initialWebsitePage = props.websitePage;
  const initialPath = props.path;
  const initialModels = props.models;
  const initialPageData = props.pageData;
  const isSwitchingPage = props.isSwitchingPage;

  const currentPlatformUser = useCurrentPlatformUser();

  const platformUser = currentPlatformUser?.platformUser;

  const pathname = usePathname();

  const pathnameDecoded = useMemo(() => decodeURI(pathname), [pathname]);

  const { website } = useWebsite();

  const [isLoading, setIsLoading] = useState(initialWebsitePage ? false : true);
  const [models, setModels] = useState(initialModels || {});
  const [pageData, setPageData] = useState(initialPageData || {});
  const [path, setPath] = useState(initialPath || null);
  const [websitePage, setWebsitePage] = useState(initialWebsitePage || null);

  const refreshWebsitePage = useCallback(async () => {
    if (!path || !website) {
      return;
    }

    try {
      setIsLoading(true);

      const { data } = await axios.get("/api/website-page?path=" + encodeURIComponent(path) + "&websiteId=" + website._id.toString());

      if (data.websitePages?.length > 0) {
        setWebsitePage(data.websitePages[0]);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [path, setIsLoading, setWebsitePage, website]);

  const saveWebsitePage = useCallback(
    async (updates) => {
      if (!platformUser || !website || !websitePage) {
        return false;
      }

      const permissions = getPermissions(platformUser, website);

      const canRead = can(permissions, "page", "read");
      const canUpdate = can(permissions, "page", "update");

      if (!canRead && !canUpdate) {
        return false;
      }

      try {
        const { data } = await axios.put("/api/website-page/" + websitePage._id.toString(), { ...updates, updateNumber: websitePage.updateNumber === null || websitePage.updateNumber === undefined ? 0 : websitePage.updateNumber });

        if (data.websitePage) {
          setWebsitePage(data.websitePage);
        }

        return { error: false, message: data.message, websitePage: data.websitePage };
      } catch (error) {
        return { error: true, message: error?.response?.data?.message, websitePage: null };
      }
    },
    [platformUser, setWebsitePage, website, websitePage],
  );

  const updateWebsitePage = useCallback(
    (updates) => {
      setWebsitePage((previousWebsitePage) => {
        if (!previousWebsitePage) {
          return previousWebsitePage;
        }

        return { ...previousWebsitePage, ...updates };
      });
    },
    [setWebsitePage],
  );

  useEffect(() => {
    if (!isSwitchingPage) {
      return;
    }

    let newPath = "/";

    if (typeof pathnameDecoded === "string" && pathnameDecoded.startsWith("/website/" + website.code)) {
      newPath = pathnameDecoded.substring(("/website/" + website.code).length);

      if (newPath === "") {
        newPath = "/";
      }
    }

    if (newPath !== path) {
      async function refreshWebsitePageImmediately(newPath) {
        try {
          setIsLoading(true);

          const { data } = await axios.get("/api/website-page?path=" + encodeURIComponent(newPath) + "&websiteId=" + website._id.toString());

          if (data.websitePages?.length > 0) {
            setWebsitePage(data.websitePages[0]);
          } else {
            setWebsitePage(null);
          }

          setPath(newPath);
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      }

      refreshWebsitePageImmediately(newPath);
    }
  }, [isSwitchingPage, path, pathnameDecoded, setIsLoading, setPath, setWebsitePage, website?.code]);

  return (
    <WebsitePageContext.Provider
      value={{
        isLoading,
        models,
        pageData,
        refreshWebsitePage,
        saveWebsitePage,
        setModels,
        setPageData,
        setWebsitePage,
        updateWebsitePage,
        websitePage,
      }}
    >
      {children}
    </WebsitePageContext.Provider>
  );
}

export function useWebsitePage() {
  const context = useContext(WebsitePageContext);

  if (!context) {
    return {
      isLoading: false,
      models: {},
      pageData: {},
      refreshWebsitePage: async () => {},
      saveWebsitePage: async (updates) => {},
      setModels: (models) => {},
      setPageData: (pageData) => {},
      setWebsitePage: (websitePage) => {},
      updateWebsitePage: (updates) => {},
      websitePage: null,
    };
  }

  return context;
}
