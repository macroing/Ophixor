// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { classNames } from "../runtime/style/classNames";
import { createTextSchema } from "./TextSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";
import { sanitizeStringOrNumber } from "../runtime/props/sanitizeStringOrNumber";

import importedStyles from "./Text.module.css";

const ELEMENTS = new Set(["div", "p", "small", "span", "strong"]);

const SCHEMA = createTextSchema();

export default function Text({ children, componentId, customClassName, display, editor, element = "p", isVisible, styles = importedStyles, text, title, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "text");
  const editorProps = getEditorProps(editor);

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  const safeText = sanitizeStringOrNumber(text);
  const safeTitle = sanitizeStringOrNumber(title);

  const TextElement = typeof element === "string" && ELEMENTS.has(element) ? element : "p";

  if (typeof display === "string" && display !== "") {
    style["--text-display"] = display;
  } else if (element === "div") {
    style["--text-display"] = "inline-block";
  } else if (element === "p") {
    style["--text-display"] = "inline-block";
  } else if (element === "small") {
    style["--text-display"] = "inline";
  } else if (element === "span") {
    style["--text-display"] = "inline";
  } else if (element === "strong") {
    style["--text-display"] = "inline";
  }

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <TextElement className={classNames(styles.text, styles.text_invisible, customClassName, ...editorClasses)} data-pc-id={componentId} style={style} title={safeTitle} {...editorProps}>
          Invisible
        </TextElement>
      );
    }

    return null;
  }

  return (
    <TextElement className={classNames(styles.text, customClassName, ...editorClasses)} data-pc-id={componentId} style={style} title={safeTitle} {...editorProps}>
      {safeText}
      {!isEmpty && children}
      {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <span className={styles.text_drop_zone}>Drop the component here</span>}
    </TextElement>
  );
}
