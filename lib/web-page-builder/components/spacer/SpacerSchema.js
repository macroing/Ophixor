// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createSpacerSchema() {
  return {
    defaultSlots: {},
    description: "A component that adds space between other components.",
    editor: {
      defaultOpenGroups: {
        layout: ["Container", "Size"],
        selectors: [],
      },
      roleGroupOrder: {
        layout: ["Container", "Size"],
        selectors: ["Selectors"],
      },
      roleOrder: ["layout", "selectors"],
    },
    exportCSS: (spacer = null, spacerSchema = null) => {
      if (spacer && spacerSchema) {
        const props = exportCSSFromProps(spacer, spacerSchema);

        if (props.length > 0) {
          return `
      .${spacer.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .spacer {
        --spacer-flex-grow: 1;
        --spacer-height: 1rem;

        flex-grow: var(--spacer-flex-grow);
        height: var(--spacer-height);
        width: 100%;
      }
`;
      }
    },
    exportHTML: (spacer, spacerSchema, pageSchema, indentation) => {
      return `${indentation}<div class="spacer ${spacer?.id}" data-pc-id="${spacer?.id || ""}"></div>`;
    },
    isAllowingChildComponents: false,
    label: "Spacer",
    plan: "Personal",
    props: {
      flexGrow: {
        cssProperty: "flex-grow",
        cssVariableName: "--spacer-flex-grow",
        defaultValue: "1",
        label: "Flexbox grow",
        role: "layout",
        roleGroup: "Container",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--spacer-height",
        defaultValue: "1rem",
        label: "Height",
        role: "styling",
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
    slots: {},
  };
}
