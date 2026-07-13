// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { classNames } from "../runtime/style/classNames";
import { createTableSchema } from "./TableSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./Table.module.css";

const SCHEMA = createTableSchema();

export default function Table({ children, componentId, editor, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "table", true);
  const editorProps = getEditorProps(editor, true);

  const slots = children?.slots || { body: [], header: [] };

  const hasBody = Array.isArray(slots?.body) ? slots.body.length > 0 : false;
  const hasHeader = Array.isArray(slots?.header) ? slots.header.length > 0 : false;

  let isCollapse = false;

  if (style["--table-border-collapse"] === "collapse") {
    style["--table-border-collapse"] = "separate";

    isCollapse = true;
  }

  function renderSlot(slotName, isFirst, isLast, isRequired = false) {
    return Array.isArray(slots?.[slotName]) || isRequired ? (
      typeof editor?.slot === "function" ? (
        editor.slot(slotName, (props) => (
          <Slot editor={props?.editor} isFirst={isFirst} isLast={isLast} slotName={slotName} styles={styles}>
            {slots[slotName]}
          </Slot>
        ))
      ) : (
        <Slot isFirst={isFirst} isLast={isLast} slotName={slotName} styles={styles}>
          {slots[slotName]}
        </Slot>
      )
    ) : undefined;
  }

  return (
    <table className={classNames(styles.table, isCollapse && styles.table_collapse, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      {renderSlot("header", hasHeader, hasHeader && !hasBody, true)}
      {renderSlot("body", !hasHeader && hasBody, hasBody, true)}
    </table>
  );
}

function Slot({ children, editor, isFirst, isLast, slotName, styles = importedStyles }) {
  const editorClasses = getEditorClasses(editor, styles, `table_${slotName}`);
  const editorProps = getEditorProps(editor, false, {}, true, true);

  const Element = slotName === "header" ? "thead" : "tbody";

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  return (
    <Element className={classNames(styles[`table_${slotName}`], isFirst && styles[`table_${slotName}_first`], isLast && styles[`table_${slotName}_last`], editor?.isDraggingOver && editor?.isDraggingOverAllowed && styles[`table_${slotName}_drag_over_allowed`], ...editorClasses)} style={children?.length === 0 && editor?.isDraggingOver ? { padding: "2rem" } : undefined} {...editorProps}>
      {!isEmpty && children}
      {((editor?.isDraggingOver && editor?.isDraggingOverAllowed) || (editor && !editor.isShowingContentOnly)) && (
        <tr className={styles[`table_${slotName}_drop_zone`]}>
          <td colSpan="100%">
            <div>{editor?.isDraggingOver && editor?.isDraggingOverAllowed ? "Drop the table row here" : "Drop table rows here"}</div>
          </td>
        </tr>
      )}
    </Element>
  );
}
