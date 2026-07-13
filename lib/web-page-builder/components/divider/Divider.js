// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { classNames } from "../runtime/style/classNames";
import { createDividerSchema } from "./DividerSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./Divider.module.css";

const SCHEMA = createDividerSchema();

export default function Divider({ componentId, editor, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "divider", true);
  const editorProps = getEditorProps(editor, true);

  return <hr className={classNames(styles.divider, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps} />;
}
