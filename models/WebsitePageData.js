// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import mongoose from "mongoose";

const websitePageDataSchema = new mongoose.Schema(
  {
    createdBy: {
      ref: "PlatformUser",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    page: {
      default: null,
      type: Object,
    },
    website: {
      ref: "Website",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    websitePage: {
      ref: "WebsitePage",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    minimize: false,
    timestamps: true,
  },
);

export default mongoose.models.WebsitePageData || mongoose.model("WebsitePageData", websitePageDataSchema);
