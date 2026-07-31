// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createIconSchema() {
  return {
    description: "",
    editor: {
      defaultOpenGroups: {
        content: ["Content"],
        selectors: [],
        styling: ["Typography"],
        visibility: [],
      },
      roleGroupOrder: {
        content: ["Content"],
        selectors: ["Selectors"],
        styling: ["Typography", "Surface"],
        visibility: ["Visibility"],
      },
      roleOrder: ["content", "styling", "visibility", "selectors"],
    },
    exportCSS: (icon = null, iconSchema = null) => {
      return "";
    },
    exportHTML: (icon, iconSchema, pageSchema, indentation) => {
      return "";
    },
    isAllowingChildComponents: true,
    label: "Icon",
    plan: "Pro",
    props: {
      icon: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "fa-question",
        label: "Icon",
        options: [
          { label: "Clock - Rotate left", value: "fa-clock-rotate-left" },
          { label: "Cookie", value: "fa-cookie" },
          { label: "File - Contract", value: "fa-file-contract" },
          { label: "File - Lines", value: "fa-file-lines" },
          { label: "Question", value: "fa-question" },
          { label: "Shield", value: "fa-shield" },
          { label: "Table cells - Large", value: "fa-table-cells-large" },
          { label: "User", value: "fa-user" },
        ],
        role: "content",
        roleGroup: "Content",
        schemaType: "enum<string>",
        type: "select",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--icon-color",
        defaultValue: "inherit",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorHover: {
        cssProperty: "color",
        cssVariableName: "--icon-color-hover",
        defaultValue: "inherit",
        label: "Color - Hover",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      cursor: {
        cssProperty: "cursor",
        cssVariableName: "--icon-cursor",
        defaultValue: "auto",
        label: "Cursor",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      isVisible: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: true,
        isExpressionUnsupported: true,
        label: "Is visible",
        role: "visibility",
        roleGroup: "Visibility",
        schemaType: "boolean",
        type: "switch",
      },
      selectors: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: [],
        label: "Selectors",
        role: "selectors",
        roleGroup: "Selectors",
        schemaType: "array",
        type: "selectors",
      },
    },
    slots: {},
  };
}
