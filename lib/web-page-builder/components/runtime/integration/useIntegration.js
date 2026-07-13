// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useState } from "react";

import { executeIntegrationClient } from "./integration-engine";

export function useIntegration(dataSource, resolveExpression, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!dataSource || dataSource.type !== "integration") {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await executeIntegrationClient({
        dataSource,
        resolveExpression,
      });

      setData(result);
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    run();
  }, deps);

  return {
    data,
    loading,
    error,
    refetch: run,
  };
}
