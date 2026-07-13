// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import importedStyles from "./Avatar.module.css";

export default function Avatar(props) {
  const email = props.email;
  const isDark = props.isDark;
  const styles = props.styles || importedStyles;

  const letter = (email || "A").charAt(0).toUpperCase();

  return <div className={styles.avatar + (isDark ? " " + styles.avatar_dark : "")}>{letter}</div>;
}
