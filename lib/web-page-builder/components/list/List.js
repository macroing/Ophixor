// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { classNames } from "../runtime/style/classNames";
import { createListSchema } from "./ListSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./List.module.css";

const SCHEMA = createListSchema();

const ELEMENTS = new Set(["ol", "ul"]);

export default function List({ children, componentId, editor, element, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "list");
  const editorProps = getEditorProps(editor);

  const ListElement = typeof element === "string" && ELEMENTS.has(element) ? element : "ul";

  return (
    <ListElement className={classNames(styles.list, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      {children}
      {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles.list_drop_zone}>Drop the component here</div>}
    </ListElement>
  );
}
