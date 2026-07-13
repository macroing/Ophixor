// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function equals(a, b) {
  if (Object.is(a, b)) {
    return true;
  }

  if (a === null || b === null) {
    return false;
  }

  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) {
      return false;
    }

    return a.every((v, i) => equals(v, b[i]));
  }

  if (a instanceof Date) {
    return b instanceof Date && a.getTime() === b.getTime();
  }

  if (typeof a === "object") {
    const ak = Object.keys(a);
    const bk = Object.keys(b);

    if (ak.length !== bk.length) {
      return false;
    }

    return ak.every((k) => Object.prototype.hasOwnProperty.call(b, k) && equals(a[k], b[k]));
  }

  return false;
}
