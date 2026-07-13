// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import mongoose from "mongoose";

const websiteModelSchema = new mongoose.Schema(
  {
    createdBy: {
      ref: "PlatformUser",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    fields: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    name: {
      required: true,
      type: String,
    },
    type: {
      default: "collection",
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
    minimize: false,
    timestamps: true,
  },
);

export default mongoose.models.WebsiteModel || mongoose.model("WebsiteModel", websiteModelSchema);
