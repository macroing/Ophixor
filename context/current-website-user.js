// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CurrentWebsiteUserContext = createContext(null);

export function CurrentWebsiteUserProvider(props) {
  const children = props.children;
  const websiteCode = props.websiteCode;

  const [websiteUser, setWebsiteUser] = useState(props.websiteUser || null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCurrentWebsiteUser = useCallback(async () => {
    try {
      const response = await fetch("/api/website-auth/session", {
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setWebsiteUser(data.websiteUser ?? null);
      } else {
        setWebsiteUser(null);
      }
    } catch {
      setWebsiteUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!props.websiteUser) {
      refreshCurrentWebsiteUser();
    }
  }, [props.websiteUser, refreshCurrentWebsiteUser]);

  const updateCurrentWebsiteUser = useCallback((data) => {
    if (data?.websiteUser) {
      setWebsiteUser(data.websiteUser);
    } else {
      setWebsiteUser(null);
    }
  }, []);

  const signIn = useCallback(
    async (credentials) => {
      try {
        const response = await fetch("/api/website-auth/sign-in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(credentials && typeof credentials === "object" && !Array.isArray(credentials) ? { ...credentials, websiteCode } : {}),
        });

        const data = await response.json();

        if (response.ok) {
          setWebsiteUser(data.websiteUser ?? null);
        }

        return { message: data.message ?? "", websiteUser: data.websiteUser ?? null };
      } catch (error) {
        return { message: "An unexpected error has occurred!", websiteUser: null };
      }
    },
    [websiteCode],
  );

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/website-auth/sign-out", {
        method: "POST",
        credentials: "include",
      });

      setWebsiteUser(null);
    } catch (error) {}
  }, []);

  const signUp = useCallback(async (credentials) => {
    try {
      const response = await fetch("/api/website-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials && typeof credentials === "object" && !Array.isArray(credentials) ? { ...credentials, websiteCode } : {}),
      });

      const data = await response.json();

      if (response.ok) {
        setWebsiteUser(data.websiteUser ?? null);
      }

      return { message: data.message ?? "", websiteUser: data.websiteUser ?? null };
    } catch (error) {
      return { message: "An unexpected error has occurred!", websiteUser: null };
    }
  }, []);

  const value = useMemo(
    () => ({
      websiteUser,
      isAuthenticated: !!websiteUser,
      isLoading,
      signIn,
      signOut,
      signUp,
      refreshCurrentWebsiteUser,
      updateCurrentWebsiteUser,
    }),
    [isLoading, refreshCurrentWebsiteUser, signIn, signOut, signUp, updateCurrentWebsiteUser, websiteUser],
  );

  return <CurrentWebsiteUserContext.Provider value={value}>{children}</CurrentWebsiteUserContext.Provider>;
}

export function useCurrentWebsiteUser() {
  return useContext(CurrentWebsiteUserContext);
}
