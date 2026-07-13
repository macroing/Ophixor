// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function sanitizeBoolean(value) {
  return typeof value === "boolean" ? value : undefined;
}
