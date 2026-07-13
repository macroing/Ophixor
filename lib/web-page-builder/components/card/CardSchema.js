// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createCardSchema() {
  return {
    defaultSlots: {
      body: [
        {
          props: {
            level: "3",
            text: "Lorem ipsum dolor sit amet",
          },
          slots: {},
          type: "Heading",
        },
        {
          props: {
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultrices ex eget lacus maximus tristique. Ut posuere, libero non ultricies eleifend, lectus ex condimentum augue, et euismod metus magna non enim. Aenean posuere tellus nec leo malesuada, consequat malesuada dui consectetur. Vestibulum eu tincidunt lorem. Vivamus ultricies porta ex, id efficitur sem tempus congue. Vivamus sodales odio nunc, sit amet rhoncus sapien bibendum ut. Sed et libero tincidunt, dignissim lacus sed, porttitor mi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum venenatis viverra magna, quis feugiat nunc vehicula non. Ut sollicitudin mauris ac magna eleifend congue.",
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
      header: [],
    },
    description: "A card that contains three optional slots; a header, a body and a footer.",
    editor: {
      defaultOpenGroups: {
        layout: ["Size", "Container"],
        selectors: [],
        styling: [],
        visibility: [],
      },
      roleGroupOrder: {
        layout: ["Size", "Container", "Header", "Body", "Footer", "Overlay"],
        selectors: ["Selectors"],
        styling: ["Surface", "Header", "Body", "Footer", "Border", "Effects", "Overlay"],
        visibility: ["Visibility"],
      },
      roleOrder: ["layout", "styling", "visibility", "selectors"],
    },
    exportCSS: (card = null, cardSchema = null) => {
      if (card && cardSchema) {
        const props = exportCSSFromProps(card, cardSchema);

        if (props.length > 0) {
          return `
      .${card.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .card {
        --card-align-items: stretch;
        --card-align-items-body: stretch;
        --card-align-items-footer: center;
        --card-align-items-header: center;
        --card-aspect-ratio: auto;
        --card-backdrop-filter: none;
        --card-background: none;
        --card-background-before: none;
        --card-background-blend-mode: normal;
        --card-background-color: var(--pc-semantic-surface-base);
        --card-background-color-body: var(--pc-semantic-surface-base);
        --card-background-color-body-hover: var(--pc-semantic-surface-base);
        --card-background-color-footer: var(--pc-semantic-surface-base);
        --card-background-color-footer-hover: var(--pc-semantic-surface-base);
        --card-background-color-header: var(--pc-semantic-surface-base);
        --card-background-color-header-hover: var(--pc-semantic-surface-base);
        --card-background-color-hover: var(--pc-semantic-surface-base);
        --card-background-image: none;
        --card-background-position: center;
        --card-background-repeat: repeat;
        --card-background-size: auto;
        --card-border-color: var(--pc-semantic-border-default);
        --card-border-color-hover: var(--pc-semantic-border-default);
        --card-border-radius: 14px;
        --card-border-width: 1px;
        --card-border-bottom-width: var(--card-border-width);
        --card-border-left-width: var(--card-border-width);
        --card-border-right-width: var(--card-border-width);
        --card-border-top-width: var(--card-border-width);
        --card-bottom: auto;
        --card-box-shadow: var(--pc-semantic-shadow-sm);
        --card-box-shadow-hover: var(--pc-semantic-shadow-sm);
        --card-color: var(--pc-semantic-text-primary);
        --card-color-hover: var(--pc-semantic-text-primary);
        --card-cursor: auto;
        --card-filter: none;
        --card-flex-direction: column;
        --card-flex-direction-body: column;
        --card-flex-direction-footer: row;
        --card-flex-direction-header: row;
        --card-flex-grow: 1;
        --card-flex-grow-body: 1;
        --card-flex-grow-footer: 0;
        --card-flex-grow-header: 0;
        --card-gap-body: 1rem;
        --card-gap-footer: 1rem;
        --card-gap-header: 1rem;
        --card-height: auto;
        --card-height-body: auto;
        --card-height-footer: auto;
        --card-height-header: auto;
        --card-inset-before: 0;
        --card-justify-content: stretch;
        --card-justify-content-body: stretch;
        --card-justify-content-footer: stretch;
        --card-justify-content-header: stretch;
        --card-left: auto;
        --card-mask-before: none;
        --card-mask-composite-before: add;
        --card-max-height: none;
        --card-max-width: none;
        --card-min-height: 0px;
        --card-min-width: 0px;
        --card-opacity: 1;
        --card-outline: none;
        --card-outline-offset: 0;
        --card-overflow: visible;
        --card-overflow-x: visible;
        --card-overflow-y: visible;
        --card-padding-before: 0px;
        --card-padding-body: 2rem;
        --card-padding-footer: 2rem;
        --card-padding-header: 2rem;
        --card-position: relative;
        --card-right: auto;
        --card-text-align: left;
        --card-top: auto;
        --card-transform: none;
        --card-transform-hover: none;
        --card-transform-origin: center;
        --card-transition: none;
        --card-width: auto;
        --card-width-body: auto;
        --card-width-footer: auto;
        --card-width-header: auto;
        --card-z-index: auto;

        align-items: var(--card-align-items);
        aspect-ratio: var(--card-aspect-ratio);
        backdrop-filter: var(--card-backdrop-filter);
        background: var(--card-background);
        background-blend-mode: var(--card-background-blend-mode);
        background-color: var(--card-background-color);
        background-image: var(--card-background-image);
        background-position: var(--card-background-position);
        background-repeat: var(--card-background-repeat);
        background-size: var(--card-background-size);
        border: var(--card-border-width) solid var(--card-border-color);
        border-bottom-width: var(--card-border-bottom-width);
        border-left-width: var(--card-border-left-width);
        border-radius: var(--card-border-radius);
        border-right-width: var(--card-border-right-width);
        border-top-width: var(--card-border-top-width);
        bottom: var(--card-bottom);
        box-shadow: var(--card-box-shadow);
        color: var(--card-color);
        cursor: var(--card-cursor);
        display: flex;
        filter: var(--card-filter);
        flex-direction: var(--card-flex-direction);
        flex-grow: var(--card-flex-grow);
        height: var(--card-height);
        justify-content: var(--card-justify-content);
        left: var(--card-left);
        max-height: var(--card-max-height);
        max-width: var(--card-max-width);
        min-height: var(--card-min-height);
        min-width: var(--card-min-width);
        opacity: var(--card-opacity);
        outline: var(--card-outline);
        outline-offset: var(--card-outline-offset);
        overflow: var(--card-overflow);
        overflow-x: var(--card-overflow-x);
        overflow-y: var(--card-overflow-y);
        position: var(--card-position);
        right: var(--card-right);
        text-align: var(--card-text-align);
        top: var(--card-top);
        transform: var(--card-transform);
        transform-origin: var(--card-transform-origin);
        transition: var(--card-transition);
        width: var(--card-width);
        z-index: var(--card-z-index);
      }

      .card::before {
        background: var(--card-background-before);
        border-radius: inherit;
        content: "";
        inset: var(--card-inset-before);
        mask: var(--card-mask-before);
        mask-composite: var(--card-mask-composite-before);
        padding: var(--card-padding-before);
        position: absolute;

        -webkit-mask: var(--card-mask-before);
        -webkit-mask-composite: xor;
      }

      .card:hover {
        background-color: var(--card-background-color-hover);
        border-color: var(--card-border-color-hover);
        box-shadow: var(--card-box-shadow-hover);
        color: var(--card-color-hover);
        transform: var(--card-transform-hover);
      }

      .card > .card-body {
        align-items: var(--card-align-items-body);
        background-color: var(--card-background-color-body);
        display: flex;
        flex-direction: var(--card-flex-direction-body);
        flex-grow: var(--card-flex-grow-body);
        gap: var(--card-gap-body);
        height: var(--card-height-body);
        justify-content: var(--card-justify-content-body);
        padding: var(--card-padding-body);
        width: var(--card-width-body);
      }

      .card:hover > .card-body {
        background-color: var(--card-background-color-body-hover);
      }

      .card > .card-body:empty {
        padding: 0px;
      }

      .card > .card-body:first-child:not(.card-body-first) {
        background-color: transparent;
        border-top-left-radius: var(--card-border-radius);
        border-top-right-radius: var(--card-border-radius);
      }

      .card > .card-body:last-child:not(.card-body-last) {
        background-color: transparent;
        border-bottom-left-radius: var(--card-border-radius);
        border-bottom-right-radius: var(--card-border-radius);
      }

      .card > .card-body.card-body-first {
        border-top-left-radius: var(--card-border-radius);
        border-top-right-radius: var(--card-border-radius);
      }

      .card > .card-body.card-body-last {
        border-bottom-left-radius: var(--card-border-radius);
        border-bottom-right-radius: var(--card-border-radius);
      }

      .card > .card-footer {
        align-items: var(--card-justify-content-footer);
        background-color: var(--card-background-color-footer);
        border-top: 1px solid var(--card-border-color);
        display: flex;
        flex-direction: var(--card-flex-direction-footer);
        flex-grow: var(--card-flex-grow-footer);
        flex-wrap: wrap;
        gap: var(--card-gap-footer);
        height: var(--card-height-footer);
        justify-content: var(--card-justify-content-footer);
        padding: var(--card-padding-footer);
        width: var(--card-width-footer);
      }

      .card:hover > .card-footer {
        background-color: var(--card-background-color-footer-hover);
        border-top-color: var(--card-border-color-hover);
      }

      .card > .card-footer:empty {
        border-top: none;
        padding: 0px;
      }

      .card > .card-footer:first-child:not(.card-footer-first) {
        background-color: transparent;
        border-top-left-radius: var(--card-border-radius);
        border-top-right-radius: var(--card-border-radius);
      }

      .card > .card-footer:last-child:not(.card-footer-last) {
        background-color: transparent;
        border-bottom-left-radius: var(--card-border-radius);
        border-bottom-right-radius: var(--card-border-radius);
      }

      .card > .card-footer.card-footer-first {
        border-top-left-radius: var(--card-border-radius);
        border-top-right-radius: var(--card-border-radius);
      }

      .card > .card-footer.card-footer-last {
        border-bottom-left-radius: var(--card-border-radius);
        border-bottom-right-radius: var(--card-border-radius);
      }

      .card > .card-header {
        align-items: var(--card-align-items-header);
        background-color: var(--card-background-color-header);
        border-bottom: 1px solid var(--card-border-color);
        display: flex;
        flex-direction: var(--card-flex-direction-header);
        flex-grow: var(--card-flex-grow-header);
        flex-wrap: wrap;
        gap: var(--card-gap-header);
        height: var(--card-height-header);
        justify-content: var(--card-justify-content-header);
        padding: var(--card-padding-header);
        width: var(--card-width-header);
      }

      .card:hover > .card-header {
        background-color: var(--card-background-color-header-hover);
        border-bottom-color: var(--card-border-color-hover);
      }

      .card > .card-header:empty {
        border-bottom: none;
        padding: 0px;
      }

      .card > .card-header:first-child:not(.card-header-first) {
        background-color: transparent;
        border-top-left-radius: var(--card-border-radius);
        border-top-right-radius: var(--card-border-radius);
      }

      .card > .card-header:last-child:not(.card-header-last) {
        background-color: transparent;
        border-bottom-left-radius: var(--card-border-radius);
        border-bottom-right-radius: var(--card-border-radius);
      }

      .card > .card-header.card-header-first {
        border-top-left-radius: var(--card-border-radius);
        border-top-right-radius: var(--card-border-radius);
      }

      .card > .card-header.card-header-last {
        border-bottom-left-radius: var(--card-border-radius);
        border-bottom-right-radius: var(--card-border-radius);
      }
`;
      }
    },
    exportHTML: (card, cardSchema, pageSchema, indentation) => {
      const element = card?.props?.element === "article" || card?.props?.element === "div" || card?.props?.element === "form" || card?.props?.element === "section" ? card.props.element : "div";

      const bodyHTML = card?.slots?.body || "";
      const footerHTML = card?.slots?.footer || "";
      const headerHTML = card?.slots?.header || "";

      const hasBody = !!bodyHTML.trim();
      const hasFooter = !!footerHTML.trim();
      const hasHeader = !!headerHTML.trim();

      const isHeaderFirst = hasHeader;
      const isHeaderLast = hasHeader && !hasBody && !hasFooter;

      const isBodyFirst = !hasHeader && hasBody;
      const isBodyLast = hasBody && !hasFooter;

      const isFooterFirst = !hasHeader && !hasBody && hasFooter;
      const isFooterLast = hasFooter;

      if (typeof card?.props?.isVisible === "boolean" && !card.props.isVisible) {
        return "";
      }

      return `${indentation}<${element} class="card ${card?.id}" data-pc-id="${card?.id || ""}">${hasHeader ? `\n${indentation + "  "}<div class="card-header${isHeaderFirst ? " card-header-first" : ""}${isHeaderLast ? " card-header-last" : ""}">\n` + headerHTML + `${indentation + "  "}</div>` : ""}${hasBody ? `\n${indentation + "  "}<div class="card-body${isBodyFirst ? " card-body-first" : ""}${isBodyLast ? " card-body-last" : ""}">\n` + bodyHTML + `${indentation + "  "}</div>` : ""}${hasFooter ? `\n${indentation + "  "}<div class="card-footer${isFooterFirst ? " card-footer-first" : ""}${isFooterLast ? " card-footer-last" : ""}">\n` + footerHTML + `${indentation + "  "}</div>` : ""}\n${indentation}</${element}>`;
    },
    isAllowingChildComponents: true,
    label: "Card",
    plan: "Personal",
    props: {
      width: {
        cssProperty: "width",
        cssVariableName: "--card-width",
        defaultValue: "auto",
        label: "Width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minWidth: {
        cssProperty: "min-width",
        cssVariableName: "--card-min-width",
        defaultValue: "0px",
        label: "Minimum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxWidth: {
        cssProperty: "max-width",
        cssVariableName: "--card-max-width",
        defaultValue: "none",
        label: "Maximum width",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      height: {
        cssProperty: "height",
        cssVariableName: "--card-height",
        defaultValue: "auto",
        label: "Height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      minHeight: {
        cssProperty: "min-height",
        cssVariableName: "--card-min-height",
        defaultValue: "0px",
        label: "Minimum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      maxHeight: {
        cssProperty: "max-height",
        cssVariableName: "--card-max-height",
        defaultValue: "none",
        label: "Maximum height",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      overflow: {
        cssProperty: "overflow",
        cssVariableName: "--card-overflow",
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
      overflowX: {
        cssProperty: "overflow-x",
        cssVariableName: "--card-overflow-x",
        defaultValue: "visible",
        label: "Overflow X",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      overflowY: {
        cssProperty: "overflow-y",
        cssVariableName: "--card-overflow-y",
        defaultValue: "visible",
        label: "Overflow Y",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      aspectRatio: {
        cssProperty: "aspect-ratio",
        cssVariableName: "--card-aspect-ratio",
        defaultValue: "auto",
        label: "Aspect ratio",
        role: "layout",
        roleGroup: "Size",
        schemaType: "string",
        type: "text",
      },
      flexDirection: {
        cssProperty: "flex-direction",
        cssVariableName: "--card-flex-direction",
        defaultValue: "column",
        label: "Flexbox direction",
        options: [
          { label: "Row", value: "row" },
          { label: "Column", value: "column" },
        ],
        role: "layout",
        roleGroup: "Container",
        schemaType: "enum<string>",
        type: "select",
      },
      alignItems: {
        cssProperty: "align-items",
        cssVariableName: "--card-align-items",
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
        roleGroup: "Container",
        schemaType: "enum<string>",
        type: "select",
      },
      justifyContent: {
        cssProperty: "justify-content",
        cssVariableName: "--card-justify-content",
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
        roleGroup: "Container",
        schemaType: "enum<string>",
        type: "select",
      },
      flexGrow: {
        cssProperty: "flex-grow",
        cssVariableName: "--card-flex-grow",
        defaultValue: "1",
        label: "Flexbox grow",
        role: "layout",
        roleGroup: "Container",
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
          { label: "Form element", value: "form" },
          { label: "Section element", value: "section" },
          { label: "Article element", value: "article" },
        ],
        role: "layout",
        roleGroup: "Container",
        schemaType: "enum<string>",
        type: "select",
      },
      position: {
        cssProperty: "position",
        cssVariableName: "--card-position",
        defaultValue: "relative",
        label: "Position",
        options: [
          { label: "Relative", value: "relative" },
          { label: "Absolute", value: "absolute" },
          { label: "Fixed", value: "fixed" },
          { label: "Sticky", value: "sticky" },
        ],
        role: "layout",
        roleGroup: "Container",
        schemaType: "enum<string>",
        type: "select",
      },
      top: {
        cssProperty: "top",
        cssVariableName: "--card-top",
        defaultValue: "auto",
        label: "Top",
        role: "layout",
        roleGroup: "Container",
        schemaType: "string",
        type: "text",
      },
      right: {
        cssProperty: "right",
        cssVariableName: "--card-right",
        defaultValue: "auto",
        label: "Right",
        role: "layout",
        roleGroup: "Container",
        schemaType: "string",
        type: "text",
      },
      bottom: {
        cssProperty: "bottom",
        cssVariableName: "--card-bottom",
        defaultValue: "auto",
        label: "Bottom",
        role: "layout",
        roleGroup: "Container",
        schemaType: "string",
        type: "text",
      },
      left: {
        cssProperty: "left",
        cssVariableName: "--card-left",
        defaultValue: "auto",
        label: "Left",
        role: "layout",
        roleGroup: "Container",
        schemaType: "string",
        type: "text",
      },
      zIndex: {
        cssProperty: "z-index",
        cssVariableName: "--card-z-index",
        defaultValue: "auto",
        label: "Z-index",
        role: "layout",
        roleGroup: "Container",
        schemaType: "string",
        type: "text",
      },
      transform: {
        cssProperty: "transform",
        cssVariableName: "--card-transform",
        defaultValue: "none",
        label: "Transform",
        role: "layout",
        roleGroup: "Container",
        schemaType: "string",
        type: "text",
      },
      transformOrigin: {
        cssProperty: "transform-origin",
        cssVariableName: "--card-transform-origin",
        defaultValue: "center",
        label: "Transform origin",
        role: "layout",
        roleGroup: "Container",
        schemaType: "string",
        type: "text",
      },
      textAlign: {
        cssProperty: "text-align",
        cssVariableName: "--card-text-align",
        defaultValue: "left",
        label: "Text align",
        options: [
          { label: "Center", value: "center" },
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
          { label: "Justify", value: "justify" },
        ],
        role: "layout",
        roleGroup: "Container",
        schemaType: "enum<string>",
        type: "select",
      },
      widthHeader: {
        cssProperty: "width",
        cssVariableName: "--card-width-header",
        defaultValue: "auto",
        label: "Width - Header",
        role: "layout",
        roleGroup: "Header",
        schemaType: "string",
        type: "text",
      },
      heightHeader: {
        cssProperty: "height",
        cssVariableName: "--card-height-header",
        defaultValue: "auto",
        label: "Height - Header",
        role: "layout",
        roleGroup: "Header",
        schemaType: "string",
        type: "text",
      },
      flexDirectionHeader: {
        cssProperty: "flex-direction",
        cssVariableName: "--card-flex-direction-header",
        defaultValue: "row",
        label: "Flexbox direction - Header",
        options: [
          { label: "Row", value: "row" },
          { label: "Column", value: "column" },
        ],
        role: "layout",
        roleGroup: "Header",
        schemaType: "enum<string>",
        type: "select",
      },
      alignItemsHeader: {
        cssProperty: "align-items",
        cssVariableName: "--card-align-items-header",
        defaultValue: "center",
        label: "Align items - Header",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Stretch", value: "stretch" },
          { label: "Center", value: "center" },
          { label: "Flexbox start", value: "flex-start" },
          { label: "Flexbox end", value: "flex-end" },
        ],
        role: "layout",
        roleGroup: "Header",
        schemaType: "enum<string>",
        type: "select",
      },
      justifyContentHeader: {
        cssProperty: "justify-content",
        cssVariableName: "--card-justify-content-header",
        defaultValue: "stretch",
        label: "Justify content - Header",
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
        roleGroup: "Header",
        schemaType: "enum<string>",
        type: "select",
      },
      flexGrowHeader: {
        cssProperty: "flex-grow",
        cssVariableName: "--card-flex-grow-header",
        defaultValue: "0",
        label: "Flexbox grow - Header",
        role: "layout",
        roleGroup: "Header",
        schemaType: "string",
        type: "text",
      },
      gapHeader: {
        cssProperty: "gap",
        cssVariableName: "--card-gap-header",
        defaultValue: "1rem",
        label: "Gap - Header",
        role: "layout",
        roleGroup: "Header",
        schemaType: "string",
        type: "text",
      },
      paddingHeader: {
        cssProperty: "padding",
        cssVariableName: "--card-padding-header",
        defaultValue: "2rem",
        label: "Padding - Header",
        role: "layout",
        roleGroup: "Header",
        schemaType: "string",
        type: "text",
      },
      widthBody: {
        cssProperty: "width",
        cssVariableName: "--card-width-body",
        defaultValue: "auto",
        label: "Width - Body",
        role: "layout",
        roleGroup: "Body",
        schemaType: "string",
        type: "text",
      },
      heightBody: {
        cssProperty: "height",
        cssVariableName: "--card-height-body",
        defaultValue: "auto",
        label: "Height - Body",
        role: "layout",
        roleGroup: "Body",
        schemaType: "string",
        type: "text",
      },
      flexDirectionBody: {
        cssProperty: "flex-direction",
        cssVariableName: "--card-flex-direction-body",
        defaultValue: "column",
        label: "Flexbox direction - Body",
        options: [
          { label: "Row", value: "row" },
          { label: "Column", value: "column" },
        ],
        role: "layout",
        roleGroup: "Body",
        schemaType: "enum<string>",
        type: "select",
      },
      alignItemsBody: {
        cssProperty: "align-items",
        cssVariableName: "--card-align-items-body",
        defaultValue: "stretch",
        label: "Align items - Body",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Stretch", value: "stretch" },
          { label: "Center", value: "center" },
          { label: "Flexbox start", value: "flex-start" },
          { label: "Flexbox end", value: "flex-end" },
        ],
        role: "layout",
        roleGroup: "Body",
        schemaType: "enum<string>",
        type: "select",
      },
      justifyContentBody: {
        cssProperty: "justify-content",
        cssVariableName: "--card-justify-content-body",
        defaultValue: "stretch",
        label: "Justify content - Body",
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
        roleGroup: "Body",
        schemaType: "enum<string>",
        type: "select",
      },
      flexGrowBody: {
        cssProperty: "flex-grow",
        cssVariableName: "--card-flex-grow-body",
        defaultValue: "1",
        label: "Flexbox grow - Body",
        role: "layout",
        roleGroup: "Body",
        schemaType: "string",
        type: "text",
      },
      gapBody: {
        cssProperty: "gap",
        cssVariableName: "--card-gap-body",
        defaultValue: "1rem",
        label: "Gap - Body",
        role: "layout",
        roleGroup: "Body",
        schemaType: "string",
        type: "text",
      },
      paddingBody: {
        cssProperty: "padding",
        cssVariableName: "--card-padding-body",
        defaultValue: "2rem",
        label: "Padding - Body",
        role: "layout",
        roleGroup: "Body",
        schemaType: "string",
        type: "text",
      },
      widthFooter: {
        cssProperty: "width",
        cssVariableName: "--card-width-footer",
        defaultValue: "auto",
        label: "Width - Footer",
        role: "layout",
        roleGroup: "Footer",
        schemaType: "string",
        type: "text",
      },
      heightFooter: {
        cssProperty: "height",
        cssVariableName: "--card-height-footer",
        defaultValue: "auto",
        label: "Height - Footer",
        role: "layout",
        roleGroup: "Footer",
        schemaType: "string",
        type: "text",
      },
      flexDirectionFooter: {
        cssProperty: "flex-direction",
        cssVariableName: "--card-flex-direction-footer",
        defaultValue: "row",
        label: "Flexbox direction - Footer",
        options: [
          { label: "Row", value: "row" },
          { label: "Column", value: "column" },
        ],
        role: "layout",
        roleGroup: "Footer",
        schemaType: "enum<string>",
        type: "select",
      },
      alignItemsFooter: {
        cssProperty: "align-items",
        cssVariableName: "--card-align-items-footer",
        defaultValue: "center",
        label: "Align items - Footer",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Stretch", value: "stretch" },
          { label: "Center", value: "center" },
          { label: "Flexbox start", value: "flex-start" },
          { label: "Flexbox end", value: "flex-end" },
        ],
        role: "layout",
        roleGroup: "Footer",
        schemaType: "enum<string>",
        type: "select",
      },
      justifyContentFooter: {
        cssProperty: "justify-content",
        cssVariableName: "--card-justify-content-footer",
        defaultValue: "stretch",
        label: "Justify content - Footer",
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
        roleGroup: "Footer",
        schemaType: "enum<string>",
        type: "select",
      },
      flexGrowFooter: {
        cssProperty: "flex-grow",
        cssVariableName: "--card-flex-grow-footer",
        defaultValue: "0",
        label: "Flexbox grow - Footer",
        role: "layout",
        roleGroup: "Footer",
        schemaType: "string",
        type: "text",
      },
      gapFooter: {
        cssProperty: "gap",
        cssVariableName: "--card-gap-footer",
        defaultValue: "1rem",
        label: "Gap - Footer",
        role: "layout",
        roleGroup: "Footer",
        schemaType: "string",
        type: "text",
      },
      paddingFooter: {
        cssProperty: "padding",
        cssVariableName: "--card-padding-footer",
        defaultValue: "2rem",
        label: "Padding - Footer",
        role: "layout",
        roleGroup: "Footer",
        schemaType: "string",
        type: "text",
      },
      paddingBefore: {
        cssProperty: "padding",
        cssVariableName: "--card-padding-before",
        defaultValue: "0px",
        label: "Padding - Before",
        role: "layout",
        roleGroup: "Overlay",
        schemaType: "string",
        type: "text",
      },
      insetBefore: {
        cssProperty: "inset",
        cssVariableName: "--card-inset-before",
        defaultValue: "0",
        label: "Inset",
        role: "layout",
        roleGroup: "Overlay",
        schemaType: "string",
        type: "text",
      },
      background: {
        cssProperty: "background",
        cssVariableName: "--card-background",
        defaultValue: "none",
        label: "Background",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--card-background-color",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backgroundColorHover: {
        cssProperty: "background-color",
        cssVariableName: "--card-background-color-hover",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color - Hover",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--card-color",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      colorHover: {
        cssProperty: "color",
        cssVariableName: "--card-color-hover",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color - Hover",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      cursor: {
        cssProperty: "cursor",
        cssVariableName: "--card-cursor",
        defaultValue: "auto",
        label: "Cursor",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundImage: {
        cssProperty: "background-image",
        cssVariableName: "--card-background-image",
        defaultValue: "none",
        label: "Background image",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundSize: {
        cssProperty: "background-size",
        cssVariableName: "--card-background-size",
        defaultValue: "auto",
        label: "Background size",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundPosition: {
        cssProperty: "background-position",
        cssVariableName: "--card-background-position",
        defaultValue: "center",
        label: "Background position",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundRepeat: {
        cssProperty: "background-repeat",
        cssVariableName: "--card-background-repeat",
        defaultValue: "repeat",
        label: "Background repeat",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundBlendMode: {
        cssProperty: "background-blend-mode",
        cssVariableName: "--card-background-blend-mode",
        defaultValue: "normal",
        label: "Background blend mode",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backgroundColorHeader: {
        cssProperty: "background-color",
        cssVariableName: "--card-background-color-header",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color - Header",
        role: "styling",
        roleGroup: "Header",
        schemaType: "string",
        type: "color",
      },
      backgroundColorHeaderHover: {
        cssProperty: "background-color",
        cssVariableName: "--card-background-color-header-hover",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color - Header - Hover",
        role: "styling",
        roleGroup: "Header",
        schemaType: "string",
        type: "color",
      },
      backgroundColorBody: {
        cssProperty: "background-color",
        cssVariableName: "--card-background-color-body",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color - Body",
        role: "styling",
        roleGroup: "Body",
        schemaType: "string",
        type: "color",
      },
      backgroundColorBodyHover: {
        cssProperty: "background-color",
        cssVariableName: "--card-background-color-body-hover",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color - Body - Hover",
        role: "styling",
        roleGroup: "Body",
        schemaType: "string",
        type: "color",
      },
      backgroundColorFooter: {
        cssProperty: "background-color",
        cssVariableName: "--card-background-color-footer",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color - Footer",
        role: "styling",
        roleGroup: "Footer",
        schemaType: "string",
        type: "color",
      },
      backgroundColorFooterHover: {
        cssProperty: "background-color",
        cssVariableName: "--card-background-color-footer-hover",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color - Footer - Hover",
        role: "styling",
        roleGroup: "Footer",
        schemaType: "string",
        type: "color",
      },
      borderWidth: {
        cssProperty: "border-width",
        cssVariableName: "--card-border-width",
        defaultValue: "1px",
        label: "Border width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderTopWidth: {
        cssProperty: "border-top-width",
        cssVariableName: "--card-border-top-width",
        defaultValue: "1px",
        label: "Border top width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderRightWidth: {
        cssProperty: "border-right-width",
        cssVariableName: "--card-border-right-width",
        defaultValue: "1px",
        label: "Border right width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderBottomWidth: {
        cssProperty: "border-bottom-width",
        cssVariableName: "--card-border-bottom-width",
        defaultValue: "1px",
        label: "Border bottom width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderLeftWidth: {
        cssProperty: "border-left-width",
        cssVariableName: "--card-border-left-width",
        defaultValue: "1px",
        label: "Border left width",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--card-border-color",
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
        defaultValue: "var(--pc-semantic-border-default)",
        label: "Border color - Hover",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "color",
      },
      borderRadius: {
        cssProperty: "border-radius",
        cssVariableName: "--card-border-radius",
        defaultValue: "14px",
        label: "Border radius",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      outline: {
        cssProperty: "outline",
        cssVariableName: "--card-outline",
        defaultValue: "none",
        label: "Outline",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      outlineOffset: {
        cssProperty: "outline-offset",
        cssVariableName: "--card-outline-offset",
        defaultValue: "0",
        label: "Outline offset",
        role: "styling",
        roleGroup: "Border",
        schemaType: "string",
        type: "text",
      },
      boxShadow: {
        cssProperty: "box-shadow",
        cssVariableName: "--card-box-shadow",
        defaultValue: "var(--pc-semantic-shadow-sm)",
        label: "Box shadow",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      boxShadowHover: {
        cssProperty: "box-shadow",
        cssVariableName: "--card-box-shadow-hover",
        defaultValue: "var(--pc-semantic-shadow-sm)",
        label: "Box shadow - Hover",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      transformHover: {
        cssProperty: "transform",
        cssVariableName: "--card-transform-hover",
        defaultValue: "none",
        label: "Transform - Hover",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      transition: {
        cssProperty: "transition",
        cssVariableName: "--card-transition",
        defaultValue: "none",
        label: "Transition",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      opacity: {
        cssProperty: "opacity",
        cssVariableName: "--card-opacity",
        defaultValue: "1",
        label: "Opacity",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      filter: {
        cssProperty: "filter",
        cssVariableName: "--card-filter",
        defaultValue: "none",
        label: "Filter",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      backdropFilter: {
        cssProperty: "backdrop-filter",
        cssVariableName: "--card-backdrop-filter",
        defaultValue: "none",
        label: "Backdrop filter",
        role: "styling",
        roleGroup: "Effects",
        schemaType: "string",
        type: "text",
      },
      backgroundBefore: {
        cssProperty: "background",
        cssVariableName: "--card-background-before",
        defaultValue: "none",
        label: "Background - Before",
        role: "styling",
        roleGroup: "Overlay",
        schemaType: "string",
        type: "text",
      },
      maskBefore: {
        cssProperty: "mask",
        cssVariableName: "--card-mask-before",
        defaultValue: "none",
        label: "Mask - Before",
        role: "styling",
        roleGroup: "Overlay",
        schemaType: "string",
        type: "text",
      },
      maskCompositeBefore: {
        cssProperty: "mask-composite",
        cssVariableName: "--card-mask-composite-before",
        defaultValue: "add",
        label: "Mask composite - Before",
        role: "styling",
        roleGroup: "Overlay",
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
        allowedChildComponents: ["Button", "Divider", "Grid", "Element", "Form", "Heading", "Image", "List", "RichText", "Section", "Spacer", "Spinner", "Table", "Text"],
      },
      footer: {
        allowedChildComponents: ["Badge", "Button", "Element", "Spacer", "Spinner", "Text"],
      },
      header: {
        allowedChildComponents: ["Badge", "Element", "Heading", "Image", "Spacer", "Spinner", "Text"],
      },
    },
    variants: [
      {
        label: "Flat",
        props: {
          borderWidth: "0px",
          boxShadow: "none",
        },
      },
      {
        label: "Outlined",
        props: {
          backgroundColor: "transparent",
          backgroundColorBody: "transparent",
          backgroundColorBodyHover: "transparent",
          backgroundColorFooter: "transparent",
          backgroundColorFooterHover: "transparent",
          backgroundColorHeader: "transparent",
          backgroundColorHeaderHover: "transparent",
          backgroundColorHover: "transparent",
          boxShadow: "none",
        },
      },
      {
        label: "Elevated",
        props: {
          borderWidth: "0px",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.15)",
        },
      },
      {
        label: "Soft",
        props: {
          backgroundColor: "#f8fafc",
          backgroundColorBody: "#f8fafc",
          backgroundColorBodyHover: "#f8fafc",
          backgroundColorFooter: "#f8fafc",
          backgroundColorFooterHover: "#f8fafc",
          backgroundColorHeader: "#f8fafc",
          backgroundColorHeaderHover: "#f8fafc",
          backgroundColorHover: "#f8fafc",
          borderColor: "#e2e8f0",
          borderColorHover: "#e2e8f0",
          boxShadow: "none",
        },
      },
      {
        label: "Glass",
        props: {
          backdropFilter: "blur(16px)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backgroundColorBody: "rgba(255, 255, 255, 0.1)",
          backgroundColorBodyHover: "rgba(255, 255, 255, 0.1)",
          backgroundColorFooter: "rgba(255, 255, 255, 0.1)",
          backgroundColorFooterHover: "rgba(255, 255, 255, 0.1)",
          backgroundColorHeader: "rgba(255, 255, 255, 0.1)",
          backgroundColorHeaderHover: "rgba(255, 255, 255, 0.1)",
          backgroundColorHover: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
          borderColorHover: "rgba(255, 255, 255, 0.2)",
        },
      },
      {
        label: "Dark",
        props: {
          backgroundColor: "#0f172a",
          backgroundColorBody: "#0f172a",
          backgroundColorBodyHover: "#0f172a",
          backgroundColorFooter: "#0f172a",
          backgroundColorFooterHover: "#0f172a",
          backgroundColorHeader: "#0f172a",
          backgroundColorHeaderHover: "#0f172a",
          backgroundColorHover: "#0f172a",
          borderColor: "#1e293b",
          borderColorHover: "#1e293b",
          color: "#f8fafc",
          colorHover: "#f8fafc",
        },
      },
      {
        label: "Compact",
        props: {
          gapBody: "0.5rem",
          paddingBody: "1rem",
          paddingFooter: "1rem",
          paddingHeader: "1rem",
        },
      },
      {
        label: "Spacious",
        props: {
          gapBody: "1.5rem",
          paddingBody: "3rem",
          paddingFooter: "2rem",
          paddingHeader: "2rem",
        },
      },
      {
        label: "Horizontal",
        props: {
          alignItems: "stretch",
          flexDirection: "row",
        },
      },
      {
        label: "Centered",
        props: {
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        },
      },
      {
        label: "Image Card",
        props: {
          backgroundPosition: "center",
          backgroundSize: "cover",
          overflow: "hidden",
          paddingBody: "0px",
        },
      },
      {
        label: "Dashboard Tile",
        props: {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          minHeight: "120px",
          paddingBody: "1.5rem",
        },
      },
      {
        label: "Clickable",
        props: {
          boxShadowHover: "0 20px 50px rgba(0, 0, 0, 0.15)",
          cursor: "pointer",
          transformHover: "translateY(-4px)",
          transition: "all 0.2s ease",
        },
      },
      {
        label: "Accent Left",
        props: {
          borderBottomWidth: "0px",
          borderLeftWidth: "4px",
          borderRadius: "0px",
          borderRightWidth: "0px",
          borderTopWidth: "0px",
        },
      },
      {
        label: "Accent Top",
        props: {
          borderBottomWidth: "0px",
          borderLeftWidth: "0px",
          borderRightWidth: "0px",
          borderTopWidth: "4px",
        },
      },
      {
        label: "Modal",
        props: {
          boxShadow: "0 40px 120px rgba(0, 0, 0, 0.35)",
          left: "50%",
          maxWidth: "500px",
          position: "fixed",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          zIndex: "1000",
        },
      },
      {
        label: "Floating Panel",
        props: {
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
          position: "absolute",
          right: "1rem",
          top: "1rem",
          zIndex: "100",
        },
      },
      {
        label: "Scrollable",
        props: {
          maxHeight: "300px",
          overflowY: "auto",
        },
      },
      {
        label: "Media Overlay",
        props: {
          backgroundPosition: "center",
          backgroundSize: "cover",
          overflow: "hidden",
          position: "relative",
        },
      },
    ],
  };
}
