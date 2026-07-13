// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useMemo, useState } from "react";

import { addComponentRule } from "../page/rules/addComponentRule";
import { applyPageRules } from "../page/applyPageRules";
import { clone } from "../transform/core/clone";
import { generateId } from "../page/identity/generateId";
import { getSchemaForType } from "../schema/getSchemaForType";
import { insertMovedComponentRule } from "../page/rules/insertMovedComponentRule";
import { removeComponentRule } from "../page/rules/removeComponentRule";
import { removeForMoveRule } from "../page/rules/removeForMoveRule";
import { sanitizeComponent } from "../validation/sanitizers";
import { updateComponentRule } from "../page/rules/updateComponentRule";
import { useLanguage } from "@/context/language";
import { withUpdatedMetadataRule } from "../page/rules/withUpdatedMetadataRule";

export function useComponentActions({ history, pageSchema, setComponentIndexRebuildingRule }) {
  const { setPage } = history;

  const { language } = useLanguage();

  const [copiedComponent, setCopiedComponent] = useState(null);

  const addComponentCallback = useCallback(
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

  const addComponent = useCallback(
    ({ component, parentId, slotName }) => {
      setPage((page) => applyPageRules(page, [addComponentRule({ callback: addComponentCallback, component: sanitizeComponent(component, pageSchema?.componentSchemas || {}, language), pageSchema, parentId, slotName }), withUpdatedMetadataRule({ initialPage: page })]));
    },
    [addComponentCallback, language, pageSchema, setPage],
  );

  const copyComponent = useCallback((component) => {
    if (!component) {
      return;
    }

    const copiedComponent = clone(component, (key, object) => {
      if (key === "id") {
        if (("props" in object && "type" in object) || "items" in object) {
          return false;
        }
      }

      return true;
    });

    setCopiedComponent(copiedComponent);
  }, []);

  const createComponent = useCallback(
    (type) => {
      const schema = getSchemaForType(type, pageSchema);

      if (!schema) {
        return null;
      }

      let props = Object.fromEntries(Object.entries(schema.props || {}).map(([k, v]) => [k, v?.defaultValue ?? ""]));

      if (schema.defaultProps) {
        props = { ...clone(schema.defaultProps) };
      }

      const slots = clone(schema.defaultSlots ?? { body: [] });

      return sanitizeComponent({ id: generateId(type.toLowerCase()), label: schema.label ?? type, props, slots, type }, pageSchema?.componentSchemas || {}, language);
    },
    [language, pageSchema],
  );

  const moveComponent = useCallback(
    (options) => {
      const capture = {};

      setPage((page) => applyPageRules(page, [removeForMoveRule({ ...options, capture }), insertMovedComponentRule({ ...options, capture }), withUpdatedMetadataRule({ initialPage: page })]));
    },
    [setPage],
  );

  const pasteComponentCallback = useCallback(
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

  const pasteComponent = useCallback(
    ({ parentId, slotName }) => {
      setPage((page) => applyPageRules(page, [addComponentRule({ callback: pasteComponentCallback, component: sanitizeComponent(copiedComponent, pageSchema?.componentSchemas || {}, language), pageSchema, parentId, slotName }), withUpdatedMetadataRule({ initialPage: page })]));

      setCopiedComponent(null);
    },
    [copiedComponent, language, pageSchema, pasteComponentCallback, setCopiedComponent, setPage],
  );

  const removeComponentCallback = useCallback(
    (currentComponentId) => {
      setComponentIndexRebuildingRule({
        type: "removeComponent",
        componentId: currentComponentId,
      });
    },
    [setComponentIndexRebuildingRule],
  );

  const removeComponent = useCallback(
    (id) => {
      setPage((page) => applyPageRules(page, [removeComponentRule({ callback: removeComponentCallback, id }), withUpdatedMetadataRule({ initialPage: page })]));
    },
    [removeComponentCallback, setPage],
  );

  const updateComponentCallback = useCallback(
    (currentComponentId, currentPatch) => {
      setComponentIndexRebuildingRule({
        type: "updateComponent",
        componentId: currentComponentId,
        patch: currentPatch,
      });
    },
    [setComponentIndexRebuildingRule],
  );

  const updateComponent = useCallback(
    (id, patch) => {
      setPage((page) => applyPageRules(page, [updateComponentRule({ callback: updateComponentCallback, id, patch }), withUpdatedMetadataRule({ initialPage: page })]));
    },
    [setPage, updateComponentCallback],
  );

  return useMemo(
    () => ({
      addComponent,
      copiedComponent,
      copyComponent,
      createComponent,
      moveComponent,
      pasteComponent,
      removeComponent,
      updateComponent,
    }),
    [addComponent, copiedComponent, copyComponent, createComponent, moveComponent, pasteComponent, removeComponent, updateComponent],
  );
}
