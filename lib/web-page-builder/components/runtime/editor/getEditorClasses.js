// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function getEditorClasses(editor, styles, prefix, isSimple = false) {
  const classes = [];

  if (!editor) {
    if (styles[`${prefix}_content_only`]) {
      classes.push(styles[`${prefix}_content_only`]);
    }

    return classes;
  }

  if (!isSimple && editor.isDraggingOver && styles[`${prefix}_drag_over`]) {
    classes.push(styles[`${prefix}_drag_over`]);
  }

  if (!isSimple && editor.isDraggingOver && !editor.isDraggingOverAllowed && styles[`${prefix}_drag_over_not_allowed`]) {
    classes.push(styles[`${prefix}_drag_over_not_allowed`]);
  }

  if (!isSimple && editor.isNearDropTarget && styles[`${prefix}_near_drop_target`]) {
    classes.push(styles[`${prefix}_near_drop_target`]);
  }

  if (editor.isSelected && styles[`${prefix}_selected`]) {
    classes.push(styles[`${prefix}_selected`]);
  }

  if (editor.isShowingContentOnly && styles[`${prefix}_content_only`]) {
    classes.push(styles[`${prefix}_content_only`]);
  }

  return classes;
}
