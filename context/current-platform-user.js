// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext } from "react";

const CurrentPlatformUserContext = createContext(null);

export const CurrentPlatformUserProvider = ({ children }) => {
  const { data: session, status, update } = useSession();

  const updateCurrentPlatformUser = async (data) => {
    if (data?.platformUser) {
      await update({
        platformUser: data.platformUser,
      });
    }
  };

  const platformUser = session?.platformUser ?? null;

  const value = {
    platformUser,
    updateCurrentPlatformUser,
    isAuthenticated: status === "authenticated",
  };

  return <CurrentPlatformUserContext.Provider value={value}>{children}</CurrentPlatformUserContext.Provider>;
};

export function useCurrentPlatformUser() {
  return useContext(CurrentPlatformUserContext);
}
