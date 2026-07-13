// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { faChevronLeft, faCog, faCube, faLayerGroup } from "@fortawesome/pro-solid-svg-icons";

import Icon from "./Icon";
import { useViewport } from "@/hooks/useViewport";

import importedStyles from "./PageToolBarPanel.module.css";

export default function PageToolBarPanel(props) {
  const active = props.active;
  const children = props.children;
  const setActive = props.setActive;
  const styles = props.styles || importedStyles;
  const title = props.title;

  const { isMobileOriginal } = useViewport();

  function getFontAwesome() {
    switch (active) {
      case "components":
        return <Icon icon={faCube} size={16} />;
      case "settings":
        return <Icon icon={faCog} size={16} />;
      case "templates":
        return <Icon icon={faLayerGroup} size={16} />;
      default:
        return null;
    }
  }

  function onClickCollapse(e) {
    if (setActive) {
      setActive("");
    }
  }

  if (active) {
    return (
      <div className={styles.panel + (isMobileOriginal ? " " + styles.panel_mobile : "")}>
        <div className={styles.header}>
          <span>{getFontAwesome()}</span>
          <span>{title}</span>
          <Icon icon={faChevronLeft} onClick={onClickCollapse} size={16} />
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    );
  }

  return null;
}
