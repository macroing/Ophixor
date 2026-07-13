// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema(
  {
    code: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    collaborators: [
      {
        permissions: {
          componentTemplate: {
            create: {
              default: false,
              type: Boolean,
            },
            delete: {
              default: false,
              type: Boolean,
            },
            read: {
              default: true,
              type: Boolean,
            },
          },
          integration: {
            create: {
              default: false,
              type: Boolean,
            },
            delete: {
              default: false,
              type: Boolean,
            },
            read: {
              default: true,
              type: Boolean,
            },
            update: {
              default: false,
              type: Boolean,
            },
          },
          media: {
            create: {
              default: true,
              type: Boolean,
            },
            delete: {
              default: false,
              type: Boolean,
            },
            read: {
              default: true,
              type: Boolean,
            },
          },
          model: {
            create: {
              default: false,
              type: Boolean,
            },
            delete: {
              default: false,
              type: Boolean,
            },
            read: {
              default: true,
              type: Boolean,
            },
            update: {
              default: false,
              type: Boolean,
            },
          },
          modelData: {
            create: {
              default: false,
              type: Boolean,
            },
            delete: {
              default: false,
              type: Boolean,
            },
            read: {
              default: true,
              type: Boolean,
            },
            update: {
              default: false,
              type: Boolean,
            },
          },
          page: {
            create: {
              default: false,
              type: Boolean,
            },
            delete: {
              default: false,
              type: Boolean,
            },
            publish: {
              default: false,
              type: Boolean,
            },
            read: {
              default: true,
              type: Boolean,
            },
            update: {
              default: false,
              type: Boolean,
            },
          },
          website: {
            delete: {
              default: false,
              type: Boolean,
            },
            updateAccessibility: {
              default: false,
              type: Boolean,
            },
            updateAnalytics: {
              default: false,
              type: Boolean,
            },
            updateCollaborators: {
              default: false,
              type: Boolean,
            },
            updateInformation: {
              default: false,
              type: Boolean,
            },
            updateTheme: {
              default: false,
              type: Boolean,
            },
          },
        },
        platformUser: {
          ref: "PlatformUser",
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    defaultLanguage: {
      default: "en",
      required: false,
      trim: true,
      type: String,
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
    name: {
      required: true,
      trim: true,
      type: String,
    },
    owner: {
      ref: "PlatformUser",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    publishedAt: {
      default: null,
      type: Date,
    },
    settings: {
      default: {},
      type: Object,
    },
    status: {
      default: "draft",
      enum: ["active", "disabled", "draft"],
      type: String,
    },
    theme: {
      default: {},
      type: Object,
    },
    updateNumber: {
      default: 0,
      type: Number,
    },
    visibility: {
      default: "private",
      enum: ["private", "public", "unlisted"],
      type: String,
    },
  },
  {
    minimize: false,
    timestamps: true,
  },
);

websiteSchema.index({ owner: 1 });

websiteSchema.index({ code: 1, status: 1, visibility: 1 });

export default mongoose.models.Website || mongoose.model("Website", websiteSchema);
