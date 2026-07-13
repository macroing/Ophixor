// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function getComponentById(id, components, isFindingParent = false, parent = null) {
  for (const component of components) {
    if (component.id === id) {
      return isFindingParent ? parent : component;
    }

    if (component.slots) {
      for (const slotComponents of Object.values(component.slots)) {
        const found = getComponentById(id, slotComponents, isFindingParent, component);

        if (found) {
          return found;
        }
      }
    }
  }

  return null;
}
