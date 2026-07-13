// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { DataModelContext } from "./DataModelContext";

export function DataModelProvider({ children, value }) {
  return <DataModelContext.Provider value={value}>{children}</DataModelContext.Provider>;
}
