// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createSelectSchema() {
  return {
    defaultSlots: {},
    description: "A form component with a drop-down menu where you can select an option.",
    editor: {
      defaultOpenGroups: {
        content: ["General", "Options"],
        layout: ["Size", "Spacing"],
        selectors: [],
        styling: ["Surface", "Typography"],
      },
      roleGroupOrder: {
        content: ["General", "Options"],
        layout: ["Size", "Spacing"],
        selectors: ["Selectors"],
        styling: ["Surface", "Border", "Typography", "Focus State"],
      },
      roleOrder: ["content", "layout", "styling", "selectors"],
    },
    exportCSS: (select = null, selectSchema = null) => {
      if (select && selectSchema) {
        const props = exportCSSFromProps(select, selectSchema);

        if (props.length > 0) {
          return `
      .${select.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .select {
        --select-background-color: var(--pc-semantic-surface-base);
        --select-border-color: var(--pc-semantic-border-default);
        --select-border-radius: 8px;
        --select-border-width: 1px;
        --select-box-shadow-focus: var(--pc-semantic-focus-ring);
        --select-color: var(--pc-semantic-text-primary);
        --select-height: auto;
        --select-max-height: none;
        --select-max-width: none;
        --select-min-height: 44px;
        --select-min-width: auto;
        --select-padding: 0.6rem 0.75rem;
        --select-width: 100%;

        background-color: var(--select-background-color);
        border: var(--select-border-width) solid var(--select-border-color);
        border-radius: var(--select-border-radius);
        color: var(--select-color);
        height: var(--select-height);
        max-height: var(--select-max-height);
        max-width: var(--select-max-width);
        min-height: var(--select-min-height);
        min-width: var(--select-min-width);
        padding: var(--select-padding);
        width: var(--select-width);
      }

      .select:hover {
        border-color: var(--select-border-color);
        outline: none;
      }

      .select:focus {
        border-color: var(--select-border-color);
        outline: none;
      }

      .select:focus-visible {
        border-color: var(--select-border-color);
        box-shadow: var(--select-box-shadow-focus);
      }

      .select:read-only {
        border-color: var(--select-border-color);
        box-shadow: none;
        outline: none;
      }
`;
      }
    },
    exportHTML: (select, selectSchema, pageSchema, indentation) => {
      const disabled = select?.props?.disabled ? true : false;
      const name = select?.props?.name || "";

      return `${indentation}<select class="select ${select?.id}"${disabled ? ` disabled="disabled"` : ""} data-pc-id="${select?.id || ""}"${select?.props?.id ? ` id="${select.props.id}"` : ""}${name ? ` name="${name}"` : ""} value="${select?.props?.value || ""}">${(select?.props?.options || []).map((option) => `\n${indentation + "  "}<option value="${option?.value || ""}">${option?.label || ""}</option>`).join("")}\n${indentation}</select>`;
    },
    isAllowingChildComponents: false,
    label: "Select",
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
      options: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: [],
        label: "Options",
        role: "content",
        roleGroup: "Options",
        schema: {
          isAllowingChildItems: false,
          props: {
            label: { label: "Text", type: "text" },
            value: { label: "Value", type: "text" },
          },
        },
        schemaType: {
          items: {
            props: {
              label: { type: "string" },
              value: { type: "string" },
            },
            type: "object",
          },
          type: "array",
        },
        type: "items",
      },
      width: {
        cssProperty: "width",
        cssVariableName: "--select-width",
        defaultValue: "100%",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--select-height",
        defaultValue: "auto",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minWidth: {
        cssProperty: "min-width",
        cssVariableName: "--select-min-width",
        defaultValue: "auto",
        label: "Minimum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minHeight: {
        cssProperty: "min-height",
        cssVariableName: "--select-min-height",
        defaultValue: "44px",
        label: "Minimum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxWidth: {
        cssProperty: "max-width",
        cssVariableName: "--select-max-width",
        defaultValue: "none",
        label: "Maximum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxHeight: {
        cssProperty: "max-height",
        cssVariableName: "--select-max-height",
        defaultValue: "none",
        label: "Maximum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      padding: {
        cssProperty: "padding",
        cssVariableName: "--select-padding",
        defaultValue: "0.6rem 0.75rem",
        label: "Padding",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--select-background-color",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--select-border-color",
        defaultValue: "var(--pc-semantic-border-default)",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--select-border-width",
        defaultValue: "1px",
        label: "Border width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--select-border-radius",
        defaultValue: "8px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--select-color",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      boxShadowFocus: {
        cssProperty: "box-shadow",
        cssVariableName: "--select-box-shadow-focus",
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
