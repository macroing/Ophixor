// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createTabPaneSchema() {
  return {
    description: "",
    editor: {
      defaultOpenGroups: {
        selectors: [],
        styling: ["Surface"],
        visibility: [],
      },
      roleGroupOrder: {
        selectors: ["Selectors"],
        styling: ["Surface", "Border", "Effects", "Typography"],
        visibility: ["Visibility"],
      },
      roleOrder: ["styling", "visibility", "selectors"],
    },
    exportCSS: (tabPane = null, tabPaneSchema = null) => {
      return "";
    },
    exportHTML: (tabPane, tabPaneSchema, pageSchema, indentation) => {
      return "";
    },
    isAllowingChildComponents: true,
    label: "TabPane",
    plan: "Pro",
    props: {
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--tab-pane-background-color",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backgroundColorTab: {
        cssProperty: "background-color",
        cssVariableName: "--tab-pane-background-color-tab",
        defaultValue: "var(--pc-semantic-surface-page)",
        label: "Background color - Tab",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backgroundColorTabSelected: {
        cssProperty: "background-color",
        cssVariableName: "--tab-pane-background-color-tab-selected",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color - Tab - Selected",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backgroundColorTabs: {
        cssProperty: "background-color",
        cssVariableName: "--tab-pane-background-color-tabs",
        defaultValue: "var(--pc-semantic-surface-page)",
        label: "Background color - Tabs",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--tab-pane-border-color",
        defaultValue: "var(--pc-semantic-border-default)",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderColorTabBottomSelected: {
        cssProperty: "border-color",
        cssVariableName: "--tab-pane-border-color-tab-bottom-selected",
        defaultValue: "var(--pc-semantic-interactive-primary)",
        label: "Border color - Tab - Bottom - Selected",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      boxShadow: {
        cssProperty: "box-shadow",
        cssVariableName: "--tab-pane-box-shadow",
        defaultValue: "var(--pc-semantic-shadow-sm)",
        label: "Box shadow",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      colorTab: {
        cssProperty: "color",
        cssVariableName: "--tab-pane-color-tab",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color - Tab",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorTabSelected: {
        cssProperty: "color",
        cssVariableName: "--tab-pane-color-tab-selected",
        defaultValue: "var(--pc-semantic-interactive-primary)",
        label: "Color - Tab - Selected",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      isVisible: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: true,
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
    slots: {
      body: {
        allowedChildComponents: ["TabPaneItem"],
      },
    },
  };
}
