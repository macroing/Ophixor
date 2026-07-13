// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { createContext, useCallback, useContext, useState } from "react";

import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "./current-platform-user";
import { useWebsite } from "./website";

const WebsiteModelContext = createContext(null);

export function WebsiteModelProvider(props) {
  const children = props.children;
  const initialWebsiteModel = props.websiteModel;
  const initialWebsiteModelId = props.websiteModelId;

  const { platformUser } = useCurrentPlatformUser();

  const { website } = useWebsite();

  const [isLoading, setIsLoading] = useState(initialWebsiteModel ? false : true);
  const [websiteModel, setWebsiteModel] = useState(initialWebsiteModel || null);
  const [websiteModelId, setWebsiteModelId] = useState(initialWebsiteModelId || null);

  const refreshWebsiteModel = useCallback(async () => {
    if (!platformUser || !website || !websiteModelId) {
      return;
    }

    const permissions = getPermissions(platformUser, website);

    const canRead = can(permissions, "model", "read");

    if (!canRead) {
      return;
    }

    try {
      setIsLoading(true);

      const { data } = await axios.get("/api/website-model/" + websiteModelId);

      if (data.websiteModel) {
        setWebsiteModel(data.websiteModel);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [platformUser, website, websiteModelId]);

  const saveWebsiteModel = useCallback(
    async (updates) => {
      if (!platformUser || !website || !websiteModel) {
        return false;
      }

      const permissions = getPermissions(platformUser, website);

      const canRead = can(permissions, "model", "read");
      const canUpdate = can(permissions, "model", "update");

      if (!canRead && !canUpdate) {
        return false;
      }

      try {
        const { data } = await axios.put("/api/website-model/" + websiteModel._id.toString(), { ...updates });

        if (data.websiteModel) {
          setWebsiteModel(data.websiteModel);
        }

        return { error: false, message: data.message, websiteModel: data.websiteModel };
      } catch (error) {
        return { error: true, message: error?.response?.data?.message, websiteModel: null };
      }
    },
    [platformUser, website, websiteModel],
  );

  const updateWebsiteModel = useCallback((updates) => {
    setWebsiteModel((previousWebsiteModel) => {
      if (!previousWebsiteModel) {
        return previousWebsiteModel;
      }

      return { ...previousWebsiteModel, ...updates };
    });
  }, []);

  return (
    <WebsiteModelContext.Provider
      value={{
        isLoading,
        refreshWebsiteModel,
        saveWebsiteModel,
        setWebsiteModel,
        updateWebsiteModel,
        websiteModel,
      }}
    >
      {children}
    </WebsiteModelContext.Provider>
  );
}

export function useWebsiteModel() {
  const context = useContext(WebsiteModelContext);

  if (!context) {
    throw new Error("useWebsiteModel must be used inside WebsiteModelProvider");
  }

  return context;
}
