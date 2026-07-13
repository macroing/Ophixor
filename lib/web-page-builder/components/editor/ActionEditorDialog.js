// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useEffect, useState } from "react";

import WorkflowEditorDialog from "../workflow/WorkflowEditorDialog";
import { actionToWorkflow, workflowToAction } from "../workflow/workflow-utilities";

export default function ActionEditorDialog(props) {
  const action = props.action || {};
  const componentType = props.componentType;
  const dataScope = props.dataScope;
  const expectedType = props.expectedType;
  const isOpen = props.isOpen;
  const isPlatformAdmin = props.isPlatformAdmin;
  const onChange = props.onChange;
  const onClose = props.onClose;
  const plan = props.plan;

  const [graph, setGraph] = useState(() => actionToWorkflow(action));

  useEffect(() => {
    if (action && isOpen) {
      setGraph(actionToWorkflow(action));
    } else {
      setGraph(null);
    }
  }, [action, isOpen]);

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
      const nextAction = workflowToAction(nextGraph);

      if (onChange) {
        onChange(nextAction);
      }

      if (onClose) {
        onClose();
      }
    },
    [expectedType, onChange, onClose],
  );

  if (graph === null) {
    return null;
  }

  return <WorkflowEditorDialog componentType={componentType} dataScope={dataScope} graph={graph} isExpressionOnly={false} isOpen={isOpen} isPlatformAdmin={isPlatformAdmin} onChange={handleChange} onClose={handleClose} onDone={handleDone} plan={plan} />;
}
