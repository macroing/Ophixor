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
        styling: ["Typography"],
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

        color: var(--table-row-color);
        padding: var(--table-row-padding);
      }
`;
      }
    },
    exportHTML: (tableRow, tableRowSchema, pageSchema, indentation) => {
      return `${indentation}<tr class="table-row ${tableRow?.id}" data-pc-id="${tableRow?.id || ""}">
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
