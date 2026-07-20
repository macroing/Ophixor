// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight } from "@fortawesome/pro-solid-svg-icons";

import Icon from "./Icon";
import { useLanguage } from "@/context/language";

import platformData from "@/definitions/platform-data.json" with { type: "json" };

import importedStyles from "./Segmented.module.css";

export default function Segmented(props) {
  const cssProperty = props.cssProperty;
  const disabled = props.disabled;
  const onChange = props.onChange;
  const options = props.options;
  const styles = props.styles || importedStyles;
  const value = props.value;

  const { language } = useLanguage();

  function getIconOrText(option) {
    if (cssProperty === "text-align") {
      switch (option) {
        case "center":
          return <Icon icon={faAlignCenter} size={16} />;
        case "justify":
          return <Icon icon={faAlignJustify} size={16} />;
        case "left":
          return <Icon icon={faAlignLeft} size={16} />;
        case "right":
          return <Icon icon={faAlignRight} size={16} />;
        default:
          return platformData.component.props[option]?.[language] ?? option;
      }
    }

    return platformData.component.props[option]?.[language] ?? option;
  }

  return (
    <div className={styles.segmented + (options.length < 3 || true ? " " + styles.segmented_two : "") /*+ (options.length === 4 ? " " + styles.segmented_four : "")*/}>
      {options.map((option) => (
        <button className={`${styles.segment} ${value === option ? styles.active : ""}`} disabled={disabled} key={option} onClick={() => onChange(option)} type="button">
          {getIconOrText(option)}
        </button>
      ))}
    </div>
  );
}
