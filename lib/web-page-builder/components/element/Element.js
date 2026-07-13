// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { memo, useMemo } from "react";

import { classNames } from "../runtime/style/classNames";
import { createElementSchema } from "./ElementSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";
import { sanitizeString } from "../runtime/props/sanitizeString";
import { sanitizeStringOrNumber } from "../runtime/props/sanitizeStringOrNumber";

import importedStyles from "./Element.module.css";

const ELEMENTS = ["a", "abbr", "acronym", "address", "altglyph", "altglyphdef", "altglyphitem", "animate", "animatemotion", "animatetransform", "annotation", "annotation-xml", "applet", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "circle", "cite", "clippath", "code", "col", "colgroup", "content", "cursor", "data", "datalist", "dd", "defs", "del", "desc", "details", "dfn", "dialog", "dir", "discard", "displaystyle", "div", "dl", "dt", "ellipse", "em", "embed", "feblend", "fecolormatrix", "fecomponenttransfer", "fecomposite", "feconvolvematrix", "fediffuselighting", "fedisplacementmap", "fedistantlight", "fedropshadow", "feflood", "fefunca", "fefuncb", "fefuncg", "fefuncr", "fegaussianblur", "feimage", "femerge", "femergenode", "femorphology", "feoffset", "fepointlight", "fespecularlighting", "fespotlight", "fetile", "feturbulence", "fieldset", "figcaption", "figure", "filter", "font", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "footer", "foreignobject", "form", "frame", "frameset", "g", "glyph", "glyphref", "h1", "h2", "h3", "h4", "h5", "h6", "hatch", "hatchpath", "head", "header", "hkern", "hr", "href", "html", "i", "iframe", "image", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "line", "lineargradient", "link", "maction", "main", "map", "mark", "marker", "marquee", "mask", "math", "mathbackground", "mathcolor", "mathsize", "mathvariant", "menclose", "menu", "menuitem", "merror", "meta", "metadata", "meter", "mfenced", "mfrac", "mi", "missing-glyph", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mpath", "mphantom", "mprescripts", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msubsup", "msup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "nav", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "path", "pattern", "picture", "plaintext", "polygon", "polyline", "portal", "pre", "progress", "q", "radialgradient", "rb", "rect", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "scriptlevel", "section", "select", "semantics", "set", "shadow", "slot", "small", "source", "spacer", "span", "stop", "strike", "strong", "style", "sub", "summary", "sup", "svg", "switch", "symbol", "table", "tbody", "td", "template", "text", "textarea", "textpath", "tfoot", "th", "thead", "time", "title", "tr", "track", "tref", "tspan", "tt", "u", "ul", "use", "var", "video", "view", "vkern", "wbr", "xmp"];

const SCHEMA = createElementSchema();

const VOID_ELEMENTS = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "textarea", "track", "wbr"];

const Element = memo(function Element({ alt, children, componentId, editor, element, href, isVisible, src, styles = importedStyles, text, ...styleProps }) {
  const style = useMemo(() => resolveStyle(styleProps, SCHEMA), [styleProps]);

  const editorClasses = getEditorClasses(editor, styles, "element");
  const editorProps = getEditorProps(editor);

  const ElementElement = typeof element === "string" && ELEMENTS.includes(element) ? element : "div";

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  const isVoidElement = typeof element === "string" && VOID_ELEMENTS.includes(element);

  const safeHref = sanitizeString(href, true);
  const safeAlt = sanitizeString(alt, true);
  const safeSrc = sanitizeString(src, true);
  const safeText = sanitizeStringOrNumber(text);

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      if (isVoidElement) {
        return <ElementElement alt={safeAlt} className={classNames(styles.element, styles.element_invisible, ...editorClasses)} data-pc-id={componentId} href={safeHref} src={safeSrc} style={style} {...editorProps} />;
      }

      return (
        <ElementElement alt={safeAlt} className={classNames(styles.element, styles.element_invisible, ...editorClasses)} data-pc-id={componentId} href={safeHref} src={safeSrc} style={style} {...editorProps}>
          Invisible
        </ElementElement>
      );
    }

    return null;
  }

  if (isVoidElement) {
    return <ElementElement alt={safeAlt} className={classNames(styles.element, ...editorClasses)} data-pc-id={componentId} href={safeHref} src={safeSrc} style={style} {...editorProps} />;
  }

  return (
    <ElementElement alt={safeAlt} className={classNames(styles.element, ...editorClasses)} data-pc-id={componentId} href={safeHref} src={safeSrc} style={style} {...editorProps}>
      {safeText}
      {!isEmpty && children}
      {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles.element_drop_zone}>Drop the component here</div>}
    </ElementElement>
  );
});

export default Element;
