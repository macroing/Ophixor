// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function clone(value, filter = null, seen = new WeakMap()) {
  //Primitives and functions:
  if (value === null || typeof value !== "object") {
    return value;
  }

  //Handle circular references:
  if (seen.has(value)) {
    return seen.get(value);
  }

  //Date:
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  //RegExp:
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  //Map:
  if (value instanceof Map) {
    const result = new Map();

    seen.set(value, result);

    value.forEach((v, k) => {
      result.set(clone(k, filter, seen), clone(v, filter, seen));
    });

    return result;
  }

  //Set:
  if (value instanceof Set) {
    const result = new Set();

    seen.set(value, result);

    value.forEach((v) => {
      result.add(clone(v, filter, seen));
    });

    return result;
  }

  //Array:
  if (Array.isArray(value)) {
    const result = [];

    seen.set(value, result);

    value.forEach((item, index) => {
      result[index] = clone(item, filter, seen);
    });

    return result;
  }

  //Typed arrays:
  if (ArrayBuffer.isView(value)) {
    return value.constructor.from(value);
  }

  //Plain Object:
  const result = {};

  seen.set(value, result);

  Object.keys(value).forEach((key) => {
    if (typeof filter === "function") {
      if (filter(key, value)) {
        result[key] = clone(value[key], filter, seen);
      }
    } else {
      result[key] = clone(value[key], filter, seen);
    }
  });

  return result;
}
