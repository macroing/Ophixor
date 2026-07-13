// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function exportCSSFromProps(component, componentSchema) {
  const props = [];

  for (const [key, value] of Object.entries(componentSchema.props)) {
    if (value && value.cssVariableName && value.defaultValue !== undefined) {
      const cssVariableName = value.cssVariableName;
      const defaultValue = value.defaultValue;
      const propValue = component.props[key];

      if (key in component.props && propValue !== defaultValue && propValue !== "" && propValue !== null && propValue !== undefined) {
        props.push(`${cssVariableName}: ${propValue};`);
      }
    }
  }

  for (const [key, value] of Object.entries(componentSchema.props)) {
    if (value && value.cssProperty && value.cssPropertyOverride && value.defaultValue !== undefined) {
      const cssProperty = value.cssProperty;
      const defaultValue = value.defaultValue;
      const propValue = component.props[key];

      if (key in component.props && propValue !== defaultValue && propValue !== "" && propValue !== null && propValue !== undefined) {
        props.push(`${cssProperty}: ${propValue};`);
      }
    }
  }

  return props;
}
