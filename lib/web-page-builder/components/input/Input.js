// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useRef, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";

import importedStyles from "./Input.module.css";

export default function Input(props) {
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
  const spellCheck = props.spellCheck;
  const styles = props.styles || importedStyles;
  const type = props.type || "text";
  const value = props.value;
  const width = props.width;

  const safeDisabled = typeof disabled === "boolean" ? disabled : false;
  const safeName = typeof name === "string" ? name : "";
  const safeReadOnly = typeof readOnly === "boolean" ? readOnly : false;
  const safeSpellCheck = typeof spellCheck === "boolean" ? spellCheck : typeof spellCheck === "string" ? (spellCheck === "true" ? true : spellCheck === "false" ? false : undefined) : undefined;
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
    style["--input-background-color"] = backgroundColor;
  }

  if (borderColor) {
    style["--input-border-color"] = borderColor;
  }

  if (borderRadius) {
    style["--input-border-radius"] = borderRadius;
  }

  if (borderWidth) {
    style["--input-border-width"] = borderWidth;
  }

  if (boxShadowFocus) {
    style["--input-box-shadow-focus"] = boxShadowFocus;
  }

  if (color) {
    style["--input-color"] = color;
  }

  if (height) {
    style["--input-height"] = height;
  }

  if (maxHeight) {
    style["--input-max-height"] = maxHeight;
  }

  if (maxWidth) {
    style["--input-max-width"] = maxWidth;
  }

  if (minHeight) {
    style["--input-min-height"] = minHeight;
  }

  if (minWidth) {
    style["--input-min-width"] = minWidth;
  }

  if (padding) {
    style["--input-padding"] = padding;
  }

  if (width) {
    style["--input-width"] = width;
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

  return <input className={cx(styles.input, editor?.isSelected && styles.input_selected, (!editor || editor?.isShowingContentOnly) && styles.input_content_only)} data-pc-id={componentId} disabled={safeDisabled} draggable={editor?.draggable} id={id ? id : undefined} name={safeName} onBlur={onBlur} onChange={onChangeImpl} onContextMenu={editor?.onContextMenu} onDragStart={editor?.onDragStart} onMouseDown={editor?.onMouseDown} placeholder={placeholder} readOnly={safeReadOnly ? safeReadOnly : !editor || editor?.isShowingContentOnly ? false : true} spellCheck={safeSpellCheck} style={style} type={type} value={internalValue} />;
}

export function DarkInput({ ...rest }) {
  return <Input {...createDarkInputProps()} {...rest} />;
}

function clearStyle(style) {
  const defaultCssVariables = getDefaultCssVariables();

  Object.entries(style).forEach(([key, currentValue]) => {
    if (key in defaultCssVariables && currentValue === defaultCssVariables[key]) {
      delete style[key];
    }
  });
}

function createDarkInputProps() {
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
    "--input-background-color": "var(--pc-semantic-surface-base)",
    "--input-border-color": "var(--pc-semantic-border-default)",
    "--input-border-radius": "8px",
    "--input-border-width": "1px",
    "--input-box-shadow-focus": "var(--pc-semantic-focus-ring)",
    "--input-color": "var(--pc-semantic-text-primary)",
    "--input-height": "auto",
    "--input-max-height": "none",
    "--input-max-width": "none",
    "--input-min-height": "44px",
    "--input-min-width": "auto",
    "--input-padding": "0.6rem 0.75rem",
    "--input-width": "100%",
  };
}
