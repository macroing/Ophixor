// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { classNames } from "../runtime/style/classNames";
import { createMarqueeSchema } from "./MarqueeSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./Marquee.module.css";

const SCHEMA = createMarqueeSchema();

export default function Marquee({ children, componentId, customClassName, duration, editor, isPausingOnHover, isVisible, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "marquee");
  const editorProps = getEditorProps(editor);

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  const safeDuration = typeof duration === "number" ? duration : Number(duration);

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <div className={classNames(styles.marquee, customClassName, styles.marquee_invisible, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
          Invisible
        </div>
      );
    }

    return null;
  }

  return (
    <div className={classNames(styles.marquee, customClassName, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      <div className={classNames(styles.marquee_track, isPausingOnHover ? styles.marquee_track_pause_on_hover : undefined)}>
        <div className={styles.marquee_content} style={{ animationDuration: `${safeDuration}s` }}>
          {!isEmpty && children}
        </div>
        <div aria-hidden={"true"} className={styles.marquee_content} style={{ animationDuration: `${safeDuration}s` }}>
          {!isEmpty && children}
        </div>
      </div>
      {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles.marquee_drop_zone}>Drop the component here</div>}
    </div>
  );
}
