// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { classNames } from "../runtime/style/classNames";
import { createDialogSchema } from "./DialogSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./Dialog.module.css";

const SCHEMA = createDialogSchema();

export default function Dialog({ children, componentId, dialogRef, editor, isDark, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "dialog", true);
  const editorProps = getEditorProps(editor, true);

  const slots = children?.slots || { body: [], footer: [], header: [] };

  const hasBody = Array.isArray(slots?.body) ? slots.body.length > 0 : false;
  const hasFooter = Array.isArray(slots?.footer) ? slots.footer.length > 0 : false;
  const hasHeader = Array.isArray(slots?.header) ? slots.header.length > 0 : false;

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
    <dialog className={classNames(styles.dialog, isDark ? styles.dialog_dark : undefined, ...editorClasses)} data-pc-id={componentId} ref={dialogRef} style={style} {...editorProps}>
      {renderSlot("header", hasHeader, hasHeader && !hasBody && !hasFooter, true)}
      {renderSlot("body", !hasHeader && hasBody, hasBody && !hasFooter, true)}
      {renderSlot("footer", !hasHeader && !hasBody && hasFooter, hasFooter, true)}
    </dialog>
  );
}

export function DarkDialog({ children, ...rest }) {
  return (
    <Dialog {...createDarkDialogProps()} {...rest}>
      {children}
    </Dialog>
  );
}

function Slot({ children, editor, isFirst, isLast, slotName, styles = importedStyles }) {
  const editorClasses = getEditorClasses(editor, styles, `dialog_${slotName}`);
  const editorProps = getEditorProps(editor, false, {}, true);

  const Element = SLOT_ELEMENT_MAP[slotName] || "section";

  return (
    <Element className={classNames(styles[`dialog_${slotName}`], isFirst && styles[`dialog_${slotName}_first`], isLast && styles[`dialog_${slotName}_last`], ...editorClasses)} style={children?.length === 0 && editor?.isDraggingOver ? { padding: "2rem" } : undefined} {...editorProps}>
      {children?.length > 0 && children}
      {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles[`dialog_${slotName}_drop_zone`]}>Drop the component here</div>}
    </Element>
  );
}

function createDarkDialogProps() {
  return {
    backgroundColor: "#111827",
    backgroundColorBody: "#111827",
    backgroundColorFooter: "#111827",
    backgroundColorHeader: "#1f2937",
    backgroundHeader: "linear-gradient(180deg, #2d3748, #1f2937)",
    borderColor: "#2d3748",
    color: "#e5e7eb",
    isDark: true,
  };
}

const SLOT_ELEMENT_MAP = {
  body: "section",
  footer: "footer",
  header: "header",
};
