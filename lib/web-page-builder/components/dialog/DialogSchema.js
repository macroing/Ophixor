// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createDialogSchema() {
  return {
    defaultSlots: {
      body: [
        {
          props: {
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultrices ex eget lacus maximus tristique. Ut posuere, libero non ultricies eleifend, lectus ex condimentum augue, et euismod metus magna non enim. Aenean posuere tellus nec leo malesuada, consequat malesuada dui consectetur. Vestibulum eu tincidunt lorem. Vivamus ultricies porta ex, id efficitur sem tempus congue.",
          },
          slots: {
            body: [],
          },
          type: "Text",
        },
      ],
      footer: [
        {
          props: {
            text: "Lorem ipsum",
            theme: "primary",
          },
          slots: {
            body: [],
          },
          type: "Button",
        },
      ],
      header: [
        {
          props: {
            level: "3",
            text: "Lorem ipsum",
          },
          slots: {},
          type: "Heading",
        },
      ],
    },
    description: "A dialog that contains three optional slots; a header, a body and a footer.",
    editor: {
      defaultOpenGroups: {
        layout: ["Size"],
        selectors: [],
        styling: ["Surface"],
      },
      roleGroupOrder: {
        layout: ["Size", "Body"],
        selectors: ["Selectors"],
        styling: ["Surface", "Header", "Body", "Footer", "Border", "Effects"],
      },
      roleOrder: ["layout", "styling", "selectors"],
    },
    exportCSS: (dialog = null, dialogSchema = null) => {
      if (dialog && dialogSchema) {
        const props = exportCSSFromProps(dialog, dialogSchema);

        if (props.length > 0) {
          return `
      .${dialog.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .dialog {
        --dialog-background-color: var(--pc-semantic-surface-base);
        --dialog-background-color-backdrop: var(--pc-semantic-backdrop);
        --dialog-background-color-body: var(--pc-semantic-surface-base);
        --dialog-background-color-footer: var(--pc-semantic-surface-base);
        --dialog-background-color-header: var(--pc-semantic-surface-base);
        --dialog-background-header: none;
        --dialog-border-color: var(--pc-semantic-border-default);
        --dialog-border-radius: 18px;
        --dialog-border-width: 1px;
        --dialog-box-shadow: var(--pc-semantic-shadow-lg);
        --dialog-color: var(--pc-semantic-text-primary);
        --dialog-height: fit-content;
        --dialog-height-body: auto;
        --dialog-max-height: calc(100vh - 4rem);
        --dialog-max-height-body: none;
        --dialog-max-width: calc(100vw - 4rem);
        --dialog-max-width-body: none;
        --dialog-min-height: 0px;
        --dialog-min-height-body: 0px;
        --dialog-min-width: 0px;
        --dialog-min-width-body: 0px;
        --dialog-width: fit-content;
        --dialog-width-body: auto;

        background-color: var(--dialog-background-color);
        border: var(--dialog-border-width) solid var(--dialog-border-color);
        border-radius: var(--dialog-border-radius);
        box-shadow: var(--dialog-box-shadow);
        color: var(--dialog-color);
        display: flex;
        flex-direction: column;
        height: var(--dialog-height);
        left: 50%;
        max-height: var(--dialog-max-height);
        max-width: var(--dialog-max-width);
        min-height: var(--dialog-min-height);
        min-width: var(--dialog-min-width);
        overflow: hidden;
        padding: 0;
        position: fixed;
        top: 50%;
        transform: translate(-50%, -50%);
        width: var(--dialog-width);
        z-index: 50;
      }

      .dialog::backdrop {
        backdrop-filter: blur(4px);
        background-color: var(--dialog-background-color-backdrop);
      }

      .dialog > .dialog-body {
        background-color: var(--dialog-background-color-body);
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 1rem;
        height: var(--dialog-height-body);
        max-height: var(--dialog-max-height-body);
        max-width: var(--dialog-max-width-body);
        min-height: var(--dialog-min-height-body);
        min-width: var(--dialog-min-width-body);
        overflow-y: auto;
        overscroll-behavior: contain;
        padding: 1.25rem 1.5rem;
        width: var(--dialog-width-body);
      }

      .dialog > .dialog-body:empty {
        padding: 0px;
      }

      .dialog > .dialog-body.dialog-body-first {
        border-top-left-radius: var(--dialog-border-radius);
        border-top-right-radius: var(--dialog-border-radius);
      }

      .dialog > .dialog-body.dialog-body-last {
        border-bottom-left-radius: var(--dialog-border-radius);
        border-bottom-right-radius: var(--dialog-border-radius);
      }

      .dialog > .dialog-footer {
        background-color: var(--dialog-background-color-footer);
        border-top: var(--dialog-border-width) solid var(--dialog-border-color);
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        padding: 1rem 1.5rem;
        z-index: 51;
      }

      .dialog > .dialog-footer:empty {
        border-top: none;
        padding: 0px;
      }

      .dialog > .dialog-footer.dialog-footer-first {
        border-top-left-radius: var(--dialog-border-radius);
        border-top-right-radius: var(--dialog-border-radius);
      }

      .dialog > .dialog-footer.dialog-footer-last {
        border-bottom-left-radius: var(--dialog-border-radius);
        border-bottom-right-radius: var(--dialog-border-radius);
      }

      .dialog > .dialog-header {
        background: var(--dialog-background-header);
        background-color: var(--dialog-background-color-header);
        border-bottom: var(--dialog-border-width) solid var(--dialog-border-color);
        display: flex;
        gap: 1rem;
        padding: 1.25rem 1.5rem;
        z-index: 51;
      }

      .dialog > .dialog-header:empty {
        border-bottom: none;
        padding: 0px;
      }

      .dialog > .dialog-header.dialog-header-first {
        border-top-left-radius: var(--dialog-border-radius);
        border-top-right-radius: var(--dialog-border-radius);
      }

      .dialog > .dialog-header.dialog-header-last {
        border-bottom-left-radius: var(--dialog-border-radius);
        border-bottom-right-radius: var(--dialog-border-radius);
      }
`;
      }
    },
    exportHTML: (dialog, dialogSchema, pageSchema, indentation) => {
      const bodyHTML = dialog?.slots?.body || "";
      const footerHTML = dialog?.slots?.footer || "";
      const headerHTML = dialog?.slots?.header || "";

      const hasBody = !!bodyHTML.trim();
      const hasFooter = !!footerHTML.trim();
      const hasHeader = !!headerHTML.trim();

      const isHeaderFirst = hasHeader;
      const isHeaderLast = hasHeader && !hasBody && !hasFooter;

      const isBodyFirst = !hasHeader && hasBody;
      const isBodyLast = hasBody && !hasFooter;

      const isFooterFirst = !hasHeader && !hasBody && hasFooter;
      const isFooterLast = hasFooter;

      return `${indentation}<dialog class="dialog ${dialog?.id}" data-pc-id="${dialog?.id || ""}">${hasHeader ? `\n${indentation + "  "}<header class="dialog-header${isHeaderFirst ? " dialog-header-first" : ""}${isHeaderLast ? " dialog-header-last" : ""}">\n` + headerHTML + `\n${indentation + "  "}</header>` : ""}${hasBody ? `\n${indentation + "  "}<section class="dialog-body${isBodyFirst ? " dialog-body-first" : ""}${isBodyLast ? " dialog-body-last" : ""}">\n` + bodyHTML + `\n${indentation + "  "}</section>` : ""}${hasFooter ? `\n${indentation + "  "}<footer class="dialog-footer${isFooterFirst ? " dialog-footer-first" : ""}${isFooterLast ? " dialog-footer-last" : ""}">\n` + footerHTML + `\n${indentation + "  "}</footer>` : ""}\n${indentation}</dialog>`;
    },
    isAllowingChildComponents: true,
    label: "Dialog",
    plan: "Personal",
    props: {
      width: {
        cssProperty: "width",
        cssVariableName: "--dialog-width",
        defaultValue: "fit-content",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minWidth: {
        cssProperty: "min-width",
        cssVariableName: "--dialog-min-width",
        defaultValue: "0px",
        label: "Minimum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxWidth: {
        cssProperty: "max-width",
        cssVariableName: "--dialog-max-width",
        defaultValue: "calc(100vw - 4rem)",
        label: "Maximum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--dialog-height",
        defaultValue: "fit-content",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minHeight: {
        cssProperty: "min-height",
        cssVariableName: "--dialog-min-height",
        defaultValue: "0px",
        label: "Minimum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxHeight: {
        cssProperty: "max-height",
        cssVariableName: "--dialog-max-height",
        defaultValue: "calc(100vh - 4rem)",
        label: "Maximum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      widthBody: {
        cssProperty: "width",
        cssVariableName: "--dialog-width-body",
        defaultValue: "auto",
        label: "Width - Body",
        role: "layout",
        roleGroup: "Body",
        schemaType: "string",
        type: "text",
      },
      minWidthBody: {
        cssProperty: "min-width",
        cssVariableName: "--dialog-min-width-body",
        defaultValue: "0px",
        label: "Minimum width - Body",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxWidthBody: {
        cssProperty: "max-width",
        cssVariableName: "--dialog-max-width-body",
        defaultValue: "none",
        label: "Maximum width - Body",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      heightBody: {
        cssProperty: "height",
        cssVariableName: "--dialog-height-body",
        defaultValue: "auto",
        label: "Height - Body",
        role: "layout",
        roleGroup: "Body",
        schemaType: "string",
        type: "text",
      },
      minHeightBody: {
        cssProperty: "min-height",
        cssVariableName: "--dialog-min-height-body",
        defaultValue: "0px",
        label: "Minimum height - Body",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxHeightBody: {
        cssProperty: "max-height",
        cssVariableName: "--dialog-max-height-body",
        defaultValue: "none",
        label: "Maximum height - Body",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--dialog-background-color",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--dialog-color",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backgroundColorHeader: {
        cssProperty: "background-color",
        cssVariableName: "--dialog-background-color-header",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color - Header",
        role: "styling",
        roleGroup: "Header",
        schemaType: "string",
        type: "color",
      },
      backgroundHeader: {
        cssProperty: "background",
        cssVariableName: "--dialog-background-header",
        defaultValue: "none",
        label: "Background - Header",
        role: "styling",
        roleGroup: "Header",
        schemaType: "string",
        type: "color",
      },
      backgroundColorBody: {
        cssProperty: "background-color",
        cssVariableName: "--dialog-background-color-body",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color - Body",
        role: "styling",
        roleGroup: "Body",
        schemaType: "string",
        type: "color",
      },
      backgroundColorFooter: {
        cssProperty: "background-color",
        cssVariableName: "--dialog-background-color-footer",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color - Footer",
        role: "styling",
        roleGroup: "Footer",
        schemaType: "string",
        type: "color",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--dialog-border-width",
        defaultValue: "1px",
        label: "Border width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--dialog-border-color",
        defaultValue: "var(--pc-semantic-border-default)",
        label: "Border color",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderColorHover: {
        cssProperty: "border-color",
        cssVariableName: "--card-border-color-hover",
        defaultValue: "#e5e7eb",
        label: "Border color - Hover",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--dialog-border-radius",
        defaultValue: "18px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      backgroundColorBackdrop: {
        cssProperty: "background-color",
        cssVariableName: "--dialog-background-color-backdrop",
        defaultValue: "var(--pc-semantic-backdrop)",
        label: "Background color - Backdrop",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "color",
      },
      boxShadow: {
        cssProperty: "box-shadow",
        cssVariableName: "--dialog-box-shadow",
        defaultValue: "var(--pc-semantic-shadow-lg)",
        label: "Box shadow",
        role: "styling",
        roleGroup: "Effects",
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
        allowedChildComponents: ["Button", "Divider", "Element", "Grid", "Heading", "Image", "List", "Section", "Spacer", "Spinner", "Table", "Text"],
      },
      footer: {
        allowedChildComponents: ["Badge", "Button", "Element", "Spacer", "Spinner"],
      },
      header: {
        allowedChildComponents: ["Badge", "Element", "Heading", "Image", "Spacer", "Spinner"],
      },
    },
  };
}
