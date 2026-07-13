// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createBadgeSchema() {
  return {
    defaultSlots: {},
    description: "A badge can be used to display unread notifications, item counts or status indicators among other things.",
    editor: {
      defaultOpenGroups: {
        content: ["General"],
        layout: [],
        selectors: [],
        styling: ["Typography"],
        visibility: [],
      },
      roleGroupOrder: {
        content: ["General"],
        layout: ["Spacing", "Positioning", "Size"],
        selectors: ["Selectors"],
        styling: ["Variant", "Typography", "Surface", "Shape"],
        visibility: ["Visibility"],
      },
      roleOrder: ["content", "styling", "layout", "visibility", "selectors"],
    },
    exportCSS: (badge = null, badgeSchema = null) => {
      if (badge && badgeSchema) {
        const props = exportCSSFromProps(badge, badgeSchema);

        if (props.length > 0) {
          return `
      .${badge.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .badge {
        --badge-background: none;
        --badge-background-color: var(--pc-semantic-status-primary-soft);
        --badge-background-color-danger: var(--pc-semantic-status-danger-soft);
        --badge-background-color-primary: var(--pc-semantic-status-primary-soft);
        --badge-background-color-success: var(--pc-semantic-status-success-soft);
        --badge-background-color-warning: var(--pc-semantic-status-warning-soft);
        --badge-border-color: transparent;
        --badge-border-color-danger: transparent;
        --badge-border-color-primary: transparent;
        --badge-border-color-success: transparent;
        --badge-border-color-warning: transparent;
        --badge-border-radius: 999px;
        --badge-border-style: solid;
        --badge-border-width: 0px;
        --badge-bottom: auto;
        --badge-box-shadow: none;
        --badge-color: var(--pc-semantic-status-primary-text);
        --badge-color-danger: var(--pc-semantic-status-danger-text);
        --badge-color-primary: var(--pc-semantic-status-primary-text);
        --badge-color-success: var(--pc-semantic-status-success-text);
        --badge-color-warning: var(--pc-semantic-status-warning-text);
        --badge-font-size: 0.75rem;
        --badge-font-weight: 600;
        --badge-height: auto;
        --badge-left: auto;
        --badge-letter-spacing: 0;
        --badge-line-height: 1;
        --badge-margin: 0px;
        --badge-max-height: none;
        --badge-max-width: none;
        --badge-min-height: auto;
        --badge-min-width: auto;
        --badge-opacity: 1;
        --badge-padding: 0.35rem 0.75rem;
        --badge-position: relative;
        --badge-right: auto;
        --badge-text-shadow: none;
        --badge-text-transform: none;
        --badge-top: auto;
        --badge-white-space: nowrap;
        --badge-width: auto;
        --badge-z-index: auto;

        background: var(--badge-background);
        background-color: var(--badge-background-color);
        border: var(--badge-border-width) var(--badge-border-style) var(--badge-border-color);
        border-radius: var(--badge-border-radius);
        bottom: var(--badge-bottom);
        box-shadow: var(--badge-box-shadow);
        color: var(--badge-color);
        cursor: auto;
        display: inline-block;
        font-size: var(--badge-font-size);
        font-weight: var(--badge-font-weight);
        height: var(--badge-height);
        left: var(--badge-left);
        letter-spacing: var(--badge-letter-spacing);
        line-height: var(--badge-line-height);
        margin: var(--badge-margin);
        max-height: var(--badge-max-height);
        max-width: var(--badge-max-width);
        min-height: var(--badge-min-height);
        min-width: var(--badge-min-width);
        opacity: var(--badge-opacity);
        padding: var(--badge-padding);
        position: var(--badge-position);
        right: var(--badge-right);
        text-align: center;
        text-shadow: var(--badge-text-shadow);
        text-transform: var(--badge-text-transform);
        top: var(--badge-top);
        white-space: var(--badge-white-space);
        width: var(--badge-width);
        z-index: var(--badge-z-index);
      }

      .badge.badge-danger {
        background-color: var(--badge-background-color-danger);
        border-color: var(--badge-border-color-danger);
        color: var(--badge-color-danger);
      }

      .badge.badge-primary {
        background-color: var(--badge-background-color-primary);
        border-color: var(--badge-border-color-primary);
        color: var(--badge-color-primary);
      }

      .badge.badge-success {
        background-color: var(--badge-background-color-success);
        border-color: var(--badge-border-color-success);
        color: var(--badge-color-success);
      }

      .badge.badge-warning {
        background-color: var(--badge-background-color-warning);
        border-color: var(--badge-border-color-warning);
        color: var(--badge-color-warning);
      }
`;
      }
    },
    exportHTML: (badge, badgeSchema, pageSchema, indentation) => {
      if (typeof badge?.props?.isVisible === "boolean" && !badge.props.isVisible) {
        return "";
      }

      return `${indentation}<span class="badge${badge?.props?.theme === "danger" ? " badge-danger" : ""}${badge?.props?.theme === "primary" ? " badge-primary" : ""}${badge?.props?.theme === "success" ? " badge-success" : ""}${badge?.props?.theme === "warning" ? " badge-warning" : ""} ${badge?.id}" data-pc-id="${badge?.id || ""}">${badge?.props?.text}</span>`;
    },
    isAllowingChildComponents: false,
    label: "Badge",
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
      theme: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Theme",
        options: [
          { label: "Default", value: "" },
          { label: "Primary", value: "primary" },
          { label: "Success", value: "success" },
          { label: "Warning", value: "warning" },
          { label: "Danger", value: "danger" },
        ],
        role: "styling",
        roleGroup: "Variant",
        schemaType: "enum<string>",
        type: "select",
      },
      fontSize: {
        cssProperty: "font-size",
        cssVariableName: "--badge-font-size",
        defaultValue: "0.75rem",
        label: "Font size",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontWeight: {
        cssProperty: "font-weight",
        cssVariableName: "--badge-font-weight",
        defaultValue: "600",
        label: "Font weight",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--badge-color",
        defaultValue: "var(--pc-semantic-status-primary-text)",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorPrimary: {
        cssProperty: "color",
        cssVariableName: "--badge-color-primary",
        defaultValue: "var(--pc-semantic-status-primary-text)",
        label: "Color - Primary",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorSuccess: {
        cssProperty: "color",
        cssVariableName: "--badge-color-success",
        defaultValue: "var(--pc-semantic-status-success-text)",
        label: "Color - Success",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorWarning: {
        cssProperty: "color",
        cssVariableName: "--badge-color-warning",
        defaultValue: "var(--pc-semantic-status-warning-text)",
        label: "Color - Warning",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorDanger: {
        cssProperty: "color",
        cssVariableName: "--badge-color-danger",
        defaultValue: "var(--pc-semantic-status-danger-text)",
        label: "Color - Danger",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      textShadow: {
        cssProperty: "text-shadow",
        cssVariableName: "--badge-text-shadow",
        defaultValue: "none",
        label: "Text shadow",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      lineHeight: {
        cssProperty: "line-height",
        cssVariableName: "--badge-line-height",
        defaultValue: "1",
        label: "Line height",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      letterSpacing: {
        cssProperty: "letter-spacing",
        cssVariableName: "--badge-letter-spacing",
        defaultValue: "0",
        label: "Letter spacing",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      textTransform: {
        cssProperty: "text-transform",
        cssVariableName: "--badge-text-transform",
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
        cssVariableName: "--badge-white-space",
        defaultValue: "nowrap",
        label: "White space",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      background: {
        cssProperty: "background",
        cssVariableName: "--badge-background",
        defaultValue: "none",
        label: "Background",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--badge-background-color",
        defaultValue: "var(--pc-semantic-status-primary-soft)",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backgroundColorPrimary: {
        cssProperty: "background-color",
        cssVariableName: "--badge-background-color-primary",
        defaultValue: "var(--pc-semantic-status-primary-soft)",
        label: "Background color - Primary",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backgroundColorSuccess: {
        cssProperty: "background-color",
        cssVariableName: "--badge-background-color-success",
        defaultValue: "var(--pc-semantic-status-success-soft)",
        label: "Background color - Success",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backgroundColorWarning: {
        cssProperty: "background-color",
        cssVariableName: "--badge-background-color-warning",
        defaultValue: "var(--pc-semantic-status-warning-soft)",
        label: "Background color - Warning",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backgroundColorDanger: {
        cssProperty: "background-color",
        cssVariableName: "--badge-background-color-danger",
        defaultValue: "var(--pc-semantic-status-danger-soft)",
        label: "Background color - Danger",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      opacity: {
        cssProperty: "opacity",
        cssVariableName: "--badge-opacity",
        defaultValue: "1",
        label: "Opacity",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--badge-border-radius",
        defaultValue: "999px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Shape",
        schemaType: "string",
        type: "text",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--badge-border-width",
        defaultValue: "0px",
        label: "Border width",
        role: "styling",
        roleGroup: "Shape",
        schemaType: "string",
        type: "text",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--badge-border-color",
        defaultValue: "transparent",
        label: "Border color",
        role: "styling",
        roleGroup: "Shape",
        schemaType: "string",
        type: "color",
      },
      borderColorPrimary: {
        cssProperty: "border-color",
        cssVariableName: "--badge-border-color-primary",
        defaultValue: "transparent",
        label: "Border color - Primary",
        role: "styling",
        roleGroup: "Shape",
        schemaType: "string",
        type: "color",
      },
      borderColorSuccess: {
        cssProperty: "border-color",
        cssVariableName: "--badge-border-color-success",
        defaultValue: "transparent",
        label: "Border color - Success",
        role: "styling",
        roleGroup: "Shape",
        schemaType: "string",
        type: "color",
      },
      borderColorWarning: {
        cssProperty: "border-color",
        cssVariableName: "--badge-border-color-warning",
        defaultValue: "transparent",
        label: "Border color - Warning",
        role: "styling",
        roleGroup: "Shape",
        schemaType: "string",
        type: "color",
      },
      borderColorDanger: {
        cssProperty: "border-color",
        cssVariableName: "--badge-border-color-danger",
        defaultValue: "transparent",
        label: "Border color - Danger",
        role: "styling",
        roleGroup: "Shape",
        schemaType: "string",
        type: "color",
      },
      borderStyle: {
        cssProperty: "border-style",
        cssVariableName: "--badge-border-style",
        defaultValue: "solid",
        label: "Border style",
        role: "styling",
        roleGroup: "Shape",
        schemaType: "string",
        type: "text",
      },
      boxShadow: {
        cssProperty: "box-shadow",
        cssVariableName: "--badge-box-shadow",
        defaultValue: "none",
        label: "Box shadow",
        role: "styling",
        roleGroup: "Shape",
        schemaType: "string",
        type: "text",
      },
      padding: {
        cssProperty: "padding",
        cssVariableName: "--badge-padding",
        defaultValue: "0.35rem 0.75rem",
        label: "Padding",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      margin: {
        cssProperty: "margin",
        cssVariableName: "--badge-margin",
        defaultValue: "0px",
        label: "Margin",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      position: {
        cssProperty: "position",
        cssVariableName: "--badge-position",
        defaultValue: "relative",
        label: "Position",
        options: [
          { label: "Static", value: "static" },
          { label: "Relative", value: "relative" },
          { label: "Absolute", value: "absolute" },
          { label: "Fixed", value: "fixed" },
          { label: "Sticky", value: "sticky" },
        ],
        role: "layout",
        roleGroup: "Positioning",
        schemaType: "enum<string>",
        type: "select",
      },
      top: {
        cssProperty: "top",
        cssVariableName: "--badge-top",
        defaultValue: "auto",
        label: "Top",
        role: "layout",
        roleGroup: "Positioning",
        schemaType: "string",
        type: "text",
      },
      right: {
        cssProperty: "right",
        cssVariableName: "--badge-right",
        defaultValue: "auto",
        label: "Right",
        role: "layout",
        roleGroup: "Positioning",
        schemaType: "string",
        type: "text",
      },
      bottom: {
        cssProperty: "bottom",
        cssVariableName: "--badge-bottom",
        defaultValue: "auto",
        label: "Bottom",
        role: "layout",
        roleGroup: "Positioning",
        schemaType: "string",
        type: "text",
      },
      left: {
        cssProperty: "left",
        cssVariableName: "--badge-left",
        defaultValue: "auto",
        label: "Left",
        role: "layout",
        roleGroup: "Positioning",
        schemaType: "string",
        type: "text",
      },
      zIndex: {
        cssProperty: "z-index",
        cssVariableName: "--badge-z-index",
        defaultValue: "auto",
        label: "Z-index",
        role: "layout",
        roleGroup: "Positioning",
        schemaType: "string",
        type: "text",
      },
      width: {
        cssProperty: "width",
        cssVariableName: "--badge-width",
        defaultValue: "auto",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minWidth: {
        cssProperty: "min-width",
        cssVariableName: "--badge-min-width",
        defaultValue: "auto",
        label: "Minimum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxWidth: {
        cssProperty: "max-width",
        cssVariableName: "--badge-max-width",
        defaultValue: "none",
        label: "Maximum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--badge-height",
        defaultValue: "auto",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minHeight: {
        cssProperty: "min-height",
        cssVariableName: "--badge-min-height",
        defaultValue: "auto",
        label: "Minimum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxHeight: {
        cssProperty: "max-height",
        cssVariableName: "--badge-max-height",
        defaultValue: "none",
        label: "Maximum height",
        role: "layout",
        roleGroup: "Size",
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
      /*
      body: {
        allowedChildComponents: ["Text"],
      },
      */
    },
    variants: [
      {
        label: "Primary (Soft)",
        props: {
          text: "Primary",
          theme: "primary",
        },
      },
      {
        label: "Success (Soft)",
        props: {
          text: "Success",
          theme: "success",
        },
      },
      {
        label: "Warning (Soft)",
        props: {
          text: "Warning",
          theme: "warning",
        },
      },
      {
        label: "Danger (Soft)",
        props: {
          text: "Danger",
          theme: "danger",
        },
      },
      {
        label: "Primary (Solid)",
        props: {
          backgroundColorPrimary: "#2563eb",
          colorPrimary: "var(--pc-semantic-text-inverse)",
          text: "Primary",
          theme: "primary",
        },
      },
      {
        label: "Success (Solid)",
        props: {
          backgroundColorSuccess: "#16a34a",
          colorSuccess: "var(--pc-semantic-text-inverse)",
          text: "Success",
          theme: "success",
        },
      },
      {
        label: "Warning (Solid)",
        props: {
          backgroundColorWarning: "#ca8a04",
          colorWarning: "var(--pc-semantic-text-inverse)",
          text: "Warning",
          theme: "warning",
        },
      },
      {
        label: "Danger (Solid)",
        props: {
          backgroundColorDanger: "#dc2626",
          colorDanger: "var(--pc-semantic-text-inverse)",
          text: "Danger",
          theme: "danger",
        },
      },
      {
        label: "Primary (Outline)",
        props: {
          backgroundColorPrimary: "transparent",
          borderColorPrimary: "#93c5fd",
          borderWidth: "1px",
          colorPrimary: "#1d4ed8",
          text: "Primary",
          theme: "primary",
        },
      },
      {
        label: "Success (Outline)",
        props: {
          backgroundColorSuccess: "transparent",
          borderColorSuccess: "#86efac",
          borderWidth: "1px",
          colorSuccess: "#166534",
          text: "Success",
          theme: "success",
        },
      },
      {
        label: "Warning (Outline)",
        props: {
          backgroundColorWarning: "transparent",
          borderColorWarning: "#fde047",
          borderWidth: "1px",
          colorWarning: "#854d0e",
          text: "Warning",
          theme: "warning",
        },
      },
      {
        label: "Danger (Outline)",
        props: {
          backgroundColorDanger: "transparent",
          borderColorDanger: "#fca5a5",
          borderWidth: "1px",
          colorDanger: "#991b1b",
          text: "Danger",
          theme: "danger",
        },
      },
      {
        label: "Muted",
        props: {
          backgroundColor: "#f1f5f9",
          color: "#475569",
          text: "Muted",
        },
      },
      {
        label: "Large Pill",
        props: {
          borderRadius: "999px",
          fontSize: "0.85rem",
          padding: "0.5rem 1rem",
          text: "Large",
        },
      },
      {
        label: "Small",
        props: {
          fontSize: "0.65rem",
          padding: "0.2rem 0.5rem",
          text: "Small",
        },
      },
      {
        label: "Dot",
        props: {
          backgroundColor: "#22c55e",
          borderRadius: "999px",
          height: "10px",
          padding: "0px",
          text: "",
          width: "10px",
        },
      },
      {
        label: "Notification",
        props: {
          backgroundColor: "#ef4444",
          borderRadius: "999px",
          color: "var(--pc-semantic-text-inverse)",
          fontSize: "0.65rem",
          padding: "0.25rem 0.45rem",
          position: "absolute",
          right: "-6px",
          text: "3",
          top: "-6px",
          zIndex: "10",
        },
      },
    ],
  };
}
