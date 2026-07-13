// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export const hasParentType = (type) => (context) => context.parents.some((p) => p?.type === type);

export const inSlot = (slot) => (context) => context.parentKey === slot;

export const isComponent = (type) => (context) => context.value?.type === type;

export const propEquals = (key, value) => (context) => context.value?.props?.[key] === value;
