// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createListSchema() {
  return {
    defaultSlots: {
      body: [],
    },
    description: "A list that can be either ordered or unordered.",
    editor: {
      defaultOpenGroups: {
        layout: [],
        selectors: [],
        styling: ["Typography"],
      },
      roleGroupOrder: {
        layout: ["Structure", "Spacing", "Size"],
        selectors: ["Selectors"],
        styling: ["Typography", "Surface", "Border", "Effects"],
      },
      roleOrder: ["styling", "layout", "selectors"],
    },
    exportCSS: (list = null, listSchema = null) => {
      if (list && listSchema) {
        const props = exportCSSFromProps(list, listSchema);

        if (props.length > 0) {
          return `
      .${list.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .list {
        --list-align-items: stretch;
        --list-background: none;
        --list-background-color: transparent;
        --list-border-color: transparent;
        --list-border-radius: 0px;
        --list-border-width: 0px;
        --list-bottom: auto;
        --list-box-shadow: none;
        --list-color: var(--pc-semantic-text-primary);
        --list-display: flex;
        --list-flex-direction: column;
        --list-font-size: 1rem;
        --list-font-weight: normal;
        --list-gap: 0.5rem;
        --list-height: auto;
        --list-justify-content: stretch;
        --list-left: auto;
        --list-letter-spacing: normal;
        --list-list-style-position: outside;
        --list-list-style-type: disc;
        --list-padding: 1rem;
        --list-padding-inline-start: 1rem;
        --list-position: relative;
        --list-right: auto;
        --list-text-shadow: none;
        --list-top: auto;
        --list-width: auto;
        --list-z-index: auto;

        align-items: var(--list-align-items);
        background: var(--list-background);
        background-color: var(--list-background-color);
        border: var(--list-border-width) solid var(--list-border-color);
        border-radius: var(--list-border-radius);
        bottom: var(--list-bottom);
        box-shadow: var(--list-box-shadow);
        color: var(--list-color);
        display: var(--list-display);
        flex-direction: var(--list-flex-direction);
        font-size: var(--list-font-size);
        font-weight: var(--list-font-weight);
        gap: var(--list-gap);
        height: var(--list-height);
        justify-content: var(--list-justify-content);
        left: var(--list-left);
        letter-spacing: var(--list-letter-spacing);
        list-style-position: var(--list-list-style-position);
        list-style-type: var(--list-list-style-type);
        padding: var(--list-padding);
        padding-inline-start: var(--list-padding-inline-start);
        position: var(--list-position);
        right: var(--list-right);
        text-shadow: var(--list-text-shadow);
        top: var(--list-top);
        width: var(--list-width);
        z-index: var(--list-z-index);
      }
`;
      }
    },
    exportHTML: (list, listSchema, pageSchema, indentation) => {
      return `${indentation}<${list?.props?.element || "ul"} class="list ${list?.id}" data-pc-id="${list?.id || ""}">
${list?.slots?.body || ""}${(list?.slots?.body || "").trim() === "" ? "\n" : ""}${indentation}</${list?.props?.element || "ul"}>`;
    },
    isAllowingChildComponents: true,
    label: "List",
    plan: "Personal",
    props: {
      listStylePosition: {
        cssProperty: "list-style-position",
        cssVariableName: "--list-list-style-position",
        defaultValue: "outside",
        label: "List style position",
        options: [
          { label: "Inside", value: "inside" },
          { label: "Outside", value: "outside" },
        ],
        role: "styling",
        roleGroup: "Typography",
        schemaType: "enum<string>",
        type: "select",
      },
      listStyleType: {
        cssProperty: "list-style-type",
        cssVariableName: "--list-list-style-type",
        defaultValue: "disc",
        label: "List style type",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontSize: {
        cssProperty: "font-size",
        cssVariableName: "--list-font-size",
        defaultValue: "1rem",
        label: "Font size",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontWeight: {
        cssProperty: "font-weight",
        cssVariableName: "--list-font-weight",
        defaultValue: "normal",
        label: "Font weight",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      letterSpacing: {
        cssProperty: "letter-spacing",
        cssVariableName: "--list-letter-spacing",
        defaultValue: "normal",
        label: "Letter spacing",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--list-color",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      background: {
        cssProperty: "background",
        cssVariableName: "--list-background",
        defaultValue: "none",
        label: "Background",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--list-background-color",
        defaultValue: "transparent",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--list-border-color",
        defaultValue: "transparent",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--list-border-width",
        defaultValue: "0px",
        label: "Border width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--list-border-radius",
        defaultValue: "0px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      boxShadow: {
        cssProperty: "box-shadow",
        cssVariableName: "--list-box-shadow",
        defaultValue: "none",
        label: "Box shadow",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      textShadow: {
        cssProperty: "text-shadow",
        cssVariableName: "--list-text-shadow",
        defaultValue: "none",
        label: "Text shadow",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      element: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "ul",
        label: "Element",
        options: [
          { label: "OL element", value: "ol" },
          { label: "UL element", value: "ul" },
        ],
        role: "layout",
        roleGroup: "Structure",
        schemaType: "enum<string>",
        type: "select",
      },
      display: {
        cssProperty: "display",
        cssVariableName: "--list-display",
        defaultValue: "flex",
        label: "Display",
        options: [
          { label: "Flexbox", value: "flex" },
          { label: "Block", value: "block" },
        ],
        role: "layout",
        roleGroup: "Structure",
        schemaType: "enum<string>",
        type: "select",
      },
      position: {
        cssProperty: "position",
        cssVariableName: "--list-position",
        defaultValue: "relative",
        label: "Position",
        options: [
          { label: "Relative", value: "relative" },
          { label: "Absolute", value: "absolute" },
          { label: "Fixed", value: "fixed" },
          { label: "Sticky", value: "sticky" },
        ],
        role: "layout",
        roleGroup: "Structure",
        schemaType: "enum<string>",
        type: "select",
      },
      top: {
        cssProperty: "top",
        cssVariableName: "--list-top",
        defaultValue: "auto",
        label: "Top",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      right: {
        cssProperty: "right",
        cssVariableName: "--list-right",
        defaultValue: "auto",
        label: "Right",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      bottom: {
        cssProperty: "bottom",
        cssVariableName: "--list-bottom",
        defaultValue: "auto",
        label: "Bottom",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      left: {
        cssProperty: "left",
        cssVariableName: "--list-left",
        defaultValue: "auto",
        label: "Left",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      zIndex: {
        cssProperty: "z-index",
        cssVariableName: "--list-z-index",
        defaultValue: "auto",
        label: "Z-index",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      flexDirection: {
        cssProperty: "flex-direction",
        cssVariableName: "--list-flex-direction",
        defaultValue: "column",
        label: "Flexbox direction",
        options: [
          { label: "Row", value: "row" },
          { label: "Column", value: "column" },
        ],
        role: "layout",
        roleGroup: "Flexbox",
        schemaType: "enum<string>",
        type: "select",
      },
      alignItems: {
        cssProperty: "align-items",
        cssVariableName: "--list-align-items",
        defaultValue: "stretch",
        label: "Align items",
        options: [
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
        cssVariableName: "--list-justify-content",
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
      padding: {
        cssProperty: "padding",
        cssVariableName: "--list-padding",
        defaultValue: "1rem",
        label: "Padding",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      paddingInlineStart: {
        cssProperty: "padding-inline-start",
        cssVariableName: "--list-padding-inline-start",
        defaultValue: "1rem",
        label: "Padding inline start",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      gap: {
        cssProperty: "gap",
        cssVariableName: "--list-gap",
        defaultValue: "0.5rem",
        label: "Gap",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      width: {
        cssProperty: "width",
        cssVariableName: "--list-width",
        defaultValue: "auto",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--list-height",
        defaultValue: "auto",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
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
    slots: {
      body: {
        allowedChildComponents: ["Element", "ListItem"],
      },
    },
  };
}
