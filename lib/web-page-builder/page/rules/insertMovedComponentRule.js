// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { createRule } from "../../transform/dsl/createRule";

export const insertMovedComponentRule = createRule({
  name: "insert-moved-component",
  when: ({ value }, { sourceParentId, targetParentId }) => value && typeof value === "object" && value.id === (targetParentId ?? sourceParentId),
  apply: ({ value }, { capture, direction, sourceIndex, sourceSlotName, targetIndex, targetSlotName }) => {
    if (!capture?.component) {
      return value;
    }

    const finalTargetSlotName = targetSlotName ?? sourceSlotName;

    let finalTargetIndex = targetIndex;

    if (typeof direction === "string" && typeof sourceIndex === "number") {
      finalTargetIndex = direction === "left" ? sourceIndex - 1 : sourceIndex + 1;
    }

    if (typeof finalTargetIndex !== "number" || finalTargetIndex < 0) {
      finalTargetIndex = 0;
    }

    const slot = [...(value?.slots?.[finalTargetSlotName] || [])];

    const clampedIndex = Math.min(finalTargetIndex, slot?.length || 0);

    slot.splice(clampedIndex, 0, capture.component);

    return {
      ...value,
      slots: {
        ...value.slots,
        [finalTargetSlotName]: slot,
      },
    };
  },
});
