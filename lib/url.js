// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function resolveUrl(href, websiteCode, isCustomDomain) {
  if (!href) {
    return href;
  }

  if (href.startsWith("http")) {
    return href;
  }

  if (href.startsWith("/")) {
    return isCustomDomain ? href : `/website/${websiteCode}${href === "/" ? "" : href}`;
  }

  return href;
}
