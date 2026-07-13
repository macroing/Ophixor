// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { createRule } from "../../transform/dsl/createRule";

export const sanitizePage = createRule({
  name: "sanitize-page",
  when: ({ value }) => value?.type === "Page",
  apply: ({ value }) => ({
    ...value,
    metadata: {
      ...value.metadata,
      updatedAt: new Date().toISOString(),
    },
  }),
});
