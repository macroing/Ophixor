// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import importedStyles from "./Icon.module.css";

export default function Icon(props) {
  const customClassName = props.customClassName;
  const icon = props.icon;
  const isResponsive = props.isResponsive || false;
  const onClick = props.onClick;
  const size = props.size || 16;
  const sizeMin = props.sizeMin || size;
  const style = props.style;
  const styles = props.styles || importedStyles;
  const theme = props.theme;

  const fontSizeMaxEm = size / 16;
  const fontSizeMinEm = sizeMin / 16;
  const fontSize = `clamp(${fontSizeMinEm}em, ${Math.ceil((size / 2400) * 100)}vw, ${fontSizeMaxEm}em)`;

  return <FontAwesomeIcon className={styles.icon + (customClassName ? " " + customClassName : "") + (isResponsive ? " " + styles.icon_responsive : "") + (onClick ? " " + styles.icon_clickable : "") + (theme === "danger" ? " " + styles.icon_danger : "")} icon={icon} onClick={onClick} style={{ ...(style || {}), fontSize: isResponsive ? fontSize : undefined, height: isResponsive ? undefined : size + "px", maxHeight: isResponsive ? undefined : size + "px", maxWidth: isResponsive ? undefined : size + "px", minHeight: isResponsive ? undefined : sizeMin + "px", minWidth: isResponsive ? undefined : sizeMin + "px", width: isResponsive ? undefined : size + "px" }} />;
}
