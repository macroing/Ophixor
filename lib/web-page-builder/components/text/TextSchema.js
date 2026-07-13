// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createTextSchema() {
  return {
    defaultSlots: {
      body: [],
    },
    description: "A component that contains text.",
    editor: {
      defaultOpenGroups: {
        content: ["Content"],
        layout: [],
        selectors: [],
        styling: ["Typography"],
        visibility: [],
      },
      roleGroupOrder: {
        content: ["Content"],
        layout: ["Size", "Spacing"],
        selectors: ["Selectors"],
        styling: ["Typography", "Alignment", "Element", "Surface", "Border"],
        visibility: ["Visibility"],
      },
      roleOrder: ["content", "styling", "layout", "visibility", "selectors"],
    },
    exportCSS: (text = null, textSchema = null) => {
      if (text && textSchema) {
        const props = exportCSSFromProps(text, textSchema);

        const display = text?.props?.display;
        const element = text?.props?.element;

        if (!display && ["small", "span", "strong"].includes(element)) {
          props.push("--text-display: inline;");
        }

        if (props.length > 0) {
          return `
      .${text.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .text {
        --text-background-color: transparent;
        --text-border-color: transparent;
        --text-border-radius: 0px;
        --text-border-width: 0px;
        --text-color: inherit;
        --text-cursor: auto;
        --text-font-family: inherit;
        --text-font-size: clamp(1rem, 1.2vw, 1.125rem);
        --text-font-style: normal;
        --text-font-weight: 400;
        --text-height: auto;
        --text-line-height: 1.65;
        --text-margin: 0px;
        --text-max-height: none;
        --text-max-width: none;
        --text-min-height: 0px;
        --text-min-width: 0px;
        --text-overflow: visible;
        --text-overflow-wrap: normal;
        --text-padding: 0px;
        --text-text-align: left;
        --text-text-decoration: none;
        --text-text-overflow: clip;
        --text-text-shadow: none;
        --text-white-space: normal;
        --text-width: auto;
        --text-word-break: normal;

        background-color: var(--text-background-color);
        border: var(--text-border-width) solid var(--text-border-color);
        border-radius: var(--text-border-radius);
        color: var(--text-color);
        cursor: var(--text-cursor);
        display: var(--text-display, revert);
        font-family: var(--text-font-family);
        font-size: var(--text-font-size);
        font-style: var(--text-font-style);
        font-weight: var(--text-font-weight);
        height: var(--text-height);
        line-height: var(--text-line-height);
        margin: var(--text-margin);
        max-height: var(--text-max-height);
        max-width: var(--text-max-width);
        min-height: var(--text-min-height);
        min-width: var(--text-min-width);
        overflow: var(--text-overflow);
        overflow-wrap: var(--text-overflow-wrap);
        padding: var(--text-padding);
        text-align: var(--text-text-align);
        text-decoration: var(--text-text-decoration);
        text-overflow: var(--text-text-overflow);
        text-shadow: var(--text-text-shadow);
        white-space: var(--text-white-space);
        width: var(--text-width);
        word-break: var(--text-word-break);
      }
`;
      }
    },
    exportHTML: (text, textSchema, pageSchema, indentation) => {
      if (typeof text?.props?.isVisible === "boolean" && !text.props.isVisible) {
        return "";
      } else {
        return `${indentation}<${text?.props?.element || "p"} class="text ${text?.id}" data-pc-id="${text?.id || ""}">${text?.props?.text || ""}${(text?.slots?.body || "").trim() !== "" ? "\n" + text.slots.body : ""}${(text?.slots?.body || "").trim() !== "" ? indentation : ""}</${text?.props?.element || "p"}>`;
      }
    },
    isAllowingChildComponents: true,
    label: "Text",
    plan: "Personal",
    props: {
      text: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        label: "Text",
        role: "content",
        roleGroup: "Content",
        schemaType: "string",
        type: "textarea",
      },
      title: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Title",
        role: "content",
        roleGroup: "Content",
        schemaType: "string",
        type: "text",
      },
      fontFamily: {
        cssProperty: "font-family",
        cssVariableName: "--text-font-family",
        defaultValue: "inherit",
        label: "Font family",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontSize: {
        cssProperty: "font-size",
        cssVariableName: "--text-font-size",
        defaultValue: "clamp(1rem, 1.2vw, 1.125rem)",
        label: "Font size",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontWeight: {
        cssProperty: "font-weight",
        cssVariableName: "--text-font-weight",
        defaultValue: "400",
        label: "Font weight",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontStyle: {
        cssProperty: "font-style",
        cssVariableName: "--text-font-style",
        defaultValue: "normal",
        label: "Font style",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      lineHeight: {
        cssProperty: "line-height",
        cssVariableName: "--text-line-height",
        defaultValue: "1.65",
        label: "Line height",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      textDecoration: {
        cssProperty: "text-decoration",
        cssVariableName: "--text-text-decoration",
        defaultValue: "none",
        label: "Text decoration",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--text-color",
        defaultValue: "inherit",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      textShadow: {
        cssProperty: "text-shadow",
        cssVariableName: "--text-text-shadow",
        defaultValue: "none",
        label: "Text shadow",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      textAlign: {
        cssProperty: "text-align",
        cssVariableName: "--text-text-align",
        defaultValue: "left",
        label: "Text align",
        options: [
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
          { label: "Center", value: "center" },
          { label: "Justify", value: "justify" },
        ],
        role: "styling",
        roleGroup: "Alignment",
        schemaType: "enum<string>",
        type: "select",
      },
      element: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "p",
        label: "Element",
        options: [
          { label: "P element", value: "p" },
          { label: "Div element", value: "div" },
          { label: "Span element", value: "span" },
          { label: "Small element", value: "small" },
          { label: "Strong element", value: "strong" },
        ],
        role: "styling",
        roleGroup: "Element",
        schemaType: "enum<string>",
        type: "select",
      },
      overflow: {
        cssProperty: "overflow",
        cssVariableName: "--text-overflow",
        defaultValue: "visible",
        label: "Overflow",
        role: "styling",
        roleGroup: "Element",
        schemaType: "string",
        type: "text",
      },
      overflowWrap: {
        cssProperty: "overflow-wrap",
        cssVariableName: "--text-overflow-wrap",
        defaultValue: "normal",
        label: "Overflow wrap",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Break word", value: "break-word" },
          { label: "Anywhere", value: "anywhere" },
          { label: "Inherit", value: "inherit" },
          { label: "Initial", value: "initial" },
          { label: "Revert", value: "revert" },
          { label: "Revert layer", value: "revert-layer" },
          { label: "Unset", value: "unset" },
        ],
        role: "styling",
        roleGroup: "Element",
        schemaType: "enum<string>",
        type: "select",
      },
      wordBreak: {
        cssProperty: "word-break",
        cssVariableName: "--text-word-break",
        defaultValue: "normal",
        label: "Word break",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Break all", value: "break-all" },
          { label: "Keep all", value: "keep-all" },
          { label: "Auto-phrase", value: "auto-phrase" },
          { label: "Inherit", value: "inherit" },
          { label: "Initial", value: "initial" },
          { label: "Revert", value: "revert" },
          { label: "Revert layer", value: "revert-layer" },
          { label: "Unset", value: "unset" },
        ],
        role: "styling",
        roleGroup: "Element",
        schemaType: "enum<string>",
        type: "select",
      },
      textOverflow: {
        cssProperty: "text-overflow",
        cssVariableName: "--text-text-overflow",
        defaultValue: "clip",
        label: "Text overflow",
        role: "styling",
        roleGroup: "Element",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--text-background-color",
        defaultValue: "transparent",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      cursor: {
        cssProperty: "cursor",
        cssVariableName: "--text-cursor",
        defaultValue: "auto",
        label: "Cursor",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--text-border-width",
        defaultValue: "0px",
        label: "Border width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--text-border-color",
        defaultValue: "transparent",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--text-border-radius",
        defaultValue: "0px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      width: {
        cssProperty: "width",
        cssVariableName: "--text-width",
        defaultValue: "auto",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minWidth: {
        cssProperty: "min-width",
        cssVariableName: "--text-min-width",
        defaultValue: "0px",
        label: "Minimum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxWidth: {
        cssProperty: "max-width",
        cssVariableName: "--text-max-width",
        defaultValue: "none",
        label: "Maximum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--text-height",
        defaultValue: "auto",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minHeight: {
        cssProperty: "min-height",
        cssVariableName: "--text-min-height",
        defaultValue: "0px",
        label: "Minimum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxHeight: {
        cssProperty: "max-height",
        cssVariableName: "--text-max-height",
        defaultValue: "none",
        label: "Maximum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      display: {
        cssProperty: "display",
        cssVariableName: "--text-display",
        defaultValue: "inline-block",
        label: "Display",
        options: [
          { label: "Default", value: "" },
          { label: "None", value: "none" },
          { label: "Contents", value: "contents" },
          { label: "Block", value: "block" },
          { label: "Inline", value: "inline" },
          { label: "Inline-block", value: "inline-block" },
          { label: "Flexbox", value: "flex" },
          { label: "Inline Flexbox", value: "inline-flex" },
        ],
        role: "layout",
        roleGroup: "Size",
        schemaType: "enum<string>",
        type: "select",
      },
      margin: {
        cssProperty: "margin",
        cssVariableName: "--text-margin",
        defaultValue: "0px",
        label: "Margin",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      padding: {
        cssProperty: "padding",
        cssVariableName: "--text-padding",
        defaultValue: "0px",
        label: "Padding",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      whiteSpace: {
        cssProperty: "white-space",
        cssVariableName: "--text-white-space",
        defaultValue: "normal",
        label: "White space",
        role: "layout",
        roleGroup: "Spacing",
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
        allowedChildComponents: ["Badge", "Element", "Link", "Text"],
      },
    },
    variants: [
      {
        label: "Default - Long text",
        props: {
          element: "p",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultrices ex eget lacus maximus tristique. Ut posuere, libero non ultricies eleifend, lectus ex condimentum augue, et euismod metus magna non enim. Aenean posuere tellus nec leo malesuada, consequat malesuada dui consectetur. Vestibulum eu tincidunt lorem. Vivamus ultricies porta ex, id efficitur sem tempus congue. Vivamus sodales odio nunc, sit amet rhoncus sapien bibendum ut. Sed et libero tincidunt, dignissim lacus sed, porttitor mi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum venenatis viverra magna, quis feugiat nunc vehicula non. Ut sollicitudin mauris ac magna eleifend congue.",
        },
      },
    ],
  };
}
