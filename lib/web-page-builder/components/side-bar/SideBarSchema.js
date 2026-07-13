// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createSideBarSchema() {
  return {
    defaultSlots: {},
    description: "",
    editor: {
      defaultOpenGroups: {
        content: ["Navigation"],
        selectors: [],
        styling: [],
      },
      roleGroupOrder: {
        content: ["Navigation"],
        selectors: ["Selectors"],
        styling: ["Surface", "Items", "Typography"],
      },
      roleOrder: ["content", "styling", "selectors"],
    },
    exportCSS: (sideBar = null, sideBarSchema = null) => {
      if (sideBar && sideBarSchema) {
        const props = exportCSSFromProps(sideBar, sideBarSchema);

        if (props.length > 0) {
          return `
      .${sideBar.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .side-bar {
        --side-bar-backdrop-filter: blur(8px);
        --side-bar-background-color: var(--pc-semantic-surface-overlay);
        --side-bar-background-color-item: transparent;
        --side-bar-background-color-item-active: var(--pc-semantic-interactive-primary);
        --side-bar-background-color-item-active-hover: var(--pc-semantic-interactive-primary-hover);
        --side-bar-background-color-item-hover: var(--pc-semantic-surface-primary);
        --side-bar-border-color: var(--pc-semantic-border-default);
        --side-bar-color-item: var(--pc-semantic-text-secondary);
        --side-bar-color-item-active: var(--pc-semantic-text-inverse);
        --side-bar-color-item-active-hover: var(--pc-semantic-text-inverse);
        --side-bar-color-item-hover: var(--pc-semantic-interactive-primary);

        backdrop-filter: var(--side-bar-backdrop-filter);
        background-color: var(--side-bar-background-color);
        border: 1px solid var(--side-bar-border-color);
        display: flex;
        flex-direction: column;
        height: 100vh;
        left: 0px;
        padding: calc(2rem + 74px) 1.5rem 2rem 1.5rem;
        position: fixed;
        top: 0px;
        width: 260px;
        z-index: 5;
      }

      .side-bar > .nav {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }

      .side-bar > .nav > .item {
        background-color: var(--side-bar-background-color-item);
        border: 1px solid transparent;
        border-radius: 12px;
        color: var(--side-bar-color-item);
        cursor: pointer;
        font-size: 0.9rem;
        padding: 0.65rem 0.9rem;
        text-decoration: none;
        transition: 0.2s ease;
      }

      .side-bar > .nav > .item:hover {
        background-color: var(--side-bar-background-color-item-hover);
        color: var(--side-bar-color-item-hover);
        text-decoration: none;
      }

      .side-bar > .nav > .item.item-active {
        background-color: var(--side-bar-background-color-item-active);
        color: var(--side-bar-color-item-active);
      }

      .side-bar > .nav > .item.item-active:hover {
        background-color: var(--side-bar-background-color-item-active-hover);
        color: var(--side-bar-color-item-active-hover);
      }

      .side-bar > .nav > .item-separator {
        border-top: 1px solid var(--side-bar-border-color);
        margin: 1rem 0px 1rem 0px;
        width: 100%;
      }
`;
      }
    },
    exportHTML: (sideBar, sideBarSchema, sideSchema, indentation) => {
      function renderItem(item, indentation) {
        return item.isSeparator ? `\n${indentation}<div class="item-separator"></div>` : item.onClick ? `\n${indentation}<button class="item${item.isActive ? " item-active" : ""}" type="button">${item.label || ""}</button>` : `\n${indentation}<a class="item${item.isActive ? " item-active" : ""}" href="${item.href || "/"}">${item.label || ""}</a>`;
      }

      function renderItems(items, indentation) {
        return `\n${indentation}<nav class="nav">${items?.map((item) => renderItem(item, indentation + "  "))?.join("")}\n${indentation}</nav>`;
      }

      return `${indentation}<aside class="side-bar ${sideBar?.id}" data-pc-id="${sideBar?.id || ""}">
${indentation + "  "}<nav class="nav">${renderItems(sideBar?.props?.items || [], indentation + "    ")}
${indentation + "  "}</nav>
${indentation}</aside>`;
    },
    isAllowingChildComponents: false,
    label: "Side bar",
    plan: "Personal",
    props: {
      items: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: [
          {
            href: "/",
            isActive: true,
            label: "Lorem ipsum",
          },
          {
            href: "/",
            isActive: false,
            label: "Suspendisse",
          },
          {
            href: "/",
            isActive: false,
            label: "Aenean consectetur",
          },
        ],
        label: "Links",
        role: "content",
        roleGroup: "Navigation",
        schema: {
          isAllowingChildItems: false,
          props: {
            href: { label: "Link", type: "text" },
            isActive: { label: "Active", type: "switch" },
            label: { label: "Text", type: "text" },
          },
        },
        schemaType: {
          items: {
            props: {
              href: { type: "string" },
              isActive: { type: "boolean" },
              label: { type: "string" },
            },
            type: "object",
          },
          type: "array",
        },
        type: "items",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--side-bar-background-color",
        defaultValue: "var(--pc-semantic-surface-overlay)",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backdropFilter: {
        cssProperty: "backdrop-filter",
        cssVariableName: "--side-bar-backdrop-filter",
        defaultValue: "blur(8px)",
        label: "Backdrop filter",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--side-bar-border-color",
        defaultValue: "var(--pc-semantic-border-default)",
        label: "Border color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      colorItem: {
        cssProperty: "color",
        cssVariableName: "--side-bar-color-item",
        defaultValue: "var(--pc-semantic-text-secondary)",
        label: "Color - Item",
        role: "styling",
        roleGroup: "Items",
        schemaType: "string",
        type: "color",
      },
      colorItemActive: {
        cssProperty: "color",
        cssVariableName: "--side-bar-color-item-active",
        defaultValue: "var(--pc-semantic-text-inverse)",
        label: "Color - Item - Active",
        role: "styling",
        roleGroup: "Items",
        schemaType: "string",
        type: "color",
      },
      colorItemActiveHover: {
        cssProperty: "color",
        cssVariableName: "--side-bar-color-item-active-hover",
        defaultValue: "var(--pc-semantic-text-inverse)",
        label: "Color - Item - Active - Hover",
        role: "styling",
        roleGroup: "Items",
        schemaType: "string",
        type: "color",
      },
      colorItemHover: {
        cssProperty: "color",
        cssVariableName: "--side-bar-color-item-hover",
        defaultValue: "var(--pc-semantic-interactive-primary)",
        label: "Color - Item - Hover",
        role: "styling",
        roleGroup: "Items",
        schemaType: "string",
        type: "color",
      },
      backgroundColorItem: {
        cssProperty: "background-color",
        cssVariableName: "--side-bar-background-color-item",
        defaultValue: "transparent",
        label: "Background color - Item",
        role: "styling",
        roleGroup: "Items",
        schemaType: "string",
        type: "color",
      },
      backgroundColorItemActive: {
        cssProperty: "background-color",
        cssVariableName: "--side-bar-background-color-item-active",
        defaultValue: "var(--pc-semantic-interactive-primary)",
        label: "Background color - Item - Active",
        role: "styling",
        roleGroup: "Items",
        schemaType: "string",
        type: "color",
      },
      backgroundColorItemActiveHover: {
        cssProperty: "background-color",
        cssVariableName: "--side-bar-background-color-item-active-hover",
        defaultValue: "var(--pc-semantic-interactive-primary-hover)",
        label: "Background color - Item - Active - Hover",
        role: "styling",
        roleGroup: "Items",
        schemaType: "string",
        type: "color",
      },
      backgroundColorItemHover: {
        cssProperty: "background-color",
        cssVariableName: "--side-bar-background-color-item-hover",
        defaultValue: "var(--pc-semantic-surface-primary)",
        label: "Background color - Item - Hover",
        role: "styling",
        roleGroup: "Items",
        schemaType: "string",
        type: "color",
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
        allowedChildComponents: ["Badge", "Button", "Link"],
      }
      */
    },
  };
}
