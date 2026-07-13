// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import importedStyles from "./Label.module.css";

export default function Label(props) {
  const color = props.color;
  const componentId = props.componentId;
  const editor = props.editor;
  const fontFamily = props.fontFamily;
  const fontSize = props.fontSize;
  const fontStyle = props.fontStyle;
  const fontWeight = props.fontWeight;
  const htmlFor = props.htmlFor;
  const lineHeight = props.lineHeight;
  const styles = props.styles || importedStyles;
  const text = props.text;
  const textAlign = props.textAlign;

  const style = {};

  if (color) {
    style["--label-color"] = color;
  }

  if (fontFamily) {
    style["--label-font-family"] = fontFamily;
  }

  if (fontSize) {
    style["--label-font-size"] = fontSize;
  }

  if (fontStyle) {
    style["--label-font-style"] = fontStyle;
  }

  if (fontWeight) {
    style["--label-font-weight"] = fontWeight;
  }

  if (lineHeight) {
    style["--label-line-height"] = lineHeight;
  }

  if (textAlign) {
    style["--label-text-align"] = textAlign;
  }

  clearStyle(style);

  function cx(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <label className={cx(styles.label, editor?.isSelected && styles.label_selected, (!editor || editor?.isShowingContentOnly) && styles.label_content_only)} data-pc-id={componentId} draggable={editor?.draggable} htmlFor={htmlFor ? htmlFor : undefined} onContextMenu={editor?.onContextMenu} onDragStart={editor?.onDragStart} onMouseDown={editor?.onMouseDown} style={style}>
      {text || ""}
    </label>
  );
}

export function DarkLabel({ ...rest }) {
  return <Label color="#e5e7eb" {...rest} />;
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
    "--label-color": "var(--pc-semantic-text-primary)",
    "--label-font-family": "inherit",
    "--label-font-size": "1rem",
    "--label-font-style": "normal",
    "--label-font-weight": "600",
    "--label-line-height": "normal",
    "--label-text-align": "left",
  };
}
