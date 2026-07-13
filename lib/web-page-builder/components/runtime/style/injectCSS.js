// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function injectCSS(id, css) {
  if (typeof document === "undefined") {
    return;
  }

  let styleTag = document.getElementById(id);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = id;

    document.head.appendChild(styleTag);
  }

  if (styleTag.textContent !== css) {
    styleTag.textContent = css;
  }
}
