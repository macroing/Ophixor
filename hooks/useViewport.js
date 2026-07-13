// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useContext } from "react";

import { ViewportContext } from "./ViewportProvider";

export function useViewport() {
  return useContext(ViewportContext);
}
