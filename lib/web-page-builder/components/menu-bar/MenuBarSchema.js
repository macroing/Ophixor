// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createMenuBarSchema() {
  return {
    defaultSlots: {},
    description: "A simple customizable menu bar that can be used at the top of the page.",
    editor: {
      defaultOpenGroups: {
        content: ["Brand", "Navigation"],
        layout: [],
        selectors: [],
        styling: [],
      },
      roleGroupOrder: {
        content: ["Brand", "Navigation"],
        layout: ["Positioning"],
        selectors: ["Selectors"],
        styling: ["Surface", "Branding", "Items", "Submenu", "Mobile", "Typography"],
      },
      roleOrder: ["content", "styling", "layout", "selectors"],
    },
    exportCSS: (menuBar = null, menuBarSchema = null) => {
      if (menuBar && menuBarSchema) {
        const props = exportCSSFromProps(menuBar, menuBarSchema);

        if (props.length > 0) {
          return `
      .${menuBar.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .menu-bar {
        --menu-bar-backdrop-filter: blur(8px);
        --menu-bar-background-color: var(--pc-semantic-surface-overlay);
        --menu-bar-background-color-icon-letter: var(--pc-semantic-interactive-primary);
        --menu-bar-background-color-item-primary: var(--pc-semantic-interactive-primary);
        --menu-bar-background-color-item-primary-hover: var(--pc-semantic-interactive-primary-hover);
        --menu-bar-background-color-line-hover: var(--pc-semantic-interactive-primary);
        --menu-bar-background-color-mobile-menu: var(--pc-semantic-surface-base);
        --menu-bar-background-color-sub-menu: var(--pc-semantic-surface-base);
        --menu-bar-background-color-sub-menu-item-hover: var(--pc-semantic-surface-primary);
        --menu-bar-background-color-sub-menu-item-primary: var(--pc-semantic-interactive-primary);
        --menu-bar-background-color-sub-menu-item-primary-hover: var(--pc-semantic-interactive-primary-hover);
        --menu-bar-background-image: none;
        --menu-bar-background-image-mobile-menu: none;
        --menu-bar-border-color: var(--pc-semantic-border-default);
        --menu-bar-color: var(--pc-semantic-text-primary);
        --menu-bar-color-hover: var(--pc-semantic-text-primary);
        --menu-bar-color-icon-letter: var(--pc-semantic-text-inverse);
        --menu-bar-color-item: var(--pc-semantic-text-secondary);
        --menu-bar-color-item-hover: var(--pc-semantic-text-primary);
        --menu-bar-color-item-primary: var(--pc-semantic-text-inverse);
        --menu-bar-color-item-primary-hover: var(--pc-semantic-text-inverse);
        --menu-bar-color-sub-menu-item: var(--pc-semantic-text-secondary);
        --menu-bar-color-sub-menu-item-hover: var(--pc-semantic-text-primary);
        --menu-bar-color-sub-menu-item-primary: var(--pc-semantic-text-inverse);
        --menu-bar-color-sub-menu-item-primary-hover: var(--pc-semantic-text-inverse);
        --menu-bar-position: relative;
        --menu-bar-top: auto;

        backdrop-filter: var(--menu-bar-backdrop-filter);
        background-color: var(--menu-bar-background-color);
        background-image: var(--menu-bar-background-image);
        border: 1px solid var(--menu-bar-border-color);
        position: var(--menu-bar-position);
        top: var(--menu-bar-top);
        width: 100%;
        z-index: 10;
      }

      .menu-bar > .nav {
        align-items: center;
        display: flex;
        justify-content: space-between;
        margin: auto;
        max-width: 1200px;
        padding: 1rem 1.5rem;
      }

      .menu-bar > .nav > .title {
        align-items: center;
        color: var(--menu-bar-color);
        display: flex;
        flex-direction: row;
        font-weight: bold;
        gap: 0.5rem;
        justify-content: center;
        text-decoration: none;
      }

      .menu-bar > .nav > .title:hover {
        color: var(--menu-bar-color-hover);
        text-decoration: none;
      }

      .menu-bar > .nav > .title > .icon-image {
        height: 32px;
        object-fit: cover;
        width: 32px;
      }

      .menu-bar > .nav > .title > .icon-letter {
        align-items: center;
        background-color: var(--menu-bar-background-color-icon-letter);
        border-radius: 50%;
        color: var(--menu-bar-color-icon-letter);
        display: flex;
        font-weight: 700;
        height: 32px;
        justify-content: center;
        width: 32px;
      }

      .menu-bar .menu-items {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .menu-bar .menu-item {
        position: relative;
      }

      .menu-bar .item-divider {
        background-color: var(--menu-bar-border-color);
        height: 1px;
        width: 100%;
      }

      .menu-bar .item-button, .menu-bar .item-link, .menu-bar .item-label {
        align-items: center;
        background-color: transparent;
        border: none;
        color: var(--menu-bar-color-item);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-family: inherit;
        font-size: 1rem;
        height: auto;
        line-height: 1.5;
        margin: 0px 0px 0px 1.2rem;
        min-height: auto;
        padding: 0.25rem 0;
        position: relative;
        text-decoration: none;
        vertical-align: middle;
        white-space: nowrap;
      }

      .menu-bar .item-button {
        appearance: none;

        -webkit-appearance: none;
      }

      .menu-bar .item-button.item_button-primary, .menu-bar .item-link.item-link-primary, .menu-bar .item-label.item-label-primary {
        background-color: var(--menu-bar-background-color-item-primary);
        border-radius: 8px;
        color: var(--menu-bar-color-item-primary);
        margin-left: 1.2rem;
        padding: 0.4rem 0.8rem;
      }

      .menu-bar .item-button.item-button-active, .menu-bar .item-link.item-link-active {
        font-weight: 600;
      }

      .menu-bar .item-button::after, .menu-bar .item-link::after, .menu-bar .item-label::after {
        background-color: var(--menu-bar-background-color-line-hover);
        bottom: -6px;
        content: "";
        height: 2px;
        left: 0;
        position: absolute;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.25s ease;
        width: 100%;
      }

      .menu-bar .item-label::after {
        background-color: transparent;
      }

      .menu-bar .item-button.item-button-primary::after, .menu-bar .item-link.item-link-primary::after, .menu-bar .item-label.item-label-primary::after {
        background-color: transparent;
      }

      .menu-bar .menu-item:hover > .item-button::after, .menu-bar .menu-item:hover > .item-link::after, .menu-bar .menu-item:hover > .item-label::after {
        transform: scaleX(1);
      }

      .menu-bar .menu-item:hover > .item-button, .menu-bar .menu-item:hover > .item-link, .menu-bar .menu-item:hover > .item-label {
        color: var(--menu-bar-color-item-hover);
        text-decoration: none;
      }

      .menu-bar .menu-item:hover > .item-button.item-button-primary, .menu-bar .menu-item:hover > .item-link.item-link-primary, .menu-bar .menu-item:hover > .item-label.item-label-primary {
        background-color: var(--menu-bar-background-color-item-primary-hover);
        color: var(--menu-bar-color-item-primary-hover);
      }

      .menu-bar .sub-menu-items {
        background-color: var(--menu-bar-background-color-sub-menu);
        border: 1px solid var(--menu-bar-border-color);
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        display: none;
        left: 0;
        list-style: none;
        margin: 0;
        min-width: 200px;
        padding: 0.5rem 0;
        position: absolute;
        top: 100%;
        z-index: 20;
      }

      .menu-bar .sub-menu-items > .menu-item > .item-button, .menu-bar .sub-menu-items > .menu-item > .item-link, .menu-bar .sub-menu-items > .menu-item > .item-label {
        color: var(--menu-bar-color-sub-menu-item);
      }

      .menu-bar .sub-menu-items > .menu-item > .item-button.item-button-primary, .menu-bar .sub-menu-items > .menu-item > .item-link.item-link-primary, .menu-bar .sub-menu-items > .menu-item > .item-label.item-label-primary {
        background-color: var(--menu-bar-background-color-sub-menu-item-primary);
        border-radius: 0px;
        color: var(--menu-bar-color-sub-menu-item-primary);
      }

      .menu-bar .sub-menu-items > .menu-item:hover > .item-button, .menu-bar .sub-menu-items > .menu-item:hover > .item-link, .menu-bar .sub-menu-items > .menu-item:hover > .item-label {
        color: var(--menu-bar-color-sub-menu-item-hover);
      }

      .menu-bar .sub-menu-items > .menu-item:hover > .item-button.item-button-primary, .menu-bar .sub-menu-items > .menu-item:hover > .item-link.item-link-primary, .menu-bar .sub-menu-items > .menu-item:hover > .item-label.item-label-primary {
        background-color: var(--menu-bar-background-color-sub-menu-item-primary-hover);
        color: var(--menu-bar-color-sub-menu-item-primary-hover);
      }

      .menu-bar .menu-item.has-items:hover > .sub-menu-items {
        display: block;
      }

      .menu-bar .sub-menu-items .menu-item {
        padding: 0;
      }

      .menu-bar .sub-menu-items .item-button, .menu-bar .sub-menu-items .item-link, .menu-bar .sub-menu-items .item-label {
        margin: 0;
        padding: 0.5rem 1rem;
        width: 100%;
      }

      .menu-bar .sub-menu-items .item-button::after, .menu-bar .sub-menu-items .item-link::after, .menu-bar .sub-menu-items .item-label::after {
        display: none;
      }

      .menu-bar .sub-menu-items .menu-item:hover {
        background-color: var(--menu-bar-background-color-sub-menu-item-hover);
      }

      .menu-bar > .nav > .hamburger {
        background: none;
        border: none;
        cursor: pointer;
        display: none;
      }

      .menu-bar > .nav > .hamburger span {
        background-color: var(--menu-bar-color);
        display: block;
        height: 2px;
        margin: 5px 0;
        width: 24px;
      }

      .menu-bar > .nav > .desktop-only {
        display: block;
      }

      .menu-bar > .mobile-menu {
        background-color: var(--menu-bar-background-color-mobile-menu);
        background-image: var(--menu-bar-background-image-mobile-menu);
        border-top: 1px solid var(--menu-bar-border-color);
        padding: 1rem;
      }

      .menu-bar > .mobile-menu.mobile-menu-hidden {
        display: none;
      }

      .menu-bar > .mobile-menu .menu-items {
        flex-direction: column;
      }

      .menu-bar > .mobile-menu .menu-item {
        margin-bottom: 0.5rem;
      }

      .menu-bar > .mobile-menu .sub-menu-items {
        border: none;
        border-left: 3px solid var(--menu-bar-border-color);
        border-radius: 0px;
        box-shadow: none;
        display: block;
        margin-left: 1rem;
        margin-top: 1rem;
        padding-left: 0rem;
        padding-right: 1rem;
        position: static;
      }

      @media (max-width: 768px) {
        .menu-bar > .nav > .desktop-only {
          display: none;
        }

        .menu-bar > .nav > .hamburger {
          display: block;
        }
      }
`;
      }
    },
    exportHTML: (menuBar, menuBarSchema, pageSchema, indentation) => {
      function renderMenuItem(item, indentation) {
        const hasItems = Array.isArray(item.items) && item.items.length > 0;

        return `\n${indentation}<li class="menu-item${hasItems ? " has-items" : ""}">${item.type === "link" ? `\n${indentation + "  "}<a class="item-link" href="${item.href || "/"}">${item.label || ""}</a>` : item.type === "button" ? `\n${indentation + "  "}<button class="item-button">${item.label || ""}</button>` : item.type === "divider" ? `\n${indentation + "  "}<div class="item-divider"></div>` : `\n${indentation + "  "}<span class="item-label">${item.label || ""}</span>`}${hasItems ? renderMenuItems(item.items, indentation + "  ", true) : ""}\n${indentation}</li>`;
      }

      function renderMenuItems(items, indentation, isSubMenu = false) {
        return `\n${indentation}<ul class="${isSubMenu ? "sub-menu-items" : "menu-items"}">${items?.map((item) => renderMenuItem(item, indentation + "  "))?.join("")}\n${indentation}</ul>`;
      }

      return `${indentation}<header class="menu-bar ${menuBar?.id}" data-pc-id="${menuBar?.id || ""}" id="${menuBar?.id}">
${indentation + "  "}<nav class="nav">
${indentation + "    "}<a class="title" href="/">${menuBar?.props?.iconImageAlt && menuBar?.props?.iconImageSrc ? `<img alt="${menuBar.props.iconImageAlt}" class="icon-image" src="${menuBar.props.iconImageSrc}" />` : ""}${menuBar?.props?.iconLetter ? `<span class="icon-letter">${menuBar.props.iconLetter}</span>` : ""}${menuBar?.props?.title || ""}</a>
${indentation + "    "}<div class="desktop-only">${renderMenuItems(menuBar?.props?.items || [], indentation + "      ")}
${indentation + "    "}</div>
${indentation + "    "}<button aria-label="Toggle menu" class="hamburger" onclick="menuBarToggleIsMobileOpen('${menuBar?.id}')">
${indentation + "      "}<span></span>
${indentation + "      "}<span></span>
${indentation + "      "}<span></span>
${indentation + "    "}</button>
${indentation + "  "}</nav>
${indentation + "  "}<div class="mobile-menu mobile-menu-hidden" id="${menuBar?.id}-mobile-menu">${renderMenuItems(menuBar?.props?.items || [], indentation + "    ")}
${indentation + "  "}</div>
${indentation}</header>`;
    },
    exportJS: (indentation) => {
      return `
${indentation}function menuBarToggleIsMobileOpen(id) {
${indentation + "  "}const mobileMenu = document.getElementById(id + "-mobile-menu");

${indentation + "  "}if(mobileMenu) {
${indentation + "    "}mobileMenu.classList.toggle("mobile-menu-hidden");
${indentation + "  "}}
${indentation}}`;
    },
    isAllowingChildComponents: false,
    label: "Menu bar",
    plan: "Personal",
    props: {
      title: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "Lorem ipsum",
        label: "Title",
        role: "content",
        roleGroup: "Brand",
        schemaType: "string",
        type: "text",
      },
      iconImageAlt: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Icon image alt",
        role: "content",
        roleGroup: "Brand",
        schemaType: "string",
        type: "text",
      },
      iconImageSrc: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "",
        label: "Icon image src",
        role: "content",
        roleGroup: "Brand",
        schemaType: "string",
        type: "text",
      },
      iconLetter: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "L",
        label: "Icon (letter)",
        role: "content",
        roleGroup: "Brand",
        schemaType: "string",
        type: "text",
      },
      items: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: [
          {
            items: [
              { href: "/", items: [], label: "Maecenas sagittis", type: "link" },
              { href: "/", items: [], label: "Morbi ac orci", type: "link" },
              { href: "/", items: [], label: "Cras ac dolor", type: "link" },
            ],
            label: "Lorem ipsum",
          },
          {
            items: [],
            label: "Suspendisse",
          },
          {
            items: [],
            label: "Aenean consectetur",
          },
        ],
        label: "Links",
        role: "content",
        roleGroup: "Navigation",
        schema: {
          isAllowingChildItems: true,
          props: {
            href: { label: "Link", type: "text" },
            label: { label: "Text", type: "text" },
            theme: {
              defaultValue: "",
              label: "Theme",
              options: [
                { label: "Default", value: "" },
                { label: "Primary", value: "primary" },
              ],
              type: "select",
            },
            type: {
              defaultValue: "link",
              label: "Type",
              options: [
                { label: "Link", value: "link" },
                { label: "Button", value: "button" },
                { label: "Divider", value: "divider" },
                { label: "Text", value: "" },
              ],
              type: "select",
            },
          },
          schema: {
            isAllowingChildItems: false,
            props: {
              href: { label: "Link", type: "text" },
              label: { label: "Text", type: "text" },
              theme: {
                defaultValue: "",
                label: "Theme",
                options: [
                  { label: "Default", value: "" },
                  { label: "Primary", value: "primary" },
                ],
                type: "select",
              },
              type: {
                defaultValue: "link",
                label: "Type",
                options: [
                  { label: "Link", value: "link" },
                  { label: "Button", value: "button" },
                  { label: "Divider", value: "divider" },
                  { label: "Text", value: "" },
                ],
                type: "select",
              },
            },
          },
        },
        schemaType: {
          items: {
            props: {
              href: { type: "string" },
              items: {
                items: {
                  props: {
                    href: { type: "string" },
                    label: { type: "string" },
                    theme: { type: "string" },
                    type: { type: "string" },
                  },
                  type: "object",
                },
                type: "array",
              },
              label: { type: "string" },
              theme: { type: "string" },
              type: { type: "string" },
            },
            type: "object",
          },
          type: "array",
        },
        type: "items",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--menu-bar-background-color",
        defaultValue: "var(--pc-semantic-surface-overlay)",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backgroundImage: {
        cssProperty: "background-image",
        cssVariableName: "--menu-bar-background-image",
        defaultValue: "none",
        label: "Background image",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      backdropFilter: {
        cssProperty: "backdrop-filter",
        cssVariableName: "--menu-bar-backdrop-filter",
        defaultValue: "blur(8px)",
        label: "Backdrop filter",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "text",
      },
      borderColor: {
        cssProperty: "border-color",
        cssVariableName: "--menu-bar-border-color",
        defaultValue: "var(--pc-semantic-border-default)",
        label: "Border color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      backgroundColorIconLetter: {
        cssProperty: "background-color",
        cssVariableName: "--menu-bar-background-color-icon-letter",
        defaultValue: "var(--pc-semantic-interactive-primary)",
        label: "Background color - Icon (letter)",
        role: "styling",
        roleGroup: "Branding",
        schemaType: "string",
        type: "color",
      },
      colorIconLetter: {
        cssProperty: "color",
        cssVariableName: "--menu-bar-color-icon-letter",
        defaultValue: "var(--pc-semantic-text-inverse)",
        label: "Color - Icon (letter)",
        role: "styling",
        roleGroup: "Branding",
        schemaType: "string",
        type: "color",
      },
      colorItem: {
        cssProperty: "color",
        cssVariableName: "--menu-bar-color-item",
        defaultValue: "var(--pc-semantic-text-secondary)",
        label: "Color - Item",
        role: "styling",
        roleGroup: "Items",
        schemaType: "string",
        type: "color",
      },
      colorItemHover: {
        cssProperty: "color",
        cssVariableName: "--menu-bar-color-item-hover",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color - Item - Hover",
        role: "styling",
        roleGroup: "Items",
        schemaType: "string",
        type: "color",
      },
      backgroundColorItemPrimary: {
        cssProperty: "background-color",
        cssVariableName: "--menu-bar-background-color-item-primary",
        defaultValue: "var(--pc-semantic-interactive-primary)",
        label: "Background color - Item - Primary",
        role: "styling",
        roleGroup: "Items",
        schemaType: "string",
        type: "color",
      },
      backgroundColorItemPrimaryHover: {
        cssProperty: "background-color",
        cssVariableName: "--menu-bar-background-color-item-primary-hover",
        defaultValue: "var(--pc-semantic-interactive-primary-hover)",
        label: "Background color - Item - Primary - Hover",
        role: "styling",
        roleGroup: "Items",
        schemaType: "string",
        type: "color",
      },
      colorItemPrimary: {
        cssProperty: "color",
        cssVariableName: "--menu-bar-color-item-primary",
        defaultValue: "var(--pc-semantic-text-inverse)",
        label: "Color - Item - Primary",
        role: "styling",
        roleGroup: "Items",
        schemaType: "string",
        type: "color",
      },
      colorItemPrimaryHover: {
        cssProperty: "color",
        cssVariableName: "--menu-bar-color-item-primary-hover",
        defaultValue: "var(--pc-semantic-text-inverse)",
        label: "Color - Item - Primary - Hover",
        role: "styling",
        roleGroup: "Items",
        schemaType: "string",
        type: "color",
      },
      backgroundColorLineHover: {
        cssProperty: "background-color",
        cssVariableName: "--menu-bar-background-color-line-hover",
        defaultValue: "var(--pc-semantic-interactive-primary)",
        label: "Background color - Line - Hover",
        role: "styling",
        roleGroup: "Items",
        schemaType: "string",
        type: "color",
      },
      backgroundColorSubMenu: {
        cssProperty: "background-color",
        cssVariableName: "--menu-bar-background-color-sub-menu",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color - Submenu",
        role: "styling",
        roleGroup: "Submenu",
        schemaType: "string",
        type: "color",
      },
      backgroundColorSubMenuItemHover: {
        cssProperty: "background-color",
        cssVariableName: "--menu-bar-background-color-sub-menu-item-hover",
        defaultValue: "var(--pc-semantic-surface-primary)",
        label: "Background color - Submenu - Item - Hover",
        role: "styling",
        roleGroup: "Submenu",
        schemaType: "string",
        type: "color",
      },
      backgroundColorSubMenuItemPrimary: {
        cssProperty: "background-color",
        cssVariableName: "--menu-bar-background-color-sub-menu-item-primary",
        defaultValue: "var(--pc-semantic-interactive-primary)",
        label: "Background color - Submenu - Item - Primary",
        role: "styling",
        roleGroup: "Submenu",
        schemaType: "string",
        type: "color",
      },
      backgroundColorSubMenuItemPrimaryHover: {
        cssProperty: "background-color",
        cssVariableName: "--menu-bar-background-color-sub-menu-item-primary-hover",
        defaultValue: "var(--pc-semantic-interactive-primary-hover)",
        label: "Background color - Submenu - Item - Primary - Hover",
        role: "styling",
        roleGroup: "Submenu",
        schemaType: "string",
        type: "color",
      },
      colorSubMenuItem: {
        cssProperty: "color",
        cssVariableName: "--menu-bar-color-sub-menu-item",
        defaultValue: "var(--pc-semantic-text-secondary)",
        label: "Color - Submenu - Item",
        role: "styling",
        roleGroup: "Submenu",
        schemaType: "string",
        type: "color",
      },
      colorSubMenuItemHover: {
        cssProperty: "color",
        cssVariableName: "--menu-bar-color-sub-menu-item-hover",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color - Submenu - Item - Hover",
        role: "styling",
        roleGroup: "Submenu",
        schemaType: "string",
        type: "color",
      },
      colorSubMenuItemPrimary: {
        cssProperty: "color",
        cssVariableName: "--menu-bar-color-sub-menu-item-primary",
        defaultValue: "var(--pc-semantic-text-inverse)",
        label: "Color - Submenu - Item - Primary",
        role: "styling",
        roleGroup: "Submenu",
        schemaType: "string",
        type: "color",
      },
      colorSubMenuItemPrimaryHover: {
        cssProperty: "color",
        cssVariableName: "--menu-bar-color-sub-menu-item-primary-hover",
        defaultValue: "var(--pc-semantic-text-inverse)",
        label: "Color - Submenu - Item - Primary - Hover",
        role: "styling",
        roleGroup: "Submenu",
        schemaType: "string",
        type: "color",
      },
      backgroundColorMobileMenu: {
        cssProperty: "background-color",
        cssVariableName: "--menu-bar-background-color-mobile-menu",
        defaultValue: "var(--pc-semantic-surface-base)",
        label: "Background color - Mobile",
        role: "styling",
        roleGroup: "Mobile",
        schemaType: "string",
        type: "color",
      },
      backgroundImageMobileMenu: {
        cssProperty: "background-image",
        cssVariableName: "--menu-bar-background-image-mobile-menu",
        defaultValue: "none",
        label: "Background image - Mobile",
        role: "styling",
        roleGroup: "Mobile",
        schemaType: "string",
        type: "text",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--menu-bar-color",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorHover: {
        cssProperty: "color",
        cssVariableName: "--menu-bar-color-hover",
        defaultValue: "var(--pc-semantic-text-primary)",
        label: "Color - Hover",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      position: {
        cssProperty: "position",
        cssVariableName: "--menu-bar-position",
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
        cssVariableName: "--menu-bar-top",
        defaultValue: "auto",
        label: "Top",
        role: "layout",
        roleGroup: "Positioning",
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
    variants: [
      {
        label: "Glass - Blue",
        props: {
          backdropFilter: "blur(16px)",
          backgroundColor: "rgba(0, 0, 255, 0.75)",
          backgroundColorIconLetter: "rgba(0, 0, 255, 0.75)",
          backgroundColorItemPrimary: "rgba(0, 0, 200, 0.75)",
          backgroundColorItemPrimaryHover: "rgba(0, 0, 255, 0.75)",
          backgroundColorLineHover: "transparent",
          backgroundColorMobileMenu: "rgba(0, 0, 255, 0.75)",
          backgroundColorSubMenu: "#ffffff",
          backgroundColorSubMenuItemHover: "#eff6ff",
          backgroundColorSubMenuItemPrimary: "rgba(0, 0, 200, 0.75)",
          backgroundColorSubMenuItemPrimaryHover: "rgba(0, 0, 255, 0.75)",
          backgroundImage: "linear-gradient(180deg, #2563eb99, #1e40af99)",
          backgroundImageMobileMenu: "linear-gradient(180deg, #2563eb99, #1e40af99)",
          borderColor: "rgba(0, 0, 200, 0.75)",
          color: "rgba(200, 200, 255, 0.75)",
          colorHover: "rgba(200, 200, 255, 0.85)",
          colorIconLetter: "rgba(200, 200, 255, 0.75)",
          colorItem: "rgba(200, 200, 255, 0.75)",
          colorItemHover: "rgba(200, 200, 255, 0.85)",
          colorItemPrimary: "rgba(200, 200, 255, 0.75)",
          colorItemPrimaryHover: "rgba(200, 200, 255, 0.85)",
          colorSubMenuItem: "rgba(0, 0, 100, 0.75)",
          colorSubMenuItemHover: "rgba(0, 0, 100, 0.85)",
          colorSubMenuItemPrimary: "rgba(200, 200, 255, 0.75)",
          colorSubMenuItemPrimaryHover: "rgba(200, 200, 255, 0.85)",
        },
      },
    ],
  };
}
