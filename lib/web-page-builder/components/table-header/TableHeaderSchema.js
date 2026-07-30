// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createTableHeaderSchema() {
  return {
    defaultSlots: {
      body: [],
    },
    description: "A component that contains the header for a column in a row of a table.",
    editor: {
      defaultOpenGroups: {
        layout: [],
        selectors: [],
        styling: ["Typography"],
      },
      roleGroupOrder: {
        layout: ["Spacing"],
        selectors: ["Selectors"],
        styling: ["Typography", "Surface", "Theme"],
      },
      roleOrder: ["styling", "layout", "selectors"],
    },
    exportCSS: (tableHeader = null, tableHeaderSchema = null) => {
      if (tableHeader && tableHeaderSchema) {
        const props = exportCSSFromProps(tableHeader, tableHeaderSchema);

        if (props.length > 0) {
          return `
      .${tableHeader.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .table-header {
        --table-header-background-color: var(--pc-semantic-surface-page);
        --table-header-color: var(--pc-semantic-text-primary);
        --table-header-padding: 0.5rem 1rem;
        --table-header-text-align: center;

        background-color: var(--table-header-background-color);
        color: var(--table-header-color);
        padding: var(--table-header-padding);
        text-align: var(--table-header-text-align);
        vertical-align: top;
      }

      .table-header.table-header-danger {
        background-color: var(--pc-semantic-status-danger-bg);
        color: var(--pc-semantic-status-danger-text);
      }

      .table-header.table-header-success {
        background-color: var(--pc-semantic-status-success-bg);
        color: var(--pc-semantic-status-success-text);
      }

      .table-header.table-header-warning {
        background-color: var(--pc-semantic-status-warning-bg);
        color: var(--pc-semantic-status-warning-text);
      }
`;
      }
    },
    exportHTML: (tableHeader, tableHeaderSchema, pageSchema, indentation) => {
      return `${indentation}<th class="table-header ${tableHeader?.id}${tableHeader?.props?.theme === "danger" ? " table-header-danger" : tableHeader?.props?.theme === "success" ? " table-header-success" : tableHeader?.props?.theme === "warning" ? " table-header-warning" : ""}" data-pc-id="${tableHeader?.id || ""}">
${tableHeader?.slots?.body || ""}${(tableHeader?.slots?.body || "").trim() === "" ? "\n" : ""}${indentation}</th>`;
    },
    isAllowingChildComponents: true,
    label: "Table header",
    plan: "Personal",
    props: {
      color: {
        cssProperty: "color",
        cssVariableName: "--table-header-color",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      textAlign: {
        cssProperty: "text-align",
        cssVariableName: "--table-header-text-align",
        defaultValue: "center",
        label: "Text align",
        options: [
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
          { label: "Center", value: "center" },
          { label: "Justify", value: "justify" },
        ],
        role: "styling",
        roleGroup: "Typography",
        schemaType: "enum<string>",
        type: "select",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--table-header-background-color",
        defaultValue: "var(--pc-semantic-surface-page)",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      theme: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Theme",
        options: [
          { label: "Default", value: "" },
          { label: "Success", value: "success" },
          { label: "Danger", value: "danger" },
          { label: "Warning", value: "warning" },
        ],
        role: "styling",
        roleGroup: "Theme",
        schemaType: "enum<string>",
        type: "select",
      },
      padding: {
        cssProperty: "padding",
        cssVariableName: "--table-header-padding",
        defaultValue: "0.5rem 1rem",
        label: "Padding",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
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
        allowedChildComponents: ["Badge", "Element", "Icon", "Link", "Spinner", "Text"],
      },
    },
  };
}
