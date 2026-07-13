// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createButtonSchema() {
  return {
    defaultSlots: {
      body: [],
    },
    description: "A button or a link that looks like a button.",
    editor: {
      defaultOpenGroups: {
        action: ["Action"],
        content: ["General"],
        layout: [],
        selectors: [],
        styling: ["Variant", "Typography"],
        visibility: [],
      },
      roleGroupOrder: {
        action: ["Action"],
        content: ["General"],
        layout: ["Structure", "Spacing", "Size"],
        selectors: ["Selectors"],
        styling: ["Variant", "Typography", "Surface", "Border", "Effects"],
        visibility: ["Visibility"],
      },
      roleOrder: ["content", "styling", "layout", "action", "visibility", "selectors"],
    },
    exportCSS: (button = null, buttonSchema = null) => {
      if (button && buttonSchema) {
        const props = exportCSSFromProps(button, buttonSchema);

        if (props.length > 0) {
          return `
      .${button.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .button {
        --button-align-items: center;
        --button-align-self: auto;
        --button-backdrop-filter: none;
        --button-background: none;
        --button-background-color: var(--pc-semantic-surface-base);
        --button-background-color-danger: var(--pc-semantic-status-danger);
        --button-background-color-danger-hover: var(--pc-semantic-status-danger);
        --button-background-color-hover: var(--pc-semantic-surface-base);
        --button-background-color-primary: var(--pc-semantic-interactive-primary);
        --button-background-color-primary-hover: var(--pc-semantic-interactive-primary);
        --button-background-danger: none;
        --button-background-danger-hover: none;
        --button-background-hover: none;
        --button-background-primary: none;
        --button-background-primary-hover: none;
        --button-border-color: var(--pc-semantic-border-default);
        --button-border-color-danger: transparent;
        --button-border-color-danger-hover: transparent;
        --button-border-color-hover: var(--pc-semantic-border-default);
        --button-border-color-primary: transparent;
        --button-border-color-primary-hover: transparent;
        --button-border-radius: 8px;
        --button-border-style: solid;
        --button-border-width: 1px;
        --button-bottom: auto;
        --button-box-shadow: none;
        --button-box-shadow-active: none;
        --button-box-shadow-hover: var(--pc-semantic-shadow-sm);
        --button-color: var(--pc-semantic-text-primary);
        --button-color-danger: var(--pc-semantic-text-inverse);
        --button-color-danger-hover: var(--pc-semantic-text-inverse);
        --button-color-hover: var(--pc-semantic-text-primary);
        --button-color-primary: var(--pc-semantic-text-inverse);
        --button-color-primary-hover: var(--pc-semantic-text-inverse);
        --button-cursor: pointer;
        --button-cursor-disabled: default;
        --button-display: inline-flex;
        --button-flex-direction: row;
        --button-flex-grow: 0;
        --button-flex-shrink: 1;
        --button-flex-wrap: nowrap;
        --button-font-size: 1rem;
        --button-font-weight: normal;
        --button-gap: 0.5rem;
        --button-height: auto;
        --button-justify-content: center;
        --button-justify-self: auto;
        --button-left: auto;
        --button-letter-spacing: normal;
        --button-line-height: 1.2;
        --button-margin: 0px;
        --button-max-height: none;
        --button-max-width: none;
        --button-min-height: 0px;
        --button-min-width: 0px;
        --button-opacity: 1;
        --button-opacity-disabled: 0.5;
        --button-outline: none;
        --button-outline-focus: 2px solid var(--pc-semantic-interactive-primary);
        --button-overflow: visible;
        --button-padding: 0.6rem 1rem;
        --button-position: relative;
        --button-right: auto;
        --button-text-align: inherit;
        --button-text-decoration: none;
        --button-text-shadow: none;
        --button-text-shadow-hover: none;
        --button-text-transform: none;
        --button-top: auto;
        --button-transform: none;
        --button-transform-active: none;
        --button-transform-hover: translateY(-1px);
        --button-transform-origin: 50% 50% 0;
        --button-transition: 0.25s ease;
        --button-white-space: nowrap;
        --button-width: auto;
        --button-z-index: auto;

        align-items: var(--button-align-items);
        align-self: var(--button-align-self);
        backdrop-filter: var(--button-backdrop-filter);
        background: var(--button-background);
        background-color: var(--button-background-color);
        border: var(--button-border-width) var(--button-border-style) var(--button-border-color);
        border-radius: var(--button-border-radius);
        bottom: var(--button-bottom);
        box-shadow: var(--button-box-shadow);
        color: var(--button-color);
        cursor: var(--button-cursor);
        display: var(--button-display);
        flex-direction: var(--button-flex-direction);
        flex-grow: var(--button-flex-grow);
        flex-shrink: var(--button-flex-shrink);
        flex-wrap: var(--button-flex-wrap);
        font-size: var(--button-font-size);
        font-weight: var(--button-font-weight);
        gap: var(--button-gap);
        height: var(--button-height);
        justify-content: var(--button-justify-content);
        justify-self: var(--button-justify-self);
        left: var(--button-left);
        letter-spacing: var(--button-letter-spacing);
        line-height: var(--button-line-height);
        margin: var(--button-margin);
        max-height: var(--button-max-height);
        max-width: var(--button-max-width);
        min-height: var(--button-min-height);
        min-width: var(--button-min-width);
        opacity: var(--button-opacity);
        outline: var(--button-outline);
        outline-offset: 2px;
        overflow: var(--button-overflow);
        padding: var(--button-padding);
        position: var(--button-position);
        right: var(--button-right);
        text-align: var(--button-text-align);
        text-decoration: var(--button-text-decoration);
        text-shadow: var(--button-text-shadow);
        text-transform: var(--button-text-transform);
        top: var(--button-top);
        transform: var(--button-transform);
        transform-origin: var(--button-transform-origin);
        transition: var(--button-transition);
        white-space: var(--button-white-space);
        width: var(--button-width);
        z-index: var(--button-z-index);
      }

      .button.button-danger {
        background: var(--button-background-danger);
        background-color: var(--button-background-color-danger);
        border-color: var(--button-border-color-danger);
        color: var(--button-color-danger);
      }

      .button.button-primary {
        background: var(--button-background-primary);
        background-color: var(--button-background-color-primary);
        border-color: var(--button-border-color-primary);
        color: var(--button-color-primary);
      }

      .button:active {
        box-shadow: var(--button-box-shadow-active);
        transform: var(--button-transform-active);
      }

      .button:focus-visible:not(:disabled) {
        outline: var(--button-outline-focus);
        outline-offset: 2px;
      }

      .button:hover {
        background: var(--button-background-hover);
        background-color: var(--button-background-color-hover);
        border-color: var(--button-border-color-hover);
        box-shadow: var(--button-box-shadow-hover);
        color: var(--button-color-hover);
        text-decoration: none;
        text-shadow: var(--button-text-shadow-hover);
        transform: var(--button-transform-hover);
      }

      .button.button-danger:hover {
        background: var(--button-background-danger-hover);
        background-color: var(--button-background-color-danger-hover);
        border-color: var(--button-border-color-danger-hover);
        color: var(--button-color-danger-hover);
      }

      .button.button-primary:hover {
        background: var(--button-background-primary-hover);
        background-color: var(--button-background-color-primary-hover);
        border-color: var(--button-border-color-primary-hover);
        color: var(--button-color-primary-hover);
      }

      .button:disabled {
        background: var(--button-background);
        background-color: var(--button-background-color);
        border: var(--button-border-width) var(--button-border-style) var(--button-border-color);
        box-shadow: var(--button-box-shadow);
        color: var(--button-color);
        cursor: var(--button-cursor-disabled);
        opacity: var(--button-opacity-disabled);
        pointer-events: none;
        text-shadow: var(--button-text-shadow);
        transform: none;
      }

      .button.button-danger:disabled {
        background: var(--button-background-danger);
        background-color: var(--button-background-color-danger);
        border: var(--button-border-width) var(--button-border-style) var(--button-border-color-danger);
        box-shadow: var(--button-box-shadow);
        color: var(--button-color-danger);
        cursor: var(--button-cursor-disabled);
        opacity: var(--button-opacity-disabled);
        pointer-events: none;
        text-shadow: var(--button-text-shadow);
        transform: none;
      }

      .button.button-primary:disabled {
        background: var(--button-background-primary);
        background-color: var(--button-background-color-primary);
        border: var(--button-border-width) var(--button-border-style) var(--button-border-color-primary);
        box-shadow: var(--button-box-shadow);
        color: var(--button-color-primary);
        cursor: var(--button-cursor-disabled);
        opacity: var(--button-opacity-disabled);
        pointer-events: none;
        text-shadow: var(--button-text-shadow);
        transform: none;
      }
`;
      }
    },
    exportHTML: (button, buttonSchema, pageSchema, indentation) => {
      const disabled = typeof button?.props?.disabled === "boolean" ? button.props.disabled : undefined;
      const href = typeof button?.props?.href === "string" ? button.props.href : undefined;
      const id = typeof button?.props?.id === "string" && button.props.id !== "" ? button.props.id : undefined;
      const rel = typeof button?.props?.rel === "string" ? button.props.rel : undefined;
      const target = typeof button?.props?.target === "string" ? button.props.target : undefined;
      const text = typeof button?.props?.text === "string" || typeof button?.props?.text === "number" ? button.props.text : "";
      const type = typeof button?.props?.type === "string" && button.props.type !== "" ? button.props.type : undefined;

      if (typeof button?.props?.isVisible === "boolean" && !button.props.isVisible) {
        return "";
      } else if (href && !disabled) {
        return `${indentation}<a class="button${button?.props?.theme === "danger" ? " button-danger" : ""}${button?.props?.theme === "primary" ? " button-primary" : ""} ${button?.id}" data-pc-id="${button?.id || ""}" href="${href}"${id ? ` id="${id}"` : ""}${rel ? ` rel="${rel}"` : ""}${target ? ` target="${target}"` : ""}>${text}${button?.slots?.body || ""}${(button?.slots?.body || "").trim() !== "" ? indentation : ""}</a>`;
      } else {
        return `${indentation}<button class="button${button?.props?.theme === "danger" ? " button-danger" : ""}${button?.props?.theme === "primary" ? " button-primary" : ""} ${button?.id}" data-pc-id="${button?.id || ""}"${disabled ? ' disabled="disabled"' : ""}${button?.props?.id ? ` id="${button.props.id}"` : ""}${type ? ` type="${type}"` : ""}>${button?.props?.text}${button?.slots?.body || ""}${(button?.slots?.body || "").trim() !== "" ? indentation : ""}</button>`;
      }
    },
    isAllowingChildComponents: true,
    label: "Button",
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
        defaultValue: "",
        label: "Link",
        role: "content",
        roleGroup: "General",
        schemaType: "string",
        type: "text",
      },
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
      type: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Type",
        options: [
          { label: "Default", value: "" },
          { label: "Button", value: "button" },
          { label: "Reset", value: "reset" },
          { label: "Submit", value: "submit" },
        ],
        role: "content",
        roleGroup: "General",
        schemaType: "enum<string>",
        type: "select",
      },
      theme: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Theme",
        options: [
          { label: "Default", value: "" },
          { label: "Primary", value: "primary" },
          { label: "Danger", value: "danger" },
        ],
        role: "styling",
        roleGroup: "Variant",
        schemaType: "enum<string>",
        type: "select",
      },
      fontSize: {
        cssProperty: "font-size",
        cssVariableName: "--button-font-size",
        defaultValue: "1rem",
        label: "Font size",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontWeight: {
        cssProperty: "font-weight",
        cssVariableName: "--button-font-weight",
        defaultValue: "normal",
        label: "Font weight",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      letterSpacing: {
        cssProperty: "letter-spacing",
        cssVariableName: "--button-letter-spacing",
        defaultValue: "normal",
        label: "Letter spacing",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--button-color",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorHover: {
        cssProperty: "color",
        cssVariableName: "--button-color-hover",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color - Hover",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorPrimary: {
        cssProperty: "color",
        cssVariableName: "--button-color-primary",
        defaultValue: "var(--pc-semantic-text-inverse)",
        label: "Color - Primary",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        theme: "primary",
        type: "color",
      },
      colorPrimaryHover: {
        cssProperty: "color",
        cssVariableName: "--button-color-primary-hover",
        defaultValue: "var(--pc-semantic-text-inverse)",
        label: "Color - Primary - Hover",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        theme: "primary",
        type: "color",
      },
      colorDanger: {
        cssProperty: "color",
        cssVariableName: "--button-color-danger",
        defaultValue: "var(--pc-semantic-text-inverse)",
        label: "Color - Danger",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        theme: "danger",
        type: "color",
      },
      colorDangerHover: {
        cssProperty: "color",
        cssVariableName: "--button-color-danger-hover",
        defaultValue: "var(--pc-semantic-text-inverse)",
        label: "Color - Danger - Hover",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        theme: "danger",
        type: "color",
      },
      lineHeight: {
        cssProperty: "line-height",
        cssVariableName: "--button-line-height",
        defaultValue: "1.2",
        label: "Line height",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      textAlign: {
        cssProperty: "text-align",
        cssVariableName: "--button-text-align",
        defaultValue: "inherit",
        label: "Text align",
        options: [
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
          { label: "Center", value: "center" },
          { label: "Justify", value: "justify" },
        ],
        role: "styling",
        roleGroup: "Typography",
        schemaType: "enum<string>",
        type: "select",
      },
      textDecoration: {
        cssProperty: "text-decoration",
        cssVariableName: "--button-text-decoration",
        defaultValue: "none",
        label: "Text decoration",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      textTransform: {
        cssProperty: "text-transform",
        cssVariableName: "--button-text-transform",
        defaultValue: "none",
        label: "Text transform",
        options: [
          { label: "None", value: "none" },
          { label: "Uppercase", value: "uppercase" },
          { label: "Lowercase", value: "lowercase" },
          { label: "Capitalize", value: "capitalize" },
        ],
        role: "styling",
        roleGroup: "Typography",
        schemaType: "enum<string>",
        type: "select",
      },
      whiteSpace: {
        cssProperty: "white-space",
        cssVariableName: "--button-white-space",
        defaultValue: "nowrap",
        label: "White space",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      background: {
        cssProperty: "background",
        cssVariableName: "--button-background",
        defaultValue: "none",
        label: "Background",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundHover: {
        cssProperty: "background",
        cssVariableName: "--button-background-hover",
        defaultValue: "none",
        label: "Background - Hover",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--button-background-color",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backgroundColorHover: {
        cssProperty: "background-color",
        cssVariableName: "--button-background-color-hover",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color - Hover",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backgroundPrimary: {
        cssProperty: "background",
        cssVariableName: "--button-background-primary",
        defaultValue: "none",
        label: "Background - Primary",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundPrimaryHover: {
        cssProperty: "background",
        cssVariableName: "--button-background-primary-hover",
        defaultValue: "none",
        label: "Background - Primary - Hover",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundDanger: {
        cssProperty: "background",
        cssVariableName: "--button-background-danger",
        defaultValue: "none",
        label: "Background - Danger",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundDangerHover: {
        cssProperty: "background",
        cssVariableName: "--button-background-danger-hover",
        defaultValue: "none",
        label: "Background - Danger - Hover",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundColorPrimary: {
        cssProperty: "background-color",
        cssVariableName: "--button-background-color-primary",
        defaultValue: "var(--pc-semantic-interactive-primary)",
        label: "Background color - Primary",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        theme: "primary",
        type: "color",
      },
      backgroundColorPrimaryHover: {
        cssProperty: "background-color",
        cssVariableName: "--button-background-color-primary-hover",
        defaultValue: "var(--pc-semantic-interactive-primary)",
        label: "Background color - Primary - Hover",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        theme: "primary",
        type: "color",
      },
      backgroundColorDanger: {
        cssProperty: "background-color",
        cssVariableName: "--button-background-color-danger",
        defaultValue: "var(--pc-semantic-status-danger)",
        label: "Background color - Danger",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        theme: "danger",
        type: "color",
      },
      backgroundColorDangerHover: {
        cssProperty: "background-color",
        cssVariableName: "--button-background-color-danger-hover",
        defaultValue: "var(--pc-semantic-status-danger)",
        label: "Background color - Danger - Hover",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        theme: "danger",
        type: "color",
      },
      backgroundImage: {
        cssProperty: "background-image",
        cssPropertyOverride: true,
        cssVariableName: null,
        defaultValue: "",
        label: "Background image",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundSize: {
        cssProperty: "background-size",
        cssPropertyOverride: true,
        cssVariableName: null,
        defaultValue: "",
        label: "Background size",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundPosition: {
        cssProperty: "background-position",
        cssPropertyOverride: true,
        cssVariableName: null,
        defaultValue: "",
        label: "Background position",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundRepeat: {
        cssProperty: "background-repeat",
        cssPropertyOverride: true,
        cssVariableName: null,
        defaultValue: "",
        label: "Background repeat",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundBlendMode: {
        cssProperty: "background-blend-mode",
        cssPropertyOverride: true,
        cssVariableName: null,
        defaultValue: "",
        label: "Background blend mode",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      opacity: {
        cssProperty: "opacity",
        cssVariableName: "--button-opacity",
        defaultValue: "1",
        label: "Opacity",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      opacityDisabled: {
        cssProperty: "opacity",
        cssVariableName: "--button-opacity-disabled",
        defaultValue: "0.5",
        label: "Opacity - Disabled",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      cursor: {
        cssProperty: "cursor",
        cssVariableName: "--button-cursor",
        defaultValue: "pointer",
        label: "Cursor",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      cursorDisabled: {
        cssProperty: "cursor",
        cssVariableName: "--button-cursor-disabled",
        defaultValue: "default",
        label: "Cursor - Disabled",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--button-border-color",
        defaultValue: "var(--pc-semantic-border-default)",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderColorHover: {
        cssProperty: "border-color",
        cssVariableName: "--button-border-color-hover",
        defaultValue: "var(--pc-semantic-border-default)",
        label: "Border color - Hover",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderColorPrimary: {
        cssProperty: "border-color",
        cssVariableName: "--button-border-color-primary",
        defaultValue: "transparent",
        label: "Border color - Primary",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        theme: "primary",
        type: "color",
      },
      borderColorPrimaryHover: {
        cssProperty: "border-color",
        cssVariableName: "--button-border-color-primary-hover",
        defaultValue: "transparent",
        label: "Border color - Primary - Hover",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        theme: "primary",
        type: "color",
      },
      borderColorDanger: {
        cssProperty: "border-color",
        cssVariableName: "--button-border-color-danger",
        defaultValue: "transparent",
        label: "Border color - Danger",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        theme: "danger",
        type: "color",
      },
      borderColorDangerHover: {
        cssProperty: "border-color",
        cssVariableName: "--button-border-color-danger-hover",
        defaultValue: "transparent",
        label: "Border color - Danger - Hover",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        theme: "danger",
        type: "color",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--button-border-radius",
        defaultValue: "8px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--button-border-width",
        defaultValue: "1px",
        label: "Border width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderTopWidth: {
        cssProperty: "border-top-width",
        cssPropertyOverride: true,
        cssVariableName: null,
        defaultValue: "",
        label: "Border top width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderRightWidth: {
        cssProperty: "border-right-width",
        cssPropertyOverride: true,
        cssVariableName: null,
        defaultValue: "",
        label: "Border right width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderBottomWidth: {
        cssProperty: "border-bottom-width",
        cssPropertyOverride: true,
        cssVariableName: null,
        defaultValue: "",
        label: "Border bottom width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderLeftWidth: {
        cssProperty: "border-left-width",
        cssPropertyOverride: true,
        cssVariableName: null,
        defaultValue: "",
        label: "Border left width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderStyle: {
        cssProperty: "border-style",
        cssVariableName: "--button-border-style",
        defaultValue: "solid",
        label: "Border style",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      boxShadow: {
        cssProperty: "box-shadow",
        cssVariableName: "--button-box-shadow",
        defaultValue: "none",
        label: "Box shadow",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      boxShadowHover: {
        cssProperty: "box-shadow",
        cssVariableName: "--button-box-shadow-hover",
        defaultValue: "var(--pc-semantic-shadow-sm)",
        label: "Box shadow - Hover",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      boxShadowActive: {
        cssProperty: "box-shadow",
        cssVariableName: "--button-box-shadow-active",
        defaultValue: "none",
        label: "Box shadow - Active",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      transformHover: {
        cssProperty: "transform",
        cssVariableName: "--button-transform-hover",
        defaultValue: "translateY(-1px)",
        label: "Transform - Hover",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      transformActive: {
        cssProperty: "transform",
        cssVariableName: "--button-transform-active",
        defaultValue: "none",
        label: "Transform - Active",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      textShadow: {
        cssProperty: "text-shadow",
        cssVariableName: "--button-text-shadow",
        defaultValue: "none",
        label: "Text shadow",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      textShadowHover: {
        cssProperty: "text-shadow",
        cssVariableName: "--button-text-shadow-hover",
        defaultValue: "none",
        label: "Text shadow - Hover",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      transition: {
        cssProperty: "transition",
        cssVariableName: "--button-transition",
        defaultValue: "0.25s ease",
        label: "Transition",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      outline: {
        cssProperty: "outline",
        cssVariableName: "--button-outline",
        defaultValue: "none",
        label: "Outline",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      outlineFocus: {
        cssProperty: "outline",
        cssVariableName: "--button-outline-focus",
        defaultValue: "2px solid var(--pc-semantic-interactive-primary)",
        label: "Outline - Focus",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      backdropFilter: {
        cssProperty: "backdrop-filter",
        cssVariableName: "--button-backdrop-filter",
        defaultValue: "none",
        label: "Backdrop filter",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      alignItems: {
        cssProperty: "align-items",
        cssVariableName: "--button-align-items",
        defaultValue: "center",
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
        cssVariableName: "--button-justify-content",
        defaultValue: "center",
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
      alignSelf: {
        cssProperty: "align-self",
        cssVariableName: "--button-align-self",
        defaultValue: "auto",
        label: "Align self",
        options: [
          { label: "Automatically", value: "auto" },
          { label: "Normal", value: "normal" },
          { label: "Center", value: "center" },
          { label: "Flexbox start", value: "flex-start" },
          { label: "Flexbox end", value: "flex-end" },
        ],
        role: "layout",
        roleGroup: "Structure",
        schemaType: "enum<string>",
        type: "select",
      },
      justifySelf: {
        cssProperty: "justify-self",
        cssVariableName: "--button-justify-self",
        defaultValue: "auto",
        label: "Justify self",
        options: [
          { label: "Automatically", value: "auto" },
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
      display: {
        cssProperty: "display",
        cssVariableName: "--button-display",
        defaultValue: "inline-flex",
        label: "Display",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      flexDirection: {
        cssProperty: "flex-direction",
        cssVariableName: "--button-flex-direction",
        defaultValue: "row",
        label: "Flex direction",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "select",
        options: [
          { label: "Row", value: "row" },
          { label: "Column", value: "column" },
        ],
      },
      flexWrap: {
        cssProperty: "flex-wrap",
        cssVariableName: "--button-flex-wrap",
        defaultValue: "nowrap",
        label: "Flex wrap",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "select",
        options: [
          { label: "No wrap", value: "nowrap" },
          { label: "Wrap", value: "wrap" },
        ],
      },
      flexGrow: {
        cssProperty: "flex-grow",
        cssVariableName: "--button-flex-grow",
        defaultValue: "0",
        label: "Flex grow",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      flexShrink: {
        cssProperty: "flex-shrink",
        cssVariableName: "--button-flex-shrink",
        defaultValue: "1",
        label: "Flex shrink",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      overflow: {
        cssProperty: "overflow",
        cssVariableName: "--button-overflow",
        defaultValue: "visible",
        label: "Overflow",
        options: [
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" },
          { label: "Auto", value: "auto" },
          { label: "Scroll", value: "scroll" },
        ],
        role: "layout",
        roleGroup: "Structure",
        schemaType: "enum<string>",
        type: "select",
      },
      position: {
        cssProperty: "position",
        cssVariableName: "--button-position",
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
        cssVariableName: "--button-top",
        defaultValue: "auto",
        label: "Top",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      right: {
        cssProperty: "right",
        cssVariableName: "--button-right",
        defaultValue: "auto",
        label: "Right",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      bottom: {
        cssProperty: "bottom",
        cssVariableName: "--button-bottom",
        defaultValue: "auto",
        label: "Bottom",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      left: {
        cssProperty: "left",
        cssVariableName: "--button-left",
        defaultValue: "auto",
        label: "Left",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      zIndex: {
        cssProperty: "z-index",
        cssVariableName: "--button-z-index",
        defaultValue: "auto",
        label: "Z-index",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      transform: {
        cssProperty: "transform",
        cssVariableName: "--button-transform",
        defaultValue: "none",
        label: "Transform",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      transformOrigin: {
        cssProperty: "transform-origin",
        cssVariableName: "--button-transform-origin",
        defaultValue: "50% 50% 0",
        label: "Transform origin",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      margin: {
        cssProperty: "margin",
        cssVariableName: "--button-margin",
        defaultValue: "0px",
        label: "Margin",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      marginTop: {
        cssProperty: "margin-top",
        cssPropertyOverride: true,
        cssVariableName: null,
        defaultValue: "",
        label: "Margin top",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      marginRight: {
        cssProperty: "margin-right",
        cssPropertyOverride: true,
        cssVariableName: null,
        defaultValue: "",
        label: "Margin right",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      marginBottom: {
        cssProperty: "margin-bottom",
        cssPropertyOverride: true,
        cssVariableName: null,
        defaultValue: "",
        label: "Margin bottom",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      marginLeft: {
        cssProperty: "margin-left",
        cssPropertyOverride: true,
        cssVariableName: null,
        defaultValue: "",
        label: "Margin left",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      padding: {
        cssProperty: "padding",
        cssVariableName: "--button-padding",
        defaultValue: "0.6rem 1rem",
        label: "Padding",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      paddingTop: {
        cssProperty: "padding-top",
        cssPropertyOverride: true,
        cssVariableName: null,
        defaultValue: "",
        label: "Padding top",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      paddingRight: {
        cssProperty: "padding-right",
        cssPropertyOverride: true,
        cssVariableName: null,
        defaultValue: "",
        label: "Padding right",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      paddingBottom: {
        cssProperty: "padding-bottom",
        cssPropertyOverride: true,
        cssVariableName: null,
        defaultValue: "",
        label: "Padding bottom",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      paddingLeft: {
        cssProperty: "padding-left",
        cssPropertyOverride: true,
        cssVariableName: null,
        defaultValue: "",
        label: "Padding left",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      gap: {
        cssProperty: "gap",
        cssVariableName: "--button-gap",
        defaultValue: "0.5rem",
        label: "Gap",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      width: {
        cssProperty: "width",
        cssVariableName: "--button-width",
        defaultValue: "auto",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minWidth: {
        cssProperty: "min-width",
        cssVariableName: "--button-min-width",
        defaultValue: "0px",
        label: "Minimum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxWidth: {
        cssProperty: "max-width",
        cssVariableName: "--button-max-width",
        defaultValue: "none",
        label: "Maximum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--button-height",
        defaultValue: "auto",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minHeight: {
        cssProperty: "min-height",
        cssVariableName: "--button-min-height",
        defaultValue: "0px",
        label: "Minimum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxHeight: {
        cssProperty: "max-height",
        cssVariableName: "--button-max-height",
        defaultValue: "none",
        label: "Maximum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      onClick: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: null,
        label: "On click",
        role: "action",
        roleGroup: "Action",
        schemaType: "object",
        type: "action",
      },
      disabled: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: false,
        label: "Disabled",
        role: "action",
        roleGroup: "Action",
        schemaType: "boolean",
        type: "switch",
      },
      target: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Target",
        role: "action",
        roleGroup: "Action",
        schemaType: "string",
        type: "text",
      },
      rel: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Rel",
        role: "action",
        roleGroup: "Action",
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
        allowedChildComponents: ["Badge", "Element", "Text"],
      },
    },
    variants: [
      {
        label: "Brushed Metal - Default",
        props: {
          background: "linear-gradient(180deg, #f4f4f5, #e4e4e7)",
          backgroundHover: "linear-gradient(180deg, #f4f4f5, #e4e4e7)",
          backgroundColor: "transparent",
          backgroundColorHover: "transparent",
          borderColor: "#d4d4d8",
          borderColorHover: "#d4d4d8",
          borderRadius: "8px",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 4px 12px rgba(0, 0, 0, 0.08)",
          boxShadowActive: "inset 0 3px 6px rgba(0, 0, 0, 0.15)",
          boxShadowHover: "inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 6px 18px rgba(0, 0, 0, 0.12)",
          color: "#6b7280",
          colorHover: "#6b7280",
          fontWeight: "600",
          letterSpacing: "0.02em",
          padding: "1rem 2rem",
          textShadow: "0 1px 0 var(--pc-semantic-surface-base), 0 -1px 1px rgba(0, 0, 0, 0.25)",
          textShadowHover: "0 1px 0 var(--pc-semantic-surface-base), 0 -1px 1px rgba(0, 0, 0, 0.25)",
          transformActive: "translateY(0)",
          transformHover: "translateY(-2px)",
        },
      },
      {
        label: "Brushed Metal - Blue",
        props: {
          background: "linear-gradient(180deg, #4f8dff, #2563eb)",
          backgroundHover: "linear-gradient(180deg, #4f8dff, #2563eb)",
          backgroundColor: "transparent",
          backgroundColorHover: "transparent",
          borderColor: "#1e40af",
          borderColorHover: "#1e40af",
          borderRadius: "8px",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 12px rgba(37, 99, 235, 0.35)",
          boxShadowActive: "inset 0 4px 10px rgba(0, 0, 0, 0.35)",
          boxShadowHover: "inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 8px 22px rgba(37, 99, 235, 0.45)",
          color: "#dbeafe",
          colorHover: "#dbeafe",
          fontWeight: "600",
          letterSpacing: "0.02em",
          padding: "1rem 2rem",
          textShadow: "0 1px 0 rgba(255, 255, 255, 0.2), 0 -1px 1px rgba(0, 0, 0, 0.4)",
          textShadowHover: "0 1px 0 rgba(255, 255, 255, 0.2), 0 -1px 1px rgba(0, 0, 0, 0.4)",
          transformActive: "translateY(0)",
          transformHover: "translateY(-2px)",
        },
      },
      {
        label: "Brushed Metal - Gold",
        props: {
          background: "linear-gradient(180deg, #facc15, #d97706)",
          backgroundHover: "linear-gradient(180deg, #facc15, #d97706)",
          backgroundColor: "transparent",
          backgroundColorHover: "transparent",
          borderColor: "#92400e",
          borderColorHover: "#92400e",
          borderRadius: "8px",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 12px rgba(217, 119, 6, 0.35)",
          boxShadowActive: "inset 0 4px 10px rgba(0, 0, 0, 0.4)",
          boxShadowHover: "inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 8px 22px rgba(217, 119, 6, 0.45)",
          color: "#fff7ed",
          colorHover: "#fff7ed",
          fontWeight: "600",
          letterSpacing: "0.02em",
          padding: "1rem 2rem",
          textShadow: "0 1px 0 rgba(255, 255, 255, 0.2), 0 -1px 1px rgba(0, 0, 0, 0.4)",
          textShadowHover: "0 1px 0 rgba(255, 255, 255, 0.2), 0 -1px 1px rgba(0, 0, 0, 0.4)",
          transformActive: "translateY(0)",
          transformHover: "translateY(-2px)",
        },
      },
      {
        label: "Gradient - Themed",
        props: {
          background: "linear-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)",
          backgroundHover: "linear-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)",
          backgroundPrimary: "linear-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)",
          backgroundPrimaryHover: "linear-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)",
          backgroundDanger: "linear-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)",
          backgroundDangerHover: "linear-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)",
          backgroundColor: "#eeeeee",
          backgroundColorHover: "var(--pc-semantic-surface-base)",
          backgroundColorPrimary: "#1877f2",
          backgroundColorPrimaryHover: "#5299f5",
          backgroundColorDanger: "#ff0000",
          backgroundColorDangerHover: "#8b0000",
          borderColor: "#dddddd",
          borderColorHover: "#dddddd",
          borderColorPrimary: "#1877f2",
          borderColorPrimaryHover: "#5299f5",
          borderColorDanger: "#ff0000",
          borderColorDangerHover: "#8b0000",
          boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.12)",
          boxShadowActive: "0 5px 8px 0 rgba(0, 0, 0, 0.12)",
          boxShadowHover: "0 5px 8px 0 rgba(0, 0, 0, 0.12)",
          color: "#333333",
          colorHover: "#1877f2",
          colorPrimary: "var(--pc-semantic-text-inverse)",
          colorPrimaryHover: "var(--pc-semantic-text-inverse)",
          colorDanger: "var(--pc-semantic-text-inverse)",
          colorDangerHover: "var(--pc-semantic-text-inverse)",
        },
      },
      {
        label: "Primary CTA",
        props: {
          borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
          boxShadowHover: "0 14px 35px rgba(37, 99, 235, 0.35)",
          fontWeight: "600",
          padding: "0.75rem 1.25rem",
          theme: "primary",
          transformHover: "translateY(-2px)",
        },
      },
      {
        label: "Secondary",
        props: {
          backgroundColor: "var(--pc-semantic-surface-base)",
          borderColor: "#e5e7eb",
          boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
          boxShadowHover: "0 6px 18px rgba(15, 23, 42, 0.08)",
          color: "#0f172a",
        },
      },
      {
        label: "Ghost",
        props: {
          backgroundColor: "transparent",
          backgroundColorHover: "rgba(37, 99, 235, 0.08)",
          borderColor: "transparent",
          boxShadow: "none",
          boxShadowHover: "none",
          color: "#2563eb",
          transformHover: "none",
        },
      },
      {
        label: "Outline",
        props: {
          backgroundColor: "transparent",
          backgroundColorHover: "#f8fafc",
          borderColor: "#e5e7eb",
          boxShadow: "none",
          color: "#0f172a",
        },
      },
      {
        label: "Danger",
        props: {
          boxShadow: "0 10px 25px rgba(220, 38, 38, 0.25)",
          boxShadowHover: "0 14px 35px rgba(220, 38, 38, 0.35)",
          fontWeight: "600",
          theme: "danger",
        },
      },
      {
        label: "Link",
        props: {
          backgroundColor: "transparent",
          backgroundColorHover: "transparent",
          borderColor: "transparent",
          boxShadow: "none",
          color: "#2563eb",
          padding: "0px",
          textShadow: "none",
          transformHover: "none",
        },
      },
      {
        label: "Soft",
        props: {
          backgroundColor: "#f1f5f9",
          backgroundColorHover: "#e2e8f0",
          borderColor: "transparent",
          boxShadow: "none",
          color: "#334155",
        },
      },
      {
        label: "Glass",
        props: {
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          borderColor: "rgba(255, 255, 255, 0.4)",
          boxShadow: "0 8px 32px rgba(15, 23, 42, 0.12)",
          color: "#0f172a",
        },
      },
      {
        label: "Full Width CTA",
        props: {
          borderRadius: "12px",
          fontWeight: "600",
          justifyContent: "center",
          padding: "1rem",
          theme: "primary",
          width: "100%",
        },
      },
      {
        label: "Compact",
        props: {
          borderRadius: "6px",
          fontSize: "0.85rem",
          gap: "0.25rem",
          padding: "0.35rem 0.6rem",
        },
      },
      {
        label: "Icon Button",
        props: {
          alignItems: "center",
          borderRadius: "999px",
          height: "40px",
          justifyContent: "center",
          padding: "0px",
          width: "40px",
        },
      },
      {
        label: "Elevated",
        props: {
          backgroundColor: "var(--pc-semantic-surface-base)",
          borderColor: "transparent",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
          boxShadowHover: "0 16px 45px rgba(15, 23, 42, 0.18)",
        },
      },
      {
        label: "Dark - Themed",
        props: {
          background: "linear-gradient(180deg, #2d3748, #1f2937)",
          backgroundColor: "#1f2937",
          backgroundColorDanger: "#7f1d1d",
          backgroundColorDangerHover: "#b91c1c",
          backgroundColorHover: "#374151",
          backgroundColorPrimary: "#6366f1",
          backgroundColorPrimaryHover: "#7c82ff",
          backgroundDanger: "linear-gradient(180deg, #991b1b, #7f1d1d)",
          backgroundDangerHover: "linear-gradient(180deg, #b91c1c, #7f1d1d)",
          backgroundHover: "linear-gradient(180deg, #374151, #1f2937)",
          backgroundPrimary: "linear-gradient(180deg, #6366f1, #4f46e5)",
          backgroundPrimaryHover: "linear-gradient(180deg, #7c82ff, #4f46e5)",
          borderColor: "#2d3748",
          borderColorDanger: "#991b1b",
          borderColorDangerHover: "#7f1d1d",
          borderColorHover: "#4b5563",
          borderColorPrimary: "#4f46e5",
          borderColorPrimaryHover: "#6366f1",
          borderRadius: "8px",
          color: "#e5e7eb",
          colorDanger: "#fecaca",
          colorDangerHover: "#fecaca",
          colorHover: "#e5e7eb",
          colorPrimary: "var(--pc-semantic-text-inverse)",
          colorPrimaryHover: "var(--pc-semantic-text-inverse)",
        },
      },
    ],
  };
}
