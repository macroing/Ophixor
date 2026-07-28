// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createAccordionSchema() {
  return {
    description: "",
    editor: {
      defaultOpenGroups: {
        content: ["Items"],
        layout: [],
        selectors: [],
        styling: [],
        visibility: [],
      },
      roleGroupOrder: {
        content: ["Items"],
        layout: [],
        selectors: ["Selectors"],
        styling: [],
        visibility: ["Visibility"],
      },
      roleOrder: ["content", "layout", "styling", "visibility", "selectors"],
    },
    exportCSS: (accordion = null, accordionSchema = null) => {
      if (accordion && accordionSchema) {
        const props = exportCSSFromProps(accordion, accordionSchema);

        if (props.length > 0) {
          return `
      .${accordion.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return "";
      }
    },
    exportHTML: (accordion, accordionSchema, pageSchema, indentation) => {
      return "";
    },
    isAllowingChildComponents: true,
    label: "Accordion",
    plan: "Pro",
    props: {
      items: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: [
          {
            label: "Lorem ipsum",
          },
          {
            label: "Suspendisse",
          },
          {
            label: "Aenean consectetur",
          },
        ],
        label: "Items",
        role: "content",
        roleGroup: "Items",
        schema: {
          isAllowingChildItems: false,
          props: {
            label: {
              label: "Text",
              type: "text",
            },
          },
        },
        schemaType: {
          items: {
            props: {
              label: { type: "string" },
            },
            type: "object",
          },
          type: "array",
        },
        type: "items",
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
        allowedChildComponents: ["Button", "Divider", "Grid", "Element", "Form", "Heading", "Image", "Link", "List", "RichText", "Section", "Spacer", "Spinner", "Table", "Text"],
      },
    },
  };
}
