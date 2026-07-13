// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { createContext, useCallback, useContext, useState } from "react";

import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "./current-platform-user";
import { useWebsite } from "./website";

const WebsiteModelDataContext = createContext(null);

export function WebsiteModelDataProvider(props) {
  const children = props.children;
  const initialWebsiteModelData = props.websiteModelData;
  const initialWebsiteModelDataId = props.websiteModelDataId;

  const { platformUser } = useCurrentPlatformUser();

  const { website } = useWebsite();

  const [isLoading, setIsLoading] = useState(initialWebsiteModelData ? false : true);
  const [websiteModelData, setWebsiteModelData] = useState(initialWebsiteModelData || null);
  const [websiteModelDataId, setWebsiteModelDataId] = useState(initialWebsiteModelDataId || null);

  const refreshWebsiteModelData = useCallback(async () => {
    if (!platformUser || !website || !websiteModelDataId) {
      return;
    }

    const permissions = getPermissions(platformUser, website);

    const canRead = can(permissions, "modelData", "read");

    if (!canRead) {
      return;
    }

    try {
      setIsLoading(true);

      const { data } = await axios.get("/api/website-model-data/" + websiteModelDataId);

      if (data.websiteModelData) {
        setWebsiteModelData(data.websiteModelData);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [platformUser, website, websiteModelDataId]);

  const saveWebsiteModelData = useCallback(
    async (updates) => {
      if (!platformUser || !website || !websiteModelData) {
        return false;
      }

      const permissions = getPermissions(platformUser, website);

      const canRead = can(permissions, "modelData", "read");
      const canUpdate = can(permissions, "modelData", "update");

      if (!canRead && !canUpdate) {
        return false;
      }

      try {
        const { data } = await axios.put("/api/website-model-data/" + websiteModelData._id.toString(), { ...updates });

        if (data.websiteModelData) {
          setWebsiteModelData(data.websiteModelData);
        }

        return { error: false, message: data.message, websiteModelData: data.websiteModelData };
      } catch (error) {
        return { error: true, message: error?.response?.data?.message, websiteModelData: null };
      }
    },
    [platformUser, website, websiteModelData],
  );

  const updateWebsiteModelData = useCallback((updates) => {
    setWebsiteModelData((previousWebsiteModelData) => {
      if (!previousWebsiteModelData) {
        return previousWebsiteModelData;
      }

      return { ...previousWebsiteModelData, ...updates };
    });
  }, []);

  return (
    <WebsiteModelDataContext.Provider
      value={{
        isLoading,
        refreshWebsiteModelData,
        saveWebsiteModelData,
        setWebsiteModelData,
        updateWebsiteModelData,
        websiteModelData,
      }}
    >
      {children}
    </WebsiteModelDataContext.Provider>
  );
}

export function useWebsiteModelData() {
  const context = useContext(WebsiteModelDataContext);

  if (!context) {
    throw new Error("useWebsiteModelData must be used inside WebsiteModelDataProvider");
  }

  return context;
}
