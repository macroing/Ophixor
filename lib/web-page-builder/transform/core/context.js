// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function createContext({ parent = null, parentIndex = null, parentKey = null, parents = [], transformArray, transformObject, value, valueIndex = null, valueKey = null, valueOld }) {
  return {
    parent,
    parentIndex,
    parentKey,
    parents,
    transformArray,
    transformObject,
    value,
    valueIndex,
    valueKey,
    valueOld,
  };
}
