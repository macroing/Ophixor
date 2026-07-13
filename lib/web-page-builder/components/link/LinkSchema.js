// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createLinkSchema() {
  return {
    defaultSlots: {},
    description: "A link that can be configured to open in the same window or a separate blank window.",
    editor: {
      defaultOpenGroups: {
        content: ["General"],
        layout: [],
        selectors: [],
        styling: ["Typography"],
      },
      roleGroupOrder: {
        content: ["General"],
        layout: ["Alignment", "Spacing"],
        selectors: ["Selectors"],
        styling: ["Typography", "Decoration", "Surface", "Border", "Effects"],
      },
      roleOrder: ["content", "styling", "layout", "selectors"],
    },
    exportCSS: (link = null, linkSchema = null) => {
      if (link && linkSchema) {
        const props = exportCSSFromProps(link, linkSchema);

        if (props.length > 0) {
          return `
      .${link.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .link {
        --link-background-color: transparent;
        --link-background-color-hover: transparent;
        --link-border-color: transparent;
        --link-border-color-hover: transparent;
        --link-border-radius: 0px;
        --link-border-width: 0px;
        --link-color: var(--pc-semantic-text-primary);
        --link-color-hover: var(--pc-semantic-interactive-link-hover);
        --link-cursor: pointer;
        --link-cursor-hover: pointer;
        --link-font-family: inherit;
        --link-font-size: 1rem;
        --link-font-style: normal;
        --link-font-weight: normal;
        --link-line-height: normal;
        --link-padding: 0px;
        --link-text-align: left;
        --link-text-decoration: none;
        --link-text-decoration-hover: none;
        --link-transition: none;

        background-color: var(--link-background-color);
        border: var(--link-border-width) solid var(--link-border-color);
        border-radius: var(--link-border-radius);
        color: var(--link-color);
        cursor: var(--link-cursor);
        font-family: var(--link-font-family);
        font-size: var(--link-font-size);
        font-style: var(--link-font-style);
        font-weight: var(--link-font-weight);
        line-height: var(--link-line-height);
        padding: var(--link-padding);
        text-align: var(--link-text-align);
        text-decoration: var(--link-text-decoration);
        transition: var(--link-transition);
      }

      .link:hover {
        background-color: var(--link-background-color-hover);
        border-color: var(--link-border-color-hover);
        color: var(--link-color-hover);
        cursor: var(--link-cursor-hover);
        text-decoration: var(--link-text-decoration-hover);
      }
`;
      }
    },
    exportHTML: (link, linkSchema, pageSchema, indentation) => {
      return `${indentation}<a class="link ${link?.id}" data-pc-id="${link?.id || ""}" href="${link?.props?.href || "/"}" target="${link?.props?.target || "_self"}">${link?.props?.text || ""}</a>`;
    },
    isAllowingChildComponents: false,
    label: "Link",
    plan: "Personal",
    props: {
      text: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "Text",
        label: "Text",
        role: "content",
        roleGroup: "General",
        schemaType: "string",
        type: "text",
      },
      href: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "/",
        label: "Link",
        role: "content",
        roleGroup: "General",
        schemaType: "string",
        type: "text",
      },
      target: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "_self",
        label: "Target",
        options: [
          { label: "Self", value: "_self" },
          { label: "Blank", value: "_blank" },
          { label: "Parent", value: "_parent" },
          { label: "Top", value: "_top" },
        ],
        role: "content",
        roleGroup: "General",
        schemaType: "enum<string>",
        type: "select",
      },
      fontFamily: {
        cssProperty: "font-family",
        cssVariableName: "--link-font-family",
        defaultValue: "inherit",
        label: "Font family",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontSize: {
        cssProperty: "font-size",
        cssVariableName: "--link-font-size",
        defaultValue: "1rem",
        label: "Font size",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontWeight: {
        cssProperty: "font-weight",
        cssVariableName: "--link-font-weight",
        defaultValue: "normal",
        label: "Font weight",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontStyle: {
        cssProperty: "font-style",
        cssVariableName: "--link-font-style",
        defaultValue: "normal",
        label: "Font style",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      lineHeight: {
        cssProperty: "line-height",
        cssVariableName: "--link-line-height",
        defaultValue: "normal",
        label: "Line height",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--link-color",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorHover: {
        cssProperty: "color",
        cssVariableName: "--link-color-hover",
        defaultValue: "var(--pc-semantic-interactive-link-hover)",
        label: "Color - Hover",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      textDecoration: {
        cssProperty: "text-decoration",
        cssVariableName: "--link-text-decoration",
        defaultValue: "none",
        label: "Text decoration",
        role: "styling",
        roleGroup: "Decoration",
        schemaType: "string",
        type: "text",
      },
      textDecorationHover: {
        cssProperty: "text-decoration",
        cssVariableName: "--link-text-decoration-hover",
        defaultValue: "none",
        label: "Text decoration - Hover",
        role: "styling",
        roleGroup: "Decoration",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--link-background-color",
        defaultValue: "transparent",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backgroundColorHover: {
        cssProperty: "background-color",
        cssVariableName: "--link-background-color-hover",
        defaultValue: "transparent",
        label: "Background color - Hover",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      cursor: {
        cssProperty: "cursor",
        cssVariableName: "--link-cursor",
        defaultValue: "pointer",
        label: "Cursor",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      cursorHover: {
        cssProperty: "cursor",
        cssVariableName: "--link-cursor-hover",
        defaultValue: "pointer",
        label: "Cursor - Hover",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--link-border-width",
        defaultValue: "0px",
        label: "Border width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--link-border-color",
        defaultValue: "transparent",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderColorHover: {
        cssProperty: "border-color",
        cssVariableName: "--link-border-color-hover",
        defaultValue: "transparent",
        label: "Border color - Hover",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--link-border-radius",
        defaultValue: "0px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      transition: {
        cssProperty: "transition",
        cssVariableName: "--link-transition",
        defaultValue: "none",
        label: "Transition",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      textAlign: {
        cssProperty: "text-align",
        cssVariableName: "--link-text-align",
        defaultValue: "left",
        label: "Text align",
        options: [
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
          { label: "Center", value: "center" },
          { label: "Justify", value: "justify" },
        ],
        role: "layout",
        roleGroup: "Alignment",
        schemaType: "enum<string>",
        type: "select",
      },
      padding: {
        cssProperty: "padding",
        cssVariableName: "--link-padding",
        defaultValue: "0px",
        label: "Padding",
        role: "layout",
        roleGroup: "Spacing",
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
      /*
      body: {
        allowedChildComponents: ["Badge", "Text"],
      }
      */
    },
  };
}
