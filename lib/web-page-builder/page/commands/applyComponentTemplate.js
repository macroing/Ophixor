// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { addComponentRule } from "../rules/addComponentRule";
import { applyPageRules } from "../../page/applyPageRules";
import { cloneTemplateComponent } from "../templates/cloneTemplateComponent";
import { sanitizeComponent } from "../../validation/sanitizers";
import { withUpdatedMetadataRule } from "../rules/withUpdatedMetadataRule";

export function applyComponentTemplate(page, { callback, parentId, slotName, componentTemplate }, pageSchema, language = "en") {
  if (!componentTemplate?.component) {
    return page;
  }

  const component = sanitizeComponent(cloneTemplateComponent(componentTemplate.component), pageSchema?.componentSchemas || {}, language);

  return applyPageRules(page, [addComponentRule({ callback, component, pageSchema, parentId, slotName }), withUpdatedMetadataRule({ initialPage: page })]);
}
