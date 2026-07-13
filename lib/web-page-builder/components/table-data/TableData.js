// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { classNames } from "../runtime/style/classNames";
import { createTableDataSchema } from "./TableDataSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./TableData.module.css";

const SCHEMA = createTableDataSchema();

export default function TableData({ children, componentId, editor, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "table_data");
  const editorProps = getEditorProps(editor);

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  return (
    <td className={classNames(styles.table_data, isEmpty && styles.table_data_empty, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      {!isEmpty && children}
      {((editor?.isDraggingOver && editor?.isDraggingOverAllowed) || (editor && !editor.isShowingContentOnly)) && <div className={styles.table_data_drop_zone}>Drop content here</div>}
    </td>
  );
}
