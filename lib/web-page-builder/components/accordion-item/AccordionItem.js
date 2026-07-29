// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/pro-solid-svg-icons";

import Icon from "../editor/Icon";
import { classNames } from "../runtime/style/classNames";
import { createAccordionItemSchema } from "./AccordionItemSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";
import { sanitizeStringOrNumber } from "../runtime/props/sanitizeStringOrNumber";

import importedStyles from "./AccordionItem.module.css";

const SCHEMA = createAccordionItemSchema();

export default function AccordionItem({ children, componentId, editor, isExpanded, isVisible, styles = importedStyles, title, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "accordion_item");
  const editorProps = getEditorProps(editor);

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  const safeTitle = sanitizeStringOrNumber(title);

  const [isSafeExpanded, setIsSafeExpanded] = useState(typeof isExpanded === "boolean" ? isExpanded : Boolean(isExpanded));

  function onClickToggle(e) {
    setIsSafeExpanded(!isSafeExpanded);
  }

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <div className={classNames(styles.accordion_item, styles.accordion_item_invisible, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
          Invisible
        </div>
      );
    }

    return null;
  }

  return (
    <div className={classNames(styles.accordion_item, !isSafeExpanded ? styles.accordion_item_collapsed : undefined, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      <div className={styles.title} onClick={onClickToggle}>
        {safeTitle}
        <Icon icon={isSafeExpanded ? faChevronUp : faChevronDown} size={12} />
      </div>
      {isSafeExpanded && (
        <div className={styles.content}>
          {!isEmpty && children}
          {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles.accordion_item_drop_zone}>Drop the component here</div>}
        </div>
      )}
    </div>
  );
}
