// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createRatingSchema() {
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
    exportCSS: (rating = null, ratingSchema = null) => {
      return "";
    },
    exportHTML: (rating, ratingSchema, pageSchema, indentation) => {
      return "";
    },
    isAllowingChildComponents: false,
    label: "Rating",
    plan: "Pro",
    props: {
      value: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: 0,
        label: "Value",
        role: "content",
        roleGroup: "Content",
        schemaType: "number",
        type: "number",
      },
      readOnly: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: false,
        label: "Read only",
        role: "content",
        roleGroup: "Content",
        schemaType: "boolean",
        type: "switch",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--rating-color",
        defaultValue: "var(--pc-foundation-color-slate-300)",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorHover: {
        cssProperty: "color",
        cssVariableName: "--rating-color-hover",
        defaultValue: "var(--pc-foundation-color-slate-300)",
        label: "Color - Hover",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorSelected: {
        cssProperty: "color",
        cssVariableName: "--rating-color-selected",
        defaultValue: "var(--pc-semantic-interactive-primary)",
        label: "Color - Selected",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorSelectedHover: {
        cssProperty: "color",
        cssVariableName: "--rating-color-selected-hover",
        defaultValue: "var(--pc-semantic-interactive-primary)",
        label: "Color - Selected - Hover",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      fontSize: {
        cssProperty: "font-size",
        cssVariableName: "--rating-font-size",
        defaultValue: "1rem",
        label: "Font size",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      cursor: {
        cssProperty: "cursor",
        cssVariableName: "--rating-cursor",
        defaultValue: "pointer",
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
