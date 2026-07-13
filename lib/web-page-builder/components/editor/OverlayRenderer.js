// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useOverlay } from "./useOverlay";

import importedStyles from "./OverlayRenderer.module.css";

export default function OverlayRenderer(props) {
  const styles = props.styles || importedStyles;

  const { tooltip } = useOverlay();

  return <div className={styles.overlay}>{tooltip}</div>;
}
