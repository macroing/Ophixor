// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { SessionProvider } from "next-auth/react";

export default function NextAuthProvider({ children, session }) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
