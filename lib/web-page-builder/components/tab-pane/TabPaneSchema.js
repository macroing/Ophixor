// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createTabPaneSchema() {
  return {
    description: "",
    editor: {
      defaultOpenGroups: {
        selectors: [],
        visibility: [],
      },
      roleGroupOrder: {
        selectors: ["Selectors"],
        visibility: ["Visibility"],
      },
      roleOrder: ["visibility", "selectors"],
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
