// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useEffect, useState } from "react";

import WorkflowEditorDialog from "../workflow/WorkflowEditorDialog";
import { castExpressionToType, expressionToWorkflow, workflowToExpression } from "../workflow/workflow-utilities";

export default function ExpressionEditorDialog(props) {
  const componentType = props.componentType;
  const dataScope = props.dataScope;
  const expectedType = props.expectedType;
  const expression = props.expression;
  const isCastingToExpression = props.isCastingToExpression;
  const isOpen = props.isOpen;
  const isPlatformAdmin = props.isPlatformAdmin;
  const onChange = props.onChange;
  const onClose = props.onClose;
  const plan = props.plan;

  const [graph, setGraph] = useState(() => expressionToWorkflow(expression));

  useEffect(() => {
    if (isOpen) {
      setGraph(expressionToWorkflow(expression));
    }
  }, [expression, isOpen]);

  const handleChange = useCallback(
    (nextGraph) => {
      setGraph(nextGraph);
    },
    [setGraph],
  );

  const handleClose = useCallback(
    (e) => {
      if (onClose) {
        onClose(e);
      }
    },
    [onClose],
  );

  const handleDone = useCallback(
    (nextGraph, e) => {
      let nextExpression = workflowToExpression(nextGraph);

      if (expectedType) {
        nextExpression = castExpressionToType(nextExpression, expectedType);
      }

      const nextValue = isCastingToExpression
        ? {
            type: "expression",
            expression: nextExpression,
          }
        : nextExpression;

      if (onChange) {
        onChange(nextValue);
      }

      if (onClose) {
        onClose();
      }
    },
    [expectedType, isCastingToExpression, onChange, onClose],
  );

  return <WorkflowEditorDialog componentType={componentType} dataScope={dataScope} graph={graph} isExpressionOnly={true} isOpen={isOpen} isPlatformAdmin={isPlatformAdmin} onChange={handleChange} onClose={handleClose} onDone={handleDone} plan={plan} />;
}
