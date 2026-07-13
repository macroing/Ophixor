// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import importedStyles from "./RadioGroup.module.css";

export default function RadioGroup(props) {
  const backgroundColorOption = props.backgroundColorOption;
  const backgroundColorOptionChecked = props.backgroundColorOptionChecked;
  const backgroundColorOptionIcon = props.backgroundColorOptionIcon;
  const backgroundColorOptionIconCircle = props.backgroundColorOptionIconCircle;
  const borderColorOption = props.borderColorOption;
  const borderColorOptionChecked = props.borderColorOptionChecked;
  const borderColorOptionIcon = props.borderColorOptionIcon;
  const borderColorOptionIconChecked = props.borderColorOptionIconChecked;
  const colorLabel = props.colorLabel;
  const colorLabelRequired = props.colorLabelRequired;
  const colorOption = props.colorOption;
  const componentId = props.componentId;
  const disabled = props.disabled || false;
  const editor = props.editor;
  const label = props.label;
  const name = props.name;
  const onChange = props.onChange;
  const options = props.options || [];
  const orientation = props.orientation || "vertical";
  const required = props.required || false;
  const styles = props.styles || importedStyles;
  const value = props.value;

  const style = {};

  if (backgroundColorOption) {
    style["--radio-group-background-color-option"] = backgroundColorOption;
  }

  if (backgroundColorOptionChecked) {
    style["--radio-group-background-color-option-checked"] = backgroundColorOptionChecked;
  }

  if (backgroundColorOptionIcon) {
    style["--radio-group-background-color-option-icon"] = backgroundColorOptionIcon;
  }

  if (backgroundColorOptionIconCircle) {
    style["--radio-group-background-color-option-icon-circle"] = backgroundColorOptionIconCircle;
  }

  if (borderColorOption) {
    style["--radio-group-border-color-option"] = borderColorOption;
  }

  if (borderColorOptionChecked) {
    style["--radio-group-border-color-option-checked"] = borderColorOptionChecked;
  }

  if (borderColorOptionIcon) {
    style["--radio-group-border-color-option-icon"] = borderColorOptionIcon;
  }

  if (borderColorOptionIconChecked) {
    style["--radio-group-border-color-option-icon-checked"] = borderColorOptionIconChecked;
  }

  if (colorLabel) {
    style["--radio-group-color-label"] = colorLabel;
  }

  if (colorLabelRequired) {
    style["--radio-group-color-label-required"] = colorLabelRequired;
  }

  if (colorOption) {
    style["--radio-group-color-option"] = colorOption;
  }

  clearStyle(style);

  function cx(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  function renderOption(option) {
    const id = `${name?.replaceAll(/\s+/g, "-") || ""}-${option.value?.replaceAll(/\s+/g, "-")}`;
    const checked = value === option.value;

    return (
      <label className={checked && (disabled || option.disabled) ? styles.radio_group_option + " " + styles.radio_group_option_checked + " " + styles.radio_group_option_disabled : checked ? styles.radio_group_option + " " + styles.radio_group_option_checked : disabled || option.disabled ? styles.radio_group_option + " " + styles.radio_group_option_disabled : styles.radio_group_option} htmlFor={id} key={option.value}>
        <input checked={checked} disabled={disabled || option.disabled} id={id} name={name} onChange={onChange} required={required} type="radio" value={option.value} />
        <span aria-hidden className={styles.icon}>
          {checked && <span className={styles.circle}></span>}
        </span>
        <span className={styles.label}>{option.label}</span>
      </label>
    );
  }

  return (
    <fieldset className={cx(styles.radio_group, editor?.isSelected && styles.radio_group_selected, (!editor || editor?.isShowingContentOnly) && styles.radio_group_content_only, orientation === "horizontal" && styles.radio_group_horizontal)} data-pc-id={componentId} disabled={disabled} draggable={editor?.draggable} onContextMenu={editor?.onContextMenu} onDragStart={editor?.onDragStart} onMouseDown={editor?.onMouseDown} style={style}>
      {label && (
        <legend className={styles.label}>
          {label}
          {required && <span className={styles.label_required}>*</span>}
        </legend>
      )}
      <div className={styles.radio_group_options} role="radiogroup">
        {options.map((option) => renderOption(option))}
      </div>
    </fieldset>
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
    "--radio-group-background-color-option": "var(--pc-semantic-surface-base)",
    "--radio-group-background-color-option-checked": "var(--pc-foundation-color-primary-50)",
    "--radio-group-background-color-option-icon": "var(--pc-semantic-surface-base)",
    "--radio-group-background-color-option-icon-circle": "var(--pc-semantic-interactive-primary)",
    "--radio-group-border-color-option": "var(--pc-foundation-color-gray-300)",
    "--radio-group-border-color-option-checked": "var(--pc-semantic-interactive-primary)",
    "--radio-group-border-color-option-icon": "var(--pc-foundation-color-gray-400)",
    "--radio-group-border-color-option-icon-checked": "var(--pc-semantic-interactive-primary)",
    "--radio-group-color-label": "var(--pc-semantic-text-primary)",
    "--radio-group-color-label-required": "var(--pc-foundation-color-danger-600)",
    "--radio-group-color-option": "var(--pc-semantic-text-primary)",
  };
}
