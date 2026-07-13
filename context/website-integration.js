// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { createContext, useCallback, useContext, useState } from "react";

import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "./current-platform-user";
import { useWebsite } from "./website";

const WebsiteIntegrationContext = createContext(null);

export function WebsiteIntegrationProvider(props) {
  const children = props.children;
  const initialWebsiteIntegration = props.websiteIntegration;
  const initialWebsiteIntegrationId = props.websiteIntegrationId;

  const { platformUser } = useCurrentPlatformUser();

  const { website } = useWebsite();

  const [isLoading, setIsLoading] = useState(initialWebsiteIntegration ? false : true);
  const [websiteIntegration, setWebsiteIntegration] = useState(initialWebsiteIntegration || null);
  const [websiteIntegrationId, setWebsiteIntegrationId] = useState(initialWebsiteIntegrationId || null);

  const refreshWebsiteIntegration = useCallback(async () => {
    if (!platformUser || !website || !websiteIntegrationId) {
      return;
    }

    const permissions = getPermissions(platformUser, website);

    const canRead = can(permissions, "integration", "read");

    if (!canRead) {
      return;
    }

    try {
      setIsLoading(true);

      const { data } = await axios.get("/api/website-integration/" + websiteIntegrationId);

      if (data.websiteIntegration) {
        setWebsiteIntegration(data.websiteIntegration);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [platformUser, website, websiteIntegrationId]);

  const saveWebsiteIntegration = useCallback(
    async (updates) => {
      if (!platformUser || !website || !websiteIntegration) {
        return false;
      }

      const permissions = getPermissions(platformUser, website);

      const canRead = can(permissions, "integration", "read");
      const canUpdate = can(permissions, "integration", "update");

      if (!canRead && !canUpdate) {
        return false;
      }

      try {
        const { data } = await axios.put("/api/website-integration/" + websiteModel._id.toString(), { ...updates });

        if (data.websiteIntegration) {
          setWebsiteIntegration(data.websiteIntegration);
        }

        return { error: false, message: data.message, websiteIntegration: data.websiteIntegration };
      } catch (error) {
        return { error: true, message: error?.response?.data?.message, websiteIntegration: null };
      }
    },
    [platformUser, website, websiteIntegration],
  );

  const updateWebsiteIntegration = useCallback((updates) => {
    setWebsiteIntegration((previousWebsiteIntegration) => {
      if (!previousWebsiteIntegration) {
        return previousWebsiteIntegration;
      }

      return { ...previousWebsiteIntegration, ...updates };
    });
  }, []);

  return (
    <WebsiteIntegrationContext.Provider
      value={{
        isLoading,
        refreshWebsiteIntegration,
        saveWebsiteIntegration,
        setWebsiteIntegration,
        updateWebsiteIntegration,
        websiteIntegration,
      }}
    >
      {children}
    </WebsiteIntegrationContext.Provider>
  );
}

export function useWebsiteIntegration() {
  const context = useContext(WebsiteIntegrationContext);

  if (!context) {
    throw new Error("useWebsiteIntegration must be used inside WebsiteIntegrationProvider");
  }

  return context;
}
