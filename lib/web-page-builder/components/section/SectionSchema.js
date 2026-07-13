// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createSectionSchema() {
  return {
    defaultProps: {
      borderColor: "#e5e7eb",
      borderWidth: "1px",
    },
    defaultSlots: {
      body: [],
    },
    description: "A mostly flex-based general purpose layout container that can be used for more than that.",
    editor: {
      defaultOpenGroups: {
        layout: ["Flexbox", "Spacing"],
        selectors: [],
        styling: [],
        visibility: [],
      },
      roleGroupOrder: {
        layout: ["Size", "Flexbox", "Grid", "Spacing", "Structure"],
        selectors: ["Selectors"],
        styling: ["Surface", "Border", "Structure", "Typography"],
        visibility: ["Visibility"],
      },
      roleOrder: ["layout", "styling", "visibility", "selectors"],
    },
    exportCSS: (section = null, sectionSchema = null) => {
      if (section && sectionSchema) {
        const props = exportCSSFromProps(section, sectionSchema);

        if (props.length > 0) {
          return `
      .${section.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .section {
        --section-align-content: normal;
        --section-align-items: stretch;
        --section-align-self: auto;
        --section-aspect-ratio: auto;
        --section-backdrop-filter: none;
        --section-background: none;
        --section-background-blend-mode: initial;
        --section-background-color: initial;
        --section-background-image: initial;
        --section-background-position: initial;
        --section-background-repeat: initial;
        --section-background-size: initial;
        --section-border-bottom-width: initial;
        --section-border-color: transparent;
        --section-border-left-width: initial;
        --section-border-radius: 0px;
        --section-border-right-width: initial;
        --section-border-top-width: initial;
        --section-border-width: 0px;
        --section-bottom: auto;
        --section-box-shadow: none;
        --section-color: inherit;
        --section-container-type: normal;
        --section-display: flex;
        --section-flex-direction: column;
        --section-flex-grow: 0;
        --section-flex-shrink: 1;
        --section-flex-wrap: nowrap;
        --section-font-family: inherit;
        --section-font-size: inherit;
        --section-font-style: inherit;
        --section-font-weight: inherit;
        --section-gap: 1rem;
        --section-grid-template-areas: none;
        --section-grid-template-columns: none;
        --section-grid-template-rows: none;
        --section-height: auto;
        --section-justify-content: stretch;
        --section-justify-items: legacy;
        --section-justify-self: auto;
        --section-left: auto;
        --section-line-height: inherit;
        --section-margin: 0px;
        --section-max-height: none;
        --section-max-width: none;
        --section-min-height: auto;
        --section-min-width: auto;
        --section-opacity: 1;
        --section-overflow: visible;
        --section-padding: clamp(1rem, 3vw, 4rem);
        --section-position: relative;
        --section-right: auto;
        --section-text-align: inherit;
        --section-text-decoration: none;
        --section-text-shadow: none;
        --section-top: auto;
        --section-transform: none;
        --section-transform-origin: 50% 50% 0;
        --section-width: 100%;
        --section-z-index: auto;

        align-content: var(--section-align-content);
        align-items: var(--section-align-items);
        align-self: var(--section-align-self);
        aspect-ratio: var(--section-aspect-ratio);
        backdrop-filter: var(--section-backdrop-filter);
        background: var(--section-background);
        background-blend-mode: var(--section-background-blend-mode, initial);
        background-color: var(--section-background-color, initial);
        background-image: var(--section-background-image, initial);
        background-position: var(--section-background-position, initial);
        background-repeat: var(--section-background-repeat, initial);
        background-size: var(--section-background-size, initial);
        border: var(--section-border-width) solid var(--section-border-color);
        border-bottom-width: var(--section-border-bottom-width, var(--section-border-width));
        border-left-width: var(--section-border-left-width, var(--section-border-width));
        border-radius: var(--section-border-radius);
        border-right-width: var(--section-border-right-width, var(--section-border-width));
        border-top-width: var(--section-border-top-width, var(--section-border-width));
        bottom: var(--section-bottom);
        box-shadow: var(--section-box-shadow);
        color: var(--section-color);
        container-type: var(--section-container-type);
        display: var(--section-display);
        flex-direction: var(--section-flex-direction);
        flex-grow: var(--section-flex-grow);
        flex-shrink: var(--section-flex-shrink);
        flex-wrap: var(--section-flex-wrap);
        font-family: var(--section-font-family);
        font-size: var(--section-font-size);
        font-style: var(--section-font-style);
        font-weight: var(--section-font-weight);
        gap: var(--section-gap);
        grid-template-areas: var(--section-grid-template-areas);
        grid-template-columns: var(--section-grid-template-columns);
        grid-template-rows: var(--section-grid-template-rows);
        height: var(--section-height);
        justify-content: var(--section-justify-content);
        justify-items: var(--section-justify-items);
        justify-self: var(--section-justify-self);
        left: var(--section-left);
        line-height: var(--section-line-height);
        margin: var(--section-margin);
        max-height: var(--section-max-height);
        max-width: var(--section-max-width);
        min-height: var(--section-min-height);
        min-width: var(--section-min-width);
        opacity: var(--section-opacity);
        overflow: var(--section-overflow);
        padding: var(--section-padding);
        position: var(--section-position);
        right: var(--section-right);
        text-align: var(--section-text-align);
        text-decoration: var(--section-text-decoration);
        text-shadow: var(--section-text-shadow);
        top: var(--section-top);
        transform: var(--section-transform);
        transform-origin: var(--section-transform-origin);
        width: var(--section-width);
        z-index: var(--section-z-index);
      }
`;
      }
    },
    exportHTML: (section, sectionSchema, pageSchema, indentation) => {
      if (typeof section?.props?.isVisible === "boolean" && !section.props.isVisible) {
        return "";
      }

      return `${indentation}<${section?.props?.element || "div"} class="section ${section?.id}" data-pc-id="${section?.id || ""}">
${section?.slots?.body || ""}${(section?.slots?.body || "").trim() === "" ? "\n" : ""}${indentation}</${section?.props?.element || "div"}>`;
    },
    isAllowingChildComponents: true,
    label: "Section",
    plan: "Personal",
    props: {
      width: {
        cssProperty: "width",
        cssVariableName: "--section-width",
        defaultValue: "100%",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minWidth: {
        cssProperty: "min-width",
        cssVariableName: "--section-min-width",
        defaultValue: "auto",
        label: "Minimum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxWidth: {
        cssProperty: "max-width",
        cssVariableName: "--section-max-width",
        defaultValue: "none",
        label: "Maximum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--section-height",
        defaultValue: "auto",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minHeight: {
        cssProperty: "min-height",
        cssVariableName: "--section-min-height",
        defaultValue: "auto",
        label: "Minimum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxHeight: {
        cssProperty: "max-height",
        cssVariableName: "--section-max-height",
        defaultValue: "none",
        label: "Maximum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      aspectRatio: {
        cssProperty: "aspect-ratio",
        cssVariableName: "--section-aspect-ratio",
        defaultValue: "auto",
        label: "Aspect ratio",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      flexGrow: {
        cssProperty: "flex-grow",
        cssVariableName: "--section-flex-grow",
        defaultValue: "0",
        label: "Flexbox grow",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      flexShrink: {
        cssProperty: "flex-shrink",
        cssVariableName: "--section-flex-shrink",
        defaultValue: "1",
        label: "Flexbox shrink",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      overflow: {
        cssProperty: "overflow",
        cssVariableName: "--section-overflow",
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
      flexDirection: {
        cssProperty: "flex-direction",
        cssVariableName: "--section-flex-direction",
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
      flexWrap: {
        cssProperty: "flex-wrap",
        cssVariableName: "--section-flex-wrap",
        defaultValue: "nowrap",
        label: "Flexbox wrap",
        options: [
          { label: "No wrap", value: "nowrap" },
          { label: "Wrap", value: "wrap" },
        ],
        role: "layout",
        roleGroup: "Flexbox",
        schemaType: "enum<string>",
        type: "select",
      },
      alignContent: {
        cssProperty: "align-content",
        cssVariableName: "--section-align-content",
        defaultValue: "normal",
        label: "Align content",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Start", value: "start" },
          { label: "Center", value: "center" },
          { label: "End", value: "end" },
          { label: "Flexbox start", value: "flex-start" },
          { label: "Flexbox end", value: "flex-end" },
          { label: "Space between", value: "space-between" },
          { label: "Space around", value: "space-around" },
          { label: "Space evenly", value: "space-evenly" },
          { label: "Stretch", value: "stretch" },
        ],
        role: "layout",
        roleGroup: "Flexbox",
        schemaType: "enum<string>",
        type: "select",
      },
      alignItems: {
        cssProperty: "align-items",
        cssVariableName: "--section-align-items",
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
        roleGroup: "Flexbox",
        schemaType: "enum<string>",
        type: "select",
      },
      justifyContent: {
        cssProperty: "justify-content",
        cssVariableName: "--section-justify-content",
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
        roleGroup: "Flexbox",
        schemaType: "enum<string>",
        type: "select",
      },
      alignSelf: {
        cssProperty: "align-self",
        cssVariableName: "--section-align-self",
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
        roleGroup: "Flexbox",
        schemaType: "enum<string>",
        type: "select",
      },
      justifySelf: {
        cssProperty: "justify-self",
        cssVariableName: "--section-justify-self",
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
        roleGroup: "Flexbox",
        schemaType: "enum<string>",
        type: "select",
      },
      gap: {
        cssProperty: "gap",
        cssVariableName: "--section-gap",
        defaultValue: "1rem",
        label: "Gap",
        role: "layout",
        roleGroup: "Flexbox",
        schemaType: "string",
        type: "text",
      },
      gridTemplateColumns: {
        cssProperty: "grid-template-columns",
        cssVariableName: "--section-grid-template-columns",
        defaultValue: "none",
        label: "Grid template columns",
        role: "layout",
        roleGroup: "Grid",
        schemaType: "string",
        type: "text",
      },
      gridTemplateRows: {
        cssProperty: "grid-template-rows",
        cssVariableName: "--section-grid-template-rows",
        defaultValue: "none",
        label: "Grid template rows",
        role: "layout",
        roleGroup: "Grid",
        schemaType: "string",
        type: "text",
      },
      gridTemplateAreas: {
        cssProperty: "grid-template-areas",
        cssVariableName: "--section-grid-template-areas",
        defaultValue: "none",
        label: "Grid template areas",
        role: "layout",
        roleGroup: "Grid",
        schemaType: "string",
        type: "text",
      },
      justifyItems: {
        cssProperty: "justify-items",
        cssVariableName: "--section-justify-items",
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
        roleGroup: "Grid",
        schemaType: "enum<string>",
        type: "select",
      },
      margin: {
        cssProperty: "margin",
        cssVariableName: "--section-margin",
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
        cssVariableName: "--section-padding",
        defaultValue: "clamp(1rem, 3vw, 4rem)",
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
      display: {
        cssProperty: "display",
        cssVariableName: "--section-display",
        defaultValue: "flex",
        label: "Display",
        options: [
          { label: "Flexbox", value: "flex" },
          { label: "Grid", value: "grid" },
          { label: "Block", value: "block" },
          { label: "Inline block", value: "inline-block" },
          { label: "None", value: "none" },
        ],
        role: "layout",
        roleGroup: "Structure",
        schemaType: "enum<string>",
        type: "select",
      },
      position: {
        cssProperty: "position",
        cssVariableName: "--section-position",
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
        cssVariableName: "--section-top",
        defaultValue: "auto",
        label: "Top",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      right: {
        cssProperty: "right",
        cssVariableName: "--section-right",
        defaultValue: "auto",
        label: "Right",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      bottom: {
        cssProperty: "bottom",
        cssVariableName: "--section-bottom",
        defaultValue: "auto",
        label: "Bottom",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      left: {
        cssProperty: "left",
        cssVariableName: "--section-left",
        defaultValue: "auto",
        label: "Left",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      zIndex: {
        cssProperty: "z-index",
        cssVariableName: "--section-z-index",
        defaultValue: "auto",
        label: "Z-index",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      transform: {
        cssProperty: "transform",
        cssVariableName: "--section-transform",
        defaultValue: "none",
        label: "Transform",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      transformOrigin: {
        cssProperty: "transform-origin",
        cssVariableName: "--section-transform-origin",
        defaultValue: "50% 50% 0",
        label: "Transform origin",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      containerType: {
        cssProperty: "container-type",
        cssVariableName: "--section-container-type",
        defaultValue: "normal",
        label: "Container type",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--section-background-color",
        defaultValue: "initial",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      background: {
        cssProperty: "background",
        cssVariableName: "--section-background",
        defaultValue: "none",
        label: "Background",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundImage: {
        cssProperty: "background-image",
        cssVariableName: "--section-background-image",
        defaultValue: "initial",
        label: "Background image",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundSize: {
        cssProperty: "background-size",
        cssVariableName: "--section-background-size",
        defaultValue: "initial",
        label: "Background size",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundPosition: {
        cssProperty: "background-position",
        cssVariableName: "--section-background-position",
        defaultValue: "initial",
        label: "Background position",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundRepeat: {
        cssProperty: "background-repeat",
        cssVariableName: "--section-background-repeat",
        defaultValue: "initial",
        label: "Background repeat",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundBlendMode: {
        cssProperty: "background-blend-mode",
        cssVariableName: "--section-background-blend-mode",
        defaultValue: "initial",
        label: "Background blend mode",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      boxShadow: {
        cssProperty: "box-shadow",
        cssVariableName: "--section-box-shadow",
        defaultValue: "none",
        label: "Box shadow",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      opacity: {
        cssProperty: "opacity",
        cssVariableName: "--section-opacity",
        defaultValue: "1",
        label: "Opacity",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backdropFilter: {
        cssProperty: "backdrop-filter",
        cssVariableName: "--section-backdrop-filter",
        defaultValue: "none",
        label: "Backdrop filter",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--section-border-width",
        defaultValue: "0px",
        label: "Border width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderTopWidth: {
        cssProperty: "border-top-width",
        cssVariableName: "--section-border-top-width",
        defaultValue: "initial",
        label: "Border top width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderRightWidth: {
        cssProperty: "border-right-width",
        cssVariableName: "--section-border-right-width",
        defaultValue: "initial",
        label: "Border right width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderBottomWidth: {
        cssProperty: "border-bottom-width",
        cssVariableName: "--section-border-bottom-width",
        defaultValue: "initial",
        label: "Border bottom width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderLeftWidth: {
        cssProperty: "border-left-width",
        cssVariableName: "--section-border-left-width",
        defaultValue: "initial",
        label: "Border left width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--section-border-color",
        defaultValue: "transparent",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--section-border-radius",
        defaultValue: "0px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      element: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "div",
        label: "Element",
        options: [
          { label: "Div element", value: "div" },
          { label: "Section element", value: "section" },
          { label: "Header element", value: "header" },
          { label: "Nav element", value: "nav" },
          { label: "Main element", value: "main" },
          { label: "Footer element", value: "footer" },
          { label: "Article element", value: "article" },
          { label: "Aside element", value: "aside" },
          { label: "Details element", value: "details" },
          { label: "Summary element", value: "summary" },
          { label: "Figure element", value: "figure" },
          { label: "Figure caption element", value: "figcaption" },
        ],
        role: "styling",
        roleGroup: "Structure",
        schemaType: "enum<string>",
        type: "select",
      },
      fontFamily: {
        cssProperty: "font-family",
        cssVariableName: "--section-font-family",
        defaultValue: "inherit",
        label: "Font family",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontSize: {
        cssProperty: "font-size",
        cssVariableName: "--section-font-size",
        defaultValue: "inherit",
        label: "Font size",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontWeight: {
        cssProperty: "font-weight",
        cssVariableName: "--section-font-weight",
        defaultValue: "inherit",
        label: "Font weight",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontStyle: {
        cssProperty: "font-style",
        cssVariableName: "--section-font-style",
        defaultValue: "inherit",
        label: "Font style",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      lineHeight: {
        cssProperty: "line-height",
        cssVariableName: "--section-line-height",
        defaultValue: "inherit",
        label: "Line height",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      textDecoration: {
        cssProperty: "text-decoration",
        cssVariableName: "--section-text-decoration",
        defaultValue: "none",
        label: "Text decoration",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--section-color",
        defaultValue: "inherit",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      textShadow: {
        cssProperty: "text-shadow",
        cssVariableName: "--section-text-shadow",
        defaultValue: "none",
        label: "Text shadow",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      textAlign: {
        cssProperty: "text-align",
        cssVariableName: "--section-text-align",
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
        allowedChildComponents: ["Alert", "Badge", "Button", "Canvas", "Card", "Checkbox", "Dialog", "Divider", "Element", "Form", "Grid", "Heading", "Image", "Input", "Label", "Link", "List", "Map", "MenuBar", "RichText", "RadioGroup", "Section", "Select", "Spacer", "Spinner", "Switch", "Table", "Text", "TextArea"],
      },
    },
  };
}
