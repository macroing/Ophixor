// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createSwitchSchema() {
  return {
    defaultSlots: {},
    description: "A component that acts in a similar way to a checkbox but looks different.",
    editor: {
      defaultOpenGroups: {
        content: ["State"],
        layout: [],
        selectors: [],
        styling: [],
      },
      roleGroupOrder: {
        content: ["State"],
        layout: ["Size"],
        selectors: ["Selectors"],
        styling: ["Surface", "Border", "Motion"],
      },
      roleOrder: ["content", "layout", "styling", "selectors"],
    },
    exportCSS: (switchInstance = null, switchSchema = null) => {
      if (switchInstance && switchSchema) {
        const props = exportCSSFromProps(switchInstance, switchSchema);

        if (props.length > 0) {
          return `
      .${switchInstance.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .switch {
        --switch-background-color: var(--pc-semantic-surface-base);
        --switch-background-color-active: var(--pc-semantic-interactive-primary);
        --switch-border-color: var(--pc-semantic-border-default);
        --switch-height: auto;
        --switch-max-height: none;
        --switch-max-width: none;
        --switch-min-height: auto;
        --switch-min-width: auto;
        --switch-transition: 0.25s ease;
        --switch-width: auto;

        align-items: center;
        display: inline-flex;
        gap: 0.5rem;
        height: var(--switch-height);
        max-height: var(--switch-max-height);
        max-width: var(--switch-max-width);
        min-height: var(--switch-min-height);
        min-width: var(--switch-min-width);
        width: var(--switch-width);
      }

      .switch > input {
        display: none;
      }

      .switch > .toggle {
        background: var(--switch-border-color);
        border-radius: 999px;
        cursor: pointer;
        height: 24px;
        max-height: 24px;
        max-width: 42px;
        min-height: 24px;
        min-width: 42px;
        position: relative;
        width: 42px;
      }

      .switch > .toggle::after {
        background: var(--switch-background-color);
        border-radius: 50%;
        content: "";
        height: 18px;
        left: 3px;
        position: absolute;
        top: 3px;
        transition: var(--switch-transition);
        width: 18px;
      }

      .switch > input:checked + .toggle {
        background: var(--switch-background-color-active);
      }

      .switch > input:checked + .toggle::after {
        transform: translateX(18px);
      }
`;
      }
    },
    exportHTML: (switchInstance, switchSchema, pageSchema, indentation) => {
      return `${indentation}<div class="switch ${switchInstance?.id}" data-pc-id="${switchInstance?.id || ""}">\n${indentation + "  "}<input${switchInstance?.props?.checked ? ' checked="checked"' : ""}${switchInstance?.props?.id ? ` id="${switchInstance.props.id}"` : switchInstance?.id ? ` id="${switchInstance.id}"` : ""} type="checkbox" />\n${indentation + "  "}<label class="toggle"${switchInstance?.props?.id ? ` for="${switchInstance.props.id}"` : switchInstance?.id ? ` for="${switchInstance.id}"` : ""}></label>\n${indentation + "  "}<span>${switchInstance?.props?.text || ""}</span>\n${indentation}</div>`;
    },
    isAllowingChildComponents: false,
    label: "Switch",
    plan: "Personal",
    props: {
      checked: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: false,
        label: "Checked",
        role: "content",
        roleGroup: "State",
        schemaType: "boolean",
        type: "switch",
      },
      text: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "Text",
        label: "Text",
        role: "content",
        roleGroup: "State",
        schemaType: "string",
        type: "text",
      },
      id: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "ID",
        role: "content",
        roleGroup: "State",
        schemaType: "string",
        type: "text",
      },
      width: {
        cssProperty: "width",
        cssVariableName: "--switch-width",
        defaultValue: "auto",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minWidth: {
        cssProperty: "min-width",
        cssVariableName: "--switch-min-width",
        defaultValue: "auto",
        label: "Minimum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxWidth: {
        cssProperty: "max-width",
        cssVariableName: "--switch-max-width",
        defaultValue: "none",
        label: "Maximum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--switch-height",
        defaultValue: "auto",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minHeight: {
        cssProperty: "min-height",
        cssVariableName: "--switch-min-height",
        defaultValue: "auto",
        label: "Minimum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxHeight: {
        cssProperty: "max-height",
        cssVariableName: "--switch-max-height",
        defaultValue: "none",
        label: "Maximum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--switch-background-color",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backgroundColorActive: {
        cssProperty: "background-color",
        cssVariableName: "--switch-background-color-active",
        defaultValue: "var(--pc-semantic-interactive-primary)",
        label: "Background color - Active",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--switch-border-color",
        defaultValue: "var(--pc-semantic-border-default)",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      transition: {
        cssProperty: "transition",
        cssVariableName: "--switch-transition",
        defaultValue: "0.25s ease",
        label: "Transition",
        role: "styling",
        roleGroup: "Motion",
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
          backgroundColor: "#e5e7eb",
          backgroundColorActive: "#6366f1",
          borderColor: "#374151",
        },
      },
    ],
  };
}
