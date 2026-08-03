// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { createContext, useCallback, useContext, useMemo, useRef } from "react";

import { equals } from "../../transform/core/equals";

const TabPaneContext = createContext(null);

export function TabPaneProvider({ children, editor, tabPaneItemId, setTabPaneItems, setTabPaneItemId, tabPaneItems }) {
  const tabPaneItemIdRef = useRef(null);
  const tabPaneItemsRef = useRef([]);

  const removeTabPaneItem = useCallback(
    (tabPaneItemId) => {
      const newTabPaneItems = [...tabPaneItems];

      for (let i = newTabPaneItems.length - 1; i >= 0; i--) {
        if (newTabPaneItems[i].id === tabPaneItemId) {
          newTabPaneItems.splice(i, 1);
        }
      }

      if (!equals(newTabPaneItems, tabPaneItems)) {
        setTabPaneItems(newTabPaneItems);
      }
    },
    [setTabPaneItems, tabPaneItems],
  );

  const updateTabPaneItem = useCallback(
    (tabPaneItemIdToUpdate, title, isVisible) => {
      const newTabPaneItems = [...tabPaneItemsRef.current];

      let currentTabPaneItem = null;

      for (let i = 0; i < newTabPaneItems.length; i++) {
        if (newTabPaneItems[i].id === tabPaneItemIdToUpdate) {
          currentTabPaneItem = newTabPaneItems[i];

          break;
        }
      }

      if (currentTabPaneItem === null) {
        currentTabPaneItem = {
          id: tabPaneItemIdToUpdate,
          isVisible,
          title,
        };

        newTabPaneItems.push(currentTabPaneItem);
      } else {
        currentTabPaneItem.isVisible = isVisible;
        currentTabPaneItem.title = title;
      }

      if (!equals(newTabPaneItems, tabPaneItemsRef.current)) {
        tabPaneItemsRef.current = newTabPaneItems;
      }

      if (!equals(tabPaneItemsRef.current, tabPaneItems)) {
        setTabPaneItems(tabPaneItemsRef.current);
      }

      if (tabPaneItemId === null) {
        for (let i = 0; i < newTabPaneItems.length; i++) {
          const tabPaneItem = newTabPaneItems[i];

          if (tabPaneItem.isVisible) {
            if (tabPaneItemIdRef.current === null) {
              tabPaneItemIdRef.current = tabPaneItem.id;

              setTabPaneItemId(tabPaneItem.id);
            }

            break;
          }
        }
      } else if (!editor || (editor && editor.isShowingContentOnly)) {
        for (let i = 0; i < newTabPaneItems.length; i++) {
          const tabPaneItem = newTabPaneItems[i];

          if (tabPaneItem.id === tabPaneItemId) {
            if (!tabPaneItem.isVisible) {
              for (let j = i - 1; j >= 0; j--) {
                if (newTabPaneItems[j].isVisible) {
                  setTabPaneItemId(newTabPaneItems[j].id);

                  return;
                }
              }

              for (let j = newTabPaneItems.length - 1; j > i; j--) {
                if (newTabPaneItems[j].isVisible) {
                  setTabPaneItemId(newTabPaneItems[j].id);

                  return;
                }
              }

              setTabPaneItemId(null);
            }

            break;
          }
        }
      }
    },
    [editor, setTabPaneItemId, setTabPaneItems, tabPaneItemId, tabPaneItems],
  );

  const value = useMemo(
    () => ({
      removeTabPaneItem,
      tabPaneItemId,
      tabPaneItems,
      updateTabPaneItem,
    }),
    [removeTabPaneItem, tabPaneItemId, tabPaneItems, updateTabPaneItem],
  );

  return <TabPaneContext value={value}>{children}</TabPaneContext>;
}

export function useTabPane() {
  return useContext(TabPaneContext);
}
