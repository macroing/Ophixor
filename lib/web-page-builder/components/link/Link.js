// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import NextLink from "next/link";

import importedStyles from "./Link.module.css";

export default function Link(props) {
  const backgroundColor = props.backgroundColor;
  const backgroundColorHover = props.backgroundColorHover;
  const borderColor = props.borderColor;
  const borderColorHover = props.borderColorHover;
  const borderRadius = props.borderRadius;
  const borderWidth = props.borderWidth;
  const color = props.color;
  const colorHover = props.colorHover;
  const componentId = props.componentId;
  const cursor = props.cursor;
  const cursorHover = props.cursorHover;
  const editor = props.editor;
  const fontFamily = props.fontFamily;
  const fontSize = props.fontSize;
  const fontStyle = props.fontStyle;
  const fontWeight = props.fontWeight;
  const href = props.href;
  const lineHeight = props.lineHeight;
  const padding = props.padding;
  const resolveUrl = props.resolveUrl;
  const styles = props.styles || importedStyles;
  const target = props.target;
  const text = props.text;
  const textAlign = props.textAlign;
  const textDecoration = props.textDecoration;
  const textDecorationHover = props.textDecorationHover;
  const transition = props.transition;

  const style = {};

  if (backgroundColor) {
    style["--link-background-color"] = backgroundColor;
  }

  if (backgroundColorHover) {
    style["--link-background-color-hover"] = backgroundColorHover;
  }

  if (borderColor) {
    style["--link-border-color"] = borderColor;
  }

  if (borderColorHover) {
    style["--link-border-color-hover"] = borderColorHover;
  }

  if (borderRadius) {
    style["--link-border-radius"] = borderRadius;
  }

  if (borderWidth) {
    style["--link-border-width"] = borderWidth;
  }

  if (color) {
    style["--link-color"] = color;
  }

  if (colorHover) {
    style["--link-color-hover"] = colorHover;
  }

  if (cursor) {
    style["--link-cursor"] = cursor;
  }

  if (cursorHover) {
    style["--link-cursor-hover"] = cursor;
  }

  if (fontFamily) {
    style["--link-font-family"] = fontFamily;
  }

  if (fontSize) {
    style["--link-font-size"] = fontSize;
  }

  if (fontStyle) {
    style["--link-font-style"] = fontStyle;
  }

  if (fontWeight) {
    style["--link-font-weight"] = fontWeight;
  }

  if (lineHeight) {
    style["--link-line-height"] = lineHeight;
  }

  if (padding) {
    style["--link-padding"] = padding;
  }

  if (textAlign) {
    style["--link-text-align"] = textAlign;
  }

  if (textDecoration) {
    style["--link-text-decoration"] = textDecoration;
  }

  if (textDecorationHover) {
    style["--link-text-decoration-hover"] = textDecorationHover;
  }

  if (transition) {
    style["--link-transition"] = transition;
  }

  clearStyle(style);

  function cx(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <NextLink className={cx(styles.link, editor?.isSelected && styles.link_selected, (!editor || editor?.isShowingContentOnly) && styles.link_content_only)} data-pc-id={componentId} draggable={editor?.draggable} href={resolveUrl ? resolveUrl(href) : href} onContextMenu={editor?.onContextMenu} onDragStart={editor?.onDragStart} onMouseDown={editor?.onMouseDown} style={style} target={target}>
      {text || ""}
    </NextLink>
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
    "--link-background-color": "transparent",
    "--link-background-color-hover": "transparent",
    "--link-border-color": "transparent",
    "--link-border-color-hover": "transparent",
    "--link-border-radius": "0px",
    "--link-border-width": "0px",
    "--link-color": "var(--pc-semantic-text-primary)",
    "--link-color-hover": "var(--pc-semantic-interactive-link-hover)",
    "--link-font-family": "inherit",
    "--link-font-size": "1rem",
    "--link-font-style": "normal",
    "--link-font-weight": "normal",
    "--link-line-height": "normal",
    "--link-padding": "0px",
    "--link-text-align": "left",
    "--link-text-decoration": "none",
    "--link-text-decoration-hover": "none",
    "--link-transition": "none",
  };
}
