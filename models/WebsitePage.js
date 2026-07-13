// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import mongoose from "mongoose";

const websitePageSchema = new mongoose.Schema(
  {
    createdBy: {
      ref: "PlatformUser",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    description: {
      default: "",
      required: false,
      trim: true,
      type: String,
    },
    firstPublishedAt: {
      default: null,
      type: Date,
    },
    isHome: {
      default: false,
      type: Boolean,
    },
    isSocketConnectingAutomatically: {
      default: false,
      type: Boolean,
    },
    isSocketEnabled: {
      default: false,
      type: Boolean,
    },
    name: {
      required: true,
      trim: true,
      type: String,
    },
    passwordHash: {
      default: "",
      trim: true,
      type: String,
    },
    parentWebsitePage: {
      default: null,
      ref: "WebsitePage",
      type: mongoose.Schema.Types.ObjectId,
    },
    path: {
      required: true,
      trim: true,
      type: String,
    },
    publishedAt: {
      default: null,
      type: Date,
    },
    seo: {
      canonicalUrl: {
        default: "",
        trim: true,
        type: String,
      },
      description: {
        default: "",
        trim: true,
        type: String,
      },
      keywords: [
        {
          default: "",
          trim: true,
          type: String,
        },
      ],
      og: {
        description: {
          default: "",
          trim: true,
          type: String,
        },
        image: {
          default: "",
          trim: true,
          type: String,
        },
        title: {
          default: "",
          trim: true,
          type: String,
        },
      },
      robots: {
        noFollow: {
          default: false,
          type: Boolean,
        },
        noIndex: {
          default: false,
          type: Boolean,
        },
      },
      title: {
        default: "",
        trim: true,
        type: String,
      },
    },
    slug: {
      default: "",
      trim: true,
      type: String,
    },
    status: {
      default: "draft",
      enum: ["archived", "draft", "published"],
      type: String,
    },
    type: {
      default: "standard",
      enum: ["standard", "landing", "system"],
      type: String,
    },
    updateNumber: {
      default: 0,
      type: Number,
    },
    visibility: {
      default: "private",
      enum: ["password", "private", "public"],
      type: String,
    },
    website: {
      ref: "Website",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    websitePageDataDraft: {
      default: null,
      ref: "WebsitePageData",
      type: mongoose.Schema.Types.ObjectId,
    },
    websitePageDataPublished: {
      default: null,
      ref: "WebsitePageData",
      type: mongoose.Schema.Types.ObjectId,
    },
    websitePageDataVersions: [
      {
        createdAt: Date,
        createdBy: {
          ref: "PlatformUser",
          required: true,
          type: mongoose.Schema.Types.ObjectId,
        },
        websitePageData: {
          default: null,
          ref: "WebsitePageData",
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
  },
  {
    minimize: false,
    timestamps: true,
  },
);

websitePageSchema.index(
  {
    path: 1,
    website: 1,
  },
  {
    unique: true,
  },
);

websitePageSchema.index({
  "seo.robots.noIndex": 1,
  status: 1,
  visibility: 1,
  website: 1,
});

export default mongoose.models.WebsitePage || mongoose.model("WebsitePage", websitePageSchema);
