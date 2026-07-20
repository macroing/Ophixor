// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getSchemaForType } from "../../schema/getSchemaForType";
import { useWebPageBuilderRenderer } from "../../context/useWebPageBuilder";

export default function SlotWrapper({ children, component, parentId, slotId, slotName, slotOwnerType }) {
  const { dataStore } = useWebPageBuilderRenderer();

  if (dataStore.isShowingContentOnly) {
    return <RuntimeSlotWrapper>{children}</RuntimeSlotWrapper>;
  }

  return (
    <EditorSlotWrapper component={component} parentId={parentId} slotId={slotId} slotName={slotName} slotOwnerType={slotOwnerType}>
      {children}
    </EditorSlotWrapper>
  );
}

function EditorSlotWrapper({ children, component, parentId, slotId, slotName, slotOwnerType }) {
  const { editorStore } = useWebPageBuilderRenderer();

  const componentId = component?.id;

  const dragDepthRef = useRef(0);
  const dropZoneContainerRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isDraggingOverAllowed, setIsDraggingOverAllowed] = useState(false);

  const isNear = useCallback((componentRef, pointer) => {
    if (!componentRef?.current) {
      return false;
    }

    const element = document.elementFromPoint(pointer.x, pointer.y);

    if (!element) {
      return false;
    }

    const isNear = componentRef.current.contains(element);

    return isNear;
  }, []);

  const onDragEnd = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    editorStore.context.setDragState(null);
  }, []);

  const onDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    dragDepthRef.current += 1;
  }, []);

  const onDragLeave = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      dragDepthRef.current -= 1;

      if (dragDepthRef.current === 0) {
        if (editorStore.context.activeDropZoneRef.current === slotId) {
          editorStore.context.activeDropZoneRef.current = null;

          setIsDraggingOver?.(false);
        }
      }
    },
    [slotId],
  );

  const onDragOver = useCallback(
    (e) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;

      e.preventDefault();

      if (!isDraggingOverAllowed) {
        e.stopPropagation();
      }

      if (editorStore.context.activeDropZoneRef.current !== slotId) {
        editorStore.context.activeDropZoneRef.current = slotId;

        setIsDraggingOver?.(true);
      }
    },
    [isDraggingOverAllowed, slotId],
  );

  const onDrop = useCallback(
    (e) => {
      try {
        e.preventDefault();
        e.stopPropagation();

        dragDepthRef.current = 0;

        if (editorStore.context.activeDropZoneRef.current === slotId) {
          editorStore.context.activeDropZoneRef.current = null;
        }

        setIsDraggingOver?.(false);

        const dataString = e.dataTransfer.getData("text/plain");

        if (typeof dataString === "string") {
          const data = JSON.parse(dataString);

          if (data && isDraggingOverAllowed) {
            if (typeof data.action === "string" && data.action === "add-component" && typeof data.sourceType === "string") {
              editorStore.context.addComponent({ component: editorStore.context.createComponent(data.sourceType), parentId, slotName });
            } else if (typeof data.action === "string" && data.action === "add-component-template" && typeof data.sourceType === "string" && typeof data.type === "string") {
              editorStore.context.addComponentFromComponentTemplate({ parentId, slotName, type: data.type });
            } else if (typeof data.action === "string" && data.action === "move-component" && typeof data.sourceId === "string" && typeof data.sourceIndex === "number" && typeof data.sourceParentId === "string" && data.sourceId !== componentId && data.sourceParentId !== componentId) {
              editorStore.context.moveComponent({ sourceId: data.sourceId, sourceIndex: data.sourceIndex, sourceParentId: data.sourceParentId, sourceSlotName: data.sourceSlotName, targetIndex: Number.MAX_SAFE_INTEGER, targetParentId: parentId, targetSlotName: slotName });
            }
          }
        }

        editorStore.context.setDragState(null);
      } catch (error) {}
    },
    [componentId, isDraggingOverAllowed, parentId, slotId, slotName],
  );

  useEffect(() => {
    if (!editorStore.context.dragState) {
      setIsDraggingOver(false);
      setIsDraggingOverAllowed(false);

      pointerRef.current.x = 0;
      pointerRef.current.y = 0;

      return;
    }

    const sourceType = editorStore.context.dragState.sourceType;

    if (!sourceType) {
      setIsDraggingOver(false);
      setIsDraggingOverAllowed(false);

      pointerRef.current.x = 0;
      pointerRef.current.y = 0;

      return;
    }

    const slotOwnerSchema = getSchemaForType(slotOwnerType, editorStore.context.pageSchema);

    const slotSchema = slotOwnerSchema?.slots?.[slotName];

    setIsDraggingOverAllowed(slotSchema?.allowedChildComponents?.includes(sourceType) ?? false);
  }, [slotName, slotOwnerType]);

  const object = useMemo(
    () => ({
      editor: {
        dropZoneContainerRef: editorStore.context.isShowingContentOnly ? undefined : dropZoneContainerRef,
        isDraggingOver: editorStore.context.isShowingContentOnly ? undefined : isDraggingOver,
        isDraggingOverAllowed: editorStore.context.isShowingContentOnly ? undefined : isDraggingOverAllowed,
        isNearDropTarget: editorStore.context.isShowingContentOnly ? undefined : !!editorStore.context.dragState && editorStore.context.activeDropZoneRef.current !== slotId && isNear(dropZoneContainerRef, pointerRef.current),
        isShowingContentOnly: editorStore.context.isShowingContentOnly,
        onDragEnd: editorStore.context.isShowingContentOnly ? undefined : onDragEnd,
        onDragEnter: editorStore.context.isShowingContentOnly ? undefined : onDragEnter,
        onDragLeave: editorStore.context.isShowingContentOnly ? undefined : onDragLeave,
        onDragOver: editorStore.context.isShowingContentOnly ? undefined : onDragOver,
        onDrop: editorStore.context.isShowingContentOnly ? undefined : onDrop,
      },
    }),
    [isDraggingOver, isDraggingOverAllowed, isNear, onDragEnd, onDragEnter, onDragLeave, onDragOver, onDrop, slotId],
  );

  return typeof children === "function" ? children(object) : null;
}

const EDITOR_OBJECT = {
  editor: {
    dropZoneContainerRef: undefined,
    isDraggingOver: undefined,
    isDraggingOverAllowed: undefined,
    isNearDropTarget: undefined,
    isShowingContentOnly: true,
    onDragEnd: undefined,
    onDragEnter: undefined,
    onDragLeave: undefined,
    onDragOver: undefined,
    onDrop: undefined,
  },
};

function RuntimeSlotWrapper({ children }) {
  return typeof children === "function" ? children(EDITOR_OBJECT) : null;
}
