// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { PLAN_PERSONAL, PLAN_PRO, PLAN_PRO_GOLD } from "@/definitions/plan-definitions";

export function isPlanGranted(isPlatformAdmin, userPlan, itemPlan) {
  if (isPlatformAdmin) {
    return true;
  } else if (itemPlan === PLAN_PERSONAL) {
    return userPlan === PLAN_PERSONAL || userPlan === PLAN_PRO || userPlan === PLAN_PRO_GOLD;
  } else if (itemPlan === PLAN_PRO) {
    return userPlan === PLAN_PRO || userPlan === PLAN_PRO_GOLD;
  } else if (itemPlan === PLAN_PRO_GOLD) {
    return userPlan === PLAN_PRO_GOLD;
  } else {
    return true;
  }
}
