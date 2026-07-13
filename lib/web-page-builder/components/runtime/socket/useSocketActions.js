// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect } from "react";

import { useSocket } from "@/context/socket";

export function useSocketActions(broadcastAction, emitAction, actionEngine) {
  const { data, setData } = useSocket();

  useEffect(() => {
    if (!broadcastAction && !emitAction) {
      return;
    }

    if (!data) {
      return;
    }

    if (data.type !== "broadcast" && data.type !== "emit") {
      return;
    }

    const action = data.type === "broadcast" ? broadcastAction : emitAction;

    if (!action) {
      return;
    }

    const currentData = data.data;

    actionEngine?.executeAction?.(action, null, {
      ...(actionEngine?.context ?? {}),
      expressionEngine: {
        ...(actionEngine?.context?.expressionEngine ?? {}),
        context: {
          ...(actionEngine?.context?.expressionEngine?.context ?? {}),
          state: {
            ...(actionEngine?.context?.expressionEngine?.context?.state ?? {}),
            runtime: {
              ...(actionEngine?.context?.expressionEngine?.context?.state?.runtime ?? {}),
              socket: {
                data: currentData,
              },
            },
          },
        },
      },
    });

    setData(null);
  }, [actionEngine, broadcastAction, data, emitAction, setData]);

  return null;
}
