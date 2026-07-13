// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_BUILD_TIME: new Date().toISOString(),
  },
};

module.exports = nextConfig;
