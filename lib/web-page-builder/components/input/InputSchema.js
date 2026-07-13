// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createInputSchema() {
  return {
    defaultSlots: {},
    description: "An input that can be used in a form or other places and receive input.",
    editor: {
      defaultOpenGroups: {
        content: ["Content"],
        layout: ["Size"],
        selectors: [],
        styling: [],
      },
      roleGroupOrder: {
        content: ["Content"],
        layout: ["Size", "Spacing"],
        selectors: ["Selectors"],
        styling: ["Surface", "Border", "Typography", "Focus State"],
      },
      roleOrder: ["content", "layout", "styling", "selectors"],
    },
    exportCSS: (input = null, inputSchema = null) => {
      if (input && inputSchema) {
        const props = exportCSSFromProps(input, inputSchema);

        if (props.length > 0) {
          return `
      .${input.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .input {
        --input-background-color: var(--pc-semantic-surface-base);
        --input-border-color: var(--pc-semantic-border-default);
        --input-border-radius: 8px;
        --input-border-width: 1px;
        --input-box-shadow-focus: var(--pc-semantic-focus-ring);
        --input-color: var(--pc-semantic-text-primary);
        --input-height: auto;
        --input-max-height: none;
        --input-max-width: none;
        --input-min-height: 44px;
        --input-min-width: auto;
        --input-padding: 0.6rem 0.75rem;
        --input-width: 100%;

        background-color: var(--input-background-color);
        border: var(--input-border-width) solid var(--input-border-color);
        border-radius: var(--input-border-radius);
        color: var(--input-color);
        height: var(--input-height);
        max-height: var(--input-max-height);
        max-width: var(--input-max-width);
        min-height: var(--input-min-height);
        min-width: var(--input-min-width);
        padding: var(--input-padding);
        width: var(--input-width);
      }

      .input:hover {
        border-color: var(--input-border-color);
        outline: none;
      }

      .input:focus {
        border-color: var(--input-border-color);
        outline: none;
      }

      .input:focus-visible {
        border-color: var(--input-border-color);
        box-shadow: var(--input-box-shadow-focus);
      }

      .input:read-only {
        border-color: var(--input-border-color);
        box-shadow: none;
        outline: none;
      }
`;
      }
    },
    exportHTML: (input, inputSchema, pageSchema, indentation) => {
      const disabled = input?.props?.disabled ? true : false;
      const name = input?.props?.name || "";
      const readOnly = input?.props?.readOnly ? true : false;
      const spellCheck = typeof input?.props?.spellCheck === "boolean" ? input.props.spellCheck : typeof input?.props?.spellCheck === "string" ? (input.props.spellCheck === "true" ? true : input.props.spellCheck === "false" ? false : undefined) : undefined;
      const type = input?.props?.type || "text";

      return `${indentation}<input class="input ${input?.id}"${disabled ? ` disabled="disabled"` : ""} data-pc-id="${input?.id || ""}"${input?.props?.id ? ` id="${input.props.id}"` : ""}${name ? ` name="${name}"` : ""} placeholder="${input?.props?.placeholder || ""}"${readOnly ? ` readonly="readonly"` : ""}${typeof spellCheck === "boolean" ? ` spellcheck="${spellCheck}"` : ""} type="${type}" value="${input?.props?.value || ""}" />`;
    },
    isAllowingChildComponents: false,
    label: "Input",
    plan: "Personal",
    props: {
      value: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Value",
        role: "content",
        roleGroup: "Content",
        schemaType: "string",
        type: "text",
      },
      placeholder: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Placeholder",
        role: "content",
        roleGroup: "Content",
        schemaType: "string",
        type: "text",
      },
      id: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "ID",
        role: "content",
        roleGroup: "Content",
        schemaType: "string",
        type: "text",
      },
      name: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Name",
        role: "content",
        roleGroup: "Content",
        schemaType: "string",
        type: "text",
      },
      disabled: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: false,
        label: "Disabled",
        role: "content",
        roleGroup: "Content",
        schemaType: "boolean",
        type: "switch",
      },
      readOnly: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: false,
        label: "Read only",
        role: "content",
        roleGroup: "Content",
        schemaType: "boolean",
        type: "switch",
      },
      spellCheck: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Spell check",
        options: [
          { label: "Ignore", value: "" },
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ],
        role: "content",
        roleGroup: "Content",
        schemaType: "enum<string>",
        type: "select",
      },
      type: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "text",
        label: "Type",
        options: [
          { label: "Text", value: "text" },
          { label: "Color", value: "color" },
          { label: "Date", value: "date" },
          { label: "Date Time - Local", value: "datetime-local" },
          { label: "E-mail", value: "email" },
          { label: "Hidden", value: "hidden" },
          { label: "Month", value: "month" },
          { label: "Number", value: "number" },
          { label: "Password", value: "password" },
          { label: "Search", value: "search" },
          { label: "Telephone", value: "tel" },
          { label: "Time", value: "time" },
          { label: "URL", value: "url" },
          { label: "Week", value: "week" },
        ],
        role: "content",
        roleGroup: "Content",
        schemaType: "enum<string>",
        type: "select",
      },
      width: {
        cssProperty: "width",
        cssVariableName: "--input-width",
        defaultValue: "100%",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minWidth: {
        cssProperty: "min-width",
        cssVariableName: "--input-min-width",
        defaultValue: "auto",
        label: "Minimum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxWidth: {
        cssProperty: "max-width",
        cssVariableName: "--input-max-width",
        defaultValue: "none",
        label: "Maximum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--input-height",
        defaultValue: "auto",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minHeight: {
        cssProperty: "min-height",
        cssVariableName: "--input-min-height",
        defaultValue: "44px",
        label: "Minimum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxHeight: {
        cssProperty: "max-height",
        cssVariableName: "--input-max-height",
        defaultValue: "none",
        label: "Maximum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      padding: {
        cssProperty: "padding",
        cssVariableName: "--input-padding",
        defaultValue: "0.6rem 0.75rem",
        label: "Padding",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--input-background-color",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--input-border-color",
        defaultValue: "var(--pc-semantic-border-default)",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--input-border-width",
        defaultValue: "1px",
        label: "Border width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--input-border-radius",
        defaultValue: "8px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--input-color",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      boxShadowFocus: {
        cssProperty: "box-shadow",
        cssVariableName: "--input-box-shadow-focus",
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
          borderRadius: "8px",
          boxShadowFocus: "0 0 0 3px #374151",
          color: "#ffffff",
        },
      },
      {
        label: "Success",
        props: {
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          borderColor: "#22c55e",
          borderRadius: "8px",
          boxShadowFocus: "0 0 0 3px #22c55e",
          color: "#166534",
        },
      },
      {
        label: "Warning",
        props: {
          backgroundColor: "rgba(234, 179, 8, 0.1)",
          borderColor: "#eab308",
          borderRadius: "8px",
          boxShadowFocus: "0 0 0 3px #eab308",
          color: "#854d0e",
        },
      },
      {
        label: "Error",
        props: {
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderColor: "#ef4444",
          borderRadius: "8px",
          boxShadowFocus: "0 0 0 3px #ef4444",
          color: "#7f1d1d",
        },
      },
    ],
  };
}
