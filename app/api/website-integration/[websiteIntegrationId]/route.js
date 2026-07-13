// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

import connect from "@/lib/database";
import { can, getPermissions } from "@/lib/services/permissions";
import { HttpError } from "@/lib/error";
import WebsiteIntegration from "@/models/WebsiteIntegration";

export const runtime = "nodejs";

export async function DELETE(req, { params }) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const awaitedParams = await params;

    const websiteIntegrationId = awaitedParams.websiteIntegrationId;

    if (!mongoose.Types.ObjectId.isValid(websiteIntegrationId)) {
      return NextResponse.json({ message: "A valid integration ID is required." }, { status: 400 });
    }

    await connect();

    let websiteIntegrationDeleted = null;

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const websiteIntegration = await WebsiteIntegration.findById(websiteIntegrationId).session(session).select("createdBy website").populate("website", "collaborators owner").exec();

        if (!websiteIntegration) {
          throw new HttpError("An integration for that ID could not be found.", 404);
        }

        websiteIntegrationDeleted = websiteIntegration;

        if (!websiteIntegration.website) {
          throw new HttpError("The website associated with that integration could not be found.", 404);
        }

        const website = websiteIntegration.website;

        const permissions = getPermissions(currentPlatformUser, website);

        const canDelete = can(permissions, "integration", "delete");

        if (!canDelete) {
          throw new HttpError("You do not have permission to perform this operation.", 403);
        }

        await WebsiteIntegration.deleteOne({ _id: websiteIntegration._id }).session(session);
      });

      return NextResponse.json({ message: "The integration has been successfully deleted.", websiteIntegration: websiteIntegrationDeleted }, { status: 200 });
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "The integration could not be deleted.";
      const status = error?.status || 500;

      return NextResponse.json({ message }, { status });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const awaitedParams = await params;

    const websiteIntegrationId = awaitedParams.websiteIntegrationId;

    if (!mongoose.Types.ObjectId.isValid(websiteIntegrationId)) {
      return NextResponse.json({ message: "A valid integration ID is required." }, { status: 400 });
    }

    await connect();

    const websiteIntegration = await WebsiteIntegration.findById(websiteIntegrationId).populate("website", "collaborators owner").lean(true).exec();

    if (!websiteIntegration) {
      return NextResponse.json({ message: "An integration for that ID could not be found." }, { status: 404 });
    }

    if (!websiteIntegration.website) {
      return NextResponse.json({ message: "The website associated with that integration could not be found." }, { status: 404 });
    }

    const website = websiteIntegration.website;

    const permissions = getPermissions(currentPlatformUser, website);

    const canRead = can(permissions, "integration", "read");

    if (!canRead) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    return NextResponse.json({ message: "An integration could be found.", websiteIntegration }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const awaitedParams = await params;

    const websiteIntegrationId = awaitedParams.websiteIntegrationId;

    if (!mongoose.Types.ObjectId.isValid(websiteIntegrationId)) {
      return NextResponse.json({ message: "A valid integration ID is required." }, { status: 400 });
    }

    const data = await req.json();

    const { integration } = data;

    await connect();

    const websiteIntegration = await WebsiteIntegration.findById(websiteIntegrationId).populate("website", "collaborators owner").exec();

    if (!websiteIntegration) {
      return NextResponse.json({ message: "An integration for that ID could not be found." }, { status: 404 });
    }

    if (!websiteIntegration.website) {
      return NextResponse.json({ message: "The website associated with that integration could not be found." }, { status: 404 });
    }

    const website = websiteIntegration.website;

    const permissions = getPermissions(currentPlatformUser, website);

    const canUpdate = can(permissions, "integration", "update");

    if (!canUpdate) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

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

    websiteIntegration.auth = {
      apiKey,
      apiKeyHeader,
      basicPassword,
      basicUsername,
      bearerToken,
      type,
    };
    websiteIntegration.baseUrl = baseUrl;
    websiteIntegration.defaultHeaders = defaultHeaders;
    websiteIntegration.description = description;
    websiteIntegration.endpoints = endpoints;
    websiteIntegration.name = name;

    await websiteIntegration.save();

    return NextResponse.json({ message: "The integration has been saved.", websiteIntegration }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
