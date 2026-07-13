// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo, useState } from "react";

import { OverlayContext } from "./OverlayContext";

export function OverlayProvider({ children }) {
  const [tooltip, setTooltip] = useState(null);

  const value = useMemo(() => ({ setTooltip, tooltip }), [setTooltip, tooltip]);

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>;
}
