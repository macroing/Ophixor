// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo, useState } from "react";

import { DarkInput } from "../input/Input";
import { DarkSelect } from "../select/Select";

import importedStyles from "./UnitInput.module.css";

const MULTI_VALUE_PROPS = ["margin", "padding", "border-radius", "border-width", "inset"];

const keywords = ["auto", "normal"];
const globals = ["inherit", "initial", "revert", "revert-layer", "unset"];
const functions = ["calc", "clamp", "min", "max"];

const UNITS = ["px", "%", "rem", "em", "vw", "vh", "cqw", "cqh", "cqi", "cqb"];

export default function UnitInput(props) {
  const cssProperty = props.cssProperty;
  const onChange = props.onChange;
  const styles = props.styles || importedStyles;

  const value = typeof props.value === "string" || typeof props.value === "number" ? String(props.value) : "";

  const isMulti = MULTI_VALUE_PROPS.includes(cssProperty);

  const parsed = useMemo(() => parseValue(value), [value]);

  const numberMatch = value.match(/^(-?\d*\.?\d+)([a-z%]*)$/i);
  const functionMatch = functions.find((fn) => value.startsWith(fn + "("));

  const isKeyword = keywords.includes(value);
  const isGlobal = globals.includes(value);
  const isFunction = !!functionMatch && value.endsWith(")");
  const isNumber = !!numberMatch && !isKeyword && !isGlobal && !isFunction;

  const [mode, setMode] = useState(detectMode(value));

  function detectMode(v) {
    const numberMatch = v.match(/^(-?\d*\.?\d+)([a-z%]*)$/i);
    const functionMatch = functions.find((fn) => v.startsWith(fn + "("));

    if (numberMatch) {
      return "fixed";
    }

    if (keywords.includes(v)) {
      return "intrinsic";
    }

    if (functionMatch && v.endsWith(")")) {
      return "function";
    }

    if (globals.includes(v)) {
      return "global";
    }

    return "raw";
  }

  function formatValue(values) {
    if (!isMulti) {
      return values[0];
    }

    const [t, r, b, l] = values;

    if (t === r && t === b && t === l) {
      return t;
    }

    if (t === b && r === l) {
      return `${t} ${r}`;
    }

    if (r === l) {
      return `${t} ${r} ${b}`;
    }

    return `${t} ${r} ${b} ${l}`;
  }

  function parseNumberUnit(v) {
    const match = v.match(/^(-?\d*\.?\d+)([a-z%]*)$/i);

    return match ? { number: match[1], unit: match[2] || "px" } : { number: "", unit: "px" };
  }

  function parseValue(v) {
    if (!v) {
      return ["", "", "", ""];
    }

    const parts = v.trim().split(/\s+/);

    if (parts.length === 1) {
      return [parts[0], parts[0], parts[0], parts[0]];
    }

    if (parts.length === 2) {
      return [parts[0], parts[1], parts[0], parts[1]];
    }

    if (parts.length === 3) {
      return [parts[0], parts[1], parts[2], parts[1]];
    }

    if (parts.length === 4) {
      return parts;
    }

    return ["", "", "", ""];
  }

  function renderFixed() {
    if (!isMulti) {
      const { number, unit } = parseNumberUnit(value);

      return (
        <div className={styles.inline_group}>
          <DarkInput onChange={(e) => onChange(e.target.value + unit)} type="number" value={number} />
          <DarkSelect onChange={(e) => onChange(number + e.target.value)} options={UNITS.map((u) => ({ label: u, value: u }))} value={unit} />
        </div>
      );
    }

    const labels = ["Top", "Right", "Bottom", "Left"];

    return (
      <div className={styles.grid_4}>
        {parsed.map((v, i) => {
          const { number, unit } = parseNumberUnit(v);

          return (
            <div className={styles.side} key={i}>
              <span>{labels[i]}</span>
              <DarkInput
                onChange={(e) => {
                  const next = [...parsed];

                  next[i] = e.target.value + unit;

                  onChange(formatValue(next));
                }}
                type="number"
                value={number}
              />
              <DarkSelect
                onChange={(e) => {
                  const next = [...parsed];
                  next[i] = number + e.target.value;
                  onChange(formatValue(next));
                }}
                options={UNITS.map((u) => ({ label: u, value: u }))}
                value={unit}
              />
            </div>
          );
        })}
      </div>
    );
  }

  function switchMode(nextMode) {
    setMode(nextMode);

    switch (nextMode) {
      case "fixed": {
        const parsed = parseValue(value);

        if (parsed.some(Boolean)) {
          onChange(formatValue(parsed));
        } else {
          onChange("0px");
        }

        break;
      }
      case "intrinsic": {
        if (keywords.includes(value)) {
          onChange(value);
        } else {
          onChange("auto");
        }

        break;
      }
      case "function": {
        if (functions.some((fn) => value.startsWith(fn + "("))) {
          onChange(value);
        } else {
          onChange("clamp(0px, 100%, 1000px)");
        }

        break;
      }
      case "global": {
        if (globals.includes(value)) {
          onChange(value);
        } else {
          onChange("inherit");
        }

        break;
      }
      case "raw":
        break;
    }
  }

  return (
    <div className={styles.unit_input + (mode === "fixed" ? " " + styles.unit_input_fixed : "")}>
      <DarkSelect
        onChange={(e) => switchMode(e.target.value)}
        options={[
          { label: "Fixed", value: "fixed" },
          { label: "Intrinsic", value: "intrinsic" },
          { label: "Function", value: "function" },
          { label: "Global", value: "global" },
          { label: "Raw", value: "raw" },
        ]}
        value={mode}
      />
      {mode === "fixed" && renderFixed()}
      {mode === "intrinsic" && <DarkSelect onChange={(e) => onChange(e.target.value)} options={keywords.map((k) => ({ label: k, value: k }))} value={value} />}
      {mode === "function" && <DarkInput onChange={(e) => onChange(e.target.value)} value={value} />}
      {mode === "global" && <DarkSelect onChange={(e) => onChange(e.target.value)} options={globals.map((g) => ({ label: g, value: g }))} value={value} />}
      {mode === "raw" && <DarkInput onChange={(e) => onChange(e.target.value)} placeholder="Enter CSS value" value={value} />}
    </div>
  );
}
