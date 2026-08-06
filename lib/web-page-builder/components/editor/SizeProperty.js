// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useState } from "react";

import { DarkInput } from "../input/Input";
import { DarkSelect } from "../select/Select";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

import importedStyles from "./SizeProperty.module.css";

export default function SizeProperty(props) {
  const styles = props.styles || importedStyles;
  const update = props.update;
  const value = typeof props.value === "string" || typeof props.value === "number" ? String(props.value) : "";

  const keywords = ["auto", "max-content", "min-content", "fit-content", "stretch"];
  const globals = ["inherit", "initial", "revert", "revert-layer", "unset"];
  const functions = ["calc", "clamp", "min", "max", "fit-content"];

  const numberMatch = value.match(/^(-?\d*\.?\d+)([a-z%]*)$/i);
  const functionMatch = functions.find((fn) => value.startsWith(fn + "("));

  const isKeyword = keywords.includes(value);
  const isGlobal = globals.includes(value);
  const isFunction = !!functionMatch && value.endsWith(")");
  const isNumber = !!numberMatch && !isKeyword && !isGlobal && !isFunction;

  const { language } = useLanguage();

  const [mode, setMode] = useState("fixed");

  const numberValue = isNumber ? numberMatch[1] : "";
  const numberUnit = isNumber ? numberMatch[2] || "px" : "px";

  const functionName = isFunction ? functionMatch : "";
  const functionInner = isFunction && functionName ? value.substring(functionName.length + 1, value.length - 1) : "";

  function switchMode(newMode) {
    setMode(newMode);

    switch (newMode) {
      case "fixed":
        if (!isNumber) {
          update("100px");
        }

        break;
      case "intrinsic":
        update("auto");

        break;
      case "function":
        update("clamp(0px, 100%, 1000px)");

        break;
      case "global":
        update("inherit");

        break;
      case "raw":
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (isNumber) {
      setMode("fixed");
    } else if (isKeyword) {
      setMode("intrinsic");
    } else if (isFunction) {
      setMode("function");
    } else if (isGlobal) {
      setMode("global");
    } else {
      setMode("raw");
    }
  }, [value]);

  return (
    <div className={styles.size_property}>
      <DarkSelect
        onChange={(e) => switchMode(e.target.value)}
        value={mode}
        options={[
          { label: platform.websiteAdmin.pages.editor.fixed[language], value: "fixed" },
          { label: platform.websiteAdmin.pages.editor.intrinsic[language], value: "intrinsic" },
          { label: platform.websiteAdmin.pages.editor.function[language], value: "function" },
          { label: platform.websiteAdmin.pages.editor.global[language], value: "global" },
          { label: platform.websiteAdmin.pages.editor.raw[language], value: "raw" },
        ]}
      />
      {mode === "fixed" && (
        <div className={styles.inline_group}>
          <DarkInput isDebounceDisabled={true} onChange={(e) => update(e.target.value + (numberUnit || "px"))} type="number" value={numberValue} />
          <DarkSelect
            onChange={(e) => update(numberValue + e.target.value)}
            value={numberUnit}
            options={[
              { label: "px", value: "px" },
              { label: "%", value: "%" },
              { label: "rem", value: "rem" },
              { label: "em", value: "em" },
              { label: "vw", value: "vw" },
              { label: "vh", value: "vh" },
              { label: "cqw", value: "cqw" },
              { label: "cqh", value: "cqh" },
              { label: "cqi", value: "cqi" },
              { label: "cqb", value: "cqb" },
            ]}
          />
        </div>
      )}
      {mode === "intrinsic" && (
        <DarkSelect
          onChange={(e) => update(e.target.value)}
          value={value}
          options={[
            ...keywords.map((k) => {
              return { label: k, value: k };
            }),
          ]}
        />
      )}
      {mode === "function" && (
        <div className={styles.inline_group}>
          <DarkSelect
            onChange={(e) => update(e.target.value + "(" + functionInner + ")")}
            value={functionName}
            options={[
              ...functions.map((fn) => {
                return { label: fn, value: fn };
              }),
            ]}
          />
          <DarkInput isDebounceDisabled={true} onChange={(e) => update(functionName + "(" + e.target.value + ")")} value={functionInner} />
        </div>
      )}
      {mode === "global" && (
        <DarkSelect
          onChange={(e) => update(e.target.value)}
          value={value}
          options={[
            ...globals.map((g) => {
              return { label: g, value: g };
            }),
          ]}
        />
      )}
      {mode === "raw" && <DarkInput isDebounceDisabled={true} onChange={(e) => update(e.target.value)} placeholder={platform.websiteAdmin.pages.editor.enterCSSValue[language]} value={value} />}
    </div>
  );
}
