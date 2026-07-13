// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createFormSchema() {
  return {
    defaultSlots: {
      body: [],
    },
    description: "A form that allows you to submit data.",
    editor: {
      defaultOpenGroups: {
        action: ["Action"],
        layout: ["Structure"],
        selectors: [],
        styling: [],
        visibility: [],
      },
      roleGroupOrder: {
        action: ["Action"],
        layout: ["Structure", "Size", "Spacing"],
        selectors: ["Selectors"],
        styling: ["Surface", "Border", "Effects"],
        visibility: ["Visibility"],
      },
      roleOrder: ["layout", "styling", "action", "visibility", "selectors"],
    },
    exportCSS: (form = null, formSchema = null) => {
      if (form && formSchema) {
        const props = exportCSSFromProps(form, formSchema);

        if (props.length > 0) {
          return `
      .${form.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .form {
        --form-align-items: stretch;
        --form-background-color: var(--pc-semantic-surface-base);
        --form-border-color: var(--pc-semantic-border-default);
        --form-border-radius: 14px;
        --form-border-width: 1px;
        --form-box-shadow: var(--pc-semantic-shadow-sm);
        --form-flex-direction: column;
        --form-gap: 1rem;
        --form-height: auto;
        --form-justify-content: stretch;
        --form-max-height: none;
        --form-max-width: none;
        --form-padding: 2rem;
        --form-width: 100%;

        align-items: var(--form-align-items);
        background-color: var(--form-background-color);
        border: var(--form-border-width) solid var(--form-border-color);
        border-radius: var(--form-border-radius);
        box-shadow: var(--form-box-shadow);
        display: flex;
        flex-direction: var(--form-flex-direction);
        gap: var(--form-gap);
        height: var(--form-height);
        justify-content: var(--form-justify-content);
        max-height: var(--form-max-height);
        max-width: var(--form-max-width);
        padding: var(--form-padding);
        width: var(--form-width);
      }
`;
      }
    },
    exportHTML: (form, formSchema, pageSchema, indentation) => {
      if (typeof form?.props?.isVisible === "boolean" && !form.props.isVisible) {
        return "";
      }

      return `${indentation}<form class="form ${form?.id}" data-pc-id="${form?.id || ""}">
${form?.slots?.body || ""}${(form?.slots?.body || "").trim() === "" ? "\n" : ""}${indentation}</form>`;
    },
    isAllowingChildComponents: true,
    label: "Form",
    plan: "Personal",
    props: {
      flexDirection: {
        cssProperty: "flex-direction",
        cssVariableName: "--form-flex-direction",
        defaultValue: "column",
        label: "Flexbox direction",
        options: [
          { label: "Row", value: "row" },
          { label: "Column", value: "column" },
        ],
        role: "layout",
        roleGroup: "Structure",
        schemaType: "enum<string>",
        type: "select",
      },
      alignItems: {
        cssProperty: "align-items",
        cssVariableName: "--form-align-items",
        defaultValue: "stretch",
        label: "Align items",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Stretch", value: "stretch" },
          { label: "Center", value: "center" },
          { label: "Flexbox start", value: "flex-start" },
          { label: "Flexbox end", value: "flex-end" },
        ],
        role: "layout",
        roleGroup: "Structure",
        schemaType: "enum<string>",
        type: "select",
      },
      justifyContent: {
        cssProperty: "justify-content",
        cssVariableName: "--form-justify-content",
        defaultValue: "stretch",
        label: "Justify content",
        options: [
          { label: "Stretch", value: "stretch" },
          { label: "Center", value: "center" },
          { label: "Flexbox start", value: "flex-start" },
          { label: "Flexbox end", value: "flex-end" },
          { label: "Space between", value: "space-between" },
          { label: "Space around", value: "space-around" },
          { label: "Space evenly", value: "space-evenly" },
        ],
        role: "layout",
        roleGroup: "Structure",
        schemaType: "enum<string>",
        type: "select",
      },
      gap: {
        cssProperty: "gap",
        cssVariableName: "--form-gap",
        defaultValue: "1rem",
        label: "Gap",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      width: {
        cssProperty: "width",
        cssVariableName: "--form-width",
        defaultValue: "100%",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxWidth: {
        cssProperty: "max-width",
        cssVariableName: "--form-max-width",
        defaultValue: "none",
        label: "Maximum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--form-height",
        defaultValue: "auto",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxHeight: {
        cssProperty: "max-height",
        cssVariableName: "--form-max-height",
        defaultValue: "none",
        label: "Maximum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      padding: {
        cssProperty: "padding",
        cssVariableName: "--form-padding",
        defaultValue: "2rem",
        label: "Padding",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--form-background-color",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--form-border-color",
        defaultValue: "var(--pc-semantic-border-default)",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--form-border-width",
        defaultValue: "1px",
        label: "Border width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--form-border-radius",
        defaultValue: "14px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      boxShadow: {
        cssProperty: "box-shadow",
        cssVariableName: "--form-box-shadow",
        defaultValue: "var(--pc-semantic-shadow-sm)",
        label: "Box shadow",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      onSubmit: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: null,
        label: "On submit",
        role: "action",
        roleGroup: "Action",
        schemaType: "object",
        type: "action",
      },
      isVisible: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: true,
        label: "Is visible",
        role: "visibility",
        roleGroup: "Visibility",
        schemaType: "boolean",
        type: "switch",
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
        allowedChildComponents: ["Button", "Checkbox", "Divider", "Element", "Heading", "Input", "Label", "List", "RichText", "RadioGroup", "Section", "Select", "Spacer", "Spinner", "Switch", "Table", "Text", "TextArea"],
      },
    },
  };
}
