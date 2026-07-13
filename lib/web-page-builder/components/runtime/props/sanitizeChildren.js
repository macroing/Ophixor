// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { isValidElement } from "react";

export function sanitizeChildren(children) {
  if (children == null) {
    return null;
  }

  if (typeof children === "string" || typeof children === "number") {
    return children;
  }

  if (isValidElement(children)) {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map(sanitizeChildren).filter((child) => child !== null);
  }

  return null;
}
