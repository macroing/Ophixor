// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

import connect from "@/lib/database";
import { can, getPermissions } from "@/lib/services/permissions";
import Website from "@/models/Website";
import WebsiteIntegration from "@/models/WebsiteIntegration";
import { canCreateWebsiteIntegration } from "@/lib/services/plan-services";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const allowedSortFields = ["createdAt", "updatedAt"];

    const url = new URL(req.url);

    const requestedSort = url.searchParams.get("sort") || "createdAt";
    const requestedSortOrder = url.searchParams.get("sortOrder") || "desc";

    const sort = allowedSortFields.includes(requestedSort) ? requestedSort : "createdAt";
    const sortOrder = requestedSortOrder === "asc" ? 1 : -1;
    const websiteCode = url.searchParams.get("websiteCode") || "";
    const websiteId = url.searchParams.get("websiteId") || "";

    if (!mongoose.Types.ObjectId.isValid(websiteId) && typeof websiteCode !== "string") {
      return NextResponse.json({ message: "A valid website ID or code is required." }, { status: 400 });
    }

    await connect();

    const website = await Website.findOne(mongoose.Types.ObjectId.isValid(websiteId) ? { _id: websiteId } : { code: websiteCode })
      .select("collaborators owner status visibility")
      .lean(true)
      .exec();

    if (!website) {
      return NextResponse.json({ message: "A website for that ID could not be found." }, { status: 404 });
    }

    const permissions = getPermissions(currentPlatformUser, website);

    const canRead = can(permissions, "integration", "read");

    if (!canRead) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const select = "";

    const params = {
      website: website._id,
    };

    const query = WebsiteIntegration.find(params).sort([[sort, sortOrder]]);

    if (select) {
      query.select(select);
    }

    const websiteIntegrations = await query.lean(true).exec();

    return NextResponse.json({ message: "Integrations could be found.", websiteIntegrations }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const data = await req.json();

    const { integration, websiteId } = data;

    if (!isPlainObject(integration)) {
      return NextResponse.json({ message: "A valid integration is required." }, { status: 400 });
    }

    const auth = integration.auth;

    if (!isPlainObject(auth)) {
      return NextResponse.json({ message: "A valid integration.auth is required." }, { status: 400 });
    }

    const type = auth.type;

    if (typeof type !== "string" || !["apiKey", "basic", "bearer", "none"].includes(type)) {
      return NextResponse.json({ message: "A valid integration.auth.type is required." }, { status: 400 });
    }

    let apiKey = auth.apiKey;
    let apiKeyHeader = auth.apiKeyHeader;
    let basicPassword = auth.basicPassword;
    let basicUsername = auth.basicUsername;
    let bearerToken = auth.bearerToken;

    if (type === "apiKey") {
      if (typeof apiKey !== "string") {
        return NextResponse.json({ message: "A valid integration.auth.apiKey is required." }, { status: 400 });
      }

      if (typeof apiKeyHeader !== "string") {
        return NextResponse.json({ message: "A valid integration.auth.apiKeyHeader is required." }, { status: 400 });
      }

      basicPassword = typeof basicPassword === "string" ? basicPassword : "";
      basicUsername = typeof basicUsername === "string" ? basicUsername : "";
      bearerToken = typeof bearerToken === "string" ? bearerToken : "";
    } else if (type === "basic") {
      if (typeof basicPassword !== "string") {
        return NextResponse.json({ message: "A valid integration.auth.basicPassword is required." }, { status: 400 });
      }

      if (typeof basicUsername !== "string") {
        return NextResponse.json({ message: "A valid integration.auth.basicUsername is required." }, { status: 400 });
      }

      apiKey = typeof apiKey === "string" ? apiKey : "";
      apiKeyHeader = typeof apiKeyHeader === "string" ? apiKeyHeader : "";
      bearerToken = typeof bearerToken === "string" ? bearerToken : "";
    } else if (type === "bearer") {
      if (typeof bearerToken !== "string") {
        return NextResponse.json({ message: "A valid integration.auth.bearerToken is required." }, { status: 400 });
      }

      apiKey = typeof apiKey === "string" ? apiKey : "";
      apiKeyHeader = typeof apiKeyHeader === "string" ? apiKeyHeader : "";
      basicPassword = typeof basicPassword === "string" ? basicPassword : "";
      basicUsername = typeof basicUsername === "string" ? basicUsername : "";
    } else if (type === "none") {
      apiKey = typeof apiKey === "string" ? apiKey : "";
      apiKeyHeader = typeof apiKeyHeader === "string" ? apiKeyHeader : "";
      basicPassword = typeof basicPassword === "string" ? basicPassword : "";
      basicUsername = typeof basicUsername === "string" ? basicUsername : "";
      bearerToken = typeof bearerToken === "string" ? bearerToken : "";
    }

    let baseUrl = integration.baseUrl;

    if (typeof baseUrl !== "string" || baseUrl.trim() === "") {
      return NextResponse.json({ message: "A valid integration.baseUrl is required." }, { status: 400 });
    }

    baseUrl = baseUrl.trim();

    const defaultHeaders = integration.defaultHeaders;

    if (!isPlainObject(defaultHeaders)) {
      return NextResponse.json({ message: "A valid integration.defaultHeaders is required." }, { status: 400 });
    }

    const description = integration.description;

    if (typeof description !== "string") {
      return NextResponse.json({ message: "A valid integration.description is required." }, { status: 400 });
    }

    const endpoints = integration.endpoints;

    if (!Array.isArray(endpoints)) {
      return NextResponse.json({ message: "A valid integration.endpoints is required." }, { status: 400 });
    }

    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];

      if (!isPlainObject(endpoint)) {
        return NextResponse.json({ message: `A valid integration.endpoints[${i}] is required.` }, { status: 400 });
      }

      const body = endpoint.body;

      if (!isPlainObject(body)) {
        return NextResponse.json({ message: `A valid integration.endpoints[${i}].body is required.` }, { status: 400 });
      }

      const cache = endpoint.cache;

      if (!isPlainObject(cache)) {
        return NextResponse.json({ message: `A valid integration.endpoints[${i}].cache is required.` }, { status: 400 });
      }

      const enabled = cache.enabled;

      if (typeof enabled !== "boolean") {
        return NextResponse.json({ message: `A valid integration.endpoints[${i}].cache.enabled is required.` }, { status: 400 });
      }

      const ttl = cache.ttl;

      if (typeof ttl !== "number") {
        return NextResponse.json({ message: `A valid integration.endpoints[${i}].cache.ttl is required.` }, { status: 400 });
      }

      const headers = endpoint.headers;

      if (!isPlainObject(headers)) {
        return NextResponse.json({ message: `A valid integration.endpoints[${i}].headers is required.` }, { status: 400 });
      }

      const key = endpoint.key;

      if (typeof key !== "string") {
        return NextResponse.json({ message: `A valid integration.endpoints[${i}].key is required.` }, { status: 400 });
      }

      const method = endpoint.method;

      if (typeof method !== "string" || !["DELETE", "GET", "PATCH", "POST", "PUT"].includes(method)) {
        return NextResponse.json({ message: `A valid integration.endpoints[${i}].method is required.` }, { status: 400 });
      }

      const path = endpoint.path;

      if (typeof path !== "string" || path.trim() === "") {
        return NextResponse.json({ message: `A valid integration.endpoints[${i}].path is required.` }, { status: 400 });
      }

      const query = endpoint.query;

      if (!isPlainObject(query)) {
        return NextResponse.json({ message: `A valid integration.endpoints[${i}].query is required.` }, { status: 400 });
      }

      const transform = endpoint.transform;

      if (!isPlainObject(transform) && transform !== null) {
        return NextResponse.json({ message: `A valid integration.endpoints[${i}].transform is required.` }, { status: 400 });
      }
    }

    const name = integration.name;

    if (typeof name !== "string") {
      return NextResponse.json({ message: "A valid integration.name is required." }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(websiteId)) {
      return NextResponse.json({ message: "A valid website ID is required." }, { status: 400 });
    }

    await connect();

    const website = await Website.findById(websiteId).select("collaborators name owner status visibility").populate("owner", "plan").lean(true).exec();

    if (!website) {
      return NextResponse.json({ message: "A website for that ID could not be found." }, { status: 404 });
    }

    const permissions = getPermissions(currentPlatformUser, website);

    const canCreate = can(permissions, "integration", "create");

    if (!canCreate) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    if (!(await canCreateWebsiteIntegration(currentPlatformUser, website))) {
      return NextResponse.json({ message: "You have already exceeded your integration limit for this website." }, { status: 400 });
    }

    const websiteIntegration = await WebsiteIntegration.create({
      auth: {
        apiKey,
        apiKeyHeader,
        basicPassword,
        basicUsername,
        bearerToken,
        type,
      },
      baseUrl,
      createdBy: currentPlatformUser._id,
      defaultHeaders,
      description,
      endpoints,
      name,
      website: website._id,
    });

    if (websiteIntegration) {
      return NextResponse.json({ message: "Your integration was successfully created!", websiteIntegration }, { status: 201 });
    }

    return NextResponse.json({ message: "Your integration could not be created." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
