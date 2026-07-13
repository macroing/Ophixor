// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function getComponentLocation(id, components, parent = null, slotName = null) {
  if (Array.isArray(components)) {
    for (let i = 0; i < components?.length; i++) {
      const component = components[i];

      if (component.id === id) {
        if (parent === null && slotName === null) {
          return { parent: null, slotName: "body", index: i };
        } else {
          return { parent, slotName, index: i };
        }
      }

      if (component.slots) {
        for (const [name, slotComponents] of Object.entries(component.slots)) {
          const index = slotComponents.findIndex((c) => c.id === id);

          if (index !== -1) {
            return { parent: component, slotName: name, index };
          }

          for (const child of slotComponents) {
            const found = getComponentLocation(id, [child], component, name);

            if (found) {
              return found;
            }
          }
        }
      }
    }
  }

  return null;
}
