// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { classNames } from "../runtime/style/classNames";
import { createFormSchema } from "./FormSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";
import { sanitizeFunction } from "../runtime/props/sanitizeFunction";

import importedStyles from "./Form.module.css";

const SCHEMA = createFormSchema();

export default function Form({ children, componentId, editor, isVisible, onSubmit, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "form");
  const editorProps = getEditorProps(editor);

  const safeOnSubmit = sanitizeFunction(onSubmit);

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  function onSubmitImpl(e) {
    e.preventDefault();

    if (typeof safeOnSubmit === "function") {
      safeOnSubmit(e);
    }
  }

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <form className={classNames(styles.form, styles.form_invisible, ...editorClasses)} data-pc-id={componentId} onSubmit={onSubmitImpl} style={style} {...editorProps}>
          Invisible
        </form>
      );
    }

    return null;
  }

  return (
    <form className={classNames(styles.form, ...editorClasses)} data-pc-id={componentId} onSubmit={onSubmitImpl} style={style} {...editorProps}>
      {!isEmpty && children}
      {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles.form_drop_zone}>Drop the component here</div>}
    </form>
  );
}
