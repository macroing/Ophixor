// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import mongoose from "mongoose";

const websiteModelDataSchema = new mongoose.Schema(
  {
    data: {
      required: true,
      type: mongoose.Schema.Types.Mixed,
    },
    website: {
      index: true,
      ref: "Website",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    websiteModel: {
      index: true,
      ref: "WebsiteModel",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    minimize: false,
    timestamps: true,
  },
);

export default mongoose.models.WebsiteModelData || mongoose.model("WebsiteModelData", websiteModelDataSchema);
