// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import Link from "next/link";

import { classNames } from "../runtime/style/classNames";
import { createButtonSchema } from "./ButtonSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";
import { sanitizeBoolean } from "../runtime/props/sanitizeBoolean";
import { sanitizeFunction } from "../runtime/props/sanitizeFunction";
import { sanitizeString } from "../runtime/props/sanitizeString";
import { sanitizeStringOrNumber } from "../runtime/props/sanitizeStringOrNumber";

import importedStyles from "./Button.module.css";

const SCHEMA = createButtonSchema();

const THEMES = new Set(["danger", "primary"]);

export default function Button({ children, componentId, disabled, draggable, editor, href, id, isVisible, onClick, onDragStart, rel, resolveUrl, styles = importedStyles, target, text, theme, type, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "button");
  const editorProps = getEditorProps(editor, false, { draggable, onDragStart });

  const themeClass = THEMES.has(theme) ? styles[`button_${theme}`] : undefined;

  const safeDisabled = sanitizeBoolean(disabled);
  const safeHref = sanitizeString(href);
  const safeId = sanitizeString(id, true);
  const safeOnClick = sanitizeFunction(onClick);
  const safeRel = sanitizeString(rel);
  const safeTarget = sanitizeString(target);
  const safeText = sanitizeStringOrNumber(text);
  const safeType = sanitizeString(type, true);

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      if (safeHref) {
        return (
          <Link className={classNames(styles.button, styles.button_invisible, ...editorClasses, themeClass)} data-pc-id={componentId} href={typeof resolveUrl === "function" ? resolveUrl(safeHref) : safeHref} id={safeId} rel={safeRel} style={style} target={safeTarget} {...editorProps}>
            Invisible
          </Link>
        );
      }

      return (
        <button className={classNames(styles.button, styles.button_invisible, ...editorClasses, themeClass)} data-pc-id={componentId} disabled={safeDisabled} id={safeId} onClick={safeOnClick} style={style} type={safeType} {...editorProps}>
          Invisible
        </button>
      );
    }

    return null;
  }

  if (safeHref) {
    return (
      <Link className={classNames(styles.button, ...editorClasses, themeClass)} data-pc-id={componentId} href={typeof resolveUrl === "function" ? resolveUrl(safeHref) : safeHref} id={safeId} rel={safeRel} style={style} target={safeTarget} {...editorProps}>
        {safeText}
        {children}
        {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles.button_drop_zone}>Drop the component here</div>}
      </Link>
    );
  }

  return (
    <button className={classNames(styles.button, ...editorClasses, themeClass)} data-pc-id={componentId} disabled={safeDisabled} id={safeId} onClick={safeOnClick} style={style} type={safeType} {...editorProps}>
      {safeText}
      {children}
      {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles.button_drop_zone}>Drop the component here</div>}
    </button>
  );
}

export function DarkButton({ children, ...rest }) {
  return (
    <Button {...createDarkButtonProps()} {...rest}>
      {children}
    </Button>
  );
}

function createDarkButtonProps() {
  return {
    background: "linear-gradient(180deg, #2d3748, #1f2937)",
    backgroundColor: "#1f2937",
    backgroundColorDanger: "#7f1d1d",
    backgroundColorDangerHover: "#b91c1c",
    backgroundColorHover: "#374151",
    backgroundColorPrimary: "#6366f1",
    backgroundColorPrimaryHover: "#7c82ff",
    backgroundDanger: "linear-gradient(180deg, #991b1b, #7f1d1d)",
    backgroundDangerHover: "linear-gradient(180deg, #b91c1c, #7f1d1d)",
    backgroundHover: "linear-gradient(180deg, #374151, #1f2937)",
    backgroundPrimary: "linear-gradient(180deg, #6366f1, #4f46e5)",
    backgroundPrimaryHover: "linear-gradient(180deg, #7c82ff, #4f46e5)",
    borderColor: "#2d3748",
    borderColorDanger: "#991b1b",
    borderColorDangerHover: "#7f1d1d",
    borderColorHover: "#4b5563",
    borderColorPrimary: "#4f46e5",
    borderColorPrimaryHover: "#6366f1",
    borderRadius: "4px",
    color: "#e5e7eb",
    colorDanger: "#fecaca",
    colorDangerHover: "#fecaca",
    colorHover: "#e5e7eb",
    colorPrimary: "var(--pc-semantic-text-inverse)",
    colorPrimaryHover: "var(--pc-semantic-text-inverse)",
  };
}
