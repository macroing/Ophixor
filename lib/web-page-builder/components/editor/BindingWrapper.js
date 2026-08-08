// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useMemo, useState } from "react";

import { DarkButton } from "../button/Button";
import { DarkSwitch } from "../switch/Switch";
import { generateId } from "../../page/identity/generateId";
import ExpressionEditorDialog from "./ExpressionEditorDialog";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

import importedStyles from "./BindingWrapper.module.css";

export default function BindingWrapper(props) {
  const { canUseExpression, children, componentType, dataScope, id, isPlatformAdmin, onChange, plan, property, propertyType, styles = importedStyles, value } = props;

  const { language } = useLanguage();

  const safeValue = useMemo(() => (value && typeof value === "object" && !Array.isArray(value) && value.type === "expression" ? value : { type: "static", value: propertyType === "items" ? (Array.isArray(value) ? value : []) : (value ?? "") }), [propertyType, value]);

  const isExpression = safeValue?.type === "expression";
  const isArray = propertyType === "items";

  const staticValue = isExpression ? (safeValue.fallback ?? (isArray ? [] : "")) : safeValue.value;

  const [isOpen, setIsOpen] = useState(false);

  const changeMode = useCallback(
    (newMode) => {
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
    },
    [onChange, staticValue],
  );

  const handleStaticChange = useCallback(
    (newValue) => {
      if (isExpression) {
        onChange({
          ...safeValue,
          fallback: newValue,
        });
      } else {
        onChange(newValue);
      }
    },
    [isExpression, onChange, safeValue],
  );

  const onChangeChecked = useCallback(
    (checked) => {
      changeMode(checked ? "Expression" : "Static");
    },
    [changeMode],
  );

  const onChangeExpressionEditorDialog = useCallback(
    (expr) => {
      onChange({ ...safeValue, expression: expr });
    },
    [onChange, safeValue],
  );

  function onClick(e) {
    setIsOpen(true);
  }

  function onClose(e) {
    setIsOpen(false);
  }

  const childValue = useMemo(
    () => ({
      value: staticValue,
      onChange: handleStaticChange,
    }),
    [handleStaticChange, staticValue],
  );

  return (
    <div className={styles.binding_wrapper}>
      {children(childValue)}
      {canUseExpression && !property?.isExpressionUnsupported && (
        <div className={styles.binding_mode}>
          <DarkSwitch checked={isExpression} id={id + "-expression"} onChangeChecked={onChangeChecked} text={platform.websiteAdmin.pages.editor.useExpression[language]} />
        </div>
      )}
      {isExpression && canUseExpression && !property?.isExpressionUnsupported && <DarkButton onClick={onClick}>{platform.websiteAdmin.pages.editor.changeExpression[language]}</DarkButton>}
      {isExpression && canUseExpression && !property?.isExpressionUnsupported && <ExpressionEditorDialog componentType={componentType} dataScope={dataScope} expectedType={getExpectedType(propertyType)} expression={safeValue.expression} isOpen={isOpen} isPlatformAdmin={isPlatformAdmin} onChange={onChangeExpressionEditorDialog} onClose={onClose} plan={plan} />}
    </div>
  );
}

function getExpectedType(propertyType) {
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
