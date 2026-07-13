// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function sanitizeString(value, isEmptyDiscarded = false) {
  return typeof value === "string" ? (isEmptyDiscarded && value === "" ? undefined : value) : undefined;
}
