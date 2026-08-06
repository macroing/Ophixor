// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { createContext, useCallback, useContext, useState } from "react";

import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "./current-platform-user";
import { useWebsite } from "./website";

const WebsiteUserContext = createContext(null);

export function WebsiteUserProvider(props) {
  const children = props.children;
  const initialWebsiteUser = props.websiteUser;
  const initialWebsiteUserId = props.websiteUserId;

  const { platformUser } = useCurrentPlatformUser();

  const { website } = useWebsite();

  const [isLoading, setIsLoading] = useState(initialWebsiteUser ? false : true);
  const [websiteUser, setWebsiteUser] = useState(initialWebsiteUser || null);
  const [websiteUserId, setWebsiteUserId] = useState(initialWebsiteUserId || null);

  const refreshWebsiteUser = useCallback(async () => {
    if (!platformUser || !website || !websiteUserId) {
      return;
    }

    const permissions = getPermissions(platformUser, website);

    const canRead = can(permissions, "user", "read");

    if (!canRead) {
      return;
    }

    try {
      setIsLoading(true);

      const { data } = await axios.get("/api/website-user/" + websiteUserId);

      if (data.websiteUser) {
        setWebsiteUser(data.websiteUser);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [platformUser, website, websiteUserId]);

  const saveWebsiteUser = useCallback(
    async (updates) => {
      if (!platformUser || !website || !websiteUser) {
        return false;
      }

      const permissions = getPermissions(platformUser, website);

      const canRead = can(permissions, "user", "read");
      const canUpdate = can(permissions, "user", "update");

      if (!canRead && !canUpdate) {
        return false;
      }

      try {
        const { data } = await axios.put("/api/website-user/" + websiteUser._id.toString(), { ...updates });

        if (data.websiteUser) {
          setWebsiteUser(data.websiteUser);
        }

        return { error: false, message: data.message, websiteUser: data.websiteUser };
      } catch (error) {
        return { error: true, message: error?.response?.data?.message, websiteUser: null };
      }
    },
    [platformUser, website, websiteUser],
  );

  const updateWebsiteUser = useCallback((updates) => {
    setWebsiteUser((previousWebsiteUser) => {
      if (!previousWebsiteUser) {
        return previousWebsiteUser;
      }

      return { ...previousWebsiteUser, ...updates };
    });
  }, []);

  return (
    <WebsiteUserContext.Provider
      value={{
        isLoading,
        refreshWebsiteUser,
        saveWebsiteUser,
        setWebsiteUser,
        updateWebsiteUser,
        websiteUser,
      }}
    >
      {children}
    </WebsiteUserContext.Provider>
  );
}

export function useWebsiteUser() {
  const context = useContext(WebsiteUserContext);

  if (!context) {
    throw new Error("useWebsiteUser must be used inside WebsiteUserProvider");
  }

  return context;
}
