// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function resolveStyle(styleProps, schema) {
  const style = {};

  const schemaProps = schema?.props || {};

  for (const key in styleProps || {}) {
    const currentValue = styleProps[key];

    if (currentValue === undefined || currentValue === null || currentValue === "") {
      continue;
    }

    const prop = schemaProps[key];

    if (!prop?.cssVariableName && !prop?.cssPropertyOverride) {
      continue;
    }

    if (currentValue === prop.defaultValue) {
      continue;
    }

    if (prop?.cssProperty && prop?.cssPropertyOverride) {
      if (currentValue) {
        style[key] = currentValue;
      }
    } else {
      style[prop.cssVariableName] = currentValue;
    }
  }

  return style;
}
