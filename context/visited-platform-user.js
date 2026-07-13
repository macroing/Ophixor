// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { createContext, useCallback, useContext, useState } from "react";

const VisitedPlatformUserContext = createContext(null);

export function VisitedPlatformUserProvider(props) {
  const children = props.children;
  const initialVisitedPlatformUser = props.visitedPlatformUser;
  const initialVisitedPlatformUserId = props.visitedPlatformUserId;

  const [isLoading, setIsLoading] = useState(initialVisitedPlatformUser ? false : true);
  const [visitedPlatformUser, setVisitedPlatformUser] = useState(initialVisitedPlatformUser || null);
  const [visitedPlatformUserId, setVisitedPlatformUserId] = useState(initialVisitedPlatformUserId || null);

  const refreshVisitedPlatformUser = useCallback(async () => {
    if (!visitedPlatformUser || !visitedPlatformUserId) {
      return;
    }

    try {
      setIsLoading(true);

      const { data } = await axios.get("/api/platform-user/" + visitedPlatformUserId);

      if (data.platformUser) {
        setVisitedPlatformUser(data.platformUser);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [visitedPlatformUserId]);

  const saveVisitedPlatformUser = useCallback(
    async (updates) => {
      if (!visitedPlatformUser) {
        return false;
      }

      try {
        const { data } = await axios.put("/api/platform-user/" + visitedPlatformUser._id.toString(), { ...updates });

        if (data.platformUser) {
          setVisitedPlatformUser(data.platformUser);
        }

        return { error: false, message: data.message, visitedPlatformUser: data.platformUser };
      } catch (error) {
        return { error: true, message: error?.response?.data?.message, visitedPlatformUser: null };
      }
    },
    [visitedPlatformUser],
  );

  const updateVisitedPlatformUser = useCallback((updates) => {
    setVisitedPlatformUser((previousVisitedPlatformUser) => {
      if (!previousVisitedPlatformUser) {
        return previousVisitedPlatformUser;
      }

      return { ...previousVisitedPlatformUser, ...updates };
    });
  }, []);

  return (
    <VisitedPlatformUserContext.Provider
      value={{
        isLoading,
        refreshVisitedPlatformUser,
        saveVisitedPlatformUser,
        setVisitedPlatformUser,
        updateVisitedPlatformUser,
        visitedPlatformUser,
      }}
    >
      {children}
    </VisitedPlatformUserContext.Provider>
  );
}

export function useVisitedPlatformUser() {
  const context = useContext(VisitedPlatformUserContext);

  if (!context) {
    throw new Error("useVisitedPlatformUser must be used inside VisitedPlatformUserProvider");
  }

  return context;
}
