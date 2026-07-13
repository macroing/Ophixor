// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useRef, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";

import importedStyles from "./TextArea.module.css";

export default function TextArea(props) {
  const backgroundColor = props.backgroundColor;
  const borderColor = props.borderColor;
  const borderRadius = props.borderRadius;
  const borderWidth = props.borderWidth;
  const boxShadowFocus = props.boxShadowFocus;
  const color = props.color;
  const componentId = props.componentId;
  const disabled = props.disabled;
  const editor = props.editor;
  const height = props.height;
  const id = props.id;
  const isDebounceDisabled = props.isDebounceDisabled || false;
  const maxHeight = props.maxHeight;
  const maxWidth = props.maxWidth;
  const minHeight = props.minHeight;
  const minWidth = props.minWidth;
  const name = props.name;
  const onBlur = props.onBlur;
  const onChange = props.onChange;
  const padding = props.padding;
  const placeholder = props.placeholder;
  const readOnly = props.readOnly;
  const rows = props.rows;
  const styles = props.styles || importedStyles;
  const value = props.value;
  const width = props.width;

  const safeDisabled = typeof disabled === "boolean" ? disabled : false;
  const safeName = typeof name === "string" ? name : "";
  const safeReadOnly = typeof readOnly === "boolean" ? readOnly : false;
  const safeValue = typeof value === "string" || typeof value === "number" ? value : "";

  const isUserTypingRef = useRef(false);

  const { debounced: debouncedOnChange } = useDebounce((value) => {
    if (typeof onChange === "function") {
      onChange({ target: { value } });
    }
  }, 250);

  const [internalValue, setInternalValue] = useState(safeValue);

  const style = {};

  if (backgroundColor) {
    style["--text-area-background-color"] = backgroundColor;
  }

  if (borderColor) {
    style["--text-area-border-color"] = borderColor;
  }

  if (borderRadius) {
    style["--text-area-border-radius"] = borderRadius;
  }

  if (borderWidth) {
    style["--text-area-border-width"] = borderWidth;
  }

  if (boxShadowFocus) {
    style["--text-area-box-shadow-focus"] = boxShadowFocus;
  }

  if (color) {
    style["--text-area-color"] = color;
  }

  if (height) {
    style["--text-area-height"] = height;
  }

  if (maxHeight) {
    style["--text-area-max-height"] = maxHeight;
  }

  if (maxWidth) {
    style["--text-area-max-width"] = maxWidth;
  }

  if (minHeight) {
    style["--text-area-min-height"] = minHeight;
  }

  if (minWidth) {
    style["--text-area-min-width"] = minWidth;
  }

  if (padding) {
    style["--text-area-padding"] = padding;
  }

  if (width) {
    style["--text-area-width"] = width;
  }

  clearStyle(style);

  function cx(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  function onChangeImpl(e) {
    const newValue = e.target.value;

    isUserTypingRef.current = true;

    setInternalValue(newValue);

    if (isDebounceDisabled) {
      if (typeof onChange === "function") {
        onChange(e);
      }
    } else {
      debouncedOnChange(newValue);
    }
  }

  useEffect(() => {
    if (isDebounceDisabled || !isUserTypingRef.current) {
      setInternalValue(safeValue);
    }

    isUserTypingRef.current = false;
  }, [isDebounceDisabled, safeValue]);

  return <textarea className={cx(styles.text_area, editor?.isSelected && styles.text_area_selected, (!editor || editor?.isShowingContentOnly) && styles.text_area_content_only)} data-pc-id={componentId} disabled={safeDisabled} draggable={editor?.draggable} id={id ? id : undefined} name={safeName} onBlur={onBlur} onChange={onChangeImpl} onContextMenu={editor?.onContextMenu} onDragStart={editor?.onDragStart} onMouseDown={editor?.onMouseDown} placeholder={placeholder} readOnly={safeReadOnly ? safeReadOnly : !editor || editor?.isShowingContentOnly ? false : true} rows={rows ? rows : undefined} style={style} value={internalValue} />;
}

export function DarkTextArea({ ...rest }) {
  return <TextArea {...createDarkTextAreaProps()} {...rest} />;
}

function clearStyle(style) {
  const defaultCssVariables = getDefaultCssVariables();

  Object.entries(style).forEach(([key, currentValue]) => {
    if (key in defaultCssVariables && currentValue === defaultCssVariables[key]) {
      delete style[key];
    }
  });
}

function createDarkTextAreaProps() {
  return {
    backgroundColor: "#020617",
    borderColor: "#374151",
    borderRadius: "4px",
    boxShadowFocus: "0 0 0 3px #374151",
    color: "#ffffff",
  };
}

function getDefaultCssVariables() {
  return {
    "--text-area-background-color": "var(--pc-semantic-surface-base)",
    "--text-area-border-color": "var(--pc-semantic-border-default)",
    "--text-area-border-radius": "8px",
    "--text-area-border-width": "1px",
    "--text-area-box-shadow-focus": "var(--pc-semantic-focus-ring)",
    "--text-area-color": "var(--pc-semantic-text-primary)",
    "--text-area-height": "auto",
    "--text-area-max-height": "none",
    "--text-area-max-width": "none",
    "--text-area-min-height": "44px",
    "--text-area-min-width": "auto",
    "--text-area-padding": "0.6rem 0.75rem",
    "--text-area-width": "100%",
  };
}
