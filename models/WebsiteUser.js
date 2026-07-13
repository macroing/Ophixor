// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import mongoose from "mongoose";

const websiteUserSchema = new mongoose.Schema(
  {
    activationToken: {
      default: "",
      type: String,
    },
    activatedAt: {
      default: null,
      type: Date,
    },
    code: {
      default: null,
      trim: true,
      type: String,
    },
    email: {
      required: true,
      trim: true,
      type: String,
    },
    emailNormalized: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
    },
    lastActiveAt: {
      default: null,
      type: Date,
    },
    name: {
      required: true,
      trim: true,
      type: String,
    },
    passwordHash: {
      required: true,
      type: String,
    },
    passwordResetToken: {
      default: "",
      type: String,
    },
    website: {
      ref: "Website",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    minimize: false,
    timestamps: true,
  },
);

websiteUserSchema.index(
  {
    code: 1,
    website: 1,
  },
  {
    partialFilterExpression: {
      code: {
        $ne: "",
        $type: "string",
      },
    },
    unique: true,
  },
);

websiteUserSchema.index(
  {
    emailNormalized: 1,
    website: 1,
  },
  { unique: true },
);

export default mongoose.models.WebsiteUser || mongoose.model("WebsiteUser", websiteUserSchema);
