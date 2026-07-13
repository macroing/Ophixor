// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { classNames } from "../runtime/style/classNames";
import { createListItemSchema } from "./ListItemSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./ListItem.module.css";

const SCHEMA = createListItemSchema();

export default function ListItem({ children, componentId, editor, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "list_item");
  const editorProps = getEditorProps(editor);

  return (
    <li className={classNames(styles.list_item, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      {children}
      {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles.list_item_drop_zone}>Drop the component here</div>}
    </li>
  );
}
