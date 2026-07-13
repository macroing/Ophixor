// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useContext } from "react";

import { ConsentContext } from "./ConsentProvider";

export function useConsent() {
  const context = useContext(ConsentContext);

  if (!context) {
    return {
      consent: {},
      hasConsent: () => false,
      grant: () => {},
      revoke: () => {},
    };
  }

  return context;
}
