// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { createContext } from "./context";
import { equals } from "./equals";

export function transform(value, transformerOrPipeline) {
  const pipeline = Array.isArray(transformerOrPipeline) ? transformerOrPipeline : [transformerOrPipeline];

  let current = value;

  for (const transformer of pipeline) {
    const next = transformImpl(current, transformer, {
      parent: null,
      parentIndex: null,
      parentKey: null,
      parents: [],
    });

    if (next === current) {
      continue;
    }

    current = next;
  }

  return current;
}

function transformArray(array, filter, transformer) {
  let next = [...array];
  let removed = [];

  if (filter) {
    next = next.filter((v, i) => {
      const keep = filter(v, i);

      if (!keep) {
        removed.push(v);
      }

      return keep;
    });
  }

  if (transformer) {
    transformer(next, removed);
  }

  return equals(array, next) ? array : next;
}

function transformArrayImpl(array, transformer, contextBase) {
  let changed = false;

  const next = array.map((v, i) => {
    const nv = transformImpl(v, transformer, {
      parent: array,
      parentIndex: contextBase.valueIndex,
      parentKey: contextBase.valueKey,
      parents: [...contextBase.parents, array],
      valueIndex: i,
    });

    if (!equals(v, nv)) {
      changed = true;
    }

    return nv;
  });

  const base = changed ? next : array;

  const context = createContext({
    ...contextBase,
    value: base,
    valueOld: array,
    transformArray,
  });

  const out = transformer(context);

  return equals(base, out) ? base : out;
}

function transformImpl(value, transformer, contextBase) {
  if (!transformer) {
    return value;
  }

  if (value === null || typeof value !== "object" || typeof value === "function") {
    return transformValue(value, transformer, contextBase);
  }

  if (Array.isArray(value)) {
    return transformArrayImpl(value, transformer, contextBase);
  }

  return transformObjectImpl(value, transformer, contextBase);
}

function transformObject(obj, filter, transformer) {
  const next = { ...obj };
  const removed = {};

  if (filter) {
    for (const k in obj) {
      if (!filter(obj[k], k)) {
        removed[k] = obj[k];

        delete next[k];
      }
    }
  }

  if (transformer) {
    transformer(next, removed);
  }

  return equals(obj, next) ? obj : next;
}

function transformObjectImpl(object, transformer, contextBase) {
  if (contextBase.parents.includes(object)) {
    return object;
  }

  let changed = false;

  const next = { ...object };

  for (const [k, v] of Object.entries(next)) {
    const nv = transformImpl(v, transformer, {
      parent: object,
      parentKey: k,
      parents: [...contextBase.parents, object],
    });

    if (!equals(v, nv)) {
      next[k] = nv;

      changed = true;
    }
  }

  const base = changed ? next : object;

  const context = createContext({
    ...contextBase,
    value: base,
    valueOld: object,
    transformObject,
  });

  const out = transformer(context);

  return equals(base, out) ? base : out;
}

function transformValue(value, transformer, contextBase) {
  const context = createContext({
    ...contextBase,
    value,
    valueOld: value,
  });

  const next = transformer(context);

  return equals(value, next) ? value : next;
}
