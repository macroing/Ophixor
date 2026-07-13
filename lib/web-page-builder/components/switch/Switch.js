// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import importedStyles from "./Switch.module.css";

export default function Switch(props) {
  const backgroundColor = props.backgroundColor;
  const backgroundColorActive = props.backgroundColorActive;
  const borderColor = props.borderColor;
  const checked = props.checked;
  const componentId = props.componentId;
  const disabled = props.disabled; //TODO: Add as prop to the schema.
  const editor = props.editor;
  const height = props.height;
  const id = props.id;
  const maxHeight = props.maxHeight;
  const maxWidth = props.maxWidth;
  const minHeight = props.minHeight;
  const minWidth = props.minWidth;
  const onChange = props.onChange;
  const styles = props.styles || importedStyles;
  const text = props.text;
  const transition = props.transition;
  const width = props.width;

  const style = {};

  if (backgroundColor) {
    style["--switch-background-color"] = backgroundColor;
  }

  if (backgroundColorActive) {
    style["--switch-background-color-active"] = backgroundColorActive;
  }

  if (borderColor) {
    style["--switch-border-color"] = borderColor;
  }

  if (height) {
    style["--switch-height"] = height;
  }

  if (maxHeight) {
    style["--switch-max-height"] = maxHeight;
  }

  if (maxWidth) {
    style["--switch-max-width"] = maxWidth;
  }

  if (minHeight) {
    style["--switch-min-height"] = minHeight;
  }

  if (minWidth) {
    style["--switch-min-width"] = minWidth;
  }

  if (transition) {
    style["--switch-transition"] = transition;
  }

  if (width) {
    style["--switch-width"] = width;
  }

  clearStyle(style);

  function cx(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className={cx(styles.switch, disabled && styles.switch_disabled, editor?.isSelected && styles.switch_selected, (!editor || editor?.isShowingContentOnly) && styles.switch_content_only)} data-pc-id={componentId} draggable={editor?.draggable} onContextMenu={editor?.onContextMenu} onDragStart={editor?.onDragStart} onMouseDown={editor?.onMouseDown} style={style}>
      <input checked={checked} disabled={disabled} id={id ? id : editor?.componentId ? editor.componentId : undefined} onChange={onChange} type="checkbox" />
      <label className={styles.toggle} htmlFor={id ? id : editor?.componentId ? editor.componentId : undefined}></label>
      <span>{text || ""}</span>
    </div>
  );
}

export function DarkSwitch({ ...rest }) {
  return <Switch {...createDarkSwitchProps()} {...rest} />;
}

function clearStyle(style) {
  const defaultCssVariables = getDefaultCssVariables();

  Object.entries(style).forEach(([key, currentValue]) => {
    if (key in defaultCssVariables && currentValue === defaultCssVariables[key]) {
      delete style[key];
    }
  });
}

function createDarkSwitchProps() {
  return {
    backgroundColor: "#e5e7eb",
    backgroundColorActive: "#6366f1",
    borderColor: "#374151",
  };
}

function getDefaultCssVariables() {
  return {
    "--switch-background-color": "var(--pc-semantic-surface-base)",
    "--switch-background-color-active": "var(--pc-semantic-interactive-primary)",
    "--switch-border-color": "var(--pc-semantic-border-default)",
    "--switch-transition": "0.25s ease",
  };
}
