// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { classNames } from "../runtime/style/classNames";
import { createTableRowSchema } from "./TableRowSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./TableRow.module.css";

const SCHEMA = createTableRowSchema();

export default function TableRow({ children, componentId, editor, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "table_row");
  const editorProps = getEditorProps(editor);

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  return (
    <tr className={classNames(styles.table_row, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      {!isEmpty && children}
      {((editor?.isDraggingOver && editor?.isDraggingOverAllowed) || (editor && !editor.isShowingContentOnly)) && (
        <td className={styles.table_row_drop_zone}>
          <div>{editor?.isDraggingOver && editor?.isDraggingOverAllowed ? "Drop the table cell here" : "Drop table cells here"}</div>
        </td>
      )}
    </tr>
  );
}
