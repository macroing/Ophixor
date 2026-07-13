// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import SlotWrapper from "./SlotWrapper";
import { getSchemaForType } from "../../schema/getSchemaForType";
import { useWebPageBuilderActions, useWebPageBuilderPageSchema, useWebPageBuilderPageState, useWebPageBuilderUI } from "../../context/useWebPageBuilder";

export default function ComponentWrapper({ children, component, index, parentId, slotName }) {
  const { isShowingContentOnly } = useWebPageBuilderUI();

  if (isShowingContentOnly) {
    return <RuntimeComponentWrapper component={component}>{children}</RuntimeComponentWrapper>;
  }

  return (
    <EditorComponentWrapper component={component} index={index} parentId={parentId} slotName={slotName}>
      {children}
    </EditorComponentWrapper>
  );
}

function EditorComponentWrapper({ children, component, index, parentId, slotName }) {
  const { addComponent, addComponentFromComponentTemplate, createComponent, moveComponent } = useWebPageBuilderActions();

  const { pageSchema } = useWebPageBuilderPageSchema();

  const { isDraftEnabled } = useWebPageBuilderPageState();

  const { activeDropZoneRef, dragState, isShowingContentOnly, selectedId, setContextMenu, setDragState, setSelectedId } = useWebPageBuilderUI();

  const componentId = component?.id;
  const componentType = component?.type;

  const type = component?.type;

  const schema = getSchemaForType(type, pageSchema);

  const dragDepthRef = useRef(0);
  const dropZoneContainerRef = useRef(null);
  const hasExplicitSlotsRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isDraggingOverAllowed, setIsDraggingOverAllowed] = useState(false);

  const isSelected = componentId === selectedId;

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
      setContextMenu(null);

      if (isDraftEnabled) {
        return;
      }

      setSelectedId(null);
    },
    [isDraftEnabled, setContextMenu, setSelectedId],
  );

  const onContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      setContextMenu({ x: e.clientX, y: e.clientY, id: componentId, type: componentType || "" });
    },
    [componentId, componentType],
  );

  const onDragEnd = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      setDragState(null);
    },
    [setDragState],
  );

  const onDragEnter = useCallback((e) => {
    const hasExplicitSlots = hasExplicitSlotsRef.current;

    if (hasExplicitSlots) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    dragDepthRef.current += 1;
  }, []);

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
        if (activeDropZoneRef.current === componentId) {
          activeDropZoneRef.current = null;

          setIsDraggingOver?.(false);
        }
      }
    },
    [componentId],
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

      if (activeDropZoneRef.current !== componentId) {
        activeDropZoneRef.current = componentId;

        setIsDraggingOver?.(true);
      }
    },
    [componentId],
  );

  const onDragStart = useCallback(
    (e) => {
      e.stopPropagation();

      if (isDraftEnabled) {
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

      setDragState(dragState);
    },
    [componentId, index, isDraftEnabled, parentId, setDragState, slotName, type],
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

        if (activeDropZoneRef.current === componentId) {
          activeDropZoneRef.current = null;
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
                  addComponent({ component: createComponent(sourceType), parentId: componentId, slotName: firstSlotName });
                } else if (action === "add-component-template" && typeof data.type === "string") {
                  addComponentFromComponentTemplate({ parentId: componentId, slotName: firstSlotName, type: data.type });
                } else if (action === "move-component" && typeof data.sourceId === "string" && typeof data.sourceIndex === "number" && typeof data.sourceParentId === "string" && data.sourceId !== componentId && data.sourceParentId !== componentId) {
                  moveComponent({ sourceId: data.sourceId, sourceIndex: data.sourceIndex, sourceParentId: data.sourceParentId, sourceSlotName: data.sourceSlotName, targetIndex: Number.MAX_SAFE_INTEGER, targetParentId: componentId, targetSlotName: firstSlotName });
                }
              }
            }
          }
        }

        setDragState(null);
      } catch (error) {}
    },
    [addComponent, addComponentFromComponentTemplate, componentId, createComponent, isDraggingOverAllowed, moveComponent, setDragState, schema],
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
    [component, componentId],
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
  }, [dragState, schema]);

  const object = useMemo(
    () => ({
      editor: {
        componentId,
        draggable: isShowingContentOnly ? undefined : draggable,
        dropZoneContainerRef: isShowingContentOnly ? undefined : dropZoneContainerRef,
        isDraggingOver: isShowingContentOnly ? undefined : isDraggingOver,
        isDraggingOverAllowed: isShowingContentOnly ? undefined : isDraggingOverAllowed,
        isNearDropTarget: isShowingContentOnly ? undefined : !!dragState && activeDropZoneRef.current !== componentId && isNear(dropZoneContainerRef, pointerRef.current),
        isSelected: isShowingContentOnly ? undefined : isSelected,
        isShowingContentOnly,
        onClick: isShowingContentOnly ? undefined : onClick,
        onContextMenu: isShowingContentOnly ? undefined : onContextMenu,
        onDragEnd: isShowingContentOnly ? undefined : onDragEnd,
        onDragEnter: isShowingContentOnly ? undefined : onDragEnter,
        onDragLeave: isShowingContentOnly ? undefined : onDragLeave,
        onDragOver: isShowingContentOnly ? undefined : onDragOver,
        onDragStart: isShowingContentOnly ? undefined : onDragStart,
        onDrop: isShowingContentOnly ? undefined : onDrop,
        onMouseDown: isShowingContentOnly ? undefined : onMouseDown,
        slot: isShowingContentOnly ? undefined : slot,
      },
    }),
    [componentId, dragState, draggable, isDraggingOver, isDraggingOverAllowed, isSelected, isShowingContentOnly, isNear, onClick, onContextMenu, onDragEnd, onDragEnter, onDragLeave, onDragOver, onDragStart, onDrop, onMouseDown, slot],
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
