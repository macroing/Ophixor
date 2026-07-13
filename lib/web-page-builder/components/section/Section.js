// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { classNames } from "../runtime/style/classNames";
import { createSectionSchema } from "./SectionSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./Section.module.css";

const ELEMENTS = new Set(["article", "aside", "details", "div", "figcaption", "figure", "footer", "header", "main", "nav", "section", "summary"]);

const SCHEMA = createSectionSchema();

export default function Section({ children, componentId, customClassName, editor, element, isVisible, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "section");
  const editorProps = getEditorProps(editor);

  const SectionElement = typeof element === "string" && ELEMENTS.has(element) ? element : "div";

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <SectionElement className={classNames(styles.section, customClassName, styles.section_invisible, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
          Invisible
        </SectionElement>
      );
    }

    return null;
  }

  return (
    <SectionElement className={classNames(styles.section, customClassName, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      {!isEmpty && children}
      {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles.section_drop_zone}>Drop the component here</div>}
    </SectionElement>
  );
}
