// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faCookie, faFileContract, faFileLines, faQuestion, faShield, faTableCellsLarge, faUser } from "@fortawesome/pro-solid-svg-icons";

import { classNames } from "../runtime/style/classNames";
import { createIconSchema } from "./IconSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./Icon.module.css";

const SCHEMA = createIconSchema();

export default function Icon({ children, componentId, editor, icon, isVisible, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "icon", true);
  const editorProps = getEditorProps(editor, true);

  const safeIcon = getIcon(icon);

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <span className={classNames(styles.icon, styles.icon_invisible, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
          Invisible
        </span>
      );
    }

    return null;
  }

  return <FontAwesomeIcon className={classNames(styles.icon, ...editorClasses)} data-pc-id={componentId} icon={safeIcon} style={style} {...editorProps} />;
}

function getIcon(icon) {
  if (typeof icon === "string") {
    switch (icon) {
      case "fa-clock-rotate-left":
        return faClockRotateLeft;
      case "fa-cookie":
        return faCookie;
      case "fa-file-contract":
        return faFileContract;
      case "fa-file-lines":
        return faFileLines;
      case "fa-question":
        return faQuestion;
      case "fa-shield":
        return faShield;
      case "fa-table-cells-large":
        return faTableCellsLarge;
      case "fa-user":
        return faUser;
      default:
        return faQuestion;
    }
  } else {
    return faQuestion;
  }
}
