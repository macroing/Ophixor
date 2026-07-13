// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { classNames } from "../runtime/style/classNames";
import { createCheckboxSchema } from "./CheckboxSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";
import { sanitizeBoolean } from "../runtime/props/sanitizeBoolean";
import { sanitizeFunction } from "../runtime/props/sanitizeFunction";
import { sanitizeString } from "../runtime/props/sanitizeString";

import importedStyles from "./Checkbox.module.css";

const SCHEMA = createCheckboxSchema();

export default function Checkbox({ checked, componentId, disabled, editor, id, onChange, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "checkbox", true);
  const editorProps = getEditorProps(editor, true);

  const safeChecked = sanitizeBoolean(checked);
  const safeId = sanitizeString(id, true);
  const safeOnChange = sanitizeFunction(onChange);

  return <input checked={safeChecked} className={classNames(styles.checkbox, ...editorClasses)} data-pc-id={componentId} disabled={disabled} id={safeId} onChange={safeOnChange} style={style} type="checkbox" {...editorProps} />;
}
