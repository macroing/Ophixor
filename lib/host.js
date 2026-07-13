// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function isLocalhost(host) {
  return typeof host === "string" && host.match(/^([a-zA-Z0-9]+\.)?(localhost|127\.0\.0\.1)(\:[0-9]+)?$/);
}
