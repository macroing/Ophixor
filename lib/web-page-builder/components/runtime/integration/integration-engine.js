// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { isPlainObject } from "@/lib/web-page-builder/validation/isPlainObject";

const dataCache = new WeakMap();

export async function executeIntegrationClient({ dataSource, resolveExpression }) {
  if (!dataSource || dataSource.type !== "integration") {
    return null;
  }

  const { integrationId, endpointKey, method, schema = {}, params = {} } = dataSource;

  if (!integrationId || !endpointKey) {
    return null;
  }

  try {
    const resolvedParams = {};

    for (const [key, expr] of Object.entries(params)) {
      const resolved = resolveExpression(expr);

      resolvedParams[key] = unwrapExpressionDeep(resolved);
    }

    const { queryParams, headerParams, bodyParams } = splitParams(resolvedParams, schema);

    const isRead = method === "GET" || method === "DELETE";

    const url = `/api/website-integration/${integrationId}/execute?endpointKey=${encodeURIComponent(endpointKey)}&queryParams=${encodeURIComponent(JSON.stringify(queryParams))}&headerParams=${encodeURIComponent(JSON.stringify(headerParams))}`;

    /*
    if (method === "GET" && dataCache.has(url)) {
      const cachedData = dataCache.get(url);

      if (isPlainObject(cachedData) && cachedData?.revalidateAt) {
        const now = Date.now();

        if (now < cachedData.revalidateAt) {
          return cachedData.data;
        }
      }
    }
    */

    const options = {
      method,
    };

    if (!isRead) {
      options.body = JSON.stringify({
        endpointKey,
        params: bodyParams,
      });
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    const res = await fetch(url, options);

    if (!res.ok) {
      const error = await safeParseResponse(res);

      throw new Error(error?.error || "Integration request failed!");
    }

    const result = await res.json();

    const data = result.data;

    /*
    if (method === "GET") {
      dataCache.set(url, { data, revalidateAt: Date.now() + 1000 * 60 * 10 });
    }
    */

    return data;
  } catch (error) {
    throw error;
  }
}

async function safeParseResponse(res) {
  try {
    return await res.json();
  } catch {
    return { error: await res.text() };
  }
}

function splitParams(params, endpoint) {
  const queryParams = {};
  const headerParams = {};
  const bodyParams = {};

  for (const [key, value] of Object.entries(params)) {
    if (endpoint?.query?.fields?.[key]) {
      queryParams[key] = value;
    } else if (endpoint?.headers?.fields?.[key]) {
      headerParams[key] = value;
    } else if (endpoint?.body?.fields?.[key]) {
      bodyParams[key] = value;
    }
  }

  return { queryParams, headerParams, bodyParams };
}

function unwrapExpressionDeep(value) {
  if (Array.isArray(value)) {
    return value.map(unwrapExpressionDeep);
  }

  if (value && typeof value === "object") {
    if (value.type === "literal") {
      return unwrapExpressionDeep(value.value);
    }

    const result = {};

    for (const [k, v] of Object.entries(value)) {
      result[k] = unwrapExpressionDeep(v);
    }

    return result;
  }

  return value;
}
