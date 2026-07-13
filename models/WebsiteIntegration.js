// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import mongoose from "mongoose";

const websiteIntegrationSchema = new mongoose.Schema(
  {
    auth: {
      apiKey: String,
      apiKeyHeader: String,
      basicPassword: String,
      basicUsername: String,
      bearerToken: String,
      type: {
        default: "none",
        enum: ["apiKey", "basic", "bearer", "none"],
        type: String,
      },
    },
    baseUrl: {
      default: "",
      type: String,
    },
    createdBy: {
      ref: "PlatformUser",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    defaultHeaders: {
      default: {},
      type: mongoose.Schema.Types.Mixed,
    },
    description: {
      default: "",
      trim: true,
      type: String,
    },
    endpoints: [
      {
        body: {
          default: {},
          type: mongoose.Schema.Types.Mixed,
        },
        cache: {
          enabled: {
            default: false,
            type: Boolean,
          },
          ttl: {
            default: 60,
            type: Number,
          },
        },
        headers: {
          default: {},
          type: mongoose.Schema.Types.Mixed,
        },
        key: {
          required: true,
          type: String,
        },
        method: {
          default: "GET",
          enum: ["DELETE", "GET", "PATCH", "POST", "PUT"],
          type: String,
        },
        path: {
          required: true,
          type: String,
        },
        query: {
          default: {},
          type: mongoose.Schema.Types.Mixed,
        },
        transform: {
          default: null,
          type: mongoose.Schema.Types.Mixed,
        },
      },
    ],
    name: {
      required: true,
      trim: true,
      type: String,
    },
    website: {
      index: true,
      ref: "Website",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    minimize: false,
  },
);

export default mongoose.models.WebsiteIntegration || mongoose.model("WebsiteIntegration", websiteIntegrationSchema);
