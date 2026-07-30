// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { classNames } from "../runtime/style/classNames";
import { createTabPaneItemSchema } from "./TabPaneItemSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./TabPaneItem.module.css";

const SCHEMA = createTabPaneItemSchema();

export default function TabPaneItem({ children, componentId, editor, isVisible, styles = importedStyles, title, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "tab_pane_item");
  const editorProps = getEditorProps(editor);

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <div className={classNames(styles.tab_pane_item, styles.tab_pane_item_invisible, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
          Invisible
        </div>
      );
    }

    return null;
  }

  return (
    <div className={classNames(styles.tab_pane_item, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      {!isEmpty && children}
      {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles.tab_pane_item_drop_zone}>Drop the component here</div>}
    </div>
  );
}
