// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createAlertSchema() {
  return {
    defaultSlots: {
      body: [],
    },
    description: "A content container that alerts the user in a visual way using different themes.",
    editor: {
      defaultOpenGroups: {
        layout: [],
        selectors: [],
        styling: ["Variant"],
        visibility: [],
      },
      roleGroupOrder: {
        layout: ["Structure", "Alignment", "Spacing", "Size"],
        selectors: ["Selectors"],
        styling: ["Variant", "Surface", "Border", "Text"],
        visibility: ["Visibility"],
      },
      roleOrder: ["styling", "layout", "visibility", "selectors"],
    },
    exportCSS: (alert = null, alertSchema = null) => {
      if (alert && alertSchema) {
        const props = exportCSSFromProps(alert, alertSchema);

        if (props.length > 0) {
          return `
      .${alert.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .alert {
        --alert-align-items: stretch;
        --alert-backdrop-filter: none;
        --alert-background-color-error: var(--pc-semantic-status-danger-bg);
        --alert-background-color-success: var(--pc-semantic-status-success-bg);
        --alert-background-color-warning: var(--pc-semantic-status-warning-bg);
        --alert-border-color-error: var(--pc-semantic-status-danger);
        --alert-border-color-success: var(--pc-semantic-status-success);
        --alert-border-color-warning: var(--pc-semantic-status-warning);
        --alert-border-radius: 14px;
        --alert-border-width: 1px;
        --alert-border-bottom-width: var(--alert-border-width);
        --alert-border-left-width: var(--alert-border-width);
        --alert-border-right-width: var(--alert-border-width);
        --alert-border-top-width: var(--alert-border-width);
        --alert-bottom: auto;
        --alert-box-shadow: none;
        --alert-color-error: var(--pc-semantic-status-danger-text);
        --alert-color-success: var(--pc-semantic-status-success-text);
        --alert-color-warning: var(--pc-semantic-status-warning-text);
        --alert-flex-direction: column;
        --alert-flex-grow: 0;
        --alert-flex-shrink: 1;
        --alert-flex-wrap: wrap;
        --alert-gap: 1rem;
        --alert-height: auto;
        --alert-justify-content: stretch;
        --alert-left: auto;
        --alert-margin: 0px;
        --alert-max-height: none;
        --alert-max-width: 100%;
        --alert-min-height: 0px;
        --alert-min-width: 0px;
        --alert-opacity: 1;
        --alert-overflow: visible;
        --alert-padding: 1rem 1.25rem;
        --alert-position: relative;
        --alert-right: auto;
        --alert-top: auto;
        --alert-transform: none;
        --alert-transition: all 0.2s ease;
        --alert-width: auto;
        --alert-z-index: auto;

        align-items: var(--alert-align-items);
        backdrop-filter: var(--alert-backdrop-filter);
        border: var(--alert-border-width) solid;
        border-bottom-width: var(--alert-border-bottom-width);
        border-left-width: var(--alert-border-left-width);
        border-radius: var(--alert-border-radius);
        border-right-width: var(--alert-border-right-width);
        border-top-width: var(--alert-border-top-width);
        bottom: var(--alert-bottom);
        box-shadow: var(--alert-box-shadow);
        display: flex;
        flex-direction: var(--alert-flex-direction);
        flex-grow: var(--alert-flex-grow);
        flex-shrink: var(--alert-flex-shrink);
        flex-wrap: var(--alert-flex-wrap);
        gap: var(--alert-gap);
        height: var(--alert-height);
        justify-content: var(--alert-justify-content);
        left: var(--alert-left);
        margin: var(--alert-margin);
        max-height: var(--alert-max-height);
        max-width: var(--alert-max-width);
        min-height: var(--alert-min-height);
        min-width: var(--alert-min-width);
        opacity: var(--alert-opacity);
        overflow: var(--alert-overflow);
        padding: var(--alert-padding);
        position: var(--alert-position);
        right: var(--alert-right);
        top: var(--alert-top);
        transform: var(--alert-transform);
        transition: var(--alert-transition);
        width: var(--alert-width);
        z-index: var(--alert-z-index);
      }

      .alert.alert-error {
        background: var(--alert-background-color-error);
        border-color: var(--alert-border-color-error);
        color: var(--alert-color-error);
      }

      .alert.alert-success {
        background: var(--alert-background-color-success);
        border-color: var(--alert-border-color-success);
        color: var(--alert-color-success);
      }

      .alert.alert-warning {
        background: var(--alert-background-color-warning);
        border-color: var(--alert-border-color-warning);
        color: var(--alert-color-warning);
      }
`;
      }
    },
    exportHTML: (alert, alertSchema, pageSchema, indentation) => {
      if (typeof alert?.props?.isVisible === "boolean" && !alert.props.isVisible) {
        return "";
      }

      return `${indentation}<div class="alert${alert?.props?.theme === "error" ? " alert-error" : ""}${alert?.props?.theme === "success" ? " alert-success" : ""}${alert?.props?.theme === "warning" ? " alert-warning" : ""} ${alert?.id}" data-pc-id="${alert?.id || ""}">
${alert?.slots?.body || ""}${(alert?.slots?.body || "").trim() === "" ? "\n" : ""}${indentation}</div>`;
    },
    isAllowingChildComponents: true,
    label: "Alert",
    plan: "Personal",
    props: {
      theme: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "success",
        label: "Theme",
        options: [
          { label: "Success", value: "success" },
          { label: "Warning", value: "warning" },
          { label: "Error", value: "error" },
        ],
        role: "styling",
        roleGroup: "Variant",
        schemaType: "enum<string>",
        type: "select",
      },
      backgroundColorSuccess: {
        cssProperty: "background-color",
        cssVariableName: "--alert-background-color-success",
        defaultValue: "var(--pc-semantic-status-success-bg)",
        label: "Background color - Success",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        theme: "success",
        type: "color",
      },
      backgroundColorWarning: {
        cssProperty: "background-color",
        cssVariableName: "--alert-background-color-warning",
        defaultValue: "var(--pc-semantic-status-warning-bg)",
        label: "Background color - Warning",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        theme: "warning",
        type: "color",
      },
      backgroundColorError: {
        cssProperty: "background-color",
        cssVariableName: "--alert-background-color-error",
        defaultValue: "var(--pc-semantic-status-danger-bg)",
        label: "Background color - Error",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        theme: "error",
        type: "color",
      },
      boxShadow: {
        cssProperty: "box-shadow",
        cssVariableName: "--alert-box-shadow",
        defaultValue: "none",
        label: "Box shadow",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      opacity: {
        cssProperty: "opacity",
        cssVariableName: "--alert-opacity",
        defaultValue: "1",
        label: "Opacity",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backdropFilter: {
        cssProperty: "backdrop-filter",
        cssVariableName: "--alert-backdrop-filter",
        defaultValue: "none",
        label: "Backdrop filter",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      transition: {
        cssProperty: "transition",
        cssVariableName: "--alert-transition",
        defaultValue: "all 0.2s ease",
        label: "Transition",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--alert-border-width",
        defaultValue: "1px",
        label: "Border width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderTopWidth: {
        cssProperty: "border-top-width",
        cssVariableName: "--alert-border-top-width",
        defaultValue: "1px",
        label: "Border top width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderRightWidth: {
        cssProperty: "border-right-width",
        cssVariableName: "--alert-border-right-width",
        defaultValue: "1px",
        label: "Border right width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderBottomWidth: {
        cssProperty: "border-bottom-width",
        cssVariableName: "--alert-border-bottom-width",
        defaultValue: "1px",
        label: "Border bottom width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderLeftWidth: {
        cssProperty: "border-left-width",
        cssVariableName: "--alert-border-left-width",
        defaultValue: "1px",
        label: "Border left width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--alert-border-radius",
        defaultValue: "14px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderColorSuccess: {
        cssProperty: "border-color",
        cssVariableName: "--alert-border-color-success",
        defaultValue: "var(--pc-semantic-status-success)",
        label: "Border color - Success",
        role: "styling",
        roleGroup: "Border",
        schemaType: "success",
        theme: "error",
        type: "color",
      },
      borderColorWarning: {
        cssProperty: "border-color",
        cssVariableName: "--alert-border-color-warning",
        defaultValue: "var(--pc-semantic-status-warning)",
        label: "Border color - Warning",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        theme: "warning",
        type: "color",
      },
      borderColorError: {
        cssProperty: "border-color",
        cssVariableName: "--alert-border-color-error",
        defaultValue: "var(--pc-semantic-status-danger)",
        label: "Border color - Error",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        theme: "error",
        type: "color",
      },
      colorSuccess: {
        cssProperty: "color",
        cssVariableName: "--alert-color-success",
        defaultValue: "var(--pc-semantic-status-success-text)",
        label: "Color - Success",
        role: "styling",
        roleGroup: "Text",
        schemaType: "string",
        theme: "success",
        type: "color",
      },
      colorWarning: {
        cssProperty: "color",
        cssVariableName: "--alert-color-warning",
        defaultValue: "var(--pc-semantic-status-warning-text)",
        label: "Color - Warning",
        role: "styling",
        roleGroup: "Text",
        schemaType: "string",
        theme: "warning",
        type: "color",
      },
      colorError: {
        cssProperty: "color",
        cssVariableName: "--alert-color-error",
        defaultValue: "var(--pc-semantic-status-danger-text)",
        label: "Color - Error",
        role: "styling",
        roleGroup: "Text",
        schemaType: "string",
        theme: "error",
        type: "color",
      },
      flexDirection: {
        cssProperty: "flex-direction",
        cssVariableName: "--alert-flex-direction",
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
      flexWrap: {
        cssProperty: "flex-wrap",
        cssVariableName: "--alert-flex-wrap",
        defaultValue: "wrap",
        label: "Flexbox wrap",
        options: [
          { label: "No wrap", value: "nowrap" },
          { label: "Wrap", value: "wrap" },
        ],
        role: "layout",
        roleGroup: "Structure",
        schemaType: "enum<string>",
        type: "select",
      },
      position: {
        cssProperty: "position",
        cssVariableName: "--alert-position",
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
        cssVariableName: "--alert-top",
        defaultValue: "auto",
        label: "Top",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      right: {
        cssProperty: "right",
        cssVariableName: "--alert-right",
        defaultValue: "auto",
        label: "Right",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      bottom: {
        cssProperty: "bottom",
        cssVariableName: "--alert-bottom",
        defaultValue: "auto",
        label: "Bottom",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      left: {
        cssProperty: "left",
        cssVariableName: "--alert-left",
        defaultValue: "auto",
        label: "Left",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      zIndex: {
        cssProperty: "z-index",
        cssVariableName: "--alert-z-index",
        defaultValue: "auto",
        label: "Z-index",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      transform: {
        cssProperty: "transform",
        cssVariableName: "--alert-transform",
        defaultValue: "none",
        label: "Transform",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      alignItems: {
        cssProperty: "align-items",
        cssVariableName: "--alert-align-items",
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
        roleGroup: "Alignment",
        schemaType: "enum<string>",
        type: "select",
      },
      justifyContent: {
        cssProperty: "justify-content",
        cssVariableName: "--alert-justify-content",
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
        roleGroup: "Alignment",
        schemaType: "enum<string>",
        type: "select",
      },
      padding: {
        cssProperty: "padding",
        cssVariableName: "--alert-padding",
        defaultValue: "1rem 1.25rem",
        label: "Padding",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      gap: {
        cssProperty: "gap",
        cssVariableName: "--alert-gap",
        defaultValue: "1rem",
        label: "Gap",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      margin: {
        cssProperty: "margin",
        cssVariableName: "--alert-margin",
        defaultValue: "0px",
        label: "Margin",
        role: "layout",
        roleGroup: "Spacing",
        schemaType: "string",
        type: "text",
      },
      width: {
        cssProperty: "width",
        cssVariableName: "--alert-width",
        defaultValue: "auto",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minWidth: {
        cssProperty: "min-width",
        cssVariableName: "--alert-min-width",
        defaultValue: "0px",
        label: "Minimum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxWidth: {
        cssProperty: "max-width",
        cssVariableName: "--alert-max-width",
        defaultValue: "100%",
        label: "Maximum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--alert-height",
        defaultValue: "auto",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minHeight: {
        cssProperty: "min-height",
        cssVariableName: "--alert-min-height",
        defaultValue: "0px",
        label: "Minimum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxHeight: {
        cssProperty: "max-height",
        cssVariableName: "--alert-max-height",
        defaultValue: "none",
        label: "Maximum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      flexGrow: {
        cssProperty: "flex-grow",
        cssVariableName: "--alert-flex-grow",
        defaultValue: "0",
        label: "Flexbox grow",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      flexShrink: {
        cssProperty: "flex-shrink",
        cssVariableName: "--alert-flex-shrink",
        defaultValue: "1",
        label: "Flexbox shrink",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      overflow: {
        cssProperty: "overflow",
        cssVariableName: "--alert-overflow",
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
        allowedChildComponents: ["Badge", "Element", "Heading", "Link", "List", "Spinner", "Table", "Text"],
      },
    },
    variants: [
      {
        label: "Soft",
        props: {
          borderWidth: "0px",
          boxShadow: "none",
          padding: "1rem 1.25rem",
        },
      },
      {
        label: "Outlined",
        props: {
          backgroundColorError: "transparent",
          backgroundColorSuccess: "transparent",
          backgroundColorWarning: "transparent",
          borderWidth: "1px",
        },
      },
      {
        label: "Solid",
        props: {
          colorError: "var(--pc-semantic-text-inverse)",
          colorSuccess: "var(--pc-semantic-text-inverse)",
          colorWarning: "var(--pc-semantic-text-inverse)",
          backgroundColorError: "#ef4444",
          backgroundColorSuccess: "#22c55e",
          backgroundColorWarning: "#eab308",
        },
      },
      {
        label: "Elevated",
        props: {
          borderWidth: "0px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
        },
      },
      {
        label: "Glass",
        props: {
          backdropFilter: "blur(12px)",
          backgroundColorError: "rgba(239, 68, 68, 0.15)",
          backgroundColorSuccess: "rgba(34, 197, 94, 0.15)",
          backgroundColorWarning: "rgba(234, 179, 8, 0.15)",
          borderWidth: "1px",
        },
      },
      {
        label: "Left Accent",
        props: {
          borderBottomWidth: "0px",
          borderLeftWidth: "4px",
          borderRadius: "0px",
          borderRightWidth: "0px",
          borderTopWidth: "0px",
        },
      },
      {
        label: "Compact Row",
        props: {
          alignItems: "center",
          flexDirection: "row",
          gap: "0.5rem",
          padding: "0.75rem 1rem",
        },
      },
      {
        label: "Banner",
        props: {
          borderRadius: "0px",
          justifyContent: "center",
          padding: "0.75rem",
          width: "100%",
        },
      },
      {
        label: "Toast",
        props: {
          bottom: "1.5rem",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
          maxWidth: "320px",
          position: "fixed",
          right: "1.5rem",
          zIndex: "1000",
        },
      },
      {
        label: "Floating Center",
        props: {
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.3)",
          left: "50%",
          maxWidth: "400px",
          position: "fixed",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: "1000",
        },
      },
    ],
  };
}
