// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import mongoose from "mongoose";

const websiteComponentTemplateSchema = new mongoose.Schema(
  {
    componentTemplate: {
      default: null,
      type: Object,
    },
    createdBy: {
      ref: "PlatformUser",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.models.WebsiteComponentTemplate || mongoose.model("WebsiteComponentTemplate", websiteComponentTemplateSchema);
