// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { createRule } from "../../transform/dsl/createRule";
import { equals } from "../../transform/core/equals";

export const updateComponentRule = createRule({
  name: "update-component",
  when: ({ value }, { id }) => value && typeof value === "object" && value.id === id,
  apply: ({ value }, { callback, id, patch }) => {
    const next = { ...value };

    if (patch.props) {
      next.props = {
        ...value.props,
        ...patch.props,
      };
    }

    for (const key of Object.keys(patch)) {
      if (key !== "props") {
        next[key] = patch[key];
      }
    }

    if (equals(next, value)) {
      return value;
    }

    if (typeof callback === "function") {
      callback(id, patch);
    }

    return next;
  },
});
