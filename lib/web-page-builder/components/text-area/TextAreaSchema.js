// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createTextAreaSchema() {
  return {
    defaultSlots: {},
    description: "A text area that can be used in a form or other places and receive input.",
    editor: {
      defaultOpenGroups: {
        content: ["General", "Structure"],
        layout: ["Size", "Spacing"],
        selectors: [],
        styling: ["Surface", "Typography"],
      },
      roleGroupOrder: {
        content: ["General", "Structure"],
        layout: ["Size", "Spacing"],
        selectors: ["Selectors"],
        styling: ["Surface", "Border", "Typography", "Focus State"],
      },
      roleOrder: ["content", "layout", "styling", "selectors"],
    },
    exportCSS: (textArea = null, textAreaSchema = null) => {
      if (textArea && textAreaSchema) {
        const props = exportCSSFromProps(textArea, textAreaSchema);

        if (props.length > 0) {
          return `
      .${textArea.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .text-area {
        --text-area-background-color: var(--pc-semantic-surface-base);
        --text-area-border-color: var(--pc-semantic-border-default);
        --text-area-border-radius: 8px;
        --text-area-border-width: 1px;
        --text-area-box-shadow-focus: var(--pc-semantic-focus-ring);
        --text-area-color: var(--pc-semantic-text-primary);
        --text-area-height: auto;
        --text-area-max-height: none;
        --text-area-max-width: none;
        --text-area-min-height: 44px;
        --text-area-min-width: auto;
        --text-area-padding: 0.6rem 0.75rem;
        --text-area-width: 100%;

        background-color: var(--text-area-background-color);
        border: var(--text-area-border-width) solid var(--text-area-border-color);
        border-radius: var(--text-area-border-radius);
        color: var(--text-area-color);
        height: var(--text-area-height);
        max-height: var(--text-area-max-height);
        max-width: var(--text-area-max-width);
        min-height: var(--text-area-min-height);
        min-width: var(--text-area-min-width);
        padding: var(--text-area-padding);
        width: var(--text-area-width);
      }

      .text-area:hover {
        border-color: var(--text-area-border-color);
        outline: none;
      }

      .text-area:focus {
        border-color: var(--text-area-border-color);
        outline: none;
      }

      .text-area:focus-visible {
        border-color: var(--text-area-border-color);
        box-shadow: var(--text-area-box-shadow-focus);
      }

      .text-area:read-only {
        border-color: var(--text-area-border-color);
        box-shadow: none;
        outline: none;
      }
`;
      }
    },
    exportHTML: (textArea, textAreaSchema, pageSchema, indentation) => {
      return `${indentation}<textarea class="text-area ${textArea?.id}" data-pc-id="${textArea?.id || ""}"${textArea?.props?.id ? ` id="${textArea.props.id}"` : ""} placeholder="${textArea?.props?.placeholder || ""}"${textArea?.props?.rows ? ` rows="${textArea.props.rows}"` : ""}>${textArea?.props?.value || ""}</textarea>`;
    },
    isAllowingChildComponents: false,
    label: "Text area",
    plan: "Personal",
    props: {
      id: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "ID",
        role: "content",
        roleGroup: "General",
        schemaType: "string",
        type: "text",
      },
      value: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Value",
        role: "content",
        roleGroup: "General",
        schemaType: "string",
        type: "textarea",
      },
      placeholder: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Placeholder",
        role: "content",
        roleGroup: "General",
        schemaType: "string",
        type: "text",
      },
      name: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Name",
        role: "content",
        roleGroup: "General",
        schemaType: "string",
        type: "text",
      },
      disabled: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: false,
        label: "Disabled",
        role: "content",
        roleGroup: "General",
        schemaType: "boolean",
        type: "switch",
      },
      readOnly: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: false,
        label: "Read only",
        role: "content",
        roleGroup: "General",
        schemaType: "boolean",
        type: "switch",
      },
      rows: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Rows",
        role: "content",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      width: {
        cssProperty: "width",
        cssVariableName: "--text-area-width",
        defaultValue: "100%",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--text-area-height",
        defaultValue: "auto",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minWidth: {
        cssProperty: "min-width",
        cssVariableName: "--text-area-min-width",
        defaultValue: "auto",
        label: "Minimum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minHeight: {
        cssProperty: "min-height",
        cssVariableName: "--text-area-min-height",
        defaultValue: "44px",
        label: "Minimum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxWidth: {
        cssProperty: "max-width",
        cssVariableName: "--text-area-max-width",
        defaultValue: "none",
        label: "Maximum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxHeight: {
        cssProperty: "max-height",
        cssVariableName: "--text-area-max-height",
        defaultValue: "none",
        label: "Maximum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      padding: {
        cssProperty: "padding",
        cssVariableName: "--text-area-padding",
        defaultValue: "0.6rem 0.75rem",
        label: "Padding",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--text-area-background-color",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--text-area-border-color",
        defaultValue: "var(--pc-semantic-border-default)",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--text-area-border-width",
        defaultValue: "1px",
        label: "Border width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--text-area-border-radius",
        defaultValue: "8px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--text-area-color",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      boxShadowFocus: {
        cssProperty: "box-shadow",
        cssVariableName: "--text-area-box-shadow-focus",
        defaultValue: "var(--pc-semantic-focus-ring)",
        label: "Box shadow - Focus",
        role: "styling",
        roleGroup: "Focus State",
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
    slots: {},
    variants: [
      {
        label: "Dark",
        props: {
          backgroundColor: "#020617",
          borderColor: "#374151",
          borderRadius: "4px",
          boxShadowFocus: "0 0 0 3px #374151",
          color: "#ffffff",
        },
      },
      {
        label: "Success",
        props: {
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          borderColor: "#22c55e",
          borderRadius: "4px",
          boxShadowFocus: "0 0 0 3px #22c55e",
          color: "#166534",
        },
      },
      {
        label: "Warning",
        props: {
          backgroundColor: "rgba(234, 179, 8, 0.1)",
          borderColor: "#eab308",
          borderRadius: "4px",
          boxShadowFocus: "0 0 0 3px #eab308",
          color: "#854d0e",
        },
      },
      {
        label: "Error",
        props: {
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderColor: "#ef4444",
          borderRadius: "4px",
          boxShadowFocus: "0 0 0 3px #ef4444",
          color: "#7f1d1d",
        },
      },
    ],
  };
}
