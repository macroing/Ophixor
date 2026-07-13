// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { classNames } from "../runtime/style/classNames";
import { createBadgeSchema } from "./BadgeSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";
import { sanitizeStringOrNumber } from "../runtime/props/sanitizeStringOrNumber";

import importedStyles from "./Badge.module.css";

const SCHEMA = createBadgeSchema();

const THEMES = new Set(["danger", "primary", "success", "warning"]);

export default function Badge({ children, componentId, editor, isVisible, styles = importedStyles, text, theme, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "badge", true);
  const editorProps = getEditorProps(editor, true);

  const themeClass = THEMES.has(theme) ? styles[`badge_${theme}`] : undefined;

  const safeText = sanitizeStringOrNumber(text);

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <span className={classNames(styles.badge, styles.badge_invisible, ...editorClasses, themeClass)} data-pc-id={componentId} style={style} {...editorProps}>
          Invisible
        </span>
      );
    }

    return null;
  }

  return (
    <span className={classNames(styles.badge, ...editorClasses, themeClass)} data-pc-id={componentId} style={style} {...editorProps}>
      {safeText}
      {children}
    </span>
  );
}
