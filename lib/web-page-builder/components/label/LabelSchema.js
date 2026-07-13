// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createLabelSchema() {
  return {
    defaultSlots: {},
    description: "A label that mainly describes form controls like inputs and selects.",
    editor: {
      defaultOpenGroups: {
        content: ["General"],
        layout: [],
        selectors: [],
        styling: ["Typography"],
      },
      roleGroupOrder: {
        content: ["General"],
        layout: ["Alignment"],
        selectors: ["Selectors"],
        styling: ["Typography"],
      },
      roleOrder: ["content", "styling", "layout", "selectors"],
    },
    exportCSS: (label = null, labelSchema = null) => {
      if (label && labelSchema) {
        const props = exportCSSFromProps(label, labelSchema);

        if (props.length > 0) {
          return `
      .${label.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .label {
        --label-color: var(--pc-semantic-text-primary);
        --label-font-family: inherit;
        --label-font-size: 1rem;
        --label-font-style: normal;
        --label-font-weight: 600;
        --label-line-height: normal;
        --label-text-align: left;

        color: var(--label-color);
        font-family: var(--label-font-family);
        font-size: var(--label-font-size);
        font-style: var(--label-font-style);
        font-weight: var(--label-font-weight);
        line-height: var(--label-line-height);
        text-align: var(--label-text-align);
      }
  `;
      }
    },
    exportHTML: (label, labelSchema, pageSchema, indentation) => {
      return `${indentation}<label class="label ${label?.id}" data-pc-id="${label?.id || ""}"${label?.props?.htmlFor ? ` for="${label.props.htmlFor}"` : ""}>${label?.props?.text || ""}</label>`;
    },
    isAllowingChildComponents: false,
    label: "Label",
    plan: "Personal",
    props: {
      text: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "Text",
        label: "Text",
        role: "content",
        roleGroup: "General",
        schemaType: "string",
        type: "text",
      },
      htmlFor: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "For form element",
        role: "content",
        roleGroup: "General",
        schemaType: "string",
        type: "text",
      },
      fontFamily: {
        cssProperty: "font-family",
        cssVariableName: "--label-font-family",
        defaultValue: "inherit",
        label: "Font family",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontSize: {
        cssProperty: "font-size",
        cssVariableName: "--label-font-size",
        defaultValue: "1rem",
        label: "Font size",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontWeight: {
        cssProperty: "font-weight",
        cssVariableName: "--label-font-weight",
        defaultValue: "600",
        label: "Font weight",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontStyle: {
        cssProperty: "font-style",
        cssVariableName: "--label-font-style",
        defaultValue: "normal",
        label: "Font style",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      lineHeight: {
        cssProperty: "line-height",
        cssVariableName: "--label-line-height",
        defaultValue: "normal",
        label: "Line height",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--label-color",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      textAlign: {
        cssProperty: "text-align",
        cssVariableName: "--label-text-align",
        defaultValue: "left",
        label: "Text align",
        options: [
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
          { label: "Center", value: "center" },
          { label: "Justify", value: "justify" },
        ],
        role: "layout",
        roleGroup: "Alignment",
        schemaType: "enum<string>",
        type: "select",
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
      /*
        body: {
          allowedChildComponents: ["Badge", "Text"],
        }
        */
    },
    variants: [
      {
        label: "Dark",
        props: {
          color: "#e5e7eb",
        },
      },
      {
        label: "Success",
        props: {
          color: "#166534",
        },
      },
      {
        label: "Warning",
        props: {
          color: "#854d0e",
        },
      },
      {
        label: "Error",
        props: {
          color: "#7f1d1d",
        },
      },
    ],
  };
}
