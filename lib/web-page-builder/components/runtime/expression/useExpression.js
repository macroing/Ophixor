// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { useSyncExternalStore } from "react";

export function useExpression(expressionEngine, exprId) {
  return useSyncExternalStore(
    (callback) => expressionEngine.subscribeExpression(exprId, callback),
    () => expressionEngine.getExpressionValue(exprId),
    () => expressionEngine.getExpressionValue(exprId),
  );
}
