// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { equals } from "../../transform/core/equals";
import { getValueByPath } from "../runtime/expression/path";

const EMPTY_OBJECT = {};

export function applyFilter(item, filter, expressionEngine) {
  const left = getValueByPath(item, filter.field);

  const right = filter.value?.type === "expression" ? expressionEngine?.executeExpression?.(filter.value.expression, item) : filter.value;

  switch (filter.operator) {
    case "contains":
      return String(left).includes(right);
    case "equals":
      return left === right;
    case "greater_than":
      return left > right;
    case "greater_than_or_equal_to":
      return left >= right;
    case "less_than":
      return left < right;
    case "less_than_or_equal_to":
      return left <= right;
    default:
      return true;
  }
}

export function applySort(items, sortRules, context = {}) {
  return [...items].sort((a, b) => {
    for (const rule of sortRules) {
      const av = getValueByPath(a, rule.field);
      const bv = getValueByPath(b, rule.field);

      if (av < bv) {
        return rule.direction === "asc" ? -1 : 1;
      }

      if (av > bv) {
        return rule.direction === "asc" ? 1 : -1;
      }
    }

    return 0;
  });
}

export function buildPathsFromModel(modelName, models, prefix = "") {
  const paths = [];

  const model = models?.[modelName];

  if (!model?.fields) {
    return paths;
  }

  function walk(fields, pathPrefix = "") {
    for (const key in fields) {
      const field = fields[key];
      const full = pathPrefix ? `${pathPrefix}.${key}` : key;

      if (field.type === "collection") {
        walk(field.fields, full);
      } else if (field.type === "relation") {
        const related = models[field.model];

        if (related?.fields) {
          walk(related.fields, full);
        }
      } else if (field.type === "single") {
        walk(field.fields, full);
      } else {
        paths.push(full);
      }
    }
  }

  walk(model.fields, prefix);

  return paths;
}

export function buildRelationIndexes(data = {}) {
  const indexes = {};

  for (const modelName in data) {
    const items = data[modelName];

    if (!Array.isArray(items)) {
      continue;
    }

    const map = new Map();

    for (const item of items) {
      if (item?.id) {
        map.set(item.id, item);
      }
    }

    indexes[modelName] = map;
  }

  return indexes;
}

export function cleanResolvedProp(key, resolvedProp) {
  if (!key) {
    return undefined;
  }

  const value = resolvedProp;

  if (value === null || value === undefined) {
    return undefined;
  }

  if (value && typeof value === "object" && !Array.isArray(value) && (value.type === "model" || value.type === "page")) {
    return undefined;
  }

  if (key.startsWith("on") && typeof value !== "function") {
    return undefined;
  }

  return value;
}

export function cleanResolvedProps(resolvedProps) {
  if (!resolvedProps || typeof resolvedProps !== "object" || Array.isArray(resolvedProps)) {
    return EMPTY_OBJECT;
  }

  const cleaned = {};

  for (const key in resolvedProps) {
    const value = resolvedProps[key];

    if (value === null || value === undefined) {
      continue;
    }

    if (value && typeof value === "object" && !Array.isArray(value) && (value.type === "model" || value.type === "page")) {
      continue;
    }

    if (key.startsWith("on") && typeof value !== "function") {
      continue;
    }

    cleaned[key] = value;
  }

  return cleaned;
}

export function containsBinding(value) {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (value.type === "expression") {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(containsBinding);
  }

  for (const key in value) {
    if (containsBinding(value[key])) {
      return true;
    }
  }

  return false;
}

export function resolveBindings(props, model, componentId, schema, expressionEngine, callback = null) {
  if (!containsBinding(props)) {
    return props;
  }

  const resolved = {}; //Do not use EMPTY_OBJECT because the for loop adds to it!

  const name = expressionEngine?.context?.viewport?.name || "desktop";

  for (const key in props) {
    let currentValue = props[key];

    if (currentValue?.[name]) {
      currentValue = currentValue[name];
    }

    const propSchema = schema?.props?.[key];
    const propSchemaType = propSchema?.type;

    if (propSchemaType === "action") {
      resolved[key] = currentValue;

      continue;
    }

    if (currentValue?.type === "expression") {
      const applyFinal = (result) => {
        const casted = propSchemaType ? expressionEngine?.castFinal?.(result, propSchemaType) : result;

        return casted !== undefined ? casted : (currentValue.fallback ?? "");
      };

      const value = expressionEngine?.executeExpression?.(currentValue.expression, model);

      resolved[key] = applyFinal(value);

      continue;
    }

    if (currentValue?.type === "model" && typeof currentValue.path === "string") {
      const resolvedValue = getValueByPath(model, currentValue.path);

      resolved[key] = resolvedValue !== undefined ? resolvedValue : (currentValue.fallback ?? "");

      continue;
    }

    if (Array.isArray(currentValue)) {
      resolved[key] = currentValue.map((item) => (typeof item === "object" ? resolveBindings(item, model, componentId, schema, expressionEngine, callback) : item));

      continue;
    }

    if (currentValue && typeof currentValue === "object") {
      if (currentValue.type === "model") {
        resolved[key] = currentValue.fallback ?? "";
      } else {
        resolved[key] = resolveBindings(currentValue, model, componentId, schema, expressionEngine, callback);
      }

      continue;
    }

    resolved[key] = currentValue;
  }

  if (equals(props, resolved)) {
    return props;
  }

  return resolved;
}

export function resolveDataScope(selectedId, page, models, pageData, relationIndexes, integrationDataMap, expressionEngine, callback = null) {
  function findPath(component, targetId, parents = []) {
    if (component.id === targetId) {
      return [...parents, component];
    }

    for (const key in component.slots || EMPTY_OBJECT) {
      const slot = component.slots[key];

      for (const child of slot) {
        const result = findPath(child, targetId, [...parents, component]);

        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  const treePath = findPath(page, selectedId);

  if (!treePath) {
    return { name: "", scope: {}, treePath: null };
  }

  const scopeTreePath = [];

  let name = "";
  let scope = pageData;

  for (const comp of treePath) {
    if (comp.dataSource?.type === "expression") {
      const result = expressionEngine?.executeExpression?.(comp.dataSource.expression, scope);

      let collection = null;

      if (Array.isArray(result)) {
        collection = result;

        scope = result[0] ?? EMPTY_OBJECT;
      } else {
        scope = result ?? EMPTY_OBJECT;
      }

      name = "expression";

      scopeTreePath.push({
        type: "expression",
        name,
        collection,
        scope,
        schema: null,
        sample: null,
      });

      continue;
    }

    if (comp.dataSource?.type === "integration") {
      const data = integrationDataMap?.[comp.id];

      let collection = null;

      if (Array.isArray(data)) {
        collection = data;

        scope = data[0] ?? EMPTY_OBJECT;
      } else {
        scope = data ?? EMPTY_OBJECT;
      }

      name = comp.dataSource.endpointKey || "integration";

      scopeTreePath.push({
        type: "integration",
        name,
        collection,
        scope,
        schema: null,
        sample: data ?? null,
      });

      continue;
    }

    if (comp.dataSource?.type === "model") {
      const query = comp.dataSource.query;

      if (!query) {
        continue;
      }

      const preliminaryResult = getValueByPath(scope, query.from);

      let result = preliminaryResult !== undefined ? preliminaryResult : getValueByPath(pageData, query.from);

      const modelName = query.from.split(".").pop();
      const modelSchema = models?.[modelName];

      if (Array.isArray(result) && modelSchema) {
        result = result.map((item) => resolveRelations(item, modelSchema, pageData, relationIndexes));
      }

      let collection = null;

      if (Array.isArray(result)) {
        if (Array.isArray(query.filter) && query.filter.length) {
          result = result.filter((item) => query.filter.every((f) => applyFilter(item, f, expressionEngine)));
        }

        if (Array.isArray(query.sort) && query.sort.length) {
          result = applySort(result, query.sort);
        }

        if (typeof query.limit === "number") {
          result = result.slice(0, query.limit);
        }

        collection = result;

        scope = result[0] ?? EMPTY_OBJECT;
      } else {
        scope = result ?? EMPTY_OBJECT;
      }

      name = modelName;

      scopeTreePath.push({
        type: "model",
        name,
        collection,
        scope,
        schema: modelSchema,
        sample: null,
      });
    }
  }

  return { name, scope, treePath: scopeTreePath };
}

export function resolveDataSource(dataSource, parentModel, models, pageData, relationIndexes, expressionEngine) {
  if (!dataSource) {
    return parentModel;
  }

  if (dataSource.type === "expression") {
    const result = expressionEngine?.executeExpression?.(dataSource.expression, parentModel);

    return Array.isArray(result) ? result : [];
  }

  if (dataSource.type === "model") {
    const query = dataSource.query;

    if (!query) {
      return parentModel;
    }

    let items = parentModel && getValueByPath(parentModel, query.from) !== undefined ? getValueByPath(parentModel, query.from) : getValueByPath(pageData, query.from);

    if (!Array.isArray(items)) {
      return items ?? EMPTY_OBJECT;
    }

    const modelName = query.from.split(".").pop();
    const modelSchema = models?.[modelName];

    if (modelSchema) {
      items = items.map((item) => resolveRelations(item, modelSchema, pageData, relationIndexes));
    }

    if (Array.isArray(query.filter) && query.filter.length) {
      items = items.filter((item) => query.filter.every((f) => applyFilter(item, f, expressionEngine)));
    }

    if (Array.isArray(query.sort) && query.sort.length) {
      items = applySort(items, query.sort);
    }

    if (typeof query.limit === "number") {
      items = items.slice(0, query.limit);
    }

    return items;
  }

  if (dataSource.type === "integration") {
    let items = parentModel;

    if (!Array.isArray(items)) {
      return items ?? EMPTY_OBJECT;
    }

    if (Array.isArray(dataSource.query?.filter)) {
      items = items.filter((item) => dataSource.query.filter.every((f) => applyFilter(item, f, expressionEngine)));
    }

    if (Array.isArray(dataSource.query?.sort)) {
      items = applySort(items, dataSource.query.sort);
    }

    return items;
  }

  return parentModel;
}

export function resolveRelations(item, modelSchema, pageData, relationIndexes) {
  if (!item || !modelSchema?.fields) {
    return item;
  }

  const resolved = { ...item };

  for (const fieldName in modelSchema.fields) {
    const field = modelSchema.fields[fieldName];
    const value = resolved[fieldName];

    if (field.type === "collection" && Array.isArray(value)) {
      resolved[fieldName] = value.map((entry) => resolveRelations(entry, { fields: field.fields }, pageData, relationIndexes));
    }

    if (field.type === "relation") {
      if (typeof value === "string") {
        const index = relationIndexes?.[field.model];

        if (index) {
          resolved[fieldName] = index.get(value) ?? null;
        }
      }
    }

    if (field.type === "single" && value && typeof value === "object" && !Array.isArray(value)) {
      resolved[fieldName] = {};

      for (const key in value) {
        resolved[fieldName][key] = resolveRelations(value[key], { fields: field.fields }, pageData, relationIndexes);
      }
    }
  }

  return resolved;
}

export function retrieveViewProp(prop, viewport) {
  const name = viewport?.name || "desktop";

  const value = prop;

  if (value && typeof value === "object" && !Array.isArray(value) && name in value) {
    return value[name];
  }

  return value;
}

export function retrieveViewProps(props, viewport) {
  const name = viewport?.name || "desktop";

  const retrieved = { ...props };

  for (const key in retrieved) {
    const value = retrieved[key];

    if (value && typeof value === "object" && !Array.isArray(value) && name in value) {
      retrieved[key] = value[name];
    }
  }

  return retrieved;
}
