// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useLayoutEffect } from "react";

import { classNames } from "../runtime/style/classNames";
import { createTabPaneItemSchema } from "./TabPaneItemSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";
import { useTabPane } from "../tab-pane/TabPaneContext";

import importedStyles from "./TabPaneItem.module.css";

const SCHEMA = createTabPaneItemSchema();

export default function TabPaneItem({ children, componentId, componentIndex, editor, isVisible, styles = importedStyles, title, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "tab_pane_item");
  const editorProps = getEditorProps(editor);

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  const id = `${componentId}${typeof componentIndex === "number" ? "-" + componentIndex : ""}`;

  const { removeTabPaneItem, tabPaneItemId, updateTabPaneItem } = useTabPane();

  useLayoutEffect(() => {
    updateTabPaneItem(id, title, isVisible === null || isVisible === undefined || isVisible === true);
  }, [id, isVisible, removeTabPaneItem, title, updateTabPaneItem]);

  if (typeof isVisible === "boolean" && !isVisible && id === tabPaneItemId) {
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
    <div className={classNames(styles.tab_pane_item, id !== tabPaneItemId ? styles.tab_pane_item_hidden : undefined, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      {id === tabPaneItemId && !isEmpty && children}
      {id === tabPaneItemId && editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles.tab_pane_item_drop_zone}>Drop the component here</div>}
    </div>
  );
}
