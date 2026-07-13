// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { executeIntegrationClient } from "../integration/integration-engine";
import { resolveBindings } from "../../editor/editor-helpers";

export async function resolveIntegration({ component, componentSchema, context, scope }) {
  const resolveExpression = (expr) => {
    const result = resolveBindings({ value: expr }, scope, context.componentIndex, component.id, componentSchema, context.nowTick, context.viewport, context.platformUser, context.website);

    return result?.value;
  };

  try {
    return await executeIntegrationClient({
      dataSource: component.dataSource,
      resolveExpression,
    });
  } catch (error) {
    return null;
  }
}
