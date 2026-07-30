// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createTabPaneItemSchema() {
  return {
    description: "",
    editor: {
      defaultOpenGroups: {
        content: [],
        selectors: [],
        visibility: [],
      },
      roleGroupOrder: {
        content: ["Content"],
        selectors: ["Selectors"],
        visibility: ["Visibility"],
      },
      roleOrder: ["content", "visibility", "selectors"],
    },
    exportCSS: (tabPaneItem = null, tabPaneItemSchema = null) => {
      return "";
    },
    exportHTML: (tabPaneItem, tabPaneItemSchema, pageSchema, indentation) => {
      return "";
    },
    isAllowingChildComponents: true,
    label: "TabPaneItem",
    plan: "Pro",
    props: {
      title: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "Lorem ipsum",
        isExpressionUnsupported: true,
        label: "Title",
        role: "content",
        roleGroup: "Content",
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
    slots: {
      body: {
        allowedChildComponents: ["Accordion", "Button", "Divider", "Grid", "Element", "Form", "Heading", "Icon", "Image", "Link", "List", "RichText", "Section", "Spacer", "Spinner", "TabPane", "Table", "Text"],
      },
    },
  };
}
