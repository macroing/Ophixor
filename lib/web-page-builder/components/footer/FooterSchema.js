// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { exportCSSFromProps } from "../runtime/export/exportCSSFromProps";

export function createFooterSchema() {
  return {
    defaultSlots: {},
    description: "A simple customizable footer that can be used at the bottom of the page.",
    editor: {
      defaultOpenGroups: {
        content: ["Brand", "Columns"],
        selectors: [],
        styling: [],
      },
      roleGroupOrder: {
        content: ["Brand", "Columns", "Bottom Bar"],
        selectors: ["Selectors"],
        styling: ["Surface", "Typography", "Divider"],
      },
      roleOrder: ["content", "styling", "selectors"],
    },
    exportCSS: (footer = null, footerSchema = null) => {
      if (footer && footerSchema) {
        const props = exportCSSFromProps(footer, footerSchema);

        if (props.length > 0) {
          return `
      .${footer.id} {
${props.map((prop) => "        " + prop).join("\n")}
      }
`;
        } else {
          return "";
        }
      } else {
        return `
      .footer {
        --footer-background-color: var(--pc-semantic-surface-base-secondary);
        --footer-border-color-bottom: var(--pc-semantic-border-tertiary);
        --footer-color: var(--pc-semantic-text-tertiary);
        --footer-color-brand-text: var(--pc-semantic-text-muted);
        --footer-color-bottom: var(--pc-semantic-text-muted);
        --footer-color-hover: var(--pc-semantic-interactive-link-hover);
        --footer-color-title: var(--pc-semantic-text-muted);

        background-color: var(--footer-background-color);
        color: var(--footer-color);
        width: 100%;
      }

      .footer > .footer-inner {
        margin: auto;
        max-width: 1100px;
        padding: 3rem 1.5rem 2rem;
      }

      .footer > .footer-inner > .footer-bottom {
        align-items: center;
        border-top: 1px solid var(--footer-border-color-bottom);
        color: var(--footer-color-bottom);
        display: flex;
        flex-wrap: wrap;
        font-size: 0.85rem;
        gap: 1rem;
        justify-content: space-between;
        padding-top: 1.5rem;
      }

      .footer > .footer-inner > .footer-bottom > span {
        white-space: nowrap;
      }

      .footer > .footer-inner > .footer-grid {
        display: grid;
        gap: 2rem;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        margin-bottom: 2.5rem;
      }

      .footer > .footer-inner > .footer-grid > .footer-brand > h3 {
        font-size: 1.2rem;
        margin: 0 0 0.4rem;
      }

      .footer > .footer-inner > .footer-grid > .footer-brand > p {
        color: var(--footer-color-brand-text);
        font-size: 0.95rem;
        margin: 0;
        max-width: 320px;
      }

      .footer > .footer-inner > .footer-grid > .footer-links > h4 {
        color: var(--footer-color-title);
        font-size: 0.95rem;
        letter-spacing: 0.05em;
        margin: 0 0 0.6rem;
        text-transform: uppercase;
      }

      .footer > .footer-inner > .footer-grid > .footer-links > ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .footer > .footer-inner > .footer-grid > .footer-links > ul > li {
        margin: 0.4rem 0;
      }

      .footer > .footer-inner > .footer-grid > .footer-links > ul > li > a {
        color: var(--footer-color);
        font-size: 0.95rem;
        text-decoration: none;
      }

      .footer > .footer-inner > .footer-grid > .footer-links > ul > li > a:hover {
        color: var(--footer-color-hover);
      }

      @media (max-width: 600px) {
        .footer > .footer-inner > .footer-bottom {
          flex-direction: column;
          text-align: center;
        }

        .footer > .footer-inner > .footer-grid {
          justify-items: center;
          text-align: center;
        }
      }
`;
      }
    },
    exportHTML: (footer, footerSchema, pageSchema, indentation) => {
      function renderItems(items, indentation) {
        return `${items?.map((item) => `\n${indentation}<div class="footer-links">\n${indentation + "  "}<h4>${item?.href ? `<a href="${item.href}">${item?.label || ""}</a>` : item?.label || ""}</h4>${item?.items?.length > 0 ? `\n${indentation + "  "}<ul>${item.items.map((innerItem) => `\n${indentation + "    "}<li>${innerItem?.href ? `<a href="${innerItem.href}">${innerItem?.label || ""}</a>` : innerItem?.label || ""}</li>`)?.join("")}\n${indentation + "  "}</ul>` : ""}\n${indentation}</div>`)?.join("")}`;
      }

      return `${indentation}<footer class="footer ${footer?.id}" data-pc-id="${footer?.id || ""}">
${indentation + "  "}<div class="footer-inner">
${indentation + "    "}<div class="footer-grid">${footer?.props?.title || footer?.props?.description ? `${"\n" + indentation + "      "}<div class="footer-brand">\n${indentation + "        "}<h3>${footer?.props?.title || ""}</h3>\n${indentation + "        "}<p>${footer?.props?.description || ""}</p>\n${indentation + "      "}</div>` : ""}${footer?.props?.items?.length > 0 ? renderItems(footer.props.items, indentation + "      ") : ""}
${indentation + "    "}</div>
${indentation + "    "}<div class="footer-bottom">
${indentation + "      "}<span>${footer?.props?.textBottomLeft || ""}</span>
${indentation + "      "}<span>${footer?.props?.textBottomRight || ""}</span>
${indentation + "    "}</div>
${indentation + "  "}</div>
${indentation}</footer>`;
    },
    isAllowingChildComponents: false,
    label: "Footer",
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
      description: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sagittis nisl a velit ultricies luctus.",
        label: "Description",
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
              {
                href: "/",
                items: [],
                label: "Maecenas sagittis",
              },
              {
                href: "/",
                items: [],
                label: "Morbi ac orci",
              },
              {
                href: "/",
                items: [],
                label: "Cras ac dolor",
              },
            ],
            label: "Lorem ipsum",
          },
          {
            items: [
              {
                href: "/",
                items: [],
                label: "Aenean consectetur",
              },
              {
                href: "/",
                items: [],
                label: "Vestibulum aliquet",
              },
              {
                href: "/",
                items: [],
                label: "Donec eget",
              },
            ],
            label: "Suspendisse id",
          },
          {
            items: [
              {
                href: "/",
                items: [],
                label: "Cras tortor enim",
              },
              {
                href: "/",
                items: [],
                label: "Fusce aliquam",
              },
              {
                href: "/",
                items: [],
                label: "Integer interdum",
              },
            ],
            label: "Vestibulum mattis",
          },
        ],
        label: "Title & Links",
        role: "content",
        roleGroup: "Columns",
        schema: {
          isAllowingChildItems: true,
          props: {
            label: { label: "Text", type: "text" },
          },
          schema: {
            isAllowingChildItems: false,
            props: {
              href: { label: "Link", type: "text" },
              label: { label: "Text", type: "text" },
            },
          },
        },
        schemaType: {
          items: {
            props: {
              items: {
                items: {
                  props: {
                    href: { type: "string" },
                    label: { type: "string" },
                  },
                  type: "object",
                },
                type: "array",
              },
              label: { type: "string" },
            },
            type: "object",
          },
          type: "array",
        },
        type: "items",
      },
      textBottomLeft: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "Lorem ipsum dolor sit amet",
        label: "Text - Bottom - Left",
        role: "content",
        roleGroup: "Bottom Bar",
        schemaType: "string",
        type: "text",
      },
      textBottomRight: {
        cssProperty: null,
        cssVariableName: null,
        defaultValue: "Maecenas sagittis nisl a velit",
        label: "Text - Bottom - Right",
        role: "content",
        roleGroup: "Bottom Bar",
        schemaType: "string",
        type: "text",
      },
      backgroundColor: {
        cssProperty: "background-color",
        cssVariableName: "--footer-background-color",
        defaultValue: "var(--pc-semantic-surface-base-secondary)",
        label: "Background color",
        role: "styling",
        roleGroup: "Surface",
        schemaType: "string",
        type: "color",
      },
      color: {
        cssProperty: "color",
        cssVariableName: "--footer-color",
        defaultValue: "var(--pc-semantic-text-tertiary)",
        label: "Color",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorHover: {
        cssProperty: "color",
        cssVariableName: "--footer-color-hover",
        defaultValue: "var(--pc-semantic-interactive-link-hover)",
        label: "Color - Hover",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorTitle: {
        cssProperty: "color",
        cssVariableName: "--footer-color-title",
        defaultValue: "var(--pc-semantic-text-muted)",
        label: "Color - Title",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorBrandText: {
        cssProperty: "color",
        cssVariableName: "--footer-color-brand-text",
        defaultValue: "var(--pc-semantic-text-muted)",
        label: "Color - Brand text",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      colorBottom: {
        cssProperty: "color",
        cssVariableName: "--footer-color-bottom",
        defaultValue: "var(--pc-semantic-text-muted)",
        label: "Color - Bottom",
        role: "styling",
        roleGroup: "Typography",
        schemaType: "string",
        type: "color",
      },
      borderColorBottom: {
        cssProperty: "border-color",
        cssVariableName: "--footer-border-color-bottom",
        defaultValue: "var(--pc-semantic-border-tertiary)",
        label: "Border color - Bottom",
        role: "styling",
        roleGroup: "Divider",
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
        allowedChildComponents: ["Badge", "Grid", "Heading", "Link", "Section", "Text"],
      },
      */
    },
  };
}
