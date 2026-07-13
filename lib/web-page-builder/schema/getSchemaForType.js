// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function getSchemaForType(type, pageSchema) {
  if (type === "Page") {
    return pageSchema;
  }

  return pageSchema.componentSchemas?.[type];
}
