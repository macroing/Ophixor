// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function getEditorProps(editor, isSimple = false, overrides = {}, isSlot = false, isBoth = false) {
  if (!editor && Object.entries(overrides).length === 0) {
    return {};
  }

  return {
    draggable: isSlot && !isBoth ? undefined : overrides?.draggable || editor?.draggable,
    onContextMenu: isSlot && !isBoth ? undefined : overrides?.onContextMenu || editor?.onContextMenu,
    onDragEnd: isSlot && !isBoth ? undefined : overrides?.onDragEnd || editor?.onDragEnd,
    onDragEnter: isSimple ? undefined : overrides?.onDragEnter || editor?.onDragEnter,
    onDragLeave: isSimple ? undefined : overrides?.onDragLeave || editor?.onDragLeave,
    onDragOver: isSimple ? undefined : overrides?.onDragOver || editor?.onDragOver,
    onDragStart: isSlot && !isBoth ? undefined : overrides?.onDragStart || editor?.onDragStart,
    onDrop: isSimple ? undefined : overrides?.onDrop || editor?.onDrop,
    onMouseDown: isSlot && !isBoth ? undefined : overrides?.onMouseDown || editor?.onMouseDown,
    ref: isSimple ? undefined : overrides?.dropZoneContainerRef || editor?.dropZoneContainerRef,
  };
}
