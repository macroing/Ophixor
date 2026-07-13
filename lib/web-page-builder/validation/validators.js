// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { CURRENT_VERSION } from "../constants/version";
import { generateId } from "../page/identity/generateId";
import { isPlainObject } from "./isPlainObject";
import { sanitizeComponent, sanitizeComponents, sanitizeDataSource, sanitizeProps } from "./sanitizers";

export function validatePage(page, pageSchema, language = "en") {
  if (!isPlainObject(page)) {
    throw new Error("The root node must be of type 'object' and may not be 'null' or an 'array'");
  }

  if (page.type !== "Page") {
    throw new Error("The root node must have a property called 'type', is of type 'string' and contain the value 'Page'");
  }

  const now = new Date().toISOString();

  const rawBody = isPlainObject(page.slots) && Array.isArray(page.slots.body) ? page.slots.body : [];

  const validatedPage = {
    id: typeof page.id === "string" ? page.id : generateId("page"),
    label: typeof page.label === "string" ? page.label : "Page",
    metadata: {
      createdAt: typeof page.metadata?.createdAt === "string" ? page.metadata.createdAt : now,
      updatedAt: typeof page.metadata?.updatedAt === "string" ? page.metadata.updatedAt : now,
      version: typeof page.metadata?.version === "string" ? page.metadata.version : CURRENT_VERSION,
    },
    props: sanitizeProps(page, pageSchema, language),
    slots: { body: sanitizeComponents(rawBody, pageSchema.componentSchemas, language) },
    type: "Page",
  };

  if (isPlainObject(page.dataSource)) {
    validatedPage.dataSource = sanitizeDataSource(page.dataSource);
  }

  return validatedPage;
}

export function validateTemplate(template, pageSchema, language = "en") {
  if (!isPlainObject(template)) {
    throw new Error("The root node must be of type 'object' and may not be 'null' or an 'array'");
  }

  if (typeof template.type !== "string" && !template.type) {
    throw new Error("The root node must have a property called 'type', is of type 'string' and contain a non-empty value");
  }

  if (!isPlainObject(template.component)) {
    throw new Error("The root node must have a property called 'component', is of type 'object' and may not be 'null' or an 'array'");
  }

  const sanitizedComponent = sanitizeComponent(template.component, pageSchema.componentSchemas, language);

  if (!sanitizedComponent) {
    throw new Error("The component is not valid");
  }

  return {
    component: sanitizedComponent,
    description: typeof template.description === "string" ? template.description : "",
    isDefault: typeof template.isDefault === "boolean" ? template.isDefault : false,
    label: typeof template.label === "string" ? template.label : template.type,
    type: template.type,
  };
}

export function buildComponentIndex(components, index = {}, page = null) {
  if (!Array.isArray(components)) {
    return index;
  }

  if (page && typeof page === "object" && !Array.isArray(page)) {
    index[page.id] = page;
  }

  for (const component of components) {
    if (!component?.id) {
      continue;
    }

    index[component.id] = component;

    if (component.slots && typeof component.slots === "object" && !Array.isArray(component.slots)) {
      for (const slotComponents of Object.values(component.slots)) {
        buildComponentIndex(slotComponents, index);
      }
    }
  }

  return index;
}

export function buildComponentIndexFor(components, id, index, page = null) {
  if (page && typeof page === "object" && !Array.isArray(page)) {
    if (page.id === id) {
      index[id] = page;

      return { hasUpdated: true, index };
    }
  }

  if (!Array.isArray(components)) {
    return { hasUpdated: false, index };
  }

  for (const component of components) {
    if (!component?.id) {
      continue;
    }

    if (component.id === id) {
      index[id] = component;

      return { hasUpdated: true, index };
    }

    if (component.slots && typeof component.slots === "object" && !Array.isArray(component.slots)) {
      for (const slotComponents of Object.values(component.slots)) {
        const result = buildComponentIndexFor(slotComponents, id, index);

        if (result.hasUpdated) {
          return result;
        }
      }
    }
  }

  return { hasUpdated: false, index };
}

export function buildComponentIndexForMany(components, ids, index, page = null) {
  const idSet = ids instanceof Set ? ids : new Set(ids);

  const originalSize = idSet.size;

  function walk(components) {
    if (!Array.isArray(components) || idSet.size === 0) {
      return;
    }

    for (const component of components) {
      if (!component?.id) {
        continue;
      }

      if (idSet.has(component.id)) {
        index[component.id] = component;

        idSet.delete(component.id);

        if (idSet.size === 0) {
          return;
        }
      }

      Object.values(component.slots || {}).forEach(walk);
    }
  }

  if (page && typeof page === "object" && !Array.isArray(page)) {
    if (idSet.has(page.id)) {
      index[page.id] = page;

      idSet.delete(page.id);

      if (idSet.size === 0) {
        return {
          hasUpdated: idSet.size !== originalSize,
          index,
        };
      }
    }
  }

  walk(components);

  return {
    hasUpdated: idSet.size !== originalSize,
    index,
  };
}
