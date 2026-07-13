// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { createRule } from "../../transform/dsl/createRule";
import { equals } from "../../transform/core/equals";
import { CURRENT_VERSION } from "../../constants/version";

export const withUpdatedMetadataRule = createRule({
  name: "update-metadata",
  when: ({ value }) => value && typeof value === "object" && value.type === "Page",
  apply: ({ value }, { initialPage }) => {
    if (equals(value, initialPage)) {
      return initialPage;
    }

    const now = new Date().toISOString();

    return {
      ...value,
      metadata: {
        createdAt: value.metadata?.createdAt ?? now,
        updatedAt: now,
        version: value.metadata?.version ?? CURRENT_VERSION,
      },
    };
  },
});
