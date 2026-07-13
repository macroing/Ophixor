// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createCheckboxSchema() {
  return {
    defaultSlots: {},
    description: "A checkbox that is useful in forms among other places.",
    editor: {
      defaultOpenGroups: {
        content: ["State"],
        layout: [],
        selectors: [],
        styling: [],
      },
      roleGroupOrder: {
        content: ["State"],
        layout: ["Size", "Alignment", "Spacing"],
        selectors: ["Selectors"],
        styling: ["Surface", "Border", "Icon / Text Color"],
      },
      roleOrder: ["content", "layout", "styling", "selectors"],
    },
    exportCSS: (checkbox = null, checkboxSchema = null) => {
      if (checkbox && checkboxSchema) {
        const props = exportCSSFromProps(checkbox, checkboxSchema);

        if (props.length > 0) {
          return `
      .${checkbox.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .checkbox {
        --checkbox-align-self: flex-start;
        --checkbox-background-color: var(--pc-semantic-surface-base);
        --checkbox-border-color: var(--pc-semantic-border-default);
        --checkbox-border-radius: 8px;
        --checkbox-border-width: 1px;
        --checkbox-color: var(--pc-semantic-text-primary);
        --checkbox-height: auto;
        --checkbox-justify-self: center;
        --checkbox-max-height: none;
        --checkbox-max-width: none;
        --checkbox-min-height: 22px;
        --checkbox-min-width: 22px;
        --checkbox-padding: 0.6rem 0.75rem;
        --checkbox-width: auto;

        align-self: var(--checkbox-align-self);
        background-color: var(--checkbox-background-color);
        border: var(--checkbox-border-width) solid var(--checkbox-border-color);
        border-radius: var(--checkbox-border-radius);
        color: var(--checkbox-color);
        height: var(--checkbox-height);
        justify-self: var(--checkbox-justify-self);
        max-height: var(--checkbox-max-height);
        max-width: var(--checkbox-max-width);
        min-height: var(--checkbox-min-height);
        min-width: var(--checkbox-min-width);
        padding: var(--checkbox-padding);
        width: var(--checkbox-width);
      }

      .checkbox:disabled {
        opacity: 0.75;
      }
  `;
      }
    },
    exportHTML: (checkbox, checkboxSchema, pageSchema, indentation) => {
      return `${indentation}<input${checkbox?.props?.checked ? ' checked="checked"' : ""} class="checkbox ${checkbox?.id}" data-pc-id="${checkbox?.id || ""}"${checkbox?.props?.id ? ` id="${checkbox.props.id}"` : ""} type="checkbox" value="" />`;
    },
    isAllowingChildComponents: false,
    label: "Checkbox",
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
        cssVariableName: "--checkbox-width",
        defaultValue: "auto",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--checkbox-height",
        defaultValue: "auto",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minWidth: {
        cssProperty: "min-width",
        cssVariableName: "--checkbox-min-width",
        defaultValue: "22px",
        label: "Minimum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minHeight: {
        cssProperty: "min-height",
        cssVariableName: "--checkbox-min-height",
        defaultValue: "22px",
        label: "Minimum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxWidth: {
        cssProperty: "max-width",
        cssVariableName: "--checkbox-max-width",
        defaultValue: "none",
        label: "Maximum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxHeight: {
        cssProperty: "max-height",
        cssVariableName: "--checkbox-max-height",
        defaultValue: "none",
        label: "Maximum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      alignSelf: {
        cssProperty: "align-self",
        cssVariableName: "--checkbox-align-self",
        defaultValue: "flex-start",
        label: "Align self",
        options: [
          { label: "Automatically", value: "auto" },
          { label: "Normal", value: "normal" },
          { label: "Stretch", value: "stretch" },
          { label: "Center", value: "center" },
          { label: "Start", value: "start" },
          { label: "Flexbox start", value: "flex-start" },
          { label: "Self start", value: "self-start" },
          { label: "End", value: "end" },
          { label: "Flexbox end", value: "flex-end" },
          { label: "Self end", value: "self-end" },
        ],
        role: "layout",
        roleGroup: "Alignment",
        schemaType: "enum<string>",
        type: "select",
      },
      justifySelf: {
        cssProperty: "justify-self",
        cssVariableName: "--checkbox-justify-self",
        defaultValue: "center",
        label: "Justify self",
        options: [
          { label: "Automatically", value: "auto" },
          { label: "Normal", value: "normal" },
          { label: "Stretch", value: "stretch" },
          { label: "Center", value: "center" },
          { label: "Start", value: "start" },
          { label: "Flexbox start", value: "flex-start" },
          { label: "Self start", value: "self-start" },
          { label: "End", value: "end" },
          { label: "Flexbox end", value: "flex-end" },
          { label: "Self end", value: "self-end" },
        ],
        role: "layout",
        roleGroup: "Alignment",
        schemaType: "enum<string>",
        type: "select",
      },
      padding: {
        cssProperty: "padding",
        cssVariableName: "--checkbox-padding",
        defaultValue: "0.6rem 0.75rem",
        label: "Padding",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--checkbox-background-color",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--checkbox-border-color",
        defaultValue: "var(--pc-semantic-border-default)",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--checkbox-border-width",
        defaultValue: "1px",
        label: "Border width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--checkbox-border-radius",
        defaultValue: "8px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--checkbox-color",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color",
        role: "styling",
        roleGroup: "Icon / Text Color",
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
