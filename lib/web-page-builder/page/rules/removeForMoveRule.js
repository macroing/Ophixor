// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { createRule } from "../../transform/dsl/createRule";

export const removeForMoveRule = createRule({
  name: "remove-for-move",
  when: ({ value }, { sourceId }) => Array.isArray(value) && value.some((component) => component.id === sourceId),
  apply: ({ value }, { capture, sourceId }) => {
    const next = [];

    for (const component of value) {
      if (component.id === sourceId) {
        capture.component = component;
      } else {
        next.push(component);
      }
    }

    return next.length === value.length ? value : next;
  },
});
