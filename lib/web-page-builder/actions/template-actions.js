// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useMemo, useState } from "react";

import { applyComponentTemplate } from "../page/commands/applyComponentTemplate";
import { cloneTemplateComponent } from "../page/templates/cloneTemplateComponent";
import { useLanguage } from "@/context/language";

export function useTemplateActions({ history, initialComponentTemplates = {}, pageSchema, setComponentIndexRebuildingRule }) {
  const { setPage } = history;

  const { language } = useLanguage();

  const [componentTemplates, setComponentTemplates] = useState(initialComponentTemplates);
  const [copiedComponentForComponentTemplate, setCopiedComponentForComponentTemplate] = useState(null);

  const addComponentFromComponentTemplateCallback = useCallback(
    (currentParentId, currentSlotName, currentComponentId) => {
      setComponentIndexRebuildingRule({
        type: "addComponent",
        parentId: currentParentId,
        slotName: currentSlotName,
        componentId: currentComponentId,
      });
    },
    [setComponentIndexRebuildingRule],
  );

  const addComponentFromComponentTemplate = useCallback(
    ({ parentId, slotName, type }) => {
      const componentTemplate = componentTemplates[type];

      if (!componentTemplate?.component) {
        return;
      }

      setPage((currentPage) => applyComponentTemplate(currentPage, { callback: addComponentFromComponentTemplateCallback, parentId, slotName, componentTemplate }, pageSchema, language));
    },
    [addComponentFromComponentTemplateCallback, componentTemplates, language, pageSchema, setPage],
  );

  const cancelComponentTemplate = useCallback(() => {
    setCopiedComponentForComponentTemplate(null);
  }, []);

  const copyComponentForComponentTemplate = useCallback((component) => {
    if (!component) {
      return;
    }

    const copiedComponent = cloneTemplateComponent(component);

    setCopiedComponentForComponentTemplate(copiedComponent);
  }, []);

  const saveComponentTemplate = useCallback(
    ({ description, label, type }) => {
      if (!copiedComponentForComponentTemplate || !type) {
        return null;
      }

      const newComponentTemplate = {
        component: copiedComponentForComponentTemplate,
        description,
        label,
        type,
      };

      setComponentTemplates((currentTemplates) => ({
        ...currentTemplates,
        [type]: newComponentTemplate,
      }));

      setCopiedComponentForComponentTemplate(null);

      return newComponentTemplate;
    },
    [copiedComponentForComponentTemplate],
  );

  return useMemo(
    () => ({
      addComponentFromComponentTemplate,
      cancelComponentTemplate,
      componentTemplates,
      copiedComponentForComponentTemplate,
      copyComponentForComponentTemplate,
      saveComponentTemplate,
    }),
    [addComponentFromComponentTemplate, cancelComponentTemplate, componentTemplates, copiedComponentForComponentTemplate, copyComponentForComponentTemplate, saveComponentTemplate],
  );
}
