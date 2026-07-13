// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createTableSchema() {
  return {
    defaultSlots: {
      body: [],
      header: [],
    },
    description: "A component that contains mainly tabular data.",
    editor: {
      defaultOpenGroups: {
        layout: ["Size"],
        selectors: [],
        styling: [],
      },
      roleGroupOrder: {
        layout: ["Size", "Header", "Body"],
        selectors: ["Selectors"],
        styling: ["Surface", "Border", "Effects"],
      },
      roleOrder: ["layout", "styling", "selectors"],
    },
    exportCSS: (table = null, tableSchema = null) => {
      if (table && tableSchema) {
        const props = exportCSSFromProps(table, tableSchema);

        for (let i = props.length - 1; i >= 0; i--) {
          if (props[i] === "--table-border-collapse: collapse;") {
            props.splice(i, 1);
          }
        }

        if (props.length > 0) {
          return `
      .${table.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .table {
        --table-background: none;
        --table-background-color: transparent;
        --table-border-collapse: separate;
        --table-border-color: var(--pc-semantic-border-default);
        --table-border-radius: 14px;
        --table-border-spacing: 0.5rem;
        --table-border-width: 1px;
        --table-box-shadow: var(--pc-semantic-shadow-sm);
        --table-color: var(--pc-semantic-text-primary);
        --table-height: auto;
        --table-max-height: none;
        --table-max-width: none;
        --table-min-height: 0px;
        --table-min-width: 0px;
        --table-padding-body: 0px;
        --table-padding-header: 0px;
        --table-width: auto;

        background: var(--table-background);
        background-color: var(--table-background-color);
        border: var(--table-border-width) solid var(--table-border-color);
        border-collapse: var(--table-border-collapse);
        border-radius: var(--table-border-radius);
        border-spacing: var(--table-border-spacing);
        box-shadow: var(--table-box-shadow);
        color: var(--table-color);
        height: var(--table-height);
        max-height: var(--table-max-height);
        max-width: var(--table-max-width);
        min-height: var(--table-min-height);
        min-width: var(--table-min-width);
        overflow: hidden;
        width: var(--table-width);
      }

      .table > thead:first-child > tr:first-child > th:first-child, .table > tbody:first-child > tr:first-child > td:first-child {
        border-top-left-radius: var(--table-border-radius);
      }

      .table > thead:first-child > tr:first-child > th:last-child, .table > tbody:first-child > tr:first-child > td:last-child {
        border-top-right-radius: var(--table-border-radius);
      }

      .table > tbody:last-child > tr:last-child > td:first-child {
        border-bottom-left-radius: var(--table-border-radius);
      }

      .table > tbody:last-child > tr:last-child > td:last-child {
        border-bottom-right-radius: var(--table-border-radius);
      }

      .table.table-collapse {
        border-spacing: 0px;
      }

      .table.table-collapse th, .table.table-collapse td {
        border: none;
      }

      .table.table-collapse th, .table.table-collapse td {
        border-right: var(--table-border-width) solid var(--table-border-color);
        border-bottom: var(--table-border-width) solid var(--table-border-color);
      }

      .table.table-collapse tr > td:last-child, .table.table-collapse tr > th:last-child {
        border-right: none;
      }

      .table.table-collapse tr:last-child > td, .table.table-collapse tr:last-child > th {
        border-bottom: none;
      }

      .table.table-collapse:has(tbody tr) > thead > tr:last-child > td, .table.table-collapse:has(tbody tr) > thead > tr:last-child > th {
        border-bottom: var(--table-border-width) solid var(--table-border-color);
      }

      .table > .table-body {
        padding: var(--table-padding-body);
      }

      .table > .table-body:empty {
        padding: 0px;
      }

      .table > .table-header {
        padding: var(--table-padding-header);
      }

      .table > .table-header:empty {
        padding: 0px;
      }
`;
      }
    },
    exportHTML: (table, tableSchema, pageSchema, indentation) => {
      const bodyHTML = table?.slots?.body || "";
      const headerHTML = table?.slots?.header || "";

      const hasBody = !!bodyHTML.trim();
      const hasHeader = !!headerHTML.trim();

      const isHeaderFirst = hasHeader;
      const isHeaderLast = hasHeader && !hasBody;

      const isBodyFirst = !hasHeader && hasBody;
      const isBodyLast = hasBody;

      let isCollapse = false;

      if (table?.props?.borderCollapse === "collapse") {
        isCollapse = true;
      }

      return `${indentation}<table class="table${isCollapse ? " table-collapse" : ""} ${table?.id}" data-pc-id="${table?.id || ""}">${hasHeader ? `\n${indentation + "  "}<thead class="table-header${isHeaderFirst ? " table-header-first" : ""}${isHeaderLast ? " table-header-last" : ""}">\n` + headerHTML + `${indentation + "  "}</thead>` : ""}${hasBody ? `\n${indentation + "  "}<tbody class="table-body${isBodyFirst ? " table-body-first" : ""}${isBodyLast ? " table-body-last" : ""}">\n` + bodyHTML + `${indentation + "  "}</tbody>` : ""}\n${indentation}</table>`;
    },
    isAllowingChildComponents: true,
    label: "Table",
    plan: "Personal",
    props: {
      width: {
        cssProperty: "width",
        cssVariableName: "--table-width",
        defaultValue: "auto",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minWidth: {
        cssProperty: "min-width",
        cssVariableName: "--table-min-width",
        defaultValue: "0px",
        label: "Minimum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxWidth: {
        cssProperty: "max-width",
        cssVariableName: "--table-max-width",
        defaultValue: "none",
        label: "Maximum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--table-height",
        defaultValue: "auto",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minHeight: {
        cssProperty: "min-height",
        cssVariableName: "--table-min-height",
        defaultValue: "0px",
        label: "Minimum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxHeight: {
        cssProperty: "max-height",
        cssVariableName: "--table-max-height",
        defaultValue: "none",
        label: "Maximum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      paddingHeader: {
        cssProperty: "padding",
        cssVariableName: "--table-padding-header",
        defaultValue: "0px",
        label: "Padding - Header",
        role: "layout",
        roleGroup: "Header",
        schemaType: "string",
        type: "text",
      },
      paddingBody: {
        cssProperty: "padding",
        cssVariableName: "--table-padding-body",
        defaultValue: "0px",
        label: "Padding - Body",
        role: "layout",
        roleGroup: "Body",
        schemaType: "string",
        type: "text",
      },
      background: {
        cssProperty: "background",
        cssVariableName: "--table-background",
        defaultValue: "none",
        label: "Background",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--table-background-color",
        defaultValue: "transparent",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--table-color",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--table-border-width",
        defaultValue: "1px",
        label: "Border width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--table-border-color",
        defaultValue: "var(--pc-semantic-border-default)",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--table-border-radius",
        defaultValue: "14px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderCollapse: {
        cssProperty: "border-collapse",
        cssVariableName: "--table-border-collapse",
        defaultValue: "separate",
        label: "Border collapse",
        options: [
          { label: "Collapse", value: "collapse" },
          { label: "Separate", value: "separate" },
        ],
        role: "styling",
        roleGroup: "Border",
        schemaType: "enum<string>",
        type: "select",
      },
      borderSpacing: {
        cssProperty: "border-spacing",
        cssVariableName: "--table-border-spacing",
        defaultValue: "0.5rem",
        label: "Border spacing",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      boxShadow: {
        cssProperty: "box-shadow",
        cssVariableName: "--table-box-shadow",
        defaultValue: "var(--pc-semantic-shadow-sm)",
        label: "Box shadow",
        role: "styling",
        roleGroup: "Effects",
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
        allowedChildComponents: ["Element", "TableRow"],
      },
      header: {
        allowedChildComponents: ["Element", "TableRow"],
      },
    },
  };
}
