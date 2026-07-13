// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { createRule } from "../../transform/dsl/createRule";
import { getSchemaForType } from "../../schema/getSchemaForType";

export const addComponentRule = createRule({
  name: "add-component",
  when: ({ value, valueKey }, { component, parentId }) => value && typeof value === "object" && !Array.isArray(value) && value.id === parentId && value.slots && component && typeof component === "object" && !Array.isArray(component),
  apply: ({ value }, { callback, component, pageSchema, parentId, slotName }) => {
    const schema = getSchemaForType(value.type, pageSchema);

    const allowedChildComponents = schema?.slots?.[slotName]?.allowedChildComponents;

    if (!allowedChildComponents?.includes?.(component.type)) {
      return value;
    }

    if (typeof callback === "function") {
      callback(parentId, slotName, component.id);
    }

    return {
      ...value,
      slots: {
        ...value.slots,
        [slotName]: [...(value.slots?.[slotName] || []), component],
      },
    };
  },
});
