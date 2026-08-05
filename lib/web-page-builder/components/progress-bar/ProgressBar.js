// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { classNames } from "../runtime/style/classNames";
import { createProgressBarSchema } from "./ProgressBarSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./ProgressBar.module.css";

const SCHEMA = createProgressBarSchema();

export default function ProgressBar({ componentId, editor, isVisible, onChange, styles = importedStyles, value, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "progress_bar", true);
  const editorProps = getEditorProps(editor, true);

  const safeValue = Math.max(Math.min(Math.round(typeof value === "number" ? value : Number(value)), 100), 0);

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <div className={classNames(styles.progress_bar, styles.progress_bar_invisible, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
          Invisible
        </div>
      );
    }

    return null;
  }

  return (
    <div className={classNames(styles.progress_bar, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      {safeValue > 0 && (
        <div className={styles.progress} style={{ width: `${safeValue}%` }}>
          {safeValue}%
        </div>
      )}
    </div>
  );
}
