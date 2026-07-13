// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connect from "@/lib/database";
import WebsiteIntegration from "@/models/WebsiteIntegration";

export async function DELETE(req, ctx) {
  return await executeIntegration({ method: "DELETE", req, params: ctx.params });
}

export async function GET(req, ctx) {
  return await executeIntegration({ method: "GET", req, params: ctx.params });
}

export async function PATCH(req, ctx) {
  return await executeIntegration({ method: "PATCH", req, params: ctx.params, requireBody: true });
}

export async function POST(req, ctx) {
  return await executeIntegration({ method: "POST", req, params: ctx.params, requireBody: true });
}

export async function PUT(req, ctx) {
  return await executeIntegration({ method: "PUT", req, params: ctx.params, requireBody: true });
}

function applyTransform(transform, data) {
  if (!transform) {
    return data;
  }

  try {
    return typeof transform === "function" ? transform(data) : data;
  } catch {
    return data;
  }
}

function buildBody(schema, params) {
  if (!schema || schema.type !== "object") {
    return undefined;
  }

  const body = {};

  for (const key of Object.keys(schema.fields || {})) {
    if (params[key] !== undefined) {
      body[key] = params[key];
    }
  }

  return body;
}

function buildHeaders(integration, endpoint, params) {
  const safeParams = { ...(params || {}) };

  delete safeParams["Authorization"];
  delete safeParams["authorization"];

  const headers = {
    "Content-Type": "application/json",
    ...(integration.defaultHeaders || {}),
    ...safeParams,
  };

  const auth = integration.auth;

  if (!auth || auth.type === "none") {
    return headers;
  }

  switch (auth.type) {
    case "apiKey":
      if (auth.apiKey && auth.apiKeyHeader) {
        headers[auth.apiKeyHeader] = auth.apiKey;
      }

      break;
    case "bearer":
      if (auth.bearerToken) {
        headers["Authorization"] = `Bearer ${auth.bearerToken}`;
      }

      break;
    case "basic":
      if (auth.basicUsername && auth.basicPassword) {
        const encoded = Buffer.from(`${auth.basicUsername}:${auth.basicPassword}`).toString("base64");

        headers["Authorization"] = `Basic ${encoded}`;
      }

      break;
  }

  return headers;
}

function buildUrl(base, path, params) {
  let url;

  try {
    url = new URL(path, base);
  } catch {
    url = new URL(path, "http://localhost");
  }

  Object.entries(params || {}).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      url.searchParams.set(key, val);
    }
  });

  return url.toString();
}

async function executeIntegration({ method, params, req, requireBody = false }) {
  try {
    const awaitedParams = await params;
    const websiteIntegrationId = awaitedParams.websiteIntegrationId;

    if (!mongoose.Types.ObjectId.isValid(websiteIntegrationId)) {
      return NextResponse.json({ error: "A valid integration ID is required." }, { status: 400 });
    }

    let parsedBody = null;

    if (requireBody) {
      try {
        parsedBody = await req.json();
      } catch {
        return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
      }
    }

    const requestUrl = new URL(req.url);

    const endpointKey = method === "GET" || method === "DELETE" ? requestUrl.searchParams.get("endpointKey") : parsedBody?.endpointKey;

    if (!endpointKey) {
      return NextResponse.json({ error: "A valid endpoint key is required." }, { status: 400 });
    }

    const queryParams = safeParseJSON(requestUrl.searchParams.get("queryParams"), {});
    const headerParams = safeParseJSON(requestUrl.searchParams.get("headerParams"), {});

    const safeQueryParams = sanitizeQueryParams(queryParams);
    const safeHeaderParams = sanitizeHeaders(headerParams);

    await connect();

    const websiteIntegration = await WebsiteIntegration.findById(websiteIntegrationId).lean();

    if (!websiteIntegration) {
      return NextResponse.json({ error: "An integration for that ID could not be found." }, { status: 404 });
    }

    const endpoint = websiteIntegration.endpoints.find((e) => e.key === endpointKey);

    if (!endpoint) {
      return NextResponse.json({ error: "An endpoint for that key could not be found." }, { status: 404 });
    }

    if (endpoint.method !== method) {
      return NextResponse.json({ error: `This endpoint expects to use the HTTP method ${endpoint.method} but the HTTP method ${method} was used.` }, { status: 400 });
    }

    const filteredQuery = filterBySchema(endpoint.query, safeQueryParams);
    const filteredHeaders = filterBySchema(endpoint.headers, safeHeaderParams);

    const url = buildUrl(websiteIntegration.baseUrl, endpoint.path, filteredQuery);

    const headers = buildHeaders(websiteIntegration, endpoint, filteredHeaders);

    let body = undefined;

    if (requireBody) {
      const params = parsedBody?.params || {};

      const filteredBody = filterBySchema(endpoint.body, params);

      body = JSON.stringify(buildBody(endpoint.body, filteredBody));
    }

    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    const contentType = response.headers.get("content-type") || "";

    const data = contentType.includes("application/json") ? await response.json() : await response.text();

    const transformed = applyTransform(endpoint.transform, data);

    return NextResponse.json({ data: transformed }, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: "An unexpected error has occurred!" }, { status: 500 });
  }
}

function filterBySchema(schema, params) {
  if (!schema?.fields) {
    return {};
  }

  const result = {};

  for (const key of Object.keys(schema.fields)) {
    if (params[key] !== undefined) {
      result[key] = params[key];
    }
  }

  return result;
}

function safeParseJSON(value, fallback = {}) {
  if (typeof value !== "string") {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value);

    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function sanitizeHeaders(params) {
  const result = {};

  const BLOCKED_HEADERS = new Set(["authorization", "cookie", "host", "content-length"]);

  for (const [key, value] of Object.entries(params)) {
    if (typeof key !== "string" || !key.trim()) {
      continue;
    }

    const lower = key.toLowerCase();

    if (BLOCKED_HEADERS.has(lower)) {
      continue;
    }

    if (typeof value === "string") {
      result[key] = value;
    }
  }

  return result;
}

function sanitizeQueryParams(params) {
  const result = {};

  for (const [key, value] of Object.entries(params)) {
    if (typeof key !== "string" || !key.trim()) {
      continue;
    }

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      result[key] = String(value);
    }
  }

  return result;
}
