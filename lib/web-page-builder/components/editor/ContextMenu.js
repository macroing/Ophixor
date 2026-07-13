// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useRef, useState } from "react";
import { faBackward, faCode, faCopy, faEdit, faForward, faPage, faLayerGroup, faPaste, faTrash } from "@fortawesome/pro-solid-svg-icons";

import Icon from "./Icon";
import { getComponentById, getComponentLocation, getSlots } from "../../page/queries";
import { useLanguage } from "@/context/language";
import { useWebPageBuilderActions, useWebPageBuilderPageSchema, useWebPageBuilderPageState, useWebPageBuilderUI } from "../../context/useWebPageBuilder";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };
import platformData from "@/definitions/platform-data.json" with { type: "json" };

import importedStyles from "./ContextMenu.module.css";

export default function ContextMenu(props) {
  const canUseExport = props.canUseExport;
  const canUsePageCodeViewer = props.canUsePageCodeViewer;
  const setIsVisiblePageCodeDialog = props.setIsVisiblePageCodeDialog;
  const setIsVisiblePageToHTMLExportDialog = props.setIsVisiblePageToHTMLExportDialog;
  const styles = props.styles || importedStyles;

  const { language } = useLanguage();

  const { copiedComponent, copyComponent, copyComponentForComponentTemplate, moveComponent, pasteComponent, removeComponent } = useWebPageBuilderActions();

  const { pageSchema } = useWebPageBuilderPageSchema();

  const { isDraftEnabled, page } = useWebPageBuilderPageState();

  const { contextMenu, setContextMenu, setSelectedId } = useWebPageBuilderUI();

  const id = page?.id;

  const contextMenuRef = useRef(null);
  const initialPositionRef = useRef({ left: null, top: null });

  const [isHidden, setIsHidden] = useState(false);
  const [position, setPosition] = useState({ left: null, top: null });

  function closeContextMenu() {
    setContextMenu(null);
    setIsHidden(false);
    setPosition({ left: null, top: null });
    setSelectedId(null);
  }

  function isCopyComponentDisabled() {
    const id = contextMenu?.id;

    if (!id) {
      return true;
    }

    const location = getComponentLocation(id, page?.slots?.body || []);

    if (location && !location.parent && location.slotName === "body" && typeof location.index === "number") {
      return false;
    }

    if (!location || !location.parent) {
      return true;
    }

    const slot = getSlots(location.parent)?.[location.slotName];

    if (slot) {
      return false;
    }

    return true;
  }

  function isMoveBackwardDisabled() {
    const id = contextMenu?.id;

    if (!id) {
      return true;
    }

    const location = getComponentLocation(id, page?.slots?.body || []);

    if (location && !location.parent && location.slotName === "body" && typeof location.index === "number") {
      const slot = getSlots(page)?.[location.slotName];

      return location.index >= slot.length - 1;
    }

    if (!location || !location.parent) {
      return true;
    }

    const slot = getSlots(location.parent)?.[location.slotName];

    return location.index >= slot.length - 1;
  }

  function isMoveForwardDisabled() {
    const id = contextMenu?.id;

    if (!id) {
      return true;
    }

    const location = getComponentLocation(id, page?.slots?.body || []);

    if (location && !location.parent && location.slotName === "body" && typeof location.index === "number") {
      return location.index <= 0;
    }

    if (!location || !location.parent) {
      return true;
    }

    return location.index <= 0;
  }

  function isPasteComponentDisabled() {
    if (!copiedComponent) {
      return true;
    }

    const id = contextMenu?.id;

    if (!id) {
      return true;
    }

    const component = id === page?.id ? page : getComponentById(id, page?.slots?.body || []);

    if (!component) {
      return true;
    }

    if (component?.type === "Page") {
      const allowedChildComponents = pageSchema?.slots?.body?.allowedChildComponents;

      if (allowedChildComponents?.includes?.(copiedComponent?.type)) {
        return false;
      }
    }

    const slots = getSlots(component);

    if (slots) {
      for (const [slotName, components] of Object.entries(slots)) {
        const allowedChildComponents = pageSchema?.componentSchemas?.[component?.type]?.slots?.[slotName]?.allowedChildComponents;

        if (allowedChildComponents?.includes?.(copiedComponent?.type)) {
          return false;
        }
      }
    }

    return true;
  }

  function isSaveComponentTemplateDisabled() {
    const id = contextMenu?.id;

    if (!id) {
      return true;
    }

    const location = getComponentLocation(id, page?.slots?.body || []);

    if (location && !location.parent && location.slotName === "body" && typeof location.index === "number") {
      return false;
    }

    if (!location || !location.parent) {
      return true;
    }

    const slot = getSlots(location.parent)?.[location.slotName];

    if (slot) {
      return false;
    }

    return true;
  }

  function onClickContextMenuCopyComponent(e) {
    const selectedId = contextMenu.id;

    if (selectedId) {
      const component = getComponentById(selectedId, page?.slots?.body || []);

      if (component) {
        copyComponent(component);
      }
    }

    closeContextMenu();
  }

  function onClickContextMenuEdit(e) {
    const selectedId = contextMenu.id;

    setContextMenu(null);
    setIsHidden(false);
    setPosition({ left: null, top: null });
    setSelectedId(selectedId);
  }

  function onClickContextMenuExportPageToHTML(e) {
    setIsVisiblePageToHTMLExportDialog(true);

    closeContextMenu();
  }

  function onClickContextMenuMoveBackward(e) {
    const selectedId = contextMenu.id;

    const location = getComponentLocation(selectedId, page?.slots?.body || []);

    if (location?.parent) {
      const parent = location.parent;

      const slotName = location.slotName;

      const slot = getSlots(parent)?.[slotName];

      if (slot && location.index < slot.length - 1) {
        moveComponent({ direction: "right", sourceId: selectedId, sourceIndex: location.index, sourceParentId: parent?.id, sourceSlotName: slotName });
      }
    } else if (location?.slotName === "body" && typeof location?.index === "number") {
      const parent = page;

      const slotName = location.slotName;

      const slot = getSlots(parent)?.[slotName];

      if (slot && location.index < slot.length - 1) {
        moveComponent({ direction: "right", sourceId: selectedId, sourceIndex: location.index, sourceParentId: parent?.id, sourceSlotName: slotName });
      }
    }

    closeContextMenu();
  }

  function onClickContextMenuMoveForward(e) {
    const selectedId = contextMenu.id;

    const location = getComponentLocation(selectedId, page?.slots?.body || []);

    if (location?.parent) {
      const parent = location.parent;

      const slotName = location.slotName;

      const slot = getSlots(parent)?.[slotName];

      if (slot && location.index > 0) {
        moveComponent({ direction: "left", sourceId: selectedId, sourceIndex: location.index, sourceParentId: parent?.id, sourceSlotName: slotName });
      }
    } else if (location?.slotName === "body" && typeof location?.index === "number") {
      const parent = page;

      const slotName = location.slotName;

      const slot = getSlots(parent)?.[slotName];

      if (slot && location.index > 0) {
        moveComponent({ direction: "left", sourceId: selectedId, sourceIndex: location.index, sourceParentId: parent?.id, sourceSlotName: slotName });
      }
    }

    closeContextMenu();
  }

  function onClickContextMenuPasteComponent(e) {
    if (contextMenu && copiedComponent) {
      const selectedId = contextMenu.id;

      const component = selectedId === page?.id ? page : getComponentById(selectedId, page?.slots?.body || []);

      if (component) {
        if (component?.type === "Page") {
          const allowedChildComponents = pageSchema?.slots?.body?.allowedChildComponents;

          if (allowedChildComponents?.includes?.(copiedComponent?.type)) {
            pasteComponent({ parentId: page.id, slotName: "body" });
          }
        } else {
          const slots = getSlots(component);

          if (slots) {
            for (const [slotName, components] of Object.entries(slots)) {
              const allowedChildComponents = pageSchema?.componentSchemas?.[component?.type]?.slots?.[slotName]?.allowedChildComponents;

              if (allowedChildComponents?.includes?.(copiedComponent?.type)) {
                pasteComponent({ parentId: component.id, slotName });

                break;
              }
            }
          }
        }
      }
    }

    closeContextMenu();
  }

  function onClickContextMenuRemove(e) {
    if (contextMenu.id !== id) {
      removeComponent(contextMenu.id);
    }

    closeContextMenu();
  }

  function onClickContextMenuSaveComponentTemplate(e) {
    const selectedId = contextMenu.id;

    if (selectedId) {
      const component = getComponentById(selectedId, page?.slots?.body || []);

      if (component) {
        copyComponentForComponentTemplate(component);
      }
    }

    closeContextMenu();
  }

  function onClickContextMenuViewPageCode(e) {
    setIsVisiblePageCodeDialog(true);

    closeContextMenu();
  }

  useEffect(() => {
    if (!contextMenu) {
      setIsHidden(false);
      setPosition({ left: null, top: null });

      return;
    }

    initialPositionRef.current = {
      left: contextMenu.x,
      top: contextMenu.y,
    };

    setIsHidden(true);
    setPosition(initialPositionRef.current);

    return () => {
      setIsHidden(false);
      setPosition({ left: null, top: null });
    };
  }, [contextMenu]);

  useEffect(() => {
    if (!contextMenu || !isHidden) {
      return;
    }

    const contextMenuElement = contextMenuRef.current;

    if (!contextMenuElement) {
      return;
    }

    const { width, height } = contextMenuElement.getBoundingClientRect();

    const padding = 20;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let { left, top } = initialPositionRef.current;

    if (left + width > viewportWidth) {
      left = viewportWidth - width - padding;
    }

    if (top + height > viewportHeight) {
      top = viewportHeight - height - padding;
    }

    setPosition({
      left: Math.max(padding, left),
      top: Math.max(padding, top),
    });

    setIsHidden(false);
  }, [contextMenu, isHidden]);

  if (!contextMenu || position.left === null || position.top === null) {
    return null;
  }

  return (
    <div className={styles.context_menu + (isHidden ? " " + styles.context_menu_hidden : "")} ref={contextMenuRef} style={{ top: position.top, left: position.left }} type="button">
      <button className={styles.button} disabled={isDraftEnabled} onClick={onClickContextMenuEdit} type="button">
        <Icon icon={faEdit} size={16} /> {platform.websiteAdmin.pages.editor.contextMenu.edit[language]}
        {contextMenu?.type ? " " + (platformData.component.types[contextMenu.type]?.label?.[language] || contextMenu.type) : ""}
      </button>
      <button className={styles.button} disabled={isDraftEnabled || isMoveForwardDisabled()} onClick={onClickContextMenuMoveForward} type="button">
        <Icon icon={faForward} size={16} /> {platform.websiteAdmin.pages.editor.contextMenu.move[language]}
        {contextMenu?.type ? " " + (platformData.component.types[contextMenu.type]?.label?.[language] || contextMenu.type) : ""} {platform.websiteAdmin.pages.editor.contextMenu.forward[language]}
      </button>
      <button className={styles.button} disabled={isDraftEnabled || isMoveBackwardDisabled()} onClick={onClickContextMenuMoveBackward} type="button">
        <Icon icon={faBackward} size={16} /> {platform.websiteAdmin.pages.editor.contextMenu.move[language]}
        {contextMenu?.type ? " " + (platformData.component.types[contextMenu.type]?.label?.[language] || contextMenu.type) : ""} {platform.websiteAdmin.pages.editor.contextMenu.backward[language]}
      </button>
      <button className={styles.button} disabled={isDraftEnabled || isCopyComponentDisabled()} onClick={onClickContextMenuCopyComponent} type="button">
        <Icon icon={faCopy} size={16} /> {platform.websiteAdmin.pages.editor.contextMenu.copy[language]}
        {contextMenu?.type ? " " + (platformData.component.types[contextMenu.type]?.label?.[language] || contextMenu.type) : ""}
      </button>
      <button className={styles.button} disabled={isDraftEnabled || isPasteComponentDisabled()} onClick={onClickContextMenuPasteComponent} type="button">
        <Icon icon={faPaste} size={16} /> {contextMenu?.type ? platform.websiteAdmin.pages.editor.contextMenu.pasteIntoSecondary[language] : platform.websiteAdmin.pages.editor.contextMenu.pasteInto[language]}
        {contextMenu?.type ? " " + (platformData.component.types[contextMenu.type]?.label?.[language] || contextMenu.type) : ""}
      </button>
      <button className={styles.button} disabled={isDraftEnabled || isSaveComponentTemplateDisabled()} onClick={onClickContextMenuSaveComponentTemplate} type="button">
        <Icon icon={faLayerGroup} size={16} /> {platform.websiteAdmin.pages.editor.contextMenu.createTemplate[language]}
        {contextMenu?.type ? " " + platform.websiteAdmin.pages.editor.contextMenu.from[language] + " " + (platformData.component.types[contextMenu.type]?.label?.[language] || contextMenu.type) : ""}
      </button>
      <button className={styles.button + " " + styles.button_danger} disabled={isDraftEnabled || contextMenu?.id === id} onClick={onClickContextMenuRemove} type="button">
        <Icon icon={faTrash} size={16} /> {platform.websiteAdmin.pages.editor.contextMenu.remove[language]}
        {contextMenu?.type ? " " + (platformData.component.types[contextMenu.type]?.label?.[language] || contextMenu.type) : ""}
      </button>
      {(canUseExport || canUsePageCodeViewer) && <div className={styles.separator}></div>}
      {canUseExport && (
        <button className={styles.button} disabled={isDraftEnabled} onClick={onClickContextMenuExportPageToHTML} type="button">
          <Icon icon={faPage} size={16} /> {platform.websiteAdmin.pages.editor.contextMenu.exportPageToHtml[language]}
        </button>
      )}
      {canUsePageCodeViewer && (
        <button className={styles.button} disabled={isDraftEnabled} onClick={onClickContextMenuViewPageCode} type="button">
          <Icon icon={faCode} size={16} /> {platform.websiteAdmin.pages.editor.contextMenu.viewPageCode[language]}
        </button>
      )}
    </div>
  );
}
