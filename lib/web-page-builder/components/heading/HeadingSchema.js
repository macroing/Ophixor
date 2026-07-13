// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createHeadingSchema() {
  return {
    defaultSlots: {},
    description: "A heading with six different levels that have been configured using a typography scale.",
    editor: {
      defaultOpenGroups: {
        content: ["Content"],
        layout: [],
        selectors: [],
        styling: ["Structure", "Typography"],
      },
      roleGroupOrder: {
        content: ["Content"],
        layout: ["Spacing"],
        selectors: ["Selectors"],
        styling: ["Structure", "Typography", "Size", "Weight", "Line Height", "Letter Spacing", "Surface"],
      },
      roleOrder: ["content", "styling", "layout", "selectors"],
    },
    exportCSS: (heading = null, headingSchema = null) => {
      if (heading && headingSchema) {
        const props = exportCSSFromProps(heading, headingSchema);

        if (props.length > 0) {
          return `
      .${heading.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .heading {
        --heading-background: none;
        --heading-background-color: transparent;
        --heading-border-color: transparent;
        --heading-border-radius: 0px;
        --heading-border-style: solid;
        --heading-border-width: 0px;
        --heading-color: currentColor;
        --heading-font-size-level-1: clamp(2.25rem, 5vw, 3.5rem);
        --heading-font-size-level-2: clamp(1.875rem, 4vw, 2.75rem);
        --heading-font-size-level-3: clamp(1.5rem, 3vw, 2.125rem);
        --heading-font-size-level-4: clamp(1.25rem, 2.2vw, 1.625rem);
        --heading-font-size-level-5: clamp(1.125rem, 1.8vw, 1.375rem);
        --heading-font-size-level-6: clamp(1rem, 1.4vw, 1.125rem);
        --heading-font-weight-level-1: 800;
        --heading-font-weight-level-2: 700;
        --heading-font-weight-level-3: 600;
        --heading-font-weight-level-4: 600;
        --heading-font-weight-level-5: 500;
        --heading-font-weight-level-6: 500;
        --heading-letter-spacing-level-1: -0.025em;
        --heading-letter-spacing-level-2: -0.02em;
        --heading-letter-spacing-level-3: -0.01em;
        --heading-letter-spacing-level-4: 0em;
        --heading-letter-spacing-level-5: 0em;
        --heading-letter-spacing-level-6: 0.02em;
        --heading-line-height-level-1: 1.1;
        --heading-line-height-level-2: 1.15;
        --heading-line-height-level-3: 1.2;
        --heading-line-height-level-4: 1.3;
        --heading-line-height-level-5: 1.35;
        --heading-line-height-level-6: 1.4;
        --heading-margin: 0px;
        --heading-text-align: left;
        --heading-text-shadow: none;

        background: var(--heading-background);
        background-color: var(--heading-background-color);
        border: var(--heading-border-width) var(--heading-border-style) var(--heading-border-color);
        border-radius: var(--heading-border-radius);
        color: var(--heading-color);
        margin: var(--heading-margin);
        text-align: var(--heading-text-align);
        text-shadow: var(--heading-text-shadow);
      }

      h1.heading {
        font-size: var(--heading-font-size-level-1);
        font-weight: var(--heading-font-weight-level-1);
        letter-spacing: var(--heading-letter-spacing-level-1);
        line-height: var(--heading-line-height-level-1);
      }

      h2.heading {
        font-size: var(--heading-font-size-level-2);
        font-weight: var(--heading-font-weight-level-2);
        letter-spacing: var(--heading-letter-spacing-level-2);
        line-height: var(--heading-line-height-level-2);
      }

      h3.heading {
        font-size: var(--heading-font-size-level-3);
        font-weight: var(--heading-font-weight-level-3);
        letter-spacing: var(--heading-letter-spacing-level-3);
        line-height: var(--heading-line-height-level-3);
      }

      h4.heading {
        font-size: var(--heading-font-size-level-4);
        font-weight: var(--heading-font-weight-level-4);
        letter-spacing: var(--heading-letter-spacing-level-4);
        line-height: var(--heading-line-height-level-4);
      }

      h5.heading {
        font-size: var(--heading-font-size-level-5);
        font-weight: var(--heading-font-weight-level-5);
        letter-spacing: var(--heading-letter-spacing-level-5);
        line-height: var(--heading-line-height-level-5);
      }

      h6.heading {
        font-size: var(--heading-font-size-level-6);
        font-weight: var(--heading-font-weight-level-6);
        letter-spacing: var(--heading-letter-spacing-level-6);
        line-height: var(--heading-line-height-level-6);
      }
`;
      }
    },
    exportHTML: (heading, headingSchema, pageSchema, indentation) => {
      if (heading?.props?.level === "1") {
        return `${indentation}<h1 class="heading ${heading?.id}" data-pc-id="${heading?.id || ""}">${heading?.props?.text || ""}</h1>`;
      } else if (heading?.props?.level === "2") {
        return `${indentation}<h2 class="heading ${heading?.id}" data-pc-id="${heading?.id || ""}">${heading?.props?.text || ""}</h2>`;
      } else if (heading?.props?.level === "3") {
        return `${indentation}<h3 class="heading ${heading?.id}" data-pc-id="${heading?.id || ""}">${heading?.props?.text || ""}</h3>`;
      } else if (heading?.props?.level === "4") {
        return `${indentation}<h4 class="heading ${heading?.id}" data-pc-id="${heading?.id || ""}">${heading?.props?.text || ""}</h4>`;
      } else if (heading?.props?.level === "5") {
        return `${indentation}<h5 class="heading ${heading?.id}" data-pc-id="${heading?.id || ""}">${heading?.props?.text || ""}</h5>`;
      } else if (heading?.props?.level === "6") {
        return `${indentation}<h6 class="heading ${heading?.id}" data-pc-id="${heading?.id || ""}">${heading?.props?.text || ""}</h6>`;
      } else {
        return `${indentation}<h1 class="heading ${heading?.id}" data-pc-id="${heading?.id || ""}">${heading?.props?.text || ""}</h1>`;
      }
    },
    isAllowingChildComponents: false,
    label: "Heading",
    plan: "Personal",
    props: {
      text: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "Lorem ipsum dolor sit amet",
        label: "Text",
        role: "content",
        roleGroup: "Content",
        schemaType: "string",
        type: "text",
      },
      level: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "1",
        label: "Level",
        options: [
          { label: "Level 1", value: "1" },
          { label: "Level 2", value: "2" },
          { label: "Level 3", value: "3" },
          { label: "Level 4", value: "4" },
          { label: "Level 5", value: "5" },
          { label: "Level 6", value: "6" },
        ],
        role: "styling",
        roleGroup: "Structure",
        schemaType: "enum<string>",
        type: "select",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--heading-color",
        defaultValue: "currentColor",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      textAlign: {
        cssProperty: "text-align",
        cssVariableName: "--heading-text-align",
        defaultValue: "left",
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
      textShadow: {
        cssProperty: "text-shadow",
        cssVariableName: "--heading-text-shadow",
        defaultValue: "none",
        label: "Text shadow",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "text",
      },
      fontSizeLevel1: {
        cssProperty: "font-size",
        cssVariableName: "--heading-font-size-level-1",
        defaultValue: "clamp(2.25rem, 5vw, 3.5rem)",
        label: "Font size - Level 1",
        role: "styling",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      fontSizeLevel2: {
        cssProperty: "font-size",
        cssVariableName: "--heading-font-size-level-2",
        defaultValue: "clamp(1.875rem, 4vw, 2.75rem)",
        label: "Font size - Level 2",
        role: "styling",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      fontSizeLevel3: {
        cssProperty: "font-size",
        cssVariableName: "--heading-font-size-level-3",
        defaultValue: "clamp(1.5rem, 3vw, 2.125rem)",
        label: "Font size - Level 3",
        role: "styling",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      fontSizeLevel4: {
        cssProperty: "font-size",
        cssVariableName: "--heading-font-size-level-4",
        defaultValue: "clamp(1.25rem, 2.2vw, 1.625rem)",
        label: "Font size - Level 4",
        role: "styling",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      fontSizeLevel5: {
        cssProperty: "font-size",
        cssVariableName: "--heading-font-size-level-5",
        defaultValue: "clamp(1.125rem, 1.8vw, 1.375rem)",
        label: "Font size - Level 5",
        role: "styling",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      fontSizeLevel6: {
        cssProperty: "font-size",
        cssVariableName: "--heading-font-size-level-6",
        defaultValue: "clamp(1rem, 1.4vw, 1.125rem)",
        label: "Font size - Level 6",
        role: "styling",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      fontWeightLevel1: {
        cssProperty: "font-weight",
        cssVariableName: "--heading-font-weight-level-1",
        defaultValue: "800",
        label: "Font weight - Level 1",
        role: "styling",
        roleGroup: "Weight",
        schemaType: "string",
        type: "text",
      },
      fontWeightLevel2: {
        cssProperty: "font-weight",
        cssVariableName: "--heading-font-weight-level-2",
        defaultValue: "700",
        label: "Font weight - Level 2",
        role: "styling",
        roleGroup: "Weight",
        schemaType: "string",
        type: "text",
      },
      fontWeightLevel3: {
        cssProperty: "font-weight",
        cssVariableName: "--heading-font-weight-level-3",
        defaultValue: "600",
        label: "Font weight - Level 3",
        role: "styling",
        roleGroup: "Weight",
        schemaType: "string",
        type: "text",
      },
      fontWeightLevel4: {
        cssProperty: "font-weight",
        cssVariableName: "--heading-font-weight-level-4",
        defaultValue: "600",
        label: "Font weight - Level 4",
        role: "styling",
        roleGroup: "Weight",
        schemaType: "string",
        type: "text",
      },
      fontWeightLevel5: {
        cssProperty: "font-weight",
        cssVariableName: "--heading-font-weight-level-5",
        defaultValue: "500",
        label: "Font weight - Level 5",
        role: "styling",
        roleGroup: "Weight",
        schemaType: "string",
        type: "text",
      },
      fontWeightLevel6: {
        cssProperty: "font-weight",
        cssVariableName: "--heading-font-weight-level-6",
        defaultValue: "500",
        label: "Font weight - Level 6",
        role: "styling",
        roleGroup: "Weight",
        schemaType: "string",
        type: "text",
      },
      lineHeightLevel1: {
        cssProperty: "line-height",
        cssVariableName: "--heading-line-height-level-1",
        defaultValue: "1.1",
        label: "Line height - Level 1",
        role: "styling",
        roleGroup: "Line Height",
        schemaType: "string",
        type: "text",
      },
      lineHeightLevel2: {
        cssProperty: "line-height",
        cssVariableName: "--heading-line-height-level-2",
        defaultValue: "1.15",
        label: "Line height - Level 2",
        role: "styling",
        roleGroup: "Line Height",
        schemaType: "string",
        type: "text",
      },
      lineHeightLevel3: {
        cssProperty: "line-height",
        cssVariableName: "--heading-line-height-level-3",
        defaultValue: "1.2",
        label: "Line height - Level 3",
        role: "styling",
        roleGroup: "Line Height",
        schemaType: "string",
        type: "text",
      },
      lineHeightLevel4: {
        cssProperty: "line-height",
        cssVariableName: "--heading-line-height-level-4",
        defaultValue: "1.3",
        label: "Line height - Level 4",
        role: "styling",
        roleGroup: "Line Height",
        schemaType: "string",
        type: "text",
      },
      lineHeightLevel5: {
        cssProperty: "line-height",
        cssVariableName: "--heading-line-height-level-5",
        defaultValue: "1.35",
        label: "Line height - Level 5",
        role: "styling",
        roleGroup: "Line Height",
        schemaType: "string",
        type: "text",
      },
      lineHeightLevel6: {
        cssProperty: "line-height",
        cssVariableName: "--heading-line-height-level-6",
        defaultValue: "1.4",
        label: "Line height - Level 6",
        role: "styling",
        roleGroup: "Line Height",
        schemaType: "string",
        type: "text",
      },
      letterSpacingLevel1: {
        cssProperty: "letter-spacing",
        cssVariableName: "--heading-letter-spacing-level-1",
        defaultValue: "-0.025em",
        label: "Letter spacing - Level 1",
        role: "styling",
        roleGroup: "Letter Spacing",
        schemaType: "string",
        type: "text",
      },
      letterSpacingLevel2: {
        cssProperty: "letter-spacing",
        cssVariableName: "--heading-letter-spacing-level-2",
        defaultValue: "-0.02em",
        label: "Letter spacing - Level 2",
        role: "styling",
        roleGroup: "Letter Spacing",
        schemaType: "string",
        type: "text",
      },
      letterSpacingLevel3: {
        cssProperty: "letter-spacing",
        cssVariableName: "--heading-letter-spacing-level-3",
        defaultValue: "-0.01em",
        label: "Letter spacing - Level 3",
        role: "styling",
        roleGroup: "Letter Spacing",
        schemaType: "string",
        type: "text",
      },
      letterSpacingLevel4: {
        cssProperty: "letter-spacing",
        cssVariableName: "--heading-letter-spacing-level-4",
        defaultValue: "0em",
        label: "Letter spacing - Level 4",
        role: "styling",
        roleGroup: "Letter Spacing",
        schemaType: "string",
        type: "text",
      },
      letterSpacingLevel5: {
        cssProperty: "letter-spacing",
        cssVariableName: "--heading-letter-spacing-level-5",
        defaultValue: "0em",
        label: "Letter spacing - Level 5",
        role: "styling",
        roleGroup: "Letter Spacing",
        schemaType: "string",
        type: "text",
      },
      letterSpacingLevel6: {
        cssProperty: "letter-spacing",
        cssVariableName: "--heading-letter-spacing-level-6",
        defaultValue: "0.02em",
        label: "Letter spacing - Level 6",
        role: "styling",
        roleGroup: "Letter Spacing",
        schemaType: "string",
        type: "text",
      },
      background: {
        cssProperty: "background",
        cssVariableName: "--heading-background",
        defaultValue: "none",
        label: "Background",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--heading-background-color",
        defaultValue: "transparent",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--heading-border-color",
        defaultValue: "transparent",
        label: "Border color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--heading-border-radius",
        defaultValue: "0px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--heading-border-width",
        defaultValue: "0px",
        label: "Border width",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      borderStyle: {
        cssProperty: "border-style",
        cssVariableName: "--heading-border-style",
        defaultValue: "solid",
        label: "Border style",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      margin: {
        cssProperty: "margin",
        cssVariableName: "--heading-margin",
        defaultValue: "0px",
        label: "Margin",
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
      body: {
        allowedChildComponents: ["Badge", "Element", "Link", "Text"],
      },
    },
  };
}
