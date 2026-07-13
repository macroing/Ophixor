// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { useContext } from "react";

import { DataModelContext } from "./DataModelContext";

export function useDataModel() {
  return useContext(DataModelContext);
}
