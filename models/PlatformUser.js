// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import mongoose from "mongoose";

const platformUserSchema = new mongoose.Schema(
  {
    activationToken: {
      default: "",
      type: String,
    },
    activatedAt: {
      default: null,
      type: Date,
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
    isPlatformAdmin: {
      type: Boolean,
      default: false,
    },
    lastActiveAt: {
      default: null,
      type: Date,
    },
    passwordHash: {
      required: true,
      type: String,
    },
    passwordResetToken: {
      default: "",
      type: String,
    },
    plan: {
      default: "Free",
      enum: ["Free", "Personal", "Pro", "Pro Gold"],
      type: String,
    },
    subscription: {
      cancelAtPeriodEnd: {
        default: false,
        type: Boolean,
      },
      currentPeriodEnd: {
        default: null,
        type: Date,
      },
      currentPeriodStart: {
        default: null,
        type: Date,
      },
      status: {
        default: null,
        enum: ["active", "canceled", "incomplete", "incomplete_expired", "past_due", "paused", "trialing", "unpaid"],
        type: String,
      },
      stripeCustomerId: {
        default: null,
        type: String,
      },
      stripePriceId: {
        default: null,
        type: String,
      },
      stripeSubscriptionId: {
        default: null,
        type: String,
      },
    },
  },
  {
    minimize: false,
    timestamps: true,
  },
);

platformUserSchema.index({ emailNormalized: 1 }, { unique: true });

export default mongoose.models.PlatformUser || mongoose.model("PlatformUser", platformUserSchema);
