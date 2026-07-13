// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { useLanguage } from "./language";

const WebsiteContext = createContext(null);

export function WebsiteProvider(props) {
  const children = props.children;
  const code = props.code;
  const initialWebsite = props.website;
  const isCustomDomain = props.isCustomDomain || false;

  const { initialLanguage, setLanguage } = useLanguage();

  const [isLoading, setIsLoading] = useState(initialWebsite ? false : true);
  const [website, setWebsite] = useState(initialWebsite || null);

  const refreshWebsite = useCallback(async () => {
    if (!code) {
      return;
    }

    try {
      setIsLoading(true);

      const { data } = await axios.get("/api/website/" + code + "?isAdmin=true");

      if (data.website) {
        setWebsite(data.website);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [code, setIsLoading, setWebsite]);

  const saveWebsite = useCallback(
    async (updates) => {
      if (!code) {
        return false;
      }

      try {
        const { data } = await axios.put("/api/website/" + code, { ...updates, updateNumber: website.updateNumber === null || website.updateNumber === undefined ? 0 : website.updateNumber });

        if (data.website) {
          setWebsite(data.website);
        }

        return true;
      } catch (error) {
        return false;
      }
    },
    [code, setWebsite, website?.updateNumber],
  );

  const updateWebsite = useCallback(
    (updates) => {
      setWebsite((previousWebsite) => {
        if (!previousWebsite) {
          return previousWebsite;
        }

        return { ...previousWebsite, ...updates };
      });
    },
    [setWebsite],
  );

  useEffect(() => {
    if (setLanguage && website?.defaultLanguage) {
      setLanguage(website.defaultLanguage);
    }

    return () => {
      setLanguage(initialLanguage);
    };
  }, [initialLanguage, setLanguage, website]);

  return (
    <WebsiteContext.Provider
      value={{
        isCustomDomain,
        isLoading,
        refreshWebsite,
        saveWebsite,
        setWebsite,
        updateWebsite,
        website,
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
}

export function useWebsite() {
  const context = useContext(WebsiteContext);

  if (!context) {
    return {
      isCustomDomain: false,
      isLoading: false,
      refreshWebsite: async () => {},
      saveWebsite: async (updates) => {},
      setWebsite: (website) => {},
      updateWebsite: (updates) => {},
      website: {},
    };
  }

  return context;
}
