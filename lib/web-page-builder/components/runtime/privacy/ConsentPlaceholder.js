// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useConsent } from "./useConsent";

export default function ConsentPlaceholder({ type, component }) {
  const { grant } = useConsent();

  const labelMap = {
    functional: "functional cookies",
    analytics: "analytics cookies",
    marketing: "marketing cookies",
  };

  return (
    <div
      style={{
        alignItems: "center",
        background: "#f1f5f9",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        color: "#334155",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        height: "100%",
        justifyContent: "center",
        padding: "1.5rem",
        textAlign: "center",
        width: "100%",
      }}
    >
      <div style={{ fontWeight: 600 }}>This content requires {labelMap[type] || "cookies"}</div>
      <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>Enable cookies to display this component.</div>
      <button
        onClick={() => grant(type)}
        style={{
          background: "#2563eb",
          border: "none",
          borderRadius: "6px",
          color: "#ffffff",
          cursor: "pointer",
          padding: "0.5rem 0.75rem",
        }}
      >
        Allow & load
      </button>
    </div>
  );
}
