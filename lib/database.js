// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the 'MONGODB_URI' environment variable inside '.env.local'.");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

export default async function connect() {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };

    console.log("Connecting to MongoDB...");

    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => mongoose);
  }

  try {
    cached.connection = await cached.promise;
  } catch (error) {
    cached.promise = null;

    throw error;
  }

  return cached.connection;
}
