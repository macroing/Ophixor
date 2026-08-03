// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useState } from "react";

import { TabPaneProvider } from "./TabPaneContext";
import { classNames } from "../runtime/style/classNames";
import { createTabPaneSchema } from "./TabPaneSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";
import { sanitizeStringOrNumber } from "../runtime/props/sanitizeStringOrNumber";

import importedStyles from "./TabPane.module.css";

const SCHEMA = createTabPaneSchema();

export default function TabPane({ children, component, componentId, editor, isVisible, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "tab_pane");
  const editorProps = getEditorProps(editor);

  const [tabPaneItemId, setTabPaneItemId] = useState(null);
  const [tabPaneItems, setTabPaneItems] = useState([]);

  function onClick(e, currentTabPaneItemId) {
    setTabPaneItemId(currentTabPaneItemId);
  }

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <div className={classNames(styles.tab_pane, styles.tab_pane_invisible, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
          Invisible
        </div>
      );
    }

    return null;
  }

  return (
    <TabPaneProvider editor={editor} setTabPaneItemId={setTabPaneItemId} setTabPaneItems={setTabPaneItems} tabPaneItemId={tabPaneItemId} tabPaneItems={tabPaneItems}>
      <div className={classNames(styles.tab_pane, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
        <div className={styles.tabs}>
          {tabPaneItems.map((currentTabPaneItem) =>
            (editor && !editor.isShowingContentOnly) || currentTabPaneItem?.isVisible ? (
              <div className={styles.tab + (tabPaneItemId === currentTabPaneItem.id ? " " + styles.tab_selected : "") + (!currentTabPaneItem.isVisible ? " " + styles.tab_invisible : "")} key={"tab-pane-item-" + currentTabPaneItem.id} onClick={(e) => onClick(e, currentTabPaneItem.id)}>
                {sanitizeStringOrNumber(currentTabPaneItem?.title ?? "")}
              </div>
            ) : null,
          )}
        </div>
        <div className={styles.content}>
          {children}
          {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles.tab_pane_drop_zone}>Drop the component here</div>}
        </div>
      </div>
    </TabPaneProvider>
  );
}
