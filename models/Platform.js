// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import mongoose from "mongoose";

const platformSchema = new mongoose.Schema(
  {
    defaultPlan: {
      default: "Free",
      enum: ["Free", "Personal", "Pro", "Pro Gold"],
      type: String,
    },
  },
  {
    minimize: false,
    timestamps: true,
  },
);

export default mongoose.models.Platform || mongoose.model("Platform", platformSchema);
