// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const ConsentContext = createContext(null);

const STORAGE_KEY = "pc-cookie-consent";

export function ConsentProvider({ children }) {
  const [consent, setConsent] = useState({ loading: true });
  const [isVisible, setIsVisible] = useState(false);

  const hasConsent = useCallback(
    (type) => {
      if (!type) {
        return true;
      }

      return !!consent[type];
    },
    [consent],
  );

  const grant = useCallback(
    (type) => {
      if (!type) {
        return;
      }

      setConsent((prev) => ({
        functional: prev.functional ?? true,
        analytics: prev.analytics ?? false,
        marketing: prev.marketing ?? false,
        [type]: true,
      }));
    },
    [setConsent],
  );

  const revoke = useCallback(
    (type) => {
      if (!type) {
        return;
      }

      setConsent((prev) => ({
        functional: prev.functional ?? true,
        analytics: prev.analytics ?? false,
        marketing: prev.marketing ?? false,
        [type]: false,
      }));
    },
    [setConsent],
  );

  const grantAll = useCallback(() => {
    setConsent({
      functional: true,
      analytics: true,
      marketing: true,
    });
  }, [setConsent]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        setConsent(JSON.parse(stored));
      } else {
        setConsent({});
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (consent && typeof consent === "object" && !Array.isArray(consent)) {
        if (typeof consent.loading === "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
        }
      }
    } catch (error) {}
  }, [consent]);

  const value = useMemo(
    () => ({
      consent,
      grant,
      grantAll,
      hasConsent,
      isVisible,
      revoke,
      setIsVisible,
    }),
    [consent, grant, grantAll, hasConsent, isVisible, revoke, setIsVisible],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}
