// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { classNames } from "../runtime/style/classNames";
import { createCardSchema } from "./CardSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";
import { sanitizeFunction } from "../runtime/props/sanitizeFunction";

import importedStyles from "./Card.module.css";

const ELEMENTS = new Set(["article", "div", "form", "section"]);

const SCHEMA = createCardSchema();

export default function Card({ children, componentId, editor, element, isVisible, onClick, onSubmit, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "card", true);
  const editorProps = getEditorProps(editor, true);

  const safeOnClick = sanitizeFunction(onClick);
  const safeOnSubmit = sanitizeFunction(onSubmit);

  const CardElement = typeof element === "string" && ELEMENTS.has(element) ? element : "div";

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

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <CardElement className={classNames(styles.card, styles.card_invisible, ...editorClasses)} data-pc-id={componentId} onClick={safeOnClick} onSubmit={safeOnSubmit} style={style} {...editorProps}>
          Invisible
        </CardElement>
      );
    }

    return null;
  }

  return (
    <CardElement className={classNames(styles.card, ...editorClasses)} data-pc-id={componentId} onClick={safeOnClick} onSubmit={safeOnSubmit} style={style} {...editorProps}>
      {renderSlot("header", hasHeader, hasHeader && !hasBody && !hasFooter, true)}
      {renderSlot("body", !hasHeader && hasBody, hasBody && !hasFooter, true)}
      {renderSlot("footer", !hasHeader && !hasBody && hasFooter, hasFooter, true)}
    </CardElement>
  );
}

export function DarkCard({ children, ...rest }) {
  return (
    <Card {...createDarkCardProps()} {...rest}>
      {children}
    </Card>
  );
}

function Slot({ children, editor, isFirst, isLast, slotName, styles = importedStyles }) {
  const editorClasses = getEditorClasses(editor, styles, `card_${slotName}`);
  const editorProps = getEditorProps(editor, false, {}, true);

  return (
    <div className={classNames(styles[`card_${slotName}`], isFirst && styles[`card_${slotName}_first`], isLast && styles[`card_${slotName}_last`], ...editorClasses)} style={children?.length === 0 && editor?.isDraggingOver ? { padding: "2rem" } : undefined} {...editorProps}>
      {children?.length > 0 && children}
      {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles[`card_${slotName}_drop_zone`]}>Drop the component here</div>}
    </div>
  );
}

function createDarkCardProps() {
  return {
    backgroundColor: "#1f2937",
    backgroundColorBody: "#1f2937",
    backgroundColorBodyHover: "#1f2937",
    backgroundColorFooter: "#1f2937",
    backgroundColorFooterHover: "#1f2937",
    backgroundColorHeader: "#1f2937",
    backgroundColorHeaderHover: "#1f2937",
    backgroundColorHover: "#1f2937",
    borderColor: "#374151",
    borderColorHover: "#374151",
    color: "#e5e7eb",
    colorHover: "#e5e7eb",
  };
}
