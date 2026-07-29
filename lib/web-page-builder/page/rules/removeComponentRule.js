// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { createRule } from "../../transform/dsl/createRule";

export const removeComponentRule = createRule({
  name: "remove-component",
  when: ({ value }) => Array.isArray(value),
  apply: ({ value }, { callback, id }) => {
    const filtered = value.filter((component) => component.id !== id);

    if (filtered.length !== value.length && typeof callback === "function") {
      let component = null;

      for (let i = 0; i < value.length; i++) {
        const currentComponent = value[i];

        if (currentComponent.id === id) {
          component = currentComponent;

          break;
        }
      }

      callback(id, component);
    }

    return filtered.length === value.length ? value : filtered;
  },
});
