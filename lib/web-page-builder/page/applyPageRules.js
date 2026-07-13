// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { transform } from "../transform/core/transform";

export function applyPageRules(page, rules) {
  return rules.reduce((current, rule) => transform(current, rule), page);
}
