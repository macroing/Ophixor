// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export class HttpError extends Error {
  constructor(message, status) {
    super(message);

    this.status = status;
  }
}
