// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useState } from "react";

import { DarkInput } from "../input/Input";
import { DarkSelect } from "../select/Select";

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
          { label: "Fixed", value: "fixed" },
          { label: "Intrinsic", value: "intrinsic" },
          { label: "Function", value: "function" },
          { label: "Global", value: "global" },
          { label: "Raw", value: "raw" },
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
      {mode === "raw" && <DarkInput isDebounceDisabled={true} onChange={(e) => update(e.target.value)} placeholder="Enter custom CSS value" value={value} />}
    </div>
  );
}
