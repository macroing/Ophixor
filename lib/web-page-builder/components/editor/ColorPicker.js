// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useState } from "react";

import { DarkInput } from "../input/Input";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

import importedStyles from "./ColorPicker.module.css";

export default function ColorPicker(props) {
  const componentId = props.componentId;
  const disabled = props.disabled || false;
  const label = props.label;
  const onChange = props.onChange;
  const placeholder = props.placeholder || "transparent";
  const styles = props.styles || importedStyles;
  const value = props.value || "";

  const { language } = useLanguage();

  const [inputValue, setInputValue] = useState(value || "");
  const [previewColor, setPreviewColor] = useState(normalizePreview(value, componentId));

  function onChangeColorInput(e) {
    const hex = e.target.value;

    setInputValue(hex);
    setPreviewColor(hex);

    onChange?.(hex);
  }

  function onChangeTextInput(e) {
    const next = e.target.value;

    setInputValue(next);
    setPreviewColor(normalizePreview(next, componentId));

    onChange?.(next);
  }

  useEffect(() => {
    setInputValue(value || "");
    setPreviewColor(normalizePreview(value, componentId));
  }, [componentId, value]);

  return (
    <label className={styles.wrapper}>
      <div className={styles.control}>
        <DarkInput disabled={disabled} onChange={onChangeColorInput} title={platform.websiteAdmin.pages.editor.selectColor[language]} type="color" value={extractHex(inputValue) || "#000000"} />
        <DarkInput disabled={disabled} onChange={onChangeTextInput} placeholder={placeholder} spellCheck={false} type="text" value={inputValue} />
        <div aria-hidden className={styles.preview} style={{ background: previewColor }}></div>
      </div>
    </label>
  );
}

function extractHex(value) {
  if (!value) {
    return null;
  }

  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)) {
    return value;
  }

  return null;
}

function normalizePreview(value, componentId) {
  return resolveColor(value, componentId);
}

function parseVarExpression(expression) {
  const inner = expression.trim();

  if (!inner.startsWith("var(") || !inner.endsWith(")")) {
    return null;
  }

  const content = inner.slice(4, -1);

  let depth = 0;
  let commaIndex = -1;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
    } else if (char === "," && depth === 0) {
      commaIndex = i;

      break;
    }
  }

  if (commaIndex === -1) {
    return {
      variableName: content.trim(),
      fallback: null,
    };
  }

  return {
    variableName: content.slice(0, commaIndex).trim(),
    fallback: content.slice(commaIndex + 1).trim(),
  };
}

function resolveColor(value, componentId) {
  if (!value) {
    return "transparent";
  }

  if (value === "transparent") {
    return "transparent";
  }

  if (typeof value !== "string" || !value.startsWith("var(")) {
    return value;
  }

  const element = document.querySelector(`[data-pc-id="${CSS.escape(componentId)}"]`);

  return resolveCssVariable(value, element);
}

function resolveCssVariable(expression, element) {
  const parsed = parseVarExpression(expression);

  if (!parsed) {
    return "transparent";
  }

  const { variableName, fallback } = parsed;

  const resolved = element ? getComputedStyle(element).getPropertyValue(variableName).trim() : "";

  if (resolved) {
    if (resolved.startsWith("var(")) {
      return resolveCssVariable(resolved, element);
    }

    return resolved;
  }

  if (fallback) {
    if (fallback.startsWith("var(")) {
      return resolveCssVariable(fallback, element);
    }

    return fallback;
  }

  return "transparent";
}
