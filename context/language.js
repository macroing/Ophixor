// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { createContext, useContext, useMemo, useState } from "react";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children, initialLanguage = "en", language: languageToUse = "en" }) => {
  const [language, setLanguage] = useState(languageToUse);

  const value = useMemo(() => ({ initialLanguage, language, setLanguage }), [initialLanguage, language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage() {
  return useContext(LanguageContext);
}
