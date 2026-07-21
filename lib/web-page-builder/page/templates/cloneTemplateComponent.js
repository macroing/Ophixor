// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { clone } from "../../transform/core/clone";
import { generateId } from "../identity/generateId";

export function cloneTemplateComponent(component) {
  const clonedComponent = clone(component);

  const idMap = createIdMap(clonedComponent);

  return remapTemplate(clonedComponent, idMap);
}

function collectIdsAndTypes(component, result = new Map()) {
  if (component?.id) {
    result.set(component.id, component.type);
  }

  Object.values(component?.slots || {}).forEach((slot) => {
    if (Array.isArray(slot)) {
      slot.forEach((child) => collectIdsAndTypes(child, result));
    }
  });

  return result;
}

function createIdMap(component) {
  const idsAndTypes = collectIdsAndTypes(component);

  const map = new Map();

  idsAndTypes.forEach((type, id) => {
    map.set(id, generateId(String(type || "component").toLowerCase()));
  });

  return map;
}

function remapTemplate(value, idMap) {
  if (Array.isArray(value)) {
    return value.map((item) => remapTemplate(item, idMap));
  }

  if (value && typeof value === "object") {
    const result = {};

    for (const [key, current] of Object.entries(value)) {
      if (key === "id" && idMap.has(current)) {
        result[key] = idMap.get(current);

        continue;
      }

      result[key] = remapTemplate(current, idMap);
    }

    return result;
  }

  if (typeof value === "string" && idMap.has(value)) {
    return idMap.get(value);
  }

  return value;
}
