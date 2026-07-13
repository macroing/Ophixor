// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createRadioGroupSchema() {
  return {
    defaultSlots: {},
    description: "A radio group where only one radio button can be enabled at a time.",
    editor: {
      defaultOpenGroups: {
        content: ["General", "Validation", "Options"],
        layout: ["Orientation"],
        selectors: [],
        styling: ["Label", "Option"],
      },
      roleGroupOrder: {
        content: ["General", "Validation", "Options"],
        layout: ["Orientation"],
        selectors: ["Selectors"],
        styling: ["Label", "Option", "Option – Checked", "Option – Icon", "Option – Icon – Checked"],
      },
      roleOrder: ["content", "layout", "styling", "selectors"],
    },
    exportCSS: (radioGroup = null, radioGroupSchema = null) => {
      if (radioGroup && radioGroupSchema) {
        const props = exportCSSFromProps(radioGroup, radioGroupSchema);

        if (props.length > 0) {
          return `
      .${radioGroup.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .radio-group {
        --radio-group-background-color-option: var(--pc-semantic-surface-base);
        --radio-group-background-color-option-checked: var(--pc-foundation-color-primary-50);
        --radio-group-background-color-option-icon: var(--pc-semantic-surface-base);
        --radio-group-background-color-option-icon-circle: var(--pc-semantic-interactive-primary);
        --radio-group-border-color-option: var(--pc-foundation-color-gray-300);
        --radio-group-border-color-option-checked: var(--pc-semantic-interactive-primary);
        --radio-group-border-color-option-icon: var(--pc-foundation-color-gray-400);
        --radio-group-border-color-option-icon-checked: var(--pc-semantic-interactive-primary);
        --radio-group-color-label: var(--pc-semantic-text-primary);
        --radio-group-color-label-required: var(--pc-foundation-color-danger-600);
        --radio-group-color-option: var(--pc-semantic-text-primary);

        border: none;
        margin: 0px;
        min-width: 0px;
        padding: 0px;
      }

      .radio-group > .label {
        color: var(--radio-group-color-label);
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .radio-group > .label > .label-required {
        color: var(--radio-group-color-label-required);
        margin-left: 0.25rem;
      }

      .radio-group > .radio-group-options {
        display: grid;
        gap: 0.5rem;
      }

      .radio-group > .radio-group-options > .radio-group-option {
        align-items: center;
        background-color: var(--radio-group-background-color-option);
        border: 1px solid var(--radio-group-border-color-option);
        border-radius: 8px;
        color: var(--radio-group-color-option);
        cursor: pointer;
        display: flex;
        gap: 0.6rem;
        margin-bottom: 0.5rem;
        padding: 0.5rem 0.75rem;
        transition: border-color 0.15s ease, background 0.15s ease;
      }

      .radio-group > .radio-group-options > .radio-group-option > .icon {
        background-color: var(--radio-group-background-color-option-icon);
        border: 2px solid var(--radio-group-border-color-option-icon);
        border-radius: 50%;
        display: grid;
        flex-shrink: 0;
        height: 16px;
        place-items: center;
        width: 16px;
      }

      .radio-group > .radio-group-options > .radio-group-option > .icon > .circle {
        background-color: var(--radio-group-background-color-option-icon-circle);
        border-radius: 50%;
        height: 8px;
        width: 8px;
      }

      .radio-group > .radio-group-options > .radio-group-option > .label {
        font-size: 0.9rem;
        line-height: 1.3;
      }

      .radio-group > .radio-group-options > .radio-group-option.radio-group-option-checked {
        background-color: var(--radio-group-background-color-option-checked);
        border-color: var(--radio-group-border-color-option-checked);
      }

      .radio-group > .radio-group-options > .radio-group-option.radio-group-option-checked > .icon {
        border-color: var(--radio-group-border-color-option-icon-checked);
      }

      .radio-group > .radio-group-options > .radio-group-option.radio-group-option-disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }

      .radio-group > .radio-group-options > .radio-group-option > input {
        margin-right: 0.5rem;
        opacity: 0;
        pointer-events: none;
        position: absolute;
      }

      .radio-group.radio-group-horizontal > .radio-group-options {
        display: flex;
      }

      .radio-group.radio-group-horizontal > .radio-group-options > .radio-group-option {
        align-items: center;
        display: flex;
        margin-bottom: 0px;
      }
`;
      }
    },
    exportHTML: (radioGroup, radioGroupSchema, pageSchema, indentation) => {
      function renderOption(option) {
        const name = radioGroup?.props?.name || radioGroup?.id;

        const label = option?.label || "";
        const value = option.value || "";

        const id = `${slugify(name)}-${slugify(value) || "option"}`;

        const checked = value === radioGroup?.props?.value;
        const disabled = radioGroup?.props?.disabled || option.disabled;
        const required = radioGroup?.props?.required;

        return `${indentation + "    "}<label${checked && disabled ? ' class="radio-group-option radio-group-option-checked radio-group-option-disabled"' : checked ? ' class="radio-group-option radio-group-option-checked"' : disabled ? ' class="radio-group-option radio-group-option-disabled"' : ' class="radio-group-option"'} for="${id}">\n${indentation + "      "}<input${checked ? ' checked="checked"' : ""}${disabled ? ' disabled="disabled"' : ""} id="${id}" name="${name}"${required ? ' required="required"' : ""} type="radio" value="${value}" />\n${indentation + "      "}<span aria-hidden="true" class="icon">${checked ? '<span class="circle"></span>' : ""}</span>\n${indentation + "      "}<span class="label">${label}</span>\n${indentation + "    "}</label>\n`;
      }

      function slugify(string) {
        return String(string)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }

      return `${indentation}<fieldset class="radio-group${radioGroup?.props?.orientation === "horizontal" ? " radio-group-horizontal" : ""} ${radioGroup?.id}" data-pc-id="${radioGroup?.id || ""}"${radioGroup?.props?.disabled ? ' disabled="disabled"' : ""}>\n${radioGroup?.props?.label ? `${indentation + "  "}<legend class="label">${radioGroup.props.label}${radioGroup?.props?.required ? ` <span class="label-required">*</span>` : ""}</legend>\n` : ""}${indentation + "  "}<div class="radio-group-options" role="radiogroup">\n${(radioGroup?.props?.options || []).map((option) => renderOption(option)).join("")}${indentation + "  "}</div>\n${indentation}</fieldset>`;
    },
    isAllowingChildComponents: false,
    label: "Radio group",
    plan: "Personal",
    props: {
      label: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Label",
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
      required: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: false,
        label: "Required",
        role: "content",
        roleGroup: "Validation",
        schemaType: "boolean",
        type: "switch",
      },
      disabled: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: false,
        label: "Disabled",
        role: "content",
        roleGroup: "Validation",
        schemaType: "boolean",
        type: "switch",
      },
      options: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: [
          {
            disabled: false,
            label: "Lorem ipsum",
            value: "Lorem ipsum",
          },
          {
            disabled: false,
            label: "Phasellus ultrices",
            value: "Phasellus ultrices",
          },
          {
            disabled: false,
            label: "Ut posuere",
            value: "Ut posuere",
          },
        ],
        label: "Options",
        role: "content",
        roleGroup: "Options",
        schema: {
          isAllowingChildItems: false,
          props: {
            disabled: { label: "Disabled", type: "switch" },
            label: { label: "Label", type: "text" },
            value: { label: "Value", type: "text" },
          },
        },
        schemaType: {
          items: {
            props: {
              disabled: { type: "boolean" },
              label: { type: "string" },
              value: { type: "string" },
            },
            type: "object",
          },
          type: "array",
        },
        type: "items",
      },
      orientation: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "vertical",
        label: "Orientation",
        options: [
          { label: "Horizontal", value: "horizontal" },
          { label: "Vertical", value: "vertical" },
        ],
        role: "layout",
        roleGroup: "Orientation",
        schemaType: "enum<string>",
        type: "select",
      },
      colorLabel: {
        cssProperty: "color",
        cssVariableName: "--radio-group-color-label",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color - Label",
        role: "styling",
        roleGroup: "Label",
        schemaType: "string",
        type: "color",
      },
      colorLabelRequired: {
        cssProperty: "color",
        cssVariableName: "--radio-group-color-label-required",
        defaultValue: "var(--pc-foundation-color-danger-600)",
        label: "Color - Label - Required",
        role: "styling",
        roleGroup: "Label",
        schemaType: "string",
        type: "color",
      },
      backgroundColorOption: {
        cssProperty: "background-color",
        cssVariableName: "--radio-group-background-color-option",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color - Option",
        role: "styling",
        roleGroup: "Option",
        schemaType: "string",
        type: "color",
      },
      borderColorOption: {
        cssProperty: "border-color",
        cssVariableName: "--radio-group-border-color-option",
        defaultValue: "var(--pc-foundation-color-gray-300)",
        label: "Border color - Option",
        role: "styling",
        roleGroup: "Option",
        schemaType: "string",
        type: "color",
      },
      colorOption: {
        cssProperty: "color",
        cssVariableName: "--radio-group-color-option",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color - Option",
        role: "styling",
        roleGroup: "Option",
        schemaType: "string",
        type: "color",
      },
      backgroundColorOptionChecked: {
        cssProperty: "background-color",
        cssVariableName: "--radio-group-background-color-option-checked",
        defaultValue: "var(--pc-foundation-color-primary-50)",
        label: "Background color - Option - Checked",
        role: "styling",
        roleGroup: "Option - Checked",
        schemaType: "string",
        type: "color",
      },
      borderColorOptionChecked: {
        cssProperty: "border-color",
        cssVariableName: "--radio-group-border-color-option-checked",
        defaultValue: "var(--pc-semantic-interactive-primary)",
        label: "Border color - Option - Checked",
        role: "styling",
        roleGroup: "Option - Checked",
        schemaType: "string",
        type: "color",
      },
      backgroundColorOptionIcon: {
        cssProperty: "background-color",
        cssVariableName: "--radio-group-background-color-option-icon",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color - Option - Icon",
        role: "styling",
        roleGroup: "Option - Icon",
        schemaType: "string",
        type: "color",
      },
      borderColorOptionIcon: {
        cssProperty: "border-color",
        cssVariableName: "--radio-group-border-color-option-icon",
        defaultValue: "var(--pc-foundation-color-gray-400)",
        label: "Border color - Option - Icon",
        role: "styling",
        roleGroup: "Option - Icon",
        schemaType: "string",
        type: "color",
      },
      backgroundColorOptionIconCircle: {
        cssProperty: "background-color",
        cssVariableName: "--radio-group-background-color-option-icon-circle",
        defaultValue: "var(--pc-semantic-interactive-primary)",
        label: "Background color - Option - Icon - Circle",
        role: "styling",
        roleGroup: "Option - Icon - Checked",
        schemaType: "string",
        type: "color",
      },
      borderColorOptionIconChecked: {
        cssProperty: "border-color",
        cssVariableName: "--radio-group-border-color-option-icon-checked",
        defaultValue: "var(--pc-semantic-interactive-primary)",
        label: "Border color - Option - Icon - Checked",
        role: "styling",
        roleGroup: "Option - Icon - Checked",
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
