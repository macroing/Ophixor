// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import puppeteer from "puppeteer";

import { createPageSchema } from "../../components/page/PageSchema";
import { generateId } from "../identity/generateId";

const PAGE_SCHEMA = createPageSchema();

const CSS_PROPERTIES = {
  "align-content": true,
  "align-items": true,
  "align-self": true,
  animation: true,
  "animation-delay": true,
  "animation-direction": true,
  "animation-duration": true,
  "animation-fill-mode": true,
  "animation-iteration-count": true,
  "animation-name": true,
  "animation-play-state": true,
  "animation-timing-function": true,
  "backface-visibility": true,
  background: true,
  "background-attachment": true,
  "background-clip": true,
  "background-color": true,
  "background-image": true,
  "background-origin": true,
  "background-position": true,
  "background-repeat": true,
  "background-size": true,
  border: true,
  "border-bottom": true,
  "border-bottom-color": true,
  "border-bottom-left-radius": true,
  "border-bottom-right-radius": true,
  "border-bottom-style": true,
  "border-bottom-width": true,
  "border-collapse": true,
  "border-color": true,
  "border-image": true,
  "border-image-outset": true,
  "border-image-repeat": true,
  "border-image-slice": true,
  "border-image-source": true,
  "border-image-width": true,
  "border-left": true,
  "border-left-color": true,
  "border-left-style": true,
  "border-left-width": true,
  "border-radius": true,
  "border-right": true,
  "border-right-color": true,
  "border-right-style": true,
  "border-right-width": true,
  "border-spacing": true,
  "border-style": true,
  "border-top": true,
  "border-top-color": true,
  "border-top-left-radius": true,
  "border-top-right-radius": true,
  "border-top-style": true,
  "border-top-width": true,
  "border-width": true,
  bottom: true,
  "box-shadow": true,
  "box-sizing": true,
  "caption-side": true,
  clear: true,
  clip: true,
  color: true,
  "column-count": true,
  "column-fill": true,
  "column-gap": true,
  "column-rule": true,
  "column-rule-color": true,
  "column-rule-style": true,
  "column-rule-width": true,
  "column-span": true,
  "column-width": true,
  columns: true,
  content: true,
  "counter-increment": true,
  "counter-reset": true,
  cursor: true,
  direction: true,
  display: true,
  "empty-cells": true,
  flex: true,
  "flex-basis": true,
  "flex-direction": true,
  "flex-flow": true,
  "flex-grow": true,
  "flex-shrink": true,
  "flex-wrap": true,
  float: true,
  font: true,
  "font-family": true,
  "font-size": true,
  "font-size-adjust": true,
  "font-stretch": true,
  "font-style": true,
  "font-variant": true,
  "font-weight": true,
  height: true,
  "justify-content": true,
  left: true,
  "letter-spacing": true,
  "line-height": true,
  "list-style": true,
  "list-style-image": true,
  "list-style-position": true,
  "list-style-type": true,
  margin: true,
  "margin-bottom": true,
  "margin-left": true,
  "margin-right": true,
  "margin-top": true,
  "max-height": true,
  "max-width": true,
  "min-height": true,
  "min-width": true,
  opacity: true,
  order: true,
  outline: true,
  "outline-color": true,
  "outline-offset": true,
  "outline-style": true,
  "outline-width": true,
  overflow: true,
  "overflow-x": true,
  "overflow-y": true,
  padding: true,
  "padding-bottom": true,
  "padding-left": true,
  "padding-right": true,
  "padding-top": true,
  "page-break-after": true,
  "page-break-before": true,
  "page-break-inside": true,
  perspective: true,
  "perspective-origin": true,
  position: true,
  quotes: true,
  resize: true,
  right: true,
  "tab-size": true,
  "table-layout": true,
  "text-align": true,
  "text-align-last": true,
  "text-decoration": true,
  "text-decoration-color": true,
  "text-decoration-line": true,
  "text-decoration-style": true,
  "text-indent": true,
  "text-justify": true,
  "text-overflow": true,
  "text-shadow": true,
  "text-transform": true,
  top: true,
  transform: true,
  "transform-origin": true,
  "transform-style": true,
  transition: true,
  "transition-delay": true,
  "transition-duration": true,
  "transition-property": true,
  "transition-timing-function": true,
  "vertical-align": true,
  visibility: true,
  "white-space": true,
  width: true,
  "word-break": true,
  "word-spacing": true,
  "word-wrap": true,
  "z-index": true,
};

export async function scrapeAndConvert(url) {
  const browser = await puppeteer.launch({
    headless: "new",
    protocolTimeout: 360_000,
    defaultViewport: {
      width: 1692,
      height: 720,
    },
  });

  async function dismissDialogs(page) {
    const actions = [
      { selector: "#c-p-bn" },
      {
        text: "Företagskund",
        selector: ".vat-popup .button.is-primary",
      },
      { text: "Accept" },
      { text: "Accept all" },
      { text: "Allow" },
      { text: "OK" },
      { text: "Okej" },
      { text: "Godkänn" },
      { text: "Godkänn alla" },
      { text: "Agree" },
      { text: "Continue" },
    ];

    for (let attempt = 0; attempt < 5; attempt++) {
      let clicked = false;

      for (const action of actions) {
        try {
          if (action.selector) {
            const element = await page.$(action.selector);

            if (element) {
              await element.click();

              clicked = true;

              await page.waitForTimeout(1000);

              continue;
            }
          }

          if (action.text) {
            const success = await page.evaluate((text) => {
              const elements = Array.from(document.querySelectorAll('button, a, input[type="button"], input[type="submit"]'));

              const target = elements.find((el) => el.innerText?.trim().toLowerCase().includes(text.toLowerCase()));

              if (target) {
                target.click();

                return true;
              }

              return false;
            }, action.text);

            if (success) {
              clicked = true;

              await page.waitForTimeout(1000);
            }
          }
        } catch (error) {
          console.warn("Dialog action failed:", error.message);
        }
      }

      if (!clicked) {
        break;
      }
    }
  }

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  await dismissDialogs(page);

  page.on("console", (msg) => {
    console.log(msg.text());
  });

  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);

    await new Promise((r) => setTimeout(r, 5000));
  });

  const pageSourceHTML = await page.content();

  const tree = await page.evaluate((properties) => {
    const cache = {};

    class Styles {
      static getStylesIframe() {
        if (typeof window.blankIframe != "undefined") {
          return window.blankIframe;
        }

        window.blankIframe = document.createElement("iframe");

        document.body.appendChild(window.blankIframe);

        return window.blankIframe;
      }

      static getStylesObject(node, parentWindow) {
        const styles = parentWindow.getComputedStyle(node);

        let stylesObject = {};

        for (let i = 0; i < styles.length; i++) {
          const property = styles[i];

          stylesObject[property] = styles[property];
        }

        return stylesObject;
      }

      static getDefaultStyles(node) {
        const tag = node.tagName;

        if (cache[tag]) {
          return cache[tag];
        }

        const iframe = Styles.getStylesIframe();
        const iframeDocument = iframe.contentDocument;
        const targetElement = iframeDocument.createElement(node.tagName);

        iframeDocument.body.appendChild(targetElement);

        cache[tag] = Styles.getStylesObject(targetElement, iframe.contentWindow);

        targetElement.remove();

        return cache[tag];
      }

      static getUserStyles(node) {
        const defaultStyles = Styles.getDefaultStyles(node);
        const styles = Styles.getStylesObject(node, window);

        let userStyles = {};

        for (let property in defaultStyles) {
          if (styles[property] != defaultStyles[property]) {
            userStyles[property] = styles[property];
          }
        }

        return userStyles;
      }
    }

    function buildStylesheetIndex() {
      const cache = {
        rules: [],
      };

      let order = 0;

      for (const sheet of Array.from(document.styleSheets || [])) {
        let rules = [];

        try {
          rules = Array.from(sheet.cssRules || []);
        } catch {
          continue;
        }

        walkRules(rules, {
          media: "",
          supports: "",
        });
      }

      function getSpecificity(selector) {
        const ids = (selector.match(/#[\w-]+/g) || []).length;

        const classes = (selector.match(/\.[\w-]+/g) || []).length + (selector.match(/\[[^\]]+\]/g) || []).length + (selector.match(/:(?!:)[\w-]+/g) || []).length;

        const tags = (selector.match(/\b[a-z]+\b/gi) || []).length + (selector.match(/::[\w-]+/g) || []).length;

        return [ids, classes, tags];
      }

      function splitSelectors(text = "") {
        const result = [];

        let current = "";
        let depth = 0;

        for (const char of text) {
          if (char === "(" || char === "[") {
            depth++;
          }

          if (char === ")" || char === "]") {
            depth--;
          }

          if (char === "," && depth === 0) {
            result.push(current.trim());

            current = "";

            continue;
          }

          current += char;
        }

        if (current.trim()) {
          result.push(current.trim());
        }

        return result;
      }

      function walkRules(rules, context) {
        for (const rule of rules) {
          if (!rule) {
            continue;
          }

          if (rule.type === CSSRule.STYLE_RULE) {
            const selectors = splitSelectors(rule.selectorText);

            for (const selector of selectors) {
              const declarations = {};
              const important = {};

              for (const prop of Array.from(rule.style)) {
                declarations[prop] = rule.style.getPropertyValue(prop).trim();

                important[prop] = rule.style.getPropertyPriority(prop) === "important";
              }

              cache.rules.push({
                selector,
                declarations,
                important,
                specificity: getSpecificity(selector),
                media: context.media,
                supports: context.supports,
                order: order++,
              });
            }

            continue;
          }

          if (rule.type === CSSRule.MEDIA_RULE) {
            walkRules(Array.from(rule.cssRules || []), {
              ...context,
              media: rule.conditionText,
            });

            continue;
          }

          if (rule.type === CSSRule.SUPPORTS_RULE) {
            walkRules(Array.from(rule.cssRules || []), {
              ...context,
              supports: rule.conditionText,
            });

            continue;
          }

          if (rule.styleSheet) {
            let imported = [];

            try {
              imported = Array.from(rule.styleSheet.cssRules || []);
            } catch {
              continue;
            }

            walkRules(imported, context);
          }
        }
      }

      return cache;
    }

    function compareRules(a, b) {
      for (let i = 0; i < 3; i++) {
        if (a.specificity[i] !== b.specificity[i]) {
          return a.specificity[i] - b.specificity[i];
        }
      }

      return a.order - b.order;
    }

    function getAuthoredStyles(node, cache) {
      const matched = [];

      for (const rule of cache.rules) {
        try {
          if (!node.matches(rule.selector)) {
            continue;
          }
        } catch {
          continue;
        }

        if (rule.media && !matchMedia(rule.media).matches) {
          continue;
        }

        if (rule.supports && !CSS.supports(rule.supports)) {
          continue;
        }

        matched.push(rule);
      }

      matched.sort(compareRules);

      const result = {};

      for (const rule of matched) {
        for (const [prop, value] of Object.entries(rule.declarations)) {
          result[prop] = value;
        }
      }

      return result;
    }

    function getFilteredStyles(node, authored, properties = {}) {
      const computed = getComputedStyle(node);
      const defaults = Styles.getDefaultStyles(node);

      const filtered = {};

      const props = Array.from(computed);

      for (const prop of props) {
        if (!properties[prop]) {
          continue;
        }

        const computedValue = computed.getPropertyValue(prop)?.trim() || "";
        const defaultValue = defaults[prop]?.trim() || "";
        const inlineValue = node.style?.getPropertyValue(prop)?.trim() || "";
        const ruleValue = authored[prop]?.trim() || "";

        const authoredValue = inlineValue || ruleValue || "";

        const isDifferentFromDefault = computedValue !== defaultValue;
        const hasAuthoredValue = !!authoredValue;

        if (isDifferentFromDefault || hasAuthoredValue) {
          filtered[prop] = {
            authored: authoredValue,
            computed: computedValue,
            default: defaultValue,
            inline: inlineValue,
            ruleValue,
          };
        }
      }

      return filtered;
    }

    const styleCache = buildStylesheetIndex();

    function walk(node) {
      if (!(node instanceof Element)) {
        return null;
      }

      const authored = getAuthoredStyles(node, styleCache);

      const styles = getFilteredStyles(node, authored, properties);

      return {
        tag: node.tagName.toLowerCase(),
        text: node.childNodes.length === 1 && node.childNodes[0].nodeType === 3 ? node.textContent : null,
        attributes: Array.from(node.attributes).reduce((acc, attr) => {
          acc[attr.name] = attr.value;

          return acc;
        }, {}),
        styles,
        children: Array.from(node.children).map(walk),
      };
    }

    return walk(document.body);
  }, CSS_PROPERTIES);

  await browser.close();

  const parsedUrl = URL.parse(url);
  const rootUrl = (parsedUrl?.protocol || "") + (parsedUrl?.protocol ? "//" : "") + (parsedUrl?.host || "");

  return { html: pageSourceHTML, json: buildSchema(tree, rootUrl) };
}

function buildSchema(tree, rootUrl) {
  const child = convertNode(tree, rootUrl);

  return {
    id: generateId("page"),
    props: {
      backgroundColor: "transparent",
      gap: "0px",
      height: "auto",
      padding: "0px",
      width: "auto",
    },
    slots: {
      body: [child],
    },
    type: "Page",
  };
}

function convertNode(node, rootUrl, parentTag = null, depth = 1) {
  if (!node) {
    return null;
  }

  const type = mapTagToComponent(node.tag);

  if (!type) {
    return null;
  }

  const id = generateId(type.toLowerCase());

  const schema = PAGE_SCHEMA.componentSchemas[type];

  const props = mapStylesToProps(node.styles, schema, type, node, depth);

  if (type === "Element") {
    props.element = node.tag === "body" ? "div" : node.tag;
    props.text = node.text?.trim() || "";

    props.alt = node.attributes.alt || "";
    props.src = node.attributes.src || "";

    if (props.src.startsWith("/")) {
      props.src = rootUrl + props.src;
    }

    props.href = node.attributes.href || "";

    if (props.href.startsWith("/")) {
      props.href = rootUrl + props.href;
    }
  }

  const children = node.children
    .map((child) => convertNode(child, rootUrl, node.tag, depth + 1))
    .flat()
    .filter(Boolean);

  return {
    id,
    type,
    props,
    slots: {
      body: children,
    },
  };
}

function mapStylesToProps(styles, schema, type, node, depth) {
  const props = {};

  Object.entries(schema?.props || {}).forEach(([schemaPropName, schemaPropValue]) => {
    const cssProperty = schemaPropValue?.cssProperty;

    if (cssProperty) {
      if (type === "Grid" || type === "Section") {
        if (cssProperty === "border-color") {
          props[schemaPropName] = "transparent";
        }

        if (cssProperty === "border-width") {
          props[schemaPropName] = "0";
        }
      }

      if (cssProperty === "border" || cssProperty === "border-bottom" || cssProperty === "border-left" || cssProperty === "border-right" || cssProperty === "border-top") {
        props[schemaPropName] = "none";
      }

      if (cssProperty === "margin" || cssProperty === "margin-bottom" || cssProperty === "margin-left" || cssProperty === "margin-right" || cssProperty === "margin-top") {
        props[schemaPropName] = "0";
      }

      if (cssProperty === "padding" || cssProperty === "padding-bottom" || cssProperty === "padding-left" || cssProperty === "padding-right" || cssProperty === "padding-top") {
        props[schemaPropName] = "0";
      }

      if (cssProperty === "position") {
        props[schemaPropName] = "static";
      }
    }
  });

  Object.entries(styles || {}).forEach(([stylePropertyName, stylePropertyValue]) => {
    if (typeof stylePropertyName === "string") {
      const authored = stylePropertyValue?.authored || "";
      const computed = stylePropertyValue?.computed || "";
      const defaultName = stylePropertyValue?.default || "";
      const inline = stylePropertyValue?.inline || "";
      const ruleValue = stylePropertyValue?.ruleValue || "";

      let hasFound = false;

      Object.entries(schema?.props || {}).forEach(([schemaPropName, schemaPropValue]) => {
        if (stylePropertyName === schemaPropValue?.cssProperty) {
          if (authored && !authored.startsWith("var(")) {
            props[schemaPropName] = authored;
          } else {
            props[schemaPropName] = computed;
          }

          if (stylePropertyName === "position" && props[schemaPropName] === "fixed") {
            props[schemaPropName] = "absolute";
          }

          if (stylePropertyName === "height" && depth === 1) {
            //props[schemaPropName] = "auto";
          }

          if (stylePropertyName === "width" && depth === 1) {
            //props[schemaPropName] = "100%";
          }

          hasFound = true;
        }
      });

      if (!hasFound && stylePropertyName !== "box-sizing") {
        console.log(type + " is lacking " + stylePropertyName);
      }
    }
  });

  return props;
}

function mapTagToComponent(tag) {
  if (tag === "head" || tag === "html" || tag === "script") {
    return null;
  }

  return "Element";
}
