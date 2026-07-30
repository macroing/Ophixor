// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useState } from "react";

import { classNames } from "../runtime/style/classNames";
import { createTabPaneSchema } from "./TabPaneSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";
import { sanitizeStringOrNumber } from "../runtime/props/sanitizeStringOrNumber";

import importedStyles from "./TabPane.module.css";

const SCHEMA = createTabPaneSchema();

export default function TabPane({ children, component, componentId, editor, isVisible, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "tab_pane");
  const editorProps = getEditorProps(editor);

  const [tabPaneItem, setTabPaneItem] = useState(createTabPaneItemMapping(children, component, findFirstVisibleTabPaneItemIndex(children, component)));
  const [tabPaneItemIndex, setTabPaneItemIndex] = useState(findFirstVisibleTabPaneItemIndex(children, component));
  const [tabPaneItems, setTabPaneItems] = useState(createTabPaneItemMappings(children, component));

  function onClick(e, currentTabPaneItemIndex) {
    const newTabPaneItemIndex = Math.max(Math.min(tabPaneItems.length, currentTabPaneItemIndex), 0);

    const newTabPaneItem = newTabPaneItemIndex >= 0 && newTabPaneItemIndex < tabPaneItems.length ? tabPaneItems[newTabPaneItemIndex] : null;

    setTabPaneItem(newTabPaneItem);
    setTabPaneItemIndex(newTabPaneItemIndex);
  }

  useEffect(() => {
    const newTabPaneItems = createTabPaneItemMappings(children, component);

    const newTabPaneItem = createTabPaneItemMapping(children, component, tabPaneItemIndex);

    setTabPaneItem(newTabPaneItem);
    setTabPaneItems(newTabPaneItems);
  }, [children, component, tabPaneItemIndex]);

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <div className={classNames(styles.tab_pane, styles.tab_pane_invisible, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
          Invisible
        </div>
      );
    }

    return null;
  }

  return (
    <div className={classNames(styles.tab_pane, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      <div className={styles.tabs}>
        {tabPaneItems.map((currentTabPaneItem, currentTabPaneItemIndex) =>
          (editor && !editor.isShowingContentOnly) || currentTabPaneItem?.isVisible ? (
            <div className={styles.tab + (tabPaneItemIndex === currentTabPaneItemIndex ? " " + styles.tab_selected : "") + (!currentTabPaneItem.isVisible ? " " + styles.tab_invisible : "")} key={"tab-pane-item-" + currentTabPaneItemIndex} onClick={(e) => onClick(e, currentTabPaneItemIndex)}>
              {sanitizeStringOrNumber(currentTabPaneItem?.title ?? "")}
            </div>
          ) : null,
        )}
      </div>
      <div className={styles.content}>
        {((editor && !editor.isShowingContentOnly) || tabPaneItem?.isVisible) && tabPaneItem?.component}
        {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles.tab_pane_drop_zone}>Drop the component here</div>}
      </div>
    </div>
  );
}

function createTabPaneItemMapping(tabPaneItems, component, index) {
  if (Array.isArray(tabPaneItems)) {
    const mappedTabPaneItems = tabPaneItems.flatMap((currentTabPaneItem, currentTabPaneItemIndex) => {
      const isVisible = component?.slots?.body?.[currentTabPaneItemIndex]?.props?.isVisible;
      const isVisibleActually = isVisible === null || isVisible === undefined || isVisible === true;

      const title = component?.slots?.body?.[currentTabPaneItemIndex]?.props?.title ?? "";

      return {
        component: currentTabPaneItem,
        isVisible: isVisibleActually,
        title,
      };
    });

    return index >= 0 && index < mappedTabPaneItems.length ? mappedTabPaneItems[index] : null;
  } else if (tabPaneItems) {
    const isVisible = component?.slots?.body?.[0]?.props?.isVisible;
    const isVisibleActually = isVisible === null || isVisible === undefined || isVisible === true;

    const title = component?.slots?.body?.[0]?.props?.title ?? "";

    const mappedTabPaneItem = {
      component: tabPaneItems,
      isVisible: isVisibleActually,
      title,
    };

    return index === 0 ? mappedTabPaneItem : null;
  } else {
    return null;
  }
}

function createTabPaneItemMappings(tabPaneItems, component) {
  if (Array.isArray(tabPaneItems)) {
    const mappedTabPaneItems = tabPaneItems.flatMap((currentTabPaneItem, currentTabPaneItemIndex) => {
      const isVisible = component?.slots?.body?.[currentTabPaneItemIndex]?.props?.isVisible;
      const isVisibleActually = isVisible === null || isVisible === undefined || isVisible === true;

      const title = component?.slots?.body?.[currentTabPaneItemIndex]?.props?.title ?? "";

      return {
        component: currentTabPaneItem,
        isVisible: isVisibleActually,
        title,
      };
    });

    return mappedTabPaneItems;
  } else if (tabPaneItems) {
    const isVisible = component?.slots?.body?.[0]?.props?.isVisible;
    const isVisibleActually = isVisible === null || isVisible === undefined || isVisible === true;

    const title = component?.slots?.body?.[0]?.props?.title ?? "";

    const mappedTabPaneItem = {
      component: tabPaneItems,
      isVisible: isVisibleActually,
      title,
    };

    return [mappedTabPaneItem];
  } else {
    return [];
  }
}

function findFirstVisibleTabPaneItemIndex(tabPaneItems, component) {
  if (Array.isArray(tabPaneItems)) {
    const mappedTabPaneItems = tabPaneItems.flatMap((currentTabPaneItem, currentTabPaneItemIndex) => {
      const isVisible = component?.slots?.body?.[currentTabPaneItemIndex]?.props?.isVisible;
      const isVisibleActually = isVisible === null || isVisible === undefined || isVisible === true;

      const title = component?.slots?.body?.[currentTabPaneItemIndex]?.props?.title ?? "";

      return {
        component: currentTabPaneItem,
        isVisible: isVisibleActually,
        title,
      };
    });

    for (let i = 0; i < mappedTabPaneItems.length; i++) {
      if (mappedTabPaneItems[i]?.isVisible) {
        return i;
      }
    }

    return -1;
  } else if (tabPaneItems) {
    const isVisible = component?.slots?.body?.[0]?.props?.isVisible;
    const isVisibleActually = isVisible === null || isVisible === undefined || isVisible === true;

    return isVisibleActually ? 0 : -1;
  } else {
    return -1;
  }
}
