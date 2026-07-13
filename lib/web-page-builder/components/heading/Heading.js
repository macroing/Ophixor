// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { classNames } from "../runtime/style/classNames";
import { createHeadingSchema } from "./HeadingSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";
import { sanitizeStringOrNumber } from "../runtime/props/sanitizeStringOrNumber";

import importedStyles from "./Heading.module.css";

const LEVELS = new Set(["1", "2", "3", "4", "5", "6"]);

const SCHEMA = createHeadingSchema();

export default function Heading({ children, componentId, customClassName, editor, level = "1", styles = importedStyles, text, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "heading");
  const editorProps = getEditorProps(editor);

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  const safeText = sanitizeStringOrNumber(text);

  const HeadingElement = (typeof level === "string" || typeof level === "number") && LEVELS.has(String(level)) ? `h${String(level)}` : "h1";

  return (
    <HeadingElement className={classNames(styles.heading, customClassName, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      {safeText}
      {!isEmpty && children}
      {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <span className={styles.heading_drop_zone}>Drop the component here</span>}
    </HeadingElement>
  );
}
