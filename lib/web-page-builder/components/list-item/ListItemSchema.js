// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createListItemSchema() {
  return {
    defaultSlots: {
      body: [],
    },
    description: "An item in an ordered or unordered list.",
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
    exportCSS: (listItem = null, listItemSchema = null) => {
      if (listItem && listItemSchema) {
        const props = exportCSSFromProps(listItem, listItemSchema);

        if (props.length > 0) {
          return `
      .${listItem.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .list-item {
        --list-item-align-items: stretch;
        --list-item-background: none;
        --list-item-background-hover: none;
        --list-item-background-color: transparent;
        --list-item-background-color-hover: transparent;
        --list-item-border-color: transparent;
        --list-item-border-color-hover: transparent;
        --list-item-border-radius: 0px;
        --list-item-border-width: 0px;
        --list-item-bottom: auto;
        --list-item-box-shadow: none;
        --list-item-box-shadow-hover: none;
        --list-item-color: var(--pc-semantic-text-primary);
        --list-item-color-hover: var(--pc-semantic-text-primary);
        --list-item-cursor: auto;
        --list-item-cursor-hover: auto;
        --list-item-display: list-item;
        --list-item-flex-direction: column;
        --list-item-font-size: 1rem;
        --list-item-font-weight: normal;
        --list-item-gap: 0.5rem;
        --list-item-height: auto;
        --list-item-justify-content: stretch;
        --list-item-left: auto;
        --list-item-letter-spacing: normal;
        --list-item-padding: 0px;
        --list-item-position: relative;
        --list-item-right: auto;
        --list-item-text-decoration: none;
        --list-item-text-decoration-hover: none;
        --list-item-text-shadow: none;
        --list-item-text-shadow-hover: none;
        --list-item-top: auto;
        --list-item-width: auto;
        --list-item-z-index: auto;

        align-items: var(--list-item-align-items);
        background: var(--list-item-background);
        background-color: var(--list-item-background-color);
        border: var(--list-item-border-width) solid var(--list-item-border-color);
        border-radius: var(--list-item-border-radius);
        bottom: var(--list-item-bottom);
        box-shadow: var(--list-item-box-shadow);
        color: var(--list-item-color);
        cursor: var(--list-item-cursor);
        display: var(--list-item-display);
        flex-direction: var(--list-item-flex-direction);
        font-size: var(--list-item-font-size);
        font-weight: var(--list-item-font-weight);
        gap: var(--list-item-gap);
        height: var(--list-item-height);
        justify-content: var(--list-item-justify-content);
        left: var(--list-item-left);
        letter-spacing: var(--list-item-letter-spacing);
        padding: var(--list-item-padding);
        position: var(--list-item-position);
        right: var(--list-item-right);
        text-decoration: var(--link-text-decoration);
        text-shadow: var(--list-item-text-shadow);
        top: var(--list-item-top);
        width: var(--list-item-width);
        z-index: var(--list-item-z-index);
      }

      .list-item:hover {
        background: var(--list-item-background-hover);
        background-color: var(--list-item-background-color-hover);
        border-color: var(--list-item-border-color-hover);
        box-shadow: var(--list-item-box-shadow-hover);
        color: var(--list-item-color-hover);
        cursor: var(--list-item-cursor-hover);
        text-decoration: var(--link-text-decoration-hover);
        text-shadow: var(--list-item-text-shadow-hover);
      }
`;
      }
    },
    exportHTML: (listItem, listItemSchema, pageSchema, indentation) => {
      return `${indentation}<li class="list-item ${listItem?.id}" data-pc-id="${listItem?.id || ""}">
${listItem?.slots?.body || ""}${(listItem?.slots?.body || "").trim() === "" ? "\n" : ""}${indentation}</li>`;
    },
    isAllowingChildComponents: true,
    label: "List item",
    plan: "Personal",
    props: {
      fontSize: {
        cssProperty: "font-size",
        cssVariableName: "--list-item-font-size",
        defaultValue: "1rem",
        label: "Font size",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontWeight: {
        cssProperty: "font-weight",
        cssVariableName: "--list-item-font-weight",
        defaultValue: "normal",
        label: "Font weight",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      letterSpacing: {
        cssProperty: "letter-spacing",
        cssVariableName: "--list-item-letter-spacing",
        defaultValue: "normal",
        label: "Letter spacing",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--list-item-color",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorHover: {
        cssProperty: "color",
        cssVariableName: "--list-item-color-hover",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      textDecoration: {
        cssProperty: "text-decoration",
        cssVariableName: "--list-item-text-decoration",
        defaultValue: "none",
        label: "Text decoration",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      textDecorationHover: {
        cssProperty: "text-decoration",
        cssVariableName: "--list-item-text-decoration-hover",
        defaultValue: "none",
        label: "Text decoration - Hover",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      background: {
        cssProperty: "background",
        cssVariableName: "--list-item-background",
        defaultValue: "none",
        label: "Background",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundHover: {
        cssProperty: "background",
        cssVariableName: "--list-item-background-hover",
        defaultValue: "none",
        label: "Background",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--list-item-background-color",
        defaultValue: "transparent",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backgroundColorHover: {
        cssProperty: "background-color",
        cssVariableName: "--list-item-background-color-hover",
        defaultValue: "transparent",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      cursor: {
        cssProperty: "cursor",
        cssVariableName: "--list-item-cursor",
        defaultValue: "auto",
        label: "Cursor",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      cursorHover: {
        cssProperty: "cursor",
        cssVariableName: "--list-item-cursor-hover",
        defaultValue: "auto",
        label: "Cursor - Hover",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--list-item-border-color",
        defaultValue: "transparent",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderColorHover: {
        cssProperty: "border-color",
        cssVariableName: "--list-item-border-color-hover",
        defaultValue: "transparent",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--list-item-border-width",
        defaultValue: "0px",
        label: "Border width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--list-item-border-radius",
        defaultValue: "0px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      boxShadow: {
        cssProperty: "box-shadow",
        cssVariableName: "--list-item-box-shadow",
        defaultValue: "none",
        label: "Box shadow",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      boxShadowHover: {
        cssProperty: "box-shadow",
        cssVariableName: "--list-item-box-shadow-hover",
        defaultValue: "none",
        label: "Box shadow",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      textShadow: {
        cssProperty: "text-shadow",
        cssVariableName: "--list-item-text-shadow",
        defaultValue: "none",
        label: "Text shadow",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      textShadowHover: {
        cssProperty: "text-shadow",
        cssVariableName: "--list-item-text-shadow-hover",
        defaultValue: "none",
        label: "Text shadow",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      display: {
        cssProperty: "display",
        cssVariableName: "--list-item-display",
        defaultValue: "list-item",
        label: "Display",
        options: [
          { label: "Flexbox", value: "flex" },
          { label: "List item", value: "list-item" },
        ],
        role: "layout",
        roleGroup: "Structure",
        schemaType: "enum<string>",
        type: "select",
      },
      position: {
        cssProperty: "position",
        cssVariableName: "--list-item-position",
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
        cssVariableName: "--list-item-top",
        defaultValue: "auto",
        label: "Top",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      right: {
        cssProperty: "right",
        cssVariableName: "--list-item-right",
        defaultValue: "auto",
        label: "Right",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      bottom: {
        cssProperty: "bottom",
        cssVariableName: "--list-item-bottom",
        defaultValue: "auto",
        label: "Bottom",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      left: {
        cssProperty: "left",
        cssVariableName: "--list-item-left",
        defaultValue: "auto",
        label: "Left",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      zIndex: {
        cssProperty: "z-index",
        cssVariableName: "--list-item-z-index",
        defaultValue: "auto",
        label: "Z-index",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      flexDirection: {
        cssProperty: "flex-direction",
        cssVariableName: "--list-item-flex-direction",
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
        cssVariableName: "--list-item-align-items",
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
        cssVariableName: "--list-item-justify-content",
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
        cssVariableName: "--list-item-padding",
        defaultValue: "0px",
        label: "Padding",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      gap: {
        cssProperty: "gap",
        cssVariableName: "--list-item-gap",
        defaultValue: "0.5rem",
        label: "Gap",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      width: {
        cssProperty: "width",
        cssVariableName: "--list-item-width",
        defaultValue: "auto",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--list-item-height",
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
        allowedChildComponents: ["Badge", "Element", "Grid", "Heading", "Image", "Link", "List", "Section", "Spacer", "Text"],
      },
    },
  };
}
