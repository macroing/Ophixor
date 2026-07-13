// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { getActionSchema } from "../components/runtime/action/action-schema";
import { getExpressionSchema } from "../components/runtime/expression/expression-schema";
import { generateId } from "../page/identity/generateId";
import { isPlainObject } from "./isPlainObject";

const ACTION_SCHEMA = getActionSchema();
const EXPRESSION_SCHEMA = getExpressionSchema();

export function sanitizeAction(action) {
  if (!isPlainObject(action)) {
    return null;
  }

  const type = typeof action.type === "string" ? action.type.trim() : "";

  if (!type) {
    return null;
  }

  const schema = ACTION_SCHEMA[type];

  if (!schema) {
    return null;
  }

  const sanitized = {
    type,
    config: {},
    conditions: [],
    runAfter: [],
  };

  for (const [key, parameter] of Object.entries(schema.parameters || {})) {
    sanitized.config[key] = sanitizeParameterValue(action.config?.[key], parameter);
  }

  sanitized.config.id = typeof action.config?.id === "string" ? action.config.id : generateId("action");

  if (Array.isArray(action.conditions)) {
    sanitized.conditions = action.conditions
      .map((condition) => {
        if (condition?.type === "expression" && condition.expression) {
          return sanitizeExpression(condition.expression);
        }

        return sanitizeExpression(condition);
      })
      .filter(Boolean);
  }

  if (Array.isArray(action.runAfter)) {
    sanitized.runAfter = action.runAfter.map(sanitizeAction).filter(Boolean);
  }

  return sanitized;
}

export function sanitizeComponent(component, componentSchemas = {}, language = "en", componentIndex = null, isAddingToComponentIndex = false) {
  if (!isPlainObject(component) || !isPlainObject(componentSchemas)) {
    return null;
  }

  if (typeof component.type !== "string") {
    return null;
  }

  const componentSchema = componentSchemas[component.type];

  if (!componentSchema) {
    return null;
  }

  const isGeneratingId = typeof component.id !== "string";

  const id = isGeneratingId ? generateId(component.type.toLowerCase()) : component.id;

  const sanitizedComponent = {
    id,
    label: typeof component.label === "string" ? component.label : componentSchema.label,
    props: sanitizeProps(component, componentSchema, language),
    type: component.type,
  };

  if (componentSchema.slots && isPlainObject(component.slots)) {
    sanitizedComponent.slots = {};

    for (const [slotName, slot] of Object.entries(componentSchema.slots)) {
      const slotComponents = component.slots?.[slotName] || [];

      sanitizedComponent.slots[slotName] = sanitizeComponents(slotComponents, componentSchemas, language, componentIndex, isAddingToComponentIndex);
    }
  }

  if (isPlainObject(component.dataSource)) {
    sanitizedComponent.dataSource = sanitizeDataSource(component.dataSource);
  }

  if (isAddingToComponentIndex && isGeneratingId && isPlainObject(componentIndex)) {
    componentIndex[id] = sanitizedComponent;
  }

  return sanitizedComponent;
}

export function sanitizeComponents(components, componentSchemas = {}, language = "en", componentIndex = null, isAddingToComponentIndex = false) {
  if (!Array.isArray(components) || !isPlainObject(componentSchemas)) {
    return [];
  }

  return components.map((component) => sanitizeComponent(component, componentSchemas, language, componentIndex, isAddingToComponentIndex)).filter(Boolean);
}

export function sanitizeDataSource(dataSource) {
  if (!isPlainObject(dataSource)) {
    return null;
  }

  const { type } = dataSource;

  if (type === "model") {
    const fallback = typeof dataSource.fallback === "string" ? dataSource.fallback : "";

    if (isPlainObject(dataSource.query)) {
      const query = dataSource.query;

      const from = typeof query.from === "string" && query.from.trim() ? query.from.trim() : "";

      if (!from) {
        return null;
      }

      const filter = Array.isArray(query.filter) ? query.filter.filter((f) => isPlainObject(f) && typeof f.field === "string" && typeof f.operator === "string") : [];

      const sort = Array.isArray(query.sort) ? query.sort.filter((s) => isPlainObject(s) && typeof s.field === "string" && (s.direction === "asc" || s.direction === "desc")) : [];

      const limit = typeof query.limit === "number" && query.limit > 0 ? Math.floor(query.limit) : null;

      return {
        type: "model",
        query: {
          from,
          filter,
          sort,
          limit,
        },
        fallback,
      };
    }

    const path = typeof dataSource.path === "string" && dataSource.path.trim() ? dataSource.path.trim() : "";

    if (!path) {
      return null;
    }

    return {
      type: "model",
      query: {
        from: path,
        filter: [],
        sort: [],
        limit: null,
      },
      fallback,
    };
  }

  if (type === "expression") {
    const fallback = typeof dataSource.fallback === "string" ? dataSource.fallback : "";

    const expression = sanitizeExpression(dataSource.expression);

    if (!expression) {
      return null;
    }

    return {
      type: "expression",
      expression,
      fallback,
    };
  }

  if (type === "integration") {
    const integrationId = typeof dataSource.integrationId === "string" ? dataSource.integrationId.trim() : "";

    const endpointKey = typeof dataSource.endpointKey === "string" ? dataSource.endpointKey.trim() : "";

    const method = typeof dataSource.method === "string" ? dataSource.method.trim() : "";

    const schema = isPlainObject(dataSource.schema) ? dataSource.schema : null;

    if (!integrationId || !endpointKey || !method || !schema) {
      return null;
    }

    const params = isPlainObject(dataSource.params) ? sanitizeParams(dataSource.params) : {};

    return {
      type: "integration",
      integrationId,
      endpointKey,
      method,
      schema,
      params,
    };
  }

  return null;
}

export function sanitizeExpression(node) {
  if (!isPlainObject(node)) {
    return null;
  }

  const type = typeof node.type === "string" ? node.type.trim() : "";

  if (!type) {
    return null;
  }

  const schema = EXPRESSION_SCHEMA[type];

  if (!schema) {
    return null;
  }

  const id = typeof node.id === "string" ? node.id : generateId("expression");

  if (type === "literal" || type === "value") {
    return {
      id,
      type: "literal",
      value: sanitizeLiteralValue(node.value),
    };
  }

  if (type === "path") {
    const value = typeof node.value === "string" && node.value.trim() ? node.value.trim() : "__item__";

    return {
      id,
      type: "path",
      value,
    };
  }

  if (type === "object") {
    const fields = {};

    if (isPlainObject(node.fields)) {
      for (const [key, value] of Object.entries(node.fields)) {
        const sanitized = sanitizeExpression(value);

        if (sanitized) {
          fields[key] = sanitized;
        }
      }
    }

    return {
      id,
      type: "object",
      fields,
    };
  }

  const sanitized = {
    id,
    type,
  };

  for (const [key, param] of Object.entries(schema.parameters || {})) {
    const value = node[key];

    const cleaned = sanitizeExpressionParameter(value, param);

    if (cleaned === undefined) {
      return null;
    }

    sanitized[key] = cleaned;
  }

  return sanitized;
}

export function sanitizeItemsArray(value, language = "en") {
  if (Array.isArray(value)) {
    const array = [...value];

    for (let i = 0; i < array.length; i++) {
      let oldItem = array[i];

      if (typeof oldItem === "function") {
        array[i] = oldItem(language);

        oldItem = array[i];
      }

      if (isPlainObject(oldItem)) {
        const newItem = { ...oldItem };

        if (!newItem.id) {
          newItem.id = generateId("item");
        }

        if (!newItem.items) {
          newItem.items = [];
        }

        Object.entries(newItem).forEach(([key, currentValue]) => {
          const currentValueAfterFunction = typeof currentValue === "function" ? currentValue(language) : currentValue;

          newItem[key] = currentValueAfterFunction;

          if (Array.isArray(currentValueAfterFunction)) {
            newItem[key] = sanitizeItemsArray(currentValueAfterFunction, language);
          }
        });

        array[i] = newItem;
      }
    }

    return array;
  }

  if (typeof value === "function") {
    return value(language);
  }

  return value;
}

function sanitizeLiteralValue(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

function sanitizeObjectExpressions(obj) {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value?.type === "expression") {
      const expr = sanitizeExpression(value.expression);

      if (expr) {
        result[key] = {
          type: "expression",
          expression: expr,
          fallback: typeof value.fallback === "string" || typeof value.fallback === "boolean" || typeof value.fallback === "number" || Array.isArray(value.fallback) ? value.fallback : "",
        };
      }

      continue;
    }

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || Array.isArray(value)) {
      result[key] = value;
    }
  }

  return result;
}

function sanitizeParameterValue(value, parameter) {
  if (!parameter) {
    return undefined;
  }

  if (parameter.isExpressionAllowed === false) {
    return sanitizeStaticValue(value, parameter);
  }

  if (isExpressionValue(value)) {
    return {
      type: "expression",
      expression: sanitizeExpression(value.expression),
      fallback: typeof value.fallback === "string" || typeof value.fallback === "number" || typeof value.fallback === "boolean" || Array.isArray(value.fallback) ? value.fallback : "",
    };
  }

  if (isExpressionNode(value)) {
    return {
      type: "expression",
      expression: sanitizeExpression(value),
      fallback: "",
    };
  }

  if (Array.isArray(parameter.type)) {
    for (const type of parameter.type) {
      const sanitized = sanitizeParameterValueByType(value, type);

      if (sanitized !== undefined) {
        return sanitized;
      }
    }

    return undefined;
  }

  return sanitizeParameterValueByType(value, parameter.type);
}

function sanitizeParameterValueByType(value, type) {
  if (typeof type !== "string") {
    return sanitizeExpressionOrNode(value);
  }

  if (type.startsWith("array")) {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.map(sanitizeExpressionOrNode).filter(Boolean);
  }

  if (type === "object") {
    if (!isPlainObject(value)) {
      return {};
    }

    return sanitizeObjectExpressions(value);
  }

  return sanitizeExpressionOrNode(value);
}

function sanitizeParams(params) {
  const result = {};

  for (const [key, value] of Object.entries(params)) {
    const sanitized = sanitizeExpressionOrNode(value);

    if (sanitized) {
      result[key] = sanitized;
    }
  }

  return result;
}

function sanitizePrimitiveByType(value, type, parameter) {
  switch (type) {
    case "string":
      return typeof value === "string" ? value.trim() : "";
    case "number":
      return typeof value === "number" && Number.isFinite(value) ? value : 0;
    case "boolean":
      return typeof value === "boolean" ? value : false;
    case "object":
      return isPlainObject(value) ? value : {};
    case "array":
      return Array.isArray(value) ? value : [];
    case "any":
      return value;
    default:
      if (typeof type === "string" && type.startsWith("enum")) {
        if (typeof value !== "string") {
          return undefined;
        }

        const options = Array.isArray(parameter?.options) ? parameter.options : [];

        return options.some((o) => o.value === value) ? value : undefined;
      }

      return value;
  }
}

export function sanitizeProps(component, componentSchema, language = "en") {
  if (!isPlainObject(component.props)) {
    return {};
  }

  const sanitizedProps = {};

  for (const [key, schemaProp] of Object.entries(componentSchema.props || {})) {
    if (!schemaProp.cssProperty) {
      sanitizedProps[key] = schemaProp.defaultValue ?? "";
    }
  }

  for (const [key, value] of Object.entries(component.props)) {
    const schemaProp = componentSchema.props[key];

    if (!schemaProp) {
      continue;
    }

    let actualValue = value;

    if (schemaProp.cssProperty && value && (value?.desktop !== undefined || value?.mobile !== undefined || value?.tablet !== undefined)) {
      let valueDesktop = value?.desktop;
      let valueMobile = value?.mobile;
      let valueTablet = value?.tablet;

      const undefinedCount = (valueDesktop === undefined ? 1 : 0) + (valueMobile === undefined ? 1 : 0) + (valueTablet === undefined ? 1 : 0);

      if (undefinedCount >= 2) {
        actualValue = valueDesktop !== undefined ? valueDesktop : valueMobile !== undefined ? valueMobile : valueTablet !== undefined ? valueTablet : actualValue;
      } else {
        if (valueDesktop === undefined) {
          if (valueMobile !== undefined) {
            valueDesktop = valueMobile;
          } else if (valueTablet !== undefined) {
            valueDesktop = valueTablet;
          }
        }

        if (valueMobile === undefined) {
          if (valueTablet !== undefined) {
            valueMobile = valueTablet;
          } else if (valueDesktop !== undefined) {
            valueMobile = valueDesktop;
          }
        }

        if (valueTablet === undefined) {
          if (valueMobile !== undefined) {
            valueTablet = valueMobile;
          } else if (valueDesktop !== undefined) {
            valueTablet = valueDesktop;
          }
        }

        const containerValue = {
          desktop: valueDesktop,
          mobile: valueMobile,
          tablet: valueTablet,
        };

        Object.entries(containerValue).forEach(([key, value]) => {
          let currentValue = typeof value === "function" ? value(language) : value;

          let nextValue = undefined;

          if (schemaProp.type === "action" && typeof currentValue === "object") {
            nextValue = sanitizeAction(currentValue) ?? null;
          } else if (schemaProp.type === "items" && Array.isArray(currentValue)) {
            nextValue = sanitizeItemsArray(currentValue, language);
          } else if (schemaProp.type === "selectors" && Array.isArray(currentValue)) {
            nextValue = sanitizeSelectors(currentValue);
          } else if (typeof currentValue === "string" || typeof currentValue === "boolean" || typeof currentValue === "number") {
            nextValue = currentValue;
          } else if (currentValue instanceof Date) {
            nextValue = currentValue.toISOString();
          } else if (isPlainObject(currentValue)) {
            if (currentValue.type === "expression" && isPlainObject(currentValue.expression)) {
              nextValue = {
                type: "expression",
                expression: sanitizeExpression(currentValue.expression),
                fallback: typeof currentValue.fallback === "string" || typeof currentValue.fallback === "boolean" || Array.isArray(currentValue.fallback) ? currentValue.fallback : schemaProp.defaultValue,
              };
            }
          }

          containerValue[key] = nextValue;
        });

        if (containerValue.desktop === undefined && containerValue.mobile === undefined && containerValue.tablet === undefined) {
          continue;
        }

        let hasDifferentValue = false;

        Object.entries(containerValue).forEach(([key, value]) => {
          if (value === undefined) {
            return;
          }

          if (schemaProp.defaultValue && typeof schemaProp.defaultValue === "object" && !Array.isArray(schemaProp.defaultValue) && key in schemaProp.defaultValue) {
            if (!isEqualToDefault(value, schemaProp.defaultValue[key])) {
              hasDifferentValue = true;
            }
          } else if (!isEqualToDefault(value, schemaProp.defaultValue)) {
            hasDifferentValue = true;
          }
        });

        if (hasDifferentValue) {
          sanitizedProps[key] = containerValue;
        }

        continue;
      }
    }

    let currentValue = typeof actualValue === "function" ? actualValue(language) : actualValue;

    let nextValue = undefined;

    if (schemaProp.type === "action" && typeof currentValue === "object") {
      nextValue = sanitizeAction(currentValue) ?? null;
    } else if (schemaProp.type === "items" && Array.isArray(currentValue)) {
      nextValue = sanitizeItemsArray(currentValue, language);
    } else if (schemaProp.type === "selectors" && Array.isArray(currentValue)) {
      nextValue = sanitizeSelectors(currentValue);
    } else if (typeof currentValue === "string" || typeof currentValue === "boolean" || typeof currentValue === "number") {
      nextValue = currentValue;
    } else if (currentValue instanceof Date) {
      nextValue = currentValue.toISOString();
    } else if (isPlainObject(currentValue)) {
      if (currentValue.type === "expression" && isPlainObject(currentValue.expression)) {
        nextValue = {
          type: "expression",
          expression: sanitizeExpression(currentValue.expression),
          fallback: typeof currentValue.fallback === "string" || typeof currentValue.fallback === "boolean" || Array.isArray(currentValue.fallback) ? currentValue.fallback : schemaProp.defaultValue,
        };
      }
    }

    if (nextValue !== undefined && !isEqualToDefault(nextValue, schemaProp.defaultValue)) {
      sanitizedProps[key] = nextValue;
    }
  }

  return sanitizedProps;
}

export function sanitizeSelectors(selectors) {
  if (!Array.isArray(selectors)) {
    return [];
  }

  return selectors
    .map((rule) => {
      if (!rule || typeof rule !== "object") {
        return null;
      }

      let selector = typeof rule.selector === "string" ? rule.selector.trim() : "";

      if (!selector) {
        return null;
      }

      const STATE_MAP = {
        hover: ":hover",
        focus: ":focus",
        active: ":active",
        visited: ":visited",
      };

      if (STATE_MAP[selector]) {
        selector = STATE_MAP[selector];
      }

      if (!isSafeSelector(selector)) {
        return null;
      }

      let media = null;

      if (typeof rule.media === "string") {
        const m = rule.media.trim();

        if (["mobile", "tablet", "desktop"].includes(m)) {
          media = m;
        }
      }

      const styles = {};

      if (rule.styles && typeof rule.styles === "object") {
        for (const [key, value] of Object.entries(rule.styles)) {
          if (typeof value === "string" || typeof value === "number") {
            styles[key] = value;

            continue;
          }

          if (value && typeof value === "object" && value.type === "expression") {
            styles[key] = value;
          }
        }
      }

      if (Object.keys(styles).length === 0) {
        return null;
      }

      return {
        selector,
        styles,
        ...(media ? { media } : {}),
      };
    })
    .filter(Boolean);
}

function sanitizeStaticValue(value, parameter) {
  const type = parameter.type;

  if (Array.isArray(type)) {
    for (const item of type) {
      const sanitized = sanitizePrimitiveByType(value, item, parameter);

      if (sanitized !== undefined) {
        return sanitized;
      }
    }

    return undefined;
  }

  return sanitizePrimitiveByType(value, type, parameter);
}

function isEqualToDefault(value, defaultValue) {
  const a = normalizeValue(value);
  const b = normalizeValue(defaultValue);

  if (a === b) {
    return true;
  }

  if (typeof a === "object" && typeof b === "object") {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  }

  return false;
}

function isExpressionNode(value) {
  return !!(value && typeof value === "object" && !Array.isArray(value) && typeof value.type === "string" && value.type !== "expression");
}

function isExpressionValue(value) {
  return !!(value && typeof value === "object" && value.type === "expression" && value.expression);
}

function isSafeSelector(selector) {
  if (selector.includes("<") || selector.includes(">")) {
    return false;
  }

  if (/^(html|body)$/i.test(selector)) {
    return false;
  }

  return true;
}

function normalizeValue(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

function sanitizeExpressionOrNode(value) {
  if (!isPlainObject(value)) {
    return sanitizePrimitive(value);
  }

  if (value.type === "expression" && isPlainObject(value.expression)) {
    return {
      type: "expression",
      expression: sanitizeExpression(value.expression),
      fallback: typeof value.fallback === "string" || typeof value.fallback === "number" || typeof value.fallback === "boolean" || Array.isArray(value.fallback) ? value.fallback : "",
    };
  }

  if (typeof value.type === "string") {
    return sanitizeExpression(value);
  }

  return {
    id: generateId("expression"),
    type: "literal",
    value,
  };
}

function sanitizeExpressionParameter(value, parameter) {
  if (!parameter) {
    return undefined;
  }

  const types = Array.isArray(parameter.type) ? parameter.type : [parameter.type];

  if (types.some((t) => typeof t === "string" && t.startsWith("array"))) {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.map((v) => sanitizeExpressionOrNode(v)).filter(Boolean);
  }

  return sanitizeExpressionOrNode(value);
}

function sanitizePrimitive(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizePrimitive);
  }

  if (isPlainObject(value)) {
    const result = {};

    for (const [key, v] of Object.entries(value)) {
      const cleaned = sanitizePrimitive(v);

      if (cleaned !== undefined) {
        result[key] = cleaned;
      }
    }

    return result;
  }

  return "";
}
