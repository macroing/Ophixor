// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import mongoose from "mongoose";

const websiteMediaSchema = new mongoose.Schema(
  {
    alt: {
      default: "",
      trim: true,
      type: String,
    },
    createdBy: {
      ref: "PlatformUser",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    deletedAt: {
      default: null,
      type: Date,
    },
    hash: {
      index: true,
      trim: true,
      type: String,
    },
    height: {
      default: 0,
      type: Number,
    },
    mimeType: {
      default: "",
      trim: true,
      type: String,
    },
    name: {
      required: true,
      trim: true,
      type: String,
    },
    size: {
      default: 0,
      type: Number,
    },
    storageKey: {
      required: true,
      trim: true,
      type: String,
    },
    type: {
      enum: ["audio", "document", "image", "other", "video"],
      default: "image",
      type: String,
    },
    variants: [
      {
        height: Number,
        storageKey: String,
        width: Number,
      },
    ],
    website: {
      ref: "Website",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    width: {
      default: 0,
      type: Number,
    },
  },
  {
    minimize: false,
    timestamps: true,
  },
);

websiteMediaSchema.index({ createdAt: -1, website: 1 });
websiteMediaSchema.index({ deletedAt: 1, website: 1 });

export default mongoose.models.WebsiteMedia || mongoose.model("WebsiteMedia", websiteMediaSchema);
