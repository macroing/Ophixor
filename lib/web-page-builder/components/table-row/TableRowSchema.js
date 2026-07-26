// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createTableRowSchema() {
  return {
    defaultSlots: {
      body: [],
    },
    description: "A component that represents a row in a table.",
    editor: {
      defaultOpenGroups: {
        layout: [],
        selectors: [],
        styling: ["Typography"],
      },
      roleGroupOrder: {
        layout: ["Spacing"],
        selectors: ["Selectors"],
        styling: ["Typography", "Theme"],
      },
      roleOrder: ["styling", "layout", "selectors"],
    },
    exportCSS: (tableRow = null, tableRowSchema = null) => {
      if (tableRow && tableRowSchema) {
        const props = exportCSSFromProps(tableRow, tableRowSchema);

        if (props.length > 0) {
          return `
      .${tableRow.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .table-row {
        --table-row-color: var(--pc-semantic-text-primary);
        --table-row-padding: 0px;

        background-color: var(--pc-semantic-surface-base);
        color: var(--table-row-color);
        padding: var(--table-row-padding);
      }

      .table-row.table-row-danger {
        background-color: var(--pc-semantic-status-danger-bg);
        color: var(--pc-semantic-status-danger-text);
      }

      .table-row.table-row-success {
        background-color: var(--pc-semantic-status-success-bg);
        color: var(--pc-semantic-status-success-text);
      }

      .table-row.table-row-warning {
        background-color: var(--pc-semantic-status-warning-bg);
        color: var(--pc-semantic-status-warning-text);
      }
`;
      }
    },
    exportHTML: (tableRow, tableRowSchema, pageSchema, indentation) => {
      return `${indentation}<tr class="table-row ${tableRow?.id}${tableRow?.props?.theme === "danger" ? " table-row-danger" : tableRow?.props?.theme === "success" ? " table-row-success" : tableRow?.props?.theme === "warning" ? " table-row-warning" : ""}" data-pc-id="${tableRow?.id || ""}">
${tableRow?.slots?.body || ""}${(tableRow?.slots?.body || "").trim() === "" ? "\n" : ""}${indentation}</tr>`;
    },
    isAllowingChildComponents: true,
    label: "Table row",
    plan: "Personal",
    props: {
      color: {
        cssProperty: "color",
        cssVariableName: "--table-row-color",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
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
        cssVariableName: "--table-row-padding",
        defaultValue: "0px",
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
        allowedChildComponents: ["Element", "TableData", "TableHeader"],
      },
    },
  };
}
