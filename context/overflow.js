// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { createContext, useContext, useMemo, useState } from "react";

const OverflowContext = createContext(null);

export const OverflowProvider = ({ children }) => {
  const [isOverflowHidden, setIsOverflowHidden] = useState(false);

  const value = useMemo(() => ({ isOverflowHidden, setIsOverflowHidden }), [isOverflowHidden, setIsOverflowHidden]);

  return <OverflowContext.Provider value={value}>{children}</OverflowContext.Provider>;
};

export function useOverflow() {
  return useContext(OverflowContext);
}
