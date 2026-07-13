// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { sanitizeString } from "../props/sanitizeString";

export function buildSelectorsCSS(page, indentation = "") {
  let css = "";

  function walk(component) {
    if (!component) {
      return;
    }

    const selectors = component.props?.selectors;

    if (selectors && Array.isArray(selectors)) {
      for (const rule of selectors) {
        const selector = resolveSelector(rule.selector, component);

        if (!selector) {
          continue;
        }

        const styleString = buildStyleString(rule.styles, indentation + "  ");

        if (!styleString) {
          continue;
        }

        const block = `
${indentation}${selector} {
${styleString}
${indentation}}
`;

        if (rule.media) {
          css += wrapWithMedia(rule.media, block, indentation);
        } else {
          css += block;
        }
      }
    }

    for (const slot of Object.values(component.slots || {})) {
      for (const child of slot) {
        walk(child);
      }
    }
  }

  walk(page);

  return css;
}

function buildStyleString(styles, indentation = "") {
  if (!styles || typeof styles !== "object") {
    return indentation;
  }

  return Object.entries(styles)
    .map(([key, value]) => {
      if (value && typeof value === "object" && value.type === "expression") {
        return null;
      }

      if (typeof value !== "string" && typeof value !== "number") {
        return null;
      }

      return `${indentation}${toKebabCase(key)}: ${value};`;
    })
    .filter(Boolean)
    .join("\n");
}

function indent(str) {
  return str
    .split("\n")
    .map((line) => (line ? "  " + line : line))
    .join("\n");
}

function resolveSelector(selector, component) {
  if (!selector || !component) {
    return null;
  }

  const componentId = component.props?.id || component.id;

  if (!componentId) {
    return null;
  }

  const elementType = toElementType(component);

  if (!elementType) {
    return null;
  }

  const base = `${elementType}[data-pc-id="${componentId}"][data-pc-id="${componentId}"]`;

  if (selector.includes("&")) {
    return selector.replace(/&/g, base);
  }

  return `${base}${selector}`;
}

function toElementType(component) {
  const type = component.type;

  if (typeof type !== "string") {
    return null;
  }

  switch (type) {
    case "Alert":
      return "div";
    case "Badge":
      return "span";
    case "Button":
      const href = sanitizeString(component.props?.href);

      if (href) {
        return "a";
      }

      return "button";
    case "Card":
      if (["article", "div", "form", "section"].includes(component.props?.element)) {
        return component.props.element;
      }

      return "div";
    case "Checkbox":
      return "input";
    case "Dialog":
      return "dialog";
    case "Divider":
      return "hr";
    case "Element":
      return component.props?.element || "div";
    case "Footer":
      return "footer";
    case "Form":
      return "form";
    case "Grid":
      return "div";
    case "Heading":
      if (["1", "2", "3", "4", "5", "6"].includes(component.props?.level)) {
        return `h${component.props.level}`;
      }

      return "h1";
    case "Image":
      return "div";
    case "Input":
      return "input";
    case "Label":
      return "label";
    case "Link":
      return "a";
    case "List":
      if (["ol", "ul"].includes(component.props?.element)) {
        return component.props.element;
      }

      return "ul";
    case "ListItem":
      return "li";
    case "Map":
      return "div";
    case "MenuBar":
      return "header";
    case "Page":
      return "section";
    case "RadioGroup":
      return "fieldset";
    case "RichText":
      return "div";
    case "Section":
      if (["article", "aside", "details", "div", "figcaption", "figure", "footer", "header", "main", "nav", "section", "summary"].includes(component.props?.element)) {
        return component.props.element;
      }

      return "div";
    case "Select":
      if (component.props?.isCustom) {
        return "div";
      }

      return "select";
    case "SideBar":
      return "aside";
    case "Spacer":
      return "div";
    case "Spinner":
      return "div";
    case "Switch":
      return "div";
    case "Table":
      return "table";
    case "TableData":
      return "td";
    case "TableHeader":
      return "th";
    case "TableRow":
      return "tr";
    case "Text":
      if (["div", "p", "small", "span", "strong"].includes(component.props?.element)) {
        return component.props.element;
      }

      return "p";
    case "TextArea":
      return "textarea";
    default:
      return null;
  }
}

function toKebabCase(str) {
  return str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}

function wrapWithMedia(media, block, indentation = "") {
  switch (media) {
    case "mobile":
      return `
${indentation}@media (max-width: 767px) {
${indent(block)}
${indentation}}
`;
    case "tablet":
      return `
${indentation}@media (min-width: 768px) and (max-width: 1023px) {
${indent(block)}
${indentation}}
`;
    case "desktop":
      return `
${indentation}@media (min-width: 1024px) {
${indent(block)}
${indentation}}
`;
    default:
      return block;
  }
}
