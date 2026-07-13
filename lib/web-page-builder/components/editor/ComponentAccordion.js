// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useState } from "react";

import SchemaTooltip from "./SchemaTooltip";
import { DarkButton } from "../button/Button";
import { isPlanGranted } from "../runtime/plan/isPlanGranted";
import { useLanguage } from "@/context/language";
import { useWebPageBuilderActions, useWebPageBuilderPageSchema, useWebPageBuilderPageState, useWebPageBuilderUI } from "../../context/useWebPageBuilder";

import platformData from "@/definitions/platform-data.json" with { type: "json" };

import importedStyles from "./ComponentAccordion.module.css";

const DEFAULT_OPEN_GROUPS = { Components: ["Layout", "Content"] };

export default function ComponentAccordion(props) {
  const isPlatformAdmin = props.isPlatformAdmin;
  const plan = props.plan;
  const styles = props.styles || importedStyles;

  const { language } = useLanguage();

  const { addComponent, createComponent } = useWebPageBuilderActions();

  const { pageSchema } = useWebPageBuilderPageSchema();

  const { isDraftEnabled, page } = useWebPageBuilderPageState();

  const { setDragState } = useWebPageBuilderUI();

  const componentGroups = pageSchema?.componentGroups;
  const componentSchemas = pageSchema?.componentSchemas || {};

  const [openGroups, setOpenGroups] = useState({});

  const defaultOpenGroups = DEFAULT_OPEN_GROUPS;

  function renderComponentSection() {
    if (!Array.isArray(componentGroups) || !componentGroups.length || !componentSchemas) {
      return null;
    }

    return (
      <>
        {componentGroups
          .filter((componentGroup) => componentGroup?.label)
          .map((componentGroup) => {
            const groupKey = `Components-${componentGroup.label}`;
            const defaultOpen = defaultOpenGroups?.["Components"]?.includes(componentGroup.label);
            const groupOpen = openGroups[groupKey] ?? defaultOpen ?? false;

            const filteredComponents = (componentGroup?.componentTypes || []).map((componentType) => ({ schema: componentSchemas?.[componentType], type: componentType })).filter((component) => !!component.schema && isPlanGranted(isPlatformAdmin, plan, component.schema.plan));

            if (filteredComponents.length === 0) {
              return null;
            }

            return (
              <div className={styles.group + (groupOpen ? " " + styles.group_open : "")} key={componentGroup.label}>
                <button className={styles.group_header + (groupOpen ? " " + styles.group_header_open : "")} onClick={() => toggleGroup(groupKey)} type="button">
                  <span>{platformData.component.groups[componentGroup.label][language] || componentGroup.label}</span>
                  <span className={`${styles.chevron} ${groupOpen ? styles.open : ""}`}>▸</span>
                </button>
                <div className={`${styles.group_body} ${groupOpen ? styles.expanded : styles.collapsed}`}>
                  {filteredComponents.map((component) => {
                    return (
                      <SchemaTooltip key={component.type} schema={component.schema}>
                        <DarkButton
                          disabled={isDraftEnabled}
                          draggable={!isDraftEnabled}
                          onClick={() => {
                            if (isDraftEnabled) {
                              return;
                            }

                            addComponent({ component: createComponent(component.type), parentId: page?.id, slotName: "body" });
                          }}
                          onDragStart={(e) => {
                            if (isDraftEnabled) {
                              return;
                            }

                            const dragState = { action: "add-component", sourceType: component.type };

                            e.dataTransfer.setData("text/plain", JSON.stringify(dragState));

                            setDragState(dragState);
                          }}
                          type="button"
                        >
                          {platformData.component.types[component.type]?.label?.[language] || component.schema.label}
                        </DarkButton>
                      </SchemaTooltip>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </>
    );
  }

  function toggleGroup(key) {
    setOpenGroups((prev) => {
      let defaultOpen = false;

      const index = key.indexOf("-");

      if (index !== -1) {
        const role = key.substring(0, index);

        const groupName = key.substring(index + 1);

        defaultOpen = defaultOpenGroups?.[role]?.includes(groupName);
      }

      const current = prev[key] === undefined ? defaultOpen : prev[key];

      return {
        ...prev,
        [key]: !current,
      };
    });
  }

  return (
    <aside className={styles.component_accordion}>
      <section className={styles.body}>{renderComponentSection()}</section>
    </aside>
  );
}
