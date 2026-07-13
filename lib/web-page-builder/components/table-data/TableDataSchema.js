// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createTableDataSchema() {
  return {
    defaultSlots: {
      body: [],
    },
    description: "A component that contains the tabular data for a column in a row of a table.",
    editor: {
      defaultOpenGroups: {
        layout: [],
        selectors: [],
        styling: ["Typography"],
      },
      roleGroupOrder: {
        layout: ["Spacing"],
        selectors: ["Selectors"],
        styling: ["Typography", "Surface"],
      },
      roleOrder: ["styling", "layout", "selectors"],
    },
    exportCSS: (tableData = null, tableDataSchema = null) => {
      if (tableData && tableDataSchema) {
        const props = exportCSSFromProps(tableData, tableDataSchema);

        if (props.length > 0) {
          return `
      .${tableData.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .table-data {
        --table-data-background-color: var(--pc-semantic-surface-base);
        --table-data-color: var(--pc-semantic-text-primary);
        --table-data-padding: 0.5rem;
        --table-data-text-align: center;
        --table-data-vertical-align: top;

        background-color: var(--table-data-background-color);
        color: var(--table-data-color);
        padding: var(--table-data-padding);
        text-align: var(--table-data-text-align);
        vertical-align: var(--table-data-vertical-align);
      }
`;
      }
    },
    exportHTML: (tableData, tableDataSchema, pageSchema, indentation) => {
      return `${indentation}<td class="table-data ${tableData?.id}" data-pc-id="${tableData?.id || ""}">
${tableData?.slots?.body || ""}${(tableData?.slots?.body || "").trim() === "" ? "\n" : ""}${indentation}</td>`;
    },
    isAllowingChildComponents: true,
    label: "Table data",
    plan: "Personal",
    props: {
      color: {
        cssProperty: "color",
        cssVariableName: "--table-data-color",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      textAlign: {
        cssProperty: "text-align",
        cssVariableName: "--table-data-text-align",
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
        cssVariableName: "--table-data-background-color",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      padding: {
        cssProperty: "padding",
        cssVariableName: "--table-data-padding",
        defaultValue: "0.5rem",
        label: "Padding",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      verticalAlign: {
        cssProperty: "vertical-align",
        cssVariableName: "--table-data-vertical-align",
        defaultValue: "top",
        label: "Vertical align",
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
        allowedChildComponents: ["Badge", "Element", "Link", "Spinner", "Text"],
      },
    },
  };
}
