// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export const coercion = {
  array(value) {
    return toArray(value);
  },
  boolean(value) {
    return toBoolean(value);
  },
  number(value) {
    return toNumber(value);
  },
  object(value) {
    return toObject(value);
  },
  string(value) {
    return toString(value);
  },
};

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === null || value === undefined) {
    return [];
  }

  if (typeof value === "string") {
    try {
      const parsedValue = JSON.parse(value.trim());

      if (Array.isArray(parsedValue)) {
        return parsedValue;
      }
    } catch {}
  }

  return [value];
}

function toBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue === "false") {
      return false;
    }

    if (normalizedValue === "0") {
      return false;
    }

    if (normalizedValue === "true") {
      return true;
    }

    return normalizedValue !== "";
  }

  if (value === null || value === undefined) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }

  return !!value;
}

function toNumber(value) {
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsedNumber = Number(value.trim());

    return Number.isFinite(parsedNumber) ? parsedNumber : 0;
  }

  if (value === null || value === undefined) {
    return 0;
  }

  if (Array.isArray(value)) {
    return value.length;
  }

  if (typeof value === "object") {
    return Object.keys(value).length;
  }

  return 0;
}

function toObject(value) {
  if (value === null || value === undefined) {
    return {};
  }

  if (typeof value === "object") {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsedValue = JSON.parse(value.trim());

      if (parsedValue && typeof parsedValue === "object" && !Array.isArray(parsedValue)) {
        return parsedValue;
      }
    } catch {}
  }

  return {};
}

function toString(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    try {
      return JSON.stringify(value) ?? `Array(${value.length})`;
    } catch {
      return `Array(${value.length})`;
    }
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value) ?? `Object(${Object.keys(value).length})`;
    } catch {
      return `Object(${Object.keys(value).length})`;
    }
  }

  return String(value);
}
