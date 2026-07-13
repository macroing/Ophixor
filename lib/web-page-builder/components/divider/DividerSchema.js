// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createDividerSchema() {
  return {
    defaultSlots: {},
    description: "A way to divide content vertically; the content above the divider and the content below it.",
    editor: {
      defaultOpenGroups: {
        layout: ["Spacing"],
        selectors: [],
        styling: ["Line"],
      },
      roleGroupOrder: {
        layout: ["Spacing"],
        selectors: ["Selectors"],
        styling: ["Line"],
      },
      roleOrder: ["layout", "styling", "selectors"],
    },
    exportCSS: (divider = null, dividerSchema = null) => {
      if (divider && dividerSchema) {
        const props = exportCSSFromProps(divider, dividerSchema);

        if (props.length > 0) {
          return `
      .${divider.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .divider {
        --divider-border-color: var(--pc-semantic-border-default);
        --divider-border-width: 1px;
        --divider-margin: 1rem 0px;

        border: none;
        border-top: var(--divider-border-width) solid var(--divider-border-color);
        margin: var(--divider-margin);
        width: 100%;
      }
`;
      }
    },
    exportHTML: (divider, dividerSchema, pageSchema, indentation) => {
      return `${indentation}<hr class="divider ${divider?.id}" data-pc-id="${divider?.id || ""}" />`;
    },
    isAllowingChildComponents: false,
    label: "Divider",
    plan: "Personal",
    props: {
      margin: {
        cssProperty: "margin",
        cssVariableName: "--divider-margin",
        defaultValue: "1rem 0px",
        label: "Margin",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--divider-border-width",
        defaultValue: "1px",
        label: "Border width",
        role: "styling",
        roleGroup: "Line",
        schemaType: "string",
        type: "text",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--divider-border-color",
        defaultValue: "var(--pc-semantic-border-default)",
        label: "Border color",
        role: "styling",
        roleGroup: "Line",
        schemaType: "string",
        type: "color",
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
