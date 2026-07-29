// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { classNames } from "../runtime/style/classNames";
import { createAccordionSchema } from "./AccordionSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./Accordion.module.css";

const SCHEMA = createAccordionSchema();

export default function Accordion({ children, componentId, editor, isVisible, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "accordion");
  const editorProps = getEditorProps(editor);

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <div className={classNames(styles.accordion, styles.accordion_invisible, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
          Invisible
        </div>
      );
    }

    return null;
  }

  return (
    <div className={classNames(styles.accordion, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      {!isEmpty && children}
      {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles.accordion_drop_zone}>Drop the component here</div>}
    </div>
  );
}
