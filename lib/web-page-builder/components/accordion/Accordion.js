// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { classNames } from "../runtime/style/classNames";
import { createAccordionSchema } from "./AccordionSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./Accordion.module.css";

const SCHEMA = createAccordionSchema();

export default function Accordion({ children, componentId, customClassName, editor, element, isVisible, items, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "accordion", true);
  const editorProps = getEditorProps(editor, true);

  const slots = Array.isArray(children) ? children : children ? [children] : [];

  function renderSlot(item, itemIndex) {
    const slotIndex = itemIndex;
    const slot = slots?.[slotIndex];

    return typeof editor?.slot === "function" ? (
      editor.slot(
        "body",
        (props) => (
          <Slot editor={props?.editor} isFirst={slotIndex === 0} isLast={slotIndex + 1 === slots.length} item={item} key={"accordion_item_" + slotIndex} styles={styles}>
            {slot}
          </Slot>
        ),
        itemIndex,
      )
    ) : (
      <Slot isFirst={slotIndex === 0} isLast={slotIndex + 1 === slots.length} item={item} key={"accordion_item_" + slotIndex} styles={styles}>
        {slot}
      </Slot>
    );
  }

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <div className={classNames(styles.accordion, customClassName, styles.accordion_invisible, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
          Invisible
        </div>
      );
    }

    return null;
  }

  return (
    <div className={classNames(styles.accordion, customClassName, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      {items.map((item, itemIndex) => renderSlot(item, itemIndex))}
    </div>
  );
}

function Slot({ children, editor, isFirst, isLast, item, styles = importedStyles }) {
  const editorClasses = getEditorClasses(editor, styles, "accordion_item");
  const editorProps = getEditorProps(editor, false, {}, true);

  return (
    <div className={classNames(styles["accordion_item"], isFirst && styles["accordion_item_first"], isLast && styles["accordion_item_last"], ...editorClasses)} style={children?.length === 0 && editor?.isDraggingOver ? { padding: "2rem" } : undefined} {...editorProps}>
      <div className={styles.header}>{item?.label}</div>
      <div className={styles.content}>
        {children?.length > 0 && children}
        {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles["accordion_item_drop_zone"]}>Drop the component here</div>}
      </div>
    </div>
  );
}
