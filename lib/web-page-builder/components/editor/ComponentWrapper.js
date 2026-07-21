// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import SlotWrapper from "./SlotWrapper";
import { getSchemaForType } from "../../schema/getSchemaForType";
import { useWebPageBuilderEditorRenderer, useWebPageBuilderRenderer } from "../../context/useWebPageBuilder";

export default function ComponentWrapper({ children, component, index, parentId, slotName }) {
  const { dataStore } = useWebPageBuilderRenderer();

  if (dataStore.isShowingContentOnly) {
    return <RuntimeComponentWrapper component={component}>{children}</RuntimeComponentWrapper>;
  }

  return (
    <EditorComponentWrapper component={component} index={index} parentId={parentId} slotName={slotName}>
      {children}
    </EditorComponentWrapper>
  );
}

function EditorComponentWrapper({ children, component, index, parentId, slotName }) {
  const { dragState, selectedId } = useWebPageBuilderEditorRenderer();

  const { editorStore } = useWebPageBuilderRenderer();

  const componentId = component?.id;
  const componentType = component?.type;

  const type = component?.type;

  const schema = getSchemaForType(type, editorStore.context.pageSchema);

  const dragDepthRef = useRef(0);
  const dropZoneContainerRef = useRef(null);
  const hasExplicitSlotsRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isDraggingOverAllowed, setIsDraggingOverAllowed] = useState(false);

  const draggable = true;

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

  const onClick = useCallback(
    (e) => {
      editorStore.context.setContextMenu(null);

      if (editorStore.context.isDraftEnabled) {
        return;
      }

      editorStore.context.setSelectedId(null);
    },
    [editorStore],
  );

  const onContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      editorStore.context.setContextMenu({ x: e.clientX, y: e.clientY, id: componentId, type: componentType || "" });
    },
    [componentId, componentType, editorStore],
  );

  const onDragEnd = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      editorStore.context.setDragState(null);

      setIsDraggingOver?.(false);
      setIsDraggingOverAllowed?.(false);
    },
    [editorStore, setIsDraggingOver, setIsDraggingOverAllowed],
  );

  const onDragEnter = useCallback(
    (e) => {
      const hasExplicitSlots = hasExplicitSlotsRef.current;

      if (hasExplicitSlots) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      dragDepthRef.current += 1;
    },
    [dragDepthRef, hasExplicitSlotsRef],
  );

  const onDragLeave = useCallback(
    (e) => {
      const hasExplicitSlots = hasExplicitSlotsRef.current;

      if (hasExplicitSlots) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      dragDepthRef.current -= 1;

      if (dragDepthRef.current === 0) {
        if (editorStore.context.activeDropZoneRef.current === componentId) {
          editorStore.context.activeDropZoneRef.current = null;
        }
      }

      setIsDraggingOver?.(false);
    },
    [componentId, dragDepthRef, editorStore, hasExplicitSlotsRef, setIsDraggingOver],
  );

  const onDragOver = useCallback(
    (e) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;

      const hasExplicitSlots = hasExplicitSlotsRef.current;

      if (hasExplicitSlots) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (editorStore.context.activeDropZoneRef.current !== componentId) {
        editorStore.context.activeDropZoneRef.current = componentId;

        setIsDraggingOver?.(true);
      }
    },
    [componentId, editorStore, hasExplicitSlotsRef, pointerRef, setIsDraggingOver],
  );

  const onDragStart = useCallback(
    (e) => {
      e.stopPropagation();

      if (editorStore.context.isDraftEnabled) {
        return;
      }

      const dragState = {
        action: "move-component",
        sourceId: componentId,
        sourceIndex: index,
        sourceParentId: parentId,
        sourceSlotName: slotName,
        sourceType: type,
      };

      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", JSON.stringify(dragState));

      editorStore.context.setDragState(dragState);
    },
    [componentId, editorStore, index, parentId, slotName, type],
  );

  const onDrop = useCallback(
    (e) => {
      try {
        const hasExplicitSlots = hasExplicitSlotsRef.current;

        if (hasExplicitSlots) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        dragDepthRef.current = 0;

        if (editorStore.context.activeDropZoneRef.current === componentId) {
          editorStore.context.activeDropZoneRef.current = null;
        }

        setIsDraggingOver?.(false);

        const dataString = e.dataTransfer.getData("text/plain");

        if (typeof dataString === "string") {
          const data = JSON.parse(dataString);

          if (data && isDraggingOverAllowed) {
            const action = data.action;
            const sourceType = data.sourceType;

            if (typeof action === "string" && typeof sourceType === "string") {
              let firstSlotName = null;

              for (const [currentSlotName, currentSlotComponents] of Object.entries(schema?.slots || {})) {
                const isAllowed = schema?.slots?.[currentSlotName]?.allowedChildComponents?.includes(sourceType) ?? false;

                if (isAllowed) {
                  firstSlotName = currentSlotName;

                  break;
                }
              }

              if (firstSlotName) {
                if (action === "add-component") {
                  editorStore.context.addComponent({ component: editorStore.context.createComponent(sourceType), parentId: componentId, slotName: firstSlotName });
                } else if (action === "add-component-template" && typeof data.type === "string") {
                  editorStore.context.addComponentFromComponentTemplate({ parentId: componentId, slotName: firstSlotName, type: data.type });
                } else if (action === "move-component" && typeof data.sourceId === "string" && typeof data.sourceIndex === "number" && typeof data.sourceParentId === "string" && data.sourceId !== componentId && data.sourceParentId !== componentId) {
                  editorStore.context.moveComponent({ sourceId: data.sourceId, sourceIndex: data.sourceIndex, sourceParentId: data.sourceParentId, sourceSlotName: data.sourceSlotName, targetIndex: Number.MAX_SAFE_INTEGER, targetParentId: componentId, targetSlotName: firstSlotName });
                }
              }
            }
          }
        }

        editorStore.context.setDragState(null);
      } catch (error) {}
    },
    [componentId, dragDepthRef, editorStore, hasExplicitSlotsRef, isDraggingOverAllowed, schema, setIsDraggingOver],
  );

  const onMouseDown = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const slot = useCallback(
    (slotName, componentFactory) => {
      hasExplicitSlotsRef.current = true;

      return (
        <SlotWrapper component={component} parentId={componentId} slotId={`${componentId}-${slotName}`} slotName={slotName} slotOwnerType={component.type}>
          {componentFactory}
        </SlotWrapper>
      );
    },
    [component, componentId, hasExplicitSlotsRef],
  );

  useEffect(() => {
    if (!dragState) {
      setIsDraggingOver(false);
      setIsDraggingOverAllowed(false);

      pointerRef.current.x = 0;
      pointerRef.current.y = 0;

      return;
    }

    const sourceType = dragState.sourceType;

    if (!sourceType) {
      setIsDraggingOver(false);
      setIsDraggingOverAllowed(false);

      pointerRef.current.x = 0;
      pointerRef.current.y = 0;

      return;
    }

    const isAllowed = Object.keys(schema?.slots || {}).some((slotName) => schema?.slots?.[slotName]?.allowedChildComponents?.includes(sourceType) ?? false);

    setIsDraggingOverAllowed(isAllowed);
  }, [dragState, pointerRef, schema, setIsDraggingOver, setIsDraggingOverAllowed]);

  const object = useMemo(
    () => ({
      editor: {
        componentId,
        draggable: editorStore.context.isShowingContentOnly ? undefined : draggable,
        dropZoneContainerRef: editorStore.context.isShowingContentOnly ? undefined : dropZoneContainerRef,
        isDraggingOver: editorStore.context.isShowingContentOnly ? undefined : isDraggingOver,
        isDraggingOverAllowed: editorStore.context.isShowingContentOnly ? undefined : isDraggingOverAllowed,
        isNearDropTarget: editorStore.context.isShowingContentOnly ? undefined : !!dragState && editorStore.context.activeDropZoneRef.current !== componentId && isNear(dropZoneContainerRef, pointerRef.current),
        isSelected: editorStore.context.isShowingContentOnly ? undefined : componentId === selectedId,
        isShowingContentOnly: editorStore.context.isShowingContentOnly,
        onClick: editorStore.context.isShowingContentOnly ? undefined : onClick,
        onContextMenu: editorStore.context.isShowingContentOnly ? undefined : onContextMenu,
        onDragEnd: editorStore.context.isShowingContentOnly ? undefined : onDragEnd,
        onDragEnter: editorStore.context.isShowingContentOnly ? undefined : onDragEnter,
        onDragLeave: editorStore.context.isShowingContentOnly ? undefined : onDragLeave,
        onDragOver: editorStore.context.isShowingContentOnly ? undefined : onDragOver,
        onDragStart: editorStore.context.isShowingContentOnly ? undefined : onDragStart,
        onDrop: editorStore.context.isShowingContentOnly ? undefined : onDrop,
        onMouseDown: editorStore.context.isShowingContentOnly ? undefined : onMouseDown,
        slot: editorStore.context.isShowingContentOnly ? undefined : slot,
      },
    }),
    [componentId, draggable, dropZoneContainerRef, editorStore, dragState, isDraggingOver, isDraggingOverAllowed, isNear, onClick, onContextMenu, onDragEnd, onDragEnter, onDragLeave, onDragOver, onDragStart, onDrop, onMouseDown, pointerRef, selectedId, slot],
  );

  return typeof children === "function" ? children(object) : null;
}

const EDITOR_OBJECT = {
  editor: {
    draggable: undefined,
    dropZoneContainerRef: undefined,
    isDraggingOver: undefined,
    isDraggingOverAllowed: undefined,
    isNearDropTarget: undefined,
    isSelected: undefined,
    isShowingContentOnly: true,
    onClick: undefined,
    onContextMenu: undefined,
    onDragEnd: undefined,
    onDragEnter: undefined,
    onDragLeave: undefined,
    onDragOver: undefined,
    onDragStart: undefined,
    onDrop: undefined,
    onMouseDown: undefined,
    slot: undefined,
  },
};

function RuntimeComponentWrapper({ children, component }) {
  const componentId = component?.id;

  const object = useMemo(() => ({ ...EDITOR_OBJECT, componentId }), [componentId]);

  return typeof children === "function" ? children(object) : null;
}
