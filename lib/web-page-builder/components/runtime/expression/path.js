// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

const PATH_CACHE = new Map();

function parsePath(path) {
  let parts = PATH_CACHE.get(path);

  if (!parts) {
    parts =
      path.match(/([^[.\]]+)|\[(\d*)\]/g)?.map((part) => {
        if (part === "[]") {
          return "__push__";
        }

        if (part.startsWith("[")) {
          return part.slice(1, -1);
        }

        return part;
      }) ?? [];

    PATH_CACHE.set(path, parts);
  }

  return parts;
}

export function getValueByPath(object, path) {
  if (object && path === "") {
    return object;
  }

  if (!object || !path) {
    return undefined;
  }

  if (path.startsWith("__item__")) {
    const subPath = path.replace(/^__item__\.?/, "");

    if (!subPath) {
      return object;
    }

    return getValueByPath(object, subPath);
  }

  const parts = parsePath(path);

  let current = object;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (part === "__push__") {
      return current;
    }

    const isIndex = /^\d+$/.test(part);

    const key = isIndex ? Number(part) : part;

    if (Array.isArray(current)) {
      if (isIndex) {
        current = current[key];
      } else {
        current = current.map((item) => item?.[key]);
      }

      continue;
    }

    if (typeof current === "object" && key in current) {
      current = current[key];

      continue;
    }

    return undefined;
  }

  return current;
}
