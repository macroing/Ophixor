// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { classNames } from "../runtime/style/classNames";
import { createAlertSchema } from "./AlertSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./Alert.module.css";

const SCHEMA = createAlertSchema();

const THEMES = new Set(["error", "success", "warning"]);

export default function Alert({ children, componentId, editor, isVisible, styles = importedStyles, theme, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "alert");
  const editorProps = getEditorProps(editor);

  const themeClass = THEMES.has(theme) ? styles[`alert_${theme}`] : undefined;

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <div className={classNames(styles.alert, styles.alert_invisible, ...editorClasses, themeClass)} data-pc-id={componentId} style={style} {...editorProps}>
          Invisible
        </div>
      );
    }

    return null;
  }

  return (
    <div className={classNames(styles.alert, ...editorClasses, themeClass)} data-pc-id={componentId} style={style} {...editorProps}>
      {!isEmpty && children}
      {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles.alert_drop_zone}>Drop the component here</div>}
    </div>
  );
}
