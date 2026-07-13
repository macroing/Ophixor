// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useRef, useState } from "react";

import importedStyles from "./Select.module.css";

export default function Select(props) {
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
  const isCustom = props.isCustom;
  const maxHeight = props.maxHeight;
  const maxWidth = props.maxWidth;
  const minHeight = props.minHeight;
  const minWidth = props.minWidth;
  const name = props.name;
  const onChange = props.onChange;
  const options = props.options || [];
  const padding = props.padding;
  const styles = props.styles || importedStyles;
  const value = props.value;
  const width = props.width;

  const safeDisabled = typeof disabled === "boolean" ? disabled : false;
  const safeName = typeof name === "string" ? name : "";

  const selectRef = useRef();

  const [isOpen, setIsOpen] = useState(false);

  const selected = options.find((option) => option.value === value);

  const style = {};

  if (backgroundColor) {
    style["--select-background-color"] = backgroundColor;
  }

  if (borderColor) {
    style["--select-border-color"] = borderColor;
  }

  if (borderRadius) {
    style["--select-border-radius"] = borderRadius;
  }

  if (borderWidth) {
    style["--select-border-width"] = borderWidth;
  }

  if (boxShadowFocus) {
    style["--select-box-shadow-focus"] = boxShadowFocus;
  }

  if (color) {
    style["--select-color"] = color;
  }

  if (height) {
    style["--select-height"] = height;
  }

  if (maxHeight) {
    style["--select-max-height"] = maxHeight;
  }

  if (maxWidth) {
    style["--select-max-width"] = maxWidth;
  }

  if (minHeight) {
    style["--select-min-height"] = minHeight;
  }

  if (minWidth) {
    style["--select-min-width"] = minWidth;
  }

  if (padding) {
    style["--select-padding"] = padding;
  }

  if (width) {
    style["--select-width"] = width;
  }

  clearStyle(style);

  function cx(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    function handleClick(e) {
      if (!selectRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClick);

    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  if (isCustom) {
    return (
      <div className={cx(styles.select, editor?.isSelected && styles.select_selected, (!editor || editor?.isShowingContentOnly) && styles.select_content_only)} data-pc-id={componentId} draggable={editor?.draggable} id={id ? id : undefined} onChange={onChange} onContextMenu={editor?.onContextMenu} onDragStart={editor?.onDragStart} onMouseDown={editor?.onMouseDown} ref={selectRef} style={style} value={value}>
        <button className={styles.trigger} onClick={() => setIsOpen((isOpen) => !isOpen)}>
          {selected?.label || "Select..."}
          <span className={styles.arrow}>▾</span>
        </button>
        {isOpen && (
          <div className={styles.options}>
            {options.map((option, optionIndex) => (
              <div
                className={`${styles.option} ${value === option.value ? styles.option_selected : ""}`}
                key={(option?.value || "") + "-" + optionIndex}
                onClick={() => {
                  onChange({ target: { value: option.value } });

                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <select className={cx(styles.select, editor?.isSelected && styles.select_selected, (!editor || editor?.isShowingContentOnly) && styles.select_content_only)} data-pc-id={componentId} disabled={safeDisabled} draggable={editor?.draggable} id={id ? id : undefined} name={safeName} onChange={onChange} onContextMenu={editor?.onContextMenu} onDragStart={editor?.onDragStart} onMouseDown={editor?.onMouseDown} style={style} value={value}>
      {options.map((option, optionIndex) => (
        <option key={(option?.value || "") + "-" + optionIndex} value={option?.value || ""}>
          {option?.label || ""}
        </option>
      ))}
    </select>
  );
}

export function DarkSelect({ ...rest }) {
  return <Select {...createDarkSelectProps()} {...rest} />;
}

function clearStyle(style) {
  const defaultCssVariables = getDefaultCssVariables();

  Object.entries(style).forEach(([key, currentValue]) => {
    if (key in defaultCssVariables && currentValue === defaultCssVariables[key]) {
      delete style[key];
    }
  });
}

function createDarkSelectProps() {
  return {
    backgroundColor: "#020617",
    borderColor: "#374151",
    borderRadius: "4px",
    boxShadowFocus: "0 0 0 3px #374151",
    color: "#ffffff",
    isCustom: true,
    padding: "0px",
  };
}

function getDefaultCssVariables() {
  return {
    "--select-background-color": "var(--pc-semantic-surface-base)",
    "--select-border-color": "var(--pc-semantic-border-default)",
    "--select-border-radius": "8px",
    "--select-border-width": "1px",
    "--select-box-shadow-focus": "var(--pc-semantic-focus-ring)",
    "--select-color": "var(--pc-semantic-text-primary)",
    "--select-height": "auto",
    "--select-max-height": "none",
    "--select-max-width": "none",
    "--select-min-height": "44px",
    "--select-min-width": "auto",
    "--select-padding": "0.6rem 0.75rem",
    "--select-width": "100%",
  };
}
