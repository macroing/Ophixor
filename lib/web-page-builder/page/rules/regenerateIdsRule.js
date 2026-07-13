// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { createRule } from "../../transform/dsl/createRule";
import { generateId } from "../identity/generateId";

export const regenerateIdsRule = createRule({
  name: "regenerate-ids",
  when: ({ value }) => value && typeof value === "object" && typeof value.type === "string",
  apply: ({ value }) => ({
    ...value,
    id: generateId(value.type.toLowerCase()),
  }),
});
