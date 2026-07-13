// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useMemo, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { classNames } from "../runtime/style/classNames";
import { createRichTextSchema } from "./RichTextSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";
import { useDebounce } from "@/hooks/useDebounce";

import importedStyles from "./RichText.module.css";

const SCHEMA = createRichTextSchema();

export default function RichText({ componentId, editable, editor, onChange, styles = importedStyles, value, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "rich_text", true);
  const editorProps = getEditorProps(editor, true);

  const safeEditable = typeof editable === "boolean" ? editable : true;

  const { debounced: debouncedOnChange } = useDebounce((newValue) => {
    if (typeof onChange === "function") {
      const e = {
        target: { value: newValue },
      };

      onChange(e);
    }
  }, 250);

  const content = useMemo(() => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
    } else {
      return "<p></p>";
    }
  }, [value]);

  const tiptapEditor = useEditor({
    content,
    extensions: [StarterKit],
    immediatelyRender: false,
    onUpdate({ editor }) {
      const newValue = JSON.stringify(editor.getJSON(), null, 2);

      if (newValue !== value) {
        debouncedOnChange(newValue);
      }
    },
  });

  useEffect(() => {
    if (tiptapEditor && content) {
      const oldContent = JSON.stringify(tiptapEditor.getJSON(), null, 2);
      const newContent = JSON.stringify(content, null, 2);

      if (oldContent !== newContent) {
        tiptapEditor.commands.setContent(content);
      }
    }
  }, [content, tiptapEditor]);

  useEffect(() => {
    if (tiptapEditor) {
      tiptapEditor.setOptions({ editable: safeEditable });
    }
  }, [safeEditable, tiptapEditor]);

  return (
    <div className={classNames(styles.rich_text, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      {safeEditable && <Toolbar editor={tiptapEditor} styles={styles} />}
      <div
        className={styles.rich_text_content}
        draggable={editor && !editor.isShowingContentOnly}
        onDragStart={
          editor && !editor.isShowingContentOnly
            ? (e) => {
                e.preventDefault();
                e.stopPropagation();
              }
            : undefined
        }
      >
        <EditorContent editor={tiptapEditor} />
      </div>
    </div>
  );
}

function Toolbar({ editor, styles }) {
  if (!editor) {
    return null;
  }

  const btn = (active, onClick, label) => (
    <button className={classNames(styles.toolbar_button, active && styles.toolbar_button_active)} onClick={onClick} type="button">
      {label}
    </button>
  );

  return (
    <div className={styles.toolbar}>
      {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), "B")}
      {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), "I")}
      {btn(editor.isActive("strike"), () => editor.chain().focus().toggleStrike().run(), "S")}
      {btn(editor.isActive("heading", { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), "H1")}
      {btn(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), "H2")}
      {btn(editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), "H3")}
      {btn(editor.isActive("heading", { level: 4 }), () => editor.chain().focus().toggleHeading({ level: 4 }).run(), "H4")}
      {btn(editor.isActive("heading", { level: 5 }), () => editor.chain().focus().toggleHeading({ level: 5 }).run(), "H5")}
      {btn(editor.isActive("heading", { level: 6 }), () => editor.chain().focus().toggleHeading({ level: 6 }).run(), "H6")}
      {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), "• List")}
      {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), "1. List")}
      {btn(editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), "❝")}
      {btn(false, () => editor.chain().focus().undo().run(), "↺")}
      {btn(false, () => editor.chain().focus().redo().run(), "↻")}
    </div>
  );
}
