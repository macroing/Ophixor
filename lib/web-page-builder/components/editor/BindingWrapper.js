// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useState } from "react";

import { DarkButton } from "../button/Button";
import { DarkSwitch } from "../switch/Switch";
import { generateId } from "../../page/identity/generateId";
import ExpressionEditorDialog from "./ExpressionEditorDialog";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

import importedStyles from "./BindingWrapper.module.css";

export default function BindingWrapper(props) {
  const { canUseExpression, children, componentType, dataScope, id, isPlatformAdmin, onChange, plan, propertyType, styles = importedStyles, value } = props;

  const { language } = useLanguage();

  const safeValue = value && typeof value === "object" && !Array.isArray(value) && value.type === "expression" ? value : { type: "static", value: propertyType === "items" ? (Array.isArray(value) ? value : []) : (value ?? "") };

  const isExpression = safeValue?.type === "expression";
  const isArray = propertyType === "items";

  const staticValue = isExpression ? (safeValue.fallback ?? (isArray ? [] : "")) : safeValue.value;

  const [isOpen, setIsOpen] = useState(false);

  function changeMode(newMode) {
    if (newMode === "Static") {
      onChange(staticValue);
    }

    if (newMode === "Expression") {
      onChange({
        type: "expression",
        expression: {
          id: generateId("expression"),
          type: "literal",
          value: staticValue,
        },
        fallback: staticValue,
      });
    }
  }

  function getExpectedType() {
    if (typeof propertyType === "string") {
      switch (propertyType) {
        case "action":
          return "string";
        case "color":
          return "string";
        case "items":
          return "array";
        case "number":
          return "number";
        case "select":
          return "string";
        case "selectors":
          return "object";
        case "switch":
          return "boolean";
        case "text":
          return "string";
        case "textarea":
          return "string";
        default:
          return "string";
      }
    } else {
      return "string";
    }
  }

  function handleStaticChange(newValue) {
    if (isExpression) {
      onChange({
        ...safeValue,
        fallback: newValue,
      });
    } else {
      onChange(newValue);
    }
  }

  function onClose(e) {
    setIsOpen(false);
  }

  return (
    <div className={styles.binding_wrapper}>
      {children({
        value: staticValue,
        onChange: handleStaticChange,
      })}
      {canUseExpression && (
        <div className={styles.binding_mode}>
          <DarkSwitch checked={isExpression} id={id + "-expression"} onChange={(e) => changeMode(e.target.checked ? "Expression" : "Static")} text={platform.websiteAdmin.pages.editor.useExpression[language]} />
        </div>
      )}
      {isExpression && canUseExpression && <DarkButton onClick={(e) => setIsOpen(true)}>{platform.websiteAdmin.pages.editor.changeExpression[language]}</DarkButton>}
      {isExpression && canUseExpression && <ExpressionEditorDialog componentType={componentType} dataScope={dataScope} expectedType={getExpectedType()} expression={safeValue.expression} isOpen={isOpen} isPlatformAdmin={isPlatformAdmin} onChange={(expr) => onChange({ ...safeValue, expression: expr })} onClose={onClose} plan={plan} />}
    </div>
  );
}
