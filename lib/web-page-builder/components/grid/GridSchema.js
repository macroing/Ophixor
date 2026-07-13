// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createGridSchema() {
  return {
    defaultProps: {
      borderColor: "#e5e7eb",
      borderWidth: "1px",
    },
    defaultSlots: {
      body: [],
    },
    description: "A grid-based container that is useful for creating some layouts.",
    editor: {
      defaultOpenGroups: {
        layout: ["Structure", "Spacing"],
        selectors: [],
        styling: [],
        visibility: [],
      },
      roleGroupOrder: {
        layout: ["Structure", "Spacing", "Alignment", "Size"],
        selectors: ["Selectors"],
        styling: ["Surface", "Border"],
        visibility: ["Visibility"],
      },
      roleOrder: ["layout", "styling", "visibility", "selectors"],
    },
    exportCSS: (grid = null, gridSchema = null) => {
      if (grid && gridSchema) {
        const props = exportCSSFromProps(grid, gridSchema);

        if (props.length > 0) {
          return `
      .${grid.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .grid {
        --grid-align-content: stretch;
        --grid-align-items: normal;
        --grid-background-color: transparent;
        --grid-border-color: transparent;
        --grid-border-radius: 0px;
        --grid-border-width: 0px;
        --grid-gap: 1rem;
        --grid-grid-template-columns: 1fr;
        --grid-height: auto;
        --grid-justify-content: flex-start;
        --grid-justify-items: legacy;
        --grid-margin: 0px;
        --grid-max-height: none;
        --grid-max-width: none;
        --grid-overflow: visible;
        --grid-padding: 1rem;
        --grid-width: 100%;

        align-content: var(--grid-align-content);
        align-items: var(--grid-align-items);
        background-color: var(--grid-background-color);
        border: var(--grid-border-width) solid var(--grid-border-color);
        border-radius: var(--grid-border-radius);
        display: grid;
        gap: var(--grid-gap);
        grid-template-columns: var(--grid-grid-template-columns);
        height: var(--grid-height);
        justify-content: var(--grid-justify-content);
        justify-items: var(--grid-justify-items);
        margin: var(--grid-margin);
        max-height: var(--grid-max-height);
        max-width: var(--grid-max-width);
        overflow: var(--grid-overflow);
        padding: var(--grid-padding);
        width: var(--grid-width);
      }
`;
      }
    },
    exportHTML: (grid, gridSchema, pageSchema, indentation) => {
      if (typeof grid?.props?.isVisible === "boolean" && !grid.props.isVisible) {
        return "";
      }

      return `${indentation}<div class="grid ${grid?.id}" data-pc-id="${grid?.id || ""}">
${grid?.slots?.body || ""}${(grid?.slots?.body || "").trim() === "" ? "\n" : ""}${indentation}</div>`;
    },
    isAllowingChildComponents: true,
    label: "Grid",
    plan: "Personal",
    props: {
      gridTemplateColumns: {
        cssProperty: "grid-template-columns",
        cssVariableName: "--grid-grid-template-columns",
        defaultValue: "1fr",
        label: "Grid template columns",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      gap: {
        cssProperty: "gap",
        cssVariableName: "--grid-gap",
        defaultValue: "1rem",
        label: "Gap",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      padding: {
        cssProperty: "padding",
        cssVariableName: "--grid-padding",
        defaultValue: "1rem",
        label: "Padding",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      margin: {
        cssProperty: "margin",
        cssVariableName: "--grid-margin",
        defaultValue: "0px",
        label: "Margin",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      justifyItems: {
        cssProperty: "justify-items",
        cssVariableName: "--grid-justify-items",
        defaultValue: "legacy",
        label: "Justify items",
        options: [
          { label: "Legacy", value: "legacy" },
          { label: "Normal", value: "normal" },
          { label: "Stretch", value: "stretch" },
          { label: "Center", value: "center" },
          { label: "Start", value: "start" },
          { label: "End", value: "end" },
        ],
        role: "layout",
        roleGroup: "Alignment",
        schemaType: "enum<string>",
        type: "select",
      },
      alignItems: {
        cssProperty: "align-items",
        cssVariableName: "--grid-align-items",
        defaultValue: "normal",
        label: "Align items",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Stretch", value: "stretch" },
          { label: "Center", value: "center" },
          { label: "Start", value: "start" },
          { label: "End", value: "end" },
        ],
        role: "layout",
        roleGroup: "Alignment",
        schemaType: "enum<string>",
        type: "select",
      },
      justifyContent: {
        cssProperty: "justify-content",
        cssVariableName: "--grid-justify-content",
        defaultValue: "flex-start",
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
        roleGroup: "Alignment",
        schemaType: "enum<string>",
        type: "select",
      },
      alignContent: {
        cssProperty: "align-content",
        cssVariableName: "--grid-align-content",
        defaultValue: "stretch",
        label: "Align content",
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
        roleGroup: "Alignment",
        schemaType: "enum<string>",
        type: "select",
      },
      width: {
        cssProperty: "width",
        cssVariableName: "--grid-width",
        defaultValue: "100%",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxWidth: {
        cssProperty: "max-width",
        cssVariableName: "--grid-max-width",
        defaultValue: "none",
        label: "Maximum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--grid-height",
        defaultValue: "auto",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxHeight: {
        cssProperty: "max-height",
        cssVariableName: "--grid-max-height",
        defaultValue: "none",
        label: "Maximum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      overflow: {
        cssProperty: "overflow",
        cssVariableName: "--grid-overflow",
        defaultValue: "visible",
        label: "Overflow",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
          { label: "Auto", value: "auto" },
          { label: "Scroll", value: "scroll" },
        ],
        role: "layout",
        roleGroup: "Size",
        schemaType: "enum<string>",
        type: "select",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--grid-background-color",
        defaultValue: "transparent",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--grid-border-width",
        defaultValue: "0px",
        label: "Border width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--grid-border-color",
        defaultValue: "transparent",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--grid-border-radius",
        defaultValue: "0px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
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
        allowedChildComponents: ["Alert", "Badge", "Button", "Canvas", "Card", "Checkbox", "Dialog", "Divider", "Element", "Form", "Grid", "Heading", "Image", "Input", "Label", "Link", "List", "Map", "RichText", "RadioGroup", "Section", "Select", "Spacer", "Spinner", "Switch", "Table", "Text", "TextArea"],
      },
    },
  };
}
