// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createImageSchema() {
  return {
    defaultSlots: {},
    description: "An image with built-in optimization capabilities.",
    editor: {
      defaultOpenGroups: {
        content: ["Source"],
        layout: ["Size"],
        optimization: ["Performance"],
        selectors: [],
        styling: ["Fit & Ratio"],
        visibility: [],
      },
      roleGroupOrder: {
        content: ["Source", "Type"],
        layout: ["Size", "Alignment", "Structure"],
        optimization: ["Performance"],
        selectors: ["Selectors"],
        styling: ["Fit & Ratio", "Surface", "Border", "Effects"],
        visibility: ["Visibility"],
      },
      roleOrder: ["content", "layout", "styling", "optimization", "visibility", "selectors"],
    },
    exportCSS: (image = null, imageSchema = null) => {
      if (image && imageSchema) {
        const props = exportCSSFromProps(image, imageSchema);

        if (props.length > 0) {
          return `
      .${image.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .image {
        --image-align-self: auto;
        --image-aspect-ratio: auto;
        --image-background-color: var(--pc-semantic-surface-base-secondary);
        --image-border-color: var(--pc-semantic-border-secondary);
        --image-border-radius: 5px;
        --image-border-width: 5px;
        --image-bottom: auto;
        --image-box-shadow: var(--pc-semantic-shadow-sm);
        --image-cursor: auto;
        --image-flex-grow: 1;
        --image-height: auto;
        --image-justify-self: auto;
        --image-left: auto;
        --image-max-height: 100%;
        --image-max-width: 100%;
        --image-object-fit: contain;
        --image-object-position: center;
        --image-opacity: 1;
        --image-position: relative;
        --image-right: auto;
        --image-top: auto;
        --image-width: auto;
        --image-z-index: auto;

        align-self: var(--image-align-self);
        background-color: var(--image-background-color);
        border: var(--image-border-width) solid var(--image-border-color);
        border-radius: var(--image-border-radius);
        bottom: var(--image-bottom);
        box-shadow: var(--image-box-shadow);
        cursor: var(--image-cursor);
        display: flex;
        flex-direction: row;
        flex-grow: var(--image-flex-grow);
        height: var(--image-height);
        justify-self: var(--image-justify-self);
        left: var(--image-left);
        max-height: var(--image-max-height);
        max-width: var(--image-max-width);
        opacity: var(--image-opacity);
        overflow: hidden;
        position: var(--image-position);
        right: var(--image-right);
        top: var(--image-top);
        width: var(--image-width);
        z-index: var(--image-z-index);
      }

      .image > img {
        aspect-ratio: var(--image-aspect-ratio);
        background-color: var(--image-background-color);
        border: none;
        border-radius: 0px;
        box-shadow: none;
        display: flex;
        height: 100%;
        max-height: none;
        max-width: none;
        object-fit: var(--image-object-fit);
        object-position: var(--image-object-position);
        width: 100%;
      }
`;
      }
    },
    exportHTML: (image, imageSchema, pageSchema, indentation) => {
      const alt = image?.props?.alt || "";
      const decoding = image?.props?.decoding || "async";
      const loading = image?.props?.loading || "lazy";
      const referrerPolicy = image?.props?.referrerPolicy || "no-referrer";
      const src = image?.props?.src || "";

      const isImage = typeof src === "string" && src.trim().length > 0;

      if (typeof image?.props?.isVisible === "boolean" && !image.props.isVisible) {
        return "";
      }

      return `${indentation}<div class="image ${image?.id}" data-pc-id="${image?.id || ""}">${isImage ? `\n${indentation + "  "}<img alt="${alt}" decoding="${decoding}" loading="${loading}" referrerpolicy="${referrerPolicy}" src="${src}" />\n${indentation}` : ""}</div>`;
    },
    isAllowingChildComponents: false,
    label: "Image",
    mediaPicker: true,
    mediaPickerAccept: "image",
    plan: "Personal",
    props: {
      src: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "/images/logo.webp",
        label: "Link",
        role: "content",
        roleGroup: "Source",
        schemaType: null,
        type: "text",
      },
      alt: {
        cssProperty: null,
        cssVariableName: null,
        defaultText: "Alternative text for the image",
        label: "Alternative text",
        role: "content",
        roleGroup: "Source",
        schemaType: "string",
        type: "text",
      },
      role: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "hero",
        label: "Role",
        options: [
          { label: "Hero", value: "hero" },
          { label: "Illustration", value: "illustration" },
          { label: "Logo", value: "logo" },
          { label: "Thumbnail", value: "thumbnail" },
        ],
        role: "content",
        roleGroup: "Type",
        schemaType: "enum<string>",
        type: null,
      },
      width: {
        cssProperty: "width",
        cssVariableName: "--image-width",
        defaultValue: "100%",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxWidth: {
        cssProperty: "max-width",
        cssVariableName: "--image-max-width",
        defaultValue: "100%",
        label: "Maximum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--image-height",
        defaultValue: "auto",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxHeight: {
        cssProperty: "max-height",
        cssVariableName: "--image-max-height",
        defaultValue: "100%",
        label: "Maximum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      flexGrow: {
        cssProperty: "flex-grow",
        cssVariableName: "--image-flex-grow",
        defaultValue: "1",
        label: "Flexbox grow",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      fill: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: false,
        label: "Fill container",
        role: "layout",
        roleGroup: "Size",
        schemaType: "boolean",
        type: "switch",
      },
      alignSelf: {
        cssProperty: "align-self",
        cssVariableName: "--image-align-self",
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
        roleGroup: "Alignment",
        schemaType: "enum<string>",
        type: "select",
      },
      justifySelf: {
        cssProperty: "justify-self",
        cssVariableName: "--image-justify-self",
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
        roleGroup: "Alignment",
        schemaType: "enum<string>",
        type: "select",
      },
      position: {
        cssProperty: "position",
        cssVariableName: "--image-position",
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
        cssVariableName: "--image-top",
        defaultValue: "auto",
        label: "Top",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      right: {
        cssProperty: "right",
        cssVariableName: "--image-right",
        defaultValue: "auto",
        label: "Right",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      bottom: {
        cssProperty: "bottom",
        cssVariableName: "--image-bottom",
        defaultValue: "auto",
        label: "Bottom",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      left: {
        cssProperty: "left",
        cssVariableName: "--image-left",
        defaultValue: "auto",
        label: "Left",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      zIndex: {
        cssProperty: "z-index",
        cssVariableName: "--image-z-index",
        defaultValue: "auto",
        label: "Z-index",
        role: "layout",
        roleGroup: "Structure",
        schemaType: "string",
        type: "text",
      },
      aspectRatio: {
        cssProperty: "aspect-ratio",
        cssVariableName: "--image-aspect-ratio",
        defaultValue: "auto",
        label: "Aspect ratio",
        options: [
          { label: "Automatic", value: "auto" },
          { label: "16/9", value: "16/9" },
          { label: "1/1", value: "1/1" },
          { label: "4/3", value: "4/3" },
        ],
        role: "styling",
        roleGroup: "Fit & Ratio",
        schemaType: "enum<string>",
        type: "select",
      },
      objectFit: {
        cssProperty: "object-fit",
        cssVariableName: "--image-object-fit",
        defaultValue: "contain",
        label: "Object fit",
        role: "styling",
        roleGroup: "Fit & Ratio",
        schemaType: "string",
        type: "text",
      },
      objectPosition: {
        cssProperty: "object-position",
        cssVariableName: "--image-object-position",
        defaultValue: "center",
        label: "Object position",
        options: [
          { label: "Center", value: "center" },
          { label: "Top", value: "top" },
          { label: "Bottom", value: "bottom" },
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
          { label: "Top left", value: "left top" },
          { label: "Top right", value: "right top" },
          { label: "Bottom left", value: "left bottom" },
          { label: "Bottom right", value: "right bottom" },
        ],
        role: "styling",
        roleGroup: "Fit & Ratio",
        schemaType: "enum<string>",
        type: "select",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--image-background-color",
        defaultValue: "var(--pc-semantic-surface-base-secondary)",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      cursor: {
        cssProperty: "cursor",
        cssVariableName: "--image-cursor",
        defaultValue: "auto",
        label: "Cursor",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      opacity: {
        cssProperty: "opacity",
        cssVariableName: "--image-opacity",
        defaultValue: "1",
        label: "Opacity",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--image-border-color",
        defaultValue: "var(--pc-semantic-border-secondary)",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--image-border-width",
        defaultValue: "5px",
        label: "Border width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--image-border-radius",
        defaultValue: "5px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      boxShadow: {
        cssProperty: "box-shadow",
        cssVariableName: "--image-box-shadow",
        defaultValue: "var(--pc-semantic-shadow-sm)",
        label: "Box shadow",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      sizes: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "100vw",
        label: "Responsive sizes",
        role: "optimization",
        roleGroup: "Performance",
        schemaType: "string",
        type: "text",
      },
      quality: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: 75,
        label: "Image quality",
        role: "optimization",
        roleGroup: "Performance",
        schemaType: "number",
        type: "number",
      },
      priority: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: false,
        label: "High priority (LCP)",
        role: "optimization",
        roleGroup: "Performance",
        schemaType: "boolean",
        type: "switch",
      },
      loading: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "lazy",
        label: "Loading behavior",
        options: [
          { label: "Lazy", value: "lazy" },
          { label: "Eager", value: "eager" },
        ],
        role: "optimization",
        roleGroup: "Performance",
        schemaType: "enum<string>",
        type: "select",
      },
      fetchPriority: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "auto",
        label: "Fetch priority",
        options: [
          { label: "Auto", value: "auto" },
          { label: "High", value: "high" },
          { label: "Low", value: "low" },
        ],
        role: "optimization",
        roleGroup: "Performance",
        schemaType: "enum<string>",
        type: "select",
      },
      decoding: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "async",
        label: "Decoding",
        options: [
          { label: "Async", value: "async" },
          { label: "Sync", value: "sync" },
          { label: "Auto", value: "auto" },
        ],
        role: "optimization",
        roleGroup: "Performance",
        schemaType: "enum<string>",
        type: "select",
      },
      placeholder: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "empty",
        label: "Placeholder",
        options: [
          { label: "None", value: "empty" },
          { label: "Blur", value: "blur" },
        ],
        role: "optimization",
        roleGroup: "Performance",
        schemaType: "enum<string>",
        type: "select",
      },
      blurDataURL: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Blur data URL",
        role: "optimization",
        roleGroup: "Performance",
        schemaType: "string",
        type: "text",
      },
      referrerPolicy: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "no-referrer",
        label: "Referrer policy",
        role: "optimization",
        roleGroup: "Performance",
        schemaType: "string",
        type: "text",
      },
      unoptimized: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: false,
        label: "Disable optimization",
        role: "optimization",
        roleGroup: "Performance",
        schemaType: "boolean",
        type: "switch",
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
    slots: {},
  };
}
