// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createAccordionItemSchema() {
  return {
    description: "",
    editor: {
      defaultOpenGroups: {
        content: ["Content"],
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
    exportCSS: (accordionItem = null, accordionItemSchema = null) => {
      return "";
    },
    exportHTML: (accordionItem, accordionItemSchema, pageSchema, indentation) => {
      return "";
    },
    isAllowingChildComponents: true,
    label: "AccordionItem",
    plan: "Pro",
    props: {
      title: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "Lorem ipsum",
        label: "Title",
        role: "content",
        roleGroup: "Content",
        schemaType: "string",
        type: "text",
      },
      isExpanded: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: false,
        label: "Is expanded",
        role: "content",
        roleGroup: "Content",
        schemaType: "boolean",
        type: "switch",
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
