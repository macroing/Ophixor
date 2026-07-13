// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useState } from "react";
import Link from "next/link";

import importedStyles from "./SideBar.module.css";

export default function SideBar(props) {
  const backdropFilter = props.backdropFilter;
  const backgroundColor = props.backgroundColor;
  const backgroundColorItem = props.backgroundColorItem;
  const backgroundColorItemActive = props.backgroundColorItemActive;
  const backgroundColorItemActiveHover = props.backgroundColorItemActiveHover;
  const backgroundColorItemHover = props.backgroundColorItemHover;
  const borderColor = props.borderColor;
  const colorItem = props.colorItem;
  const colorItemActive = props.colorItemActive;
  const colorItemActiveHover = props.colorItemActiveHover;
  const colorItemHover = props.colorItemHover;
  const componentId = props.componentId;
  const editor = props.editor;
  const items = props.items || [];
  const resolveUrl = props.resolveUrl;
  const styles = props.styles || importedStyles;

  const [isExpanded, setIsExpanded] = useState(false);

  const style = {};

  if (backdropFilter) {
    style["--side-bar-backdrop-filter"] = backdropFilter;
  }

  if (backgroundColor) {
    style["--side-bar-background-color"] = backgroundColor;
  }

  if (backgroundColorItem) {
    style["--side-bar-background-color-item"] = backgroundColorItem;
  }

  if (backgroundColorItemActive) {
    style["--side-bar-background-color-item-active"] = backgroundColorItemActive;
  }

  if (backgroundColorItemActiveHover) {
    style["--side-bar-background-color-item-active-hover"] = backgroundColorItemActiveHover;
  }

  if (backgroundColorItemHover) {
    style["--side-bar-background-color-item-hover"] = backgroundColorItemHover;
  }

  if (borderColor) {
    style["--side-bar-border-color"] = borderColor;
  }

  if (colorItem) {
    style["--side-bar-color-item"] = colorItem;
  }

  if (colorItemActive) {
    style["--side-bar-color-item-active"] = colorItemActive;
  }

  if (colorItemActiveHover) {
    style["--side-bar-color-item-active-hover"] = colorItemActiveHover;
  }

  if (colorItemHover) {
    style["--side-bar-color-item-hover"] = colorItemHover;
  }

  clearStyle(style);

  function cx(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  function onClickCollapse(e) {
    setIsExpanded(false);
  }

  function onClickExpand(e) {
    setIsExpanded(true);
  }

  return (
    <aside className={cx(styles.side_bar, isExpanded && styles.side_bar_expanded, editor?.isSelected && styles.side_bar_selected, (!editor || editor?.isShowingContentOnly) && styles.side_bar_content_only)} data-pc-id={componentId} draggable={editor?.draggable} onContextMenu={editor?.onContextMenu} onDragStart={editor?.onDragStart} onMouseDown={editor?.onMouseDown} style={style}>
      <nav className={styles.nav}>
        {isExpanded && (
          <div className={styles.mobile_collapse}>
            <button className={styles.button} onClick={onClickCollapse}>
              ⇦
            </button>
          </div>
        )}
        {items.map((item, itemIndex) =>
          item.isSeparator ? (
            <div className={styles.item_separator} key={"item-" + itemIndex + "-separator"}></div>
          ) : item.onClick ? (
            <button className={styles.item + (item.isActive ? " " + styles.item_active : "")} key={"item-" + itemIndex + "-" + item.label} onClick={item.onClick} type="button">
              {item.label}
            </button>
          ) : (
            <Link className={styles.item + (item.isActive ? " " + styles.item_active : "")} href={resolveUrl ? resolveUrl(item.href || "/") : item.href || "/"} key={"item-" + itemIndex + "-" + item.label}>
              {item.label}
            </Link>
          ),
        )}
      </nav>
      <div className={styles.mobile_expand}>
        <button className={styles.button} onClick={onClickExpand}>
          ⇨
        </button>
      </div>
    </aside>
  );
}

function clearStyle(style) {
  const defaultCssVariables = getDefaultCssVariables();

  Object.entries(style).forEach(([key, currentValue]) => {
    if (key in defaultCssVariables && currentValue === defaultCssVariables[key]) {
      delete style[key];
    }
  });
}

function getDefaultCssVariables() {
  return {
    "--side-bar-backdrop-filter": "blur(8px)",
    "--side-bar-background-color": "var(--pc-semantic-surface-overlay)",
    "--side-bar-background-color-item": "transparent",
    "--side-bar-background-color-item-active": "var(--pc-semantic-interactive-primary)",
    "--side-bar-background-color-item-active-hover": "var(--pc-semantic-interactive-primary-hover)",
    "--side-bar-background-color-item-hover": "var(--pc-semantic-surface-primary)",
    "--side-bar-border-color": "var(--pc-semantic-border-default)",
    "--side-bar-color-item": "var(--pc-semantic-text-secondary)",
    "--side-bar-color-item-active": "var(--pc-semantic-text-inverse)",
    "--side-bar-color-item-active-hover": "var(--pc-semantic-text-inverse)",
    "--side-bar-color-item-hover": "var(--pc-semantic-interactive-primary)",
  };
}
