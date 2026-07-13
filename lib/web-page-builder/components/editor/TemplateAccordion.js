// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useState } from "react";

import { DarkButton } from "../button/Button";
import { isPlainObject } from "../../validation/isPlainObject";
import { isPlanGranted } from "../runtime/plan/isPlanGranted";
import { useWebPageBuilderActions, useWebPageBuilderPageState, useWebPageBuilderUI } from "../../context/useWebPageBuilder";

import importedStyles from "./TemplateAccordion.module.css";

export default function TemplateAccordion(props) {
  const isPlatformAdmin = props.isPlatformAdmin;
  const plan = props.plan;
  const styles = props.styles || importedStyles;

  const { addComponentFromComponentTemplate, componentTemplates } = useWebPageBuilderActions();

  const { isDraftEnabled, page } = useWebPageBuilderPageState();

  const { setDragState } = useWebPageBuilderUI();

  const [openGroups, setOpenGroups] = useState({});

  const defaultOpenGroups = { Templates: [] };

  function renderComponentTemplateSection() {
    if (!isPlainObject(componentTemplates) || Object.entries(componentTemplates).length === 0) {
      return null;
    }

    const componentTemplateGroups = ["Default", "Custom"];

    return (
      <>
        {componentTemplateGroups
          .filter((componentTemplateGroup) => Object.entries(componentTemplates || {}).filter(([key, value]) => (componentTemplateGroup === "Default" && value.isDefault && isPlanGranted(isPlatformAdmin, plan, value.plan)) || (componentTemplateGroup === "Custom" && !value.isDefault)).length > 0)
          .map((componentTemplateGroup) => {
            const groupKey = `Templates-${componentTemplateGroup}`;
            const defaultOpen = defaultOpenGroups?.["Templates"]?.includes(componentTemplateGroup);
            const groupOpen = openGroups[groupKey] ?? defaultOpen ?? false;

            return (
              <div className={styles.group + (groupOpen ? " " + styles.group_open : "")} key={componentTemplateGroup}>
                <button className={styles.group_header + (groupOpen ? " " + styles.group_header_open : "")} onClick={() => toggleGroup(groupKey)} type="button">
                  <span>{componentTemplateGroup}</span>
                  <span className={`${styles.chevron} ${groupOpen ? styles.open : ""}`}>▸</span>
                </button>
                <div className={`${styles.group_body} ${groupOpen ? styles.expanded : styles.collapsed}`}>
                  {Object.entries(componentTemplates || {})
                    .filter(([key, value]) => (componentTemplateGroup === "Default" && value.isDefault && isPlanGranted(isPlatformAdmin, plan, value.plan)) || (componentTemplateGroup === "Custom" && !value.isDefault))
                    .map(([key, value]) => (
                      <DarkButton
                        disabled={isDraftEnabled}
                        draggable={!isDraftEnabled}
                        key={value?.type}
                        onClick={() => {
                          if (isDraftEnabled) {
                            return;
                          }

                          addComponentFromComponentTemplate({ parentId: page?.id, slotName: "body", type: value?.type });
                        }}
                        onDragStart={(e) => {
                          if (isDraftEnabled) {
                            return;
                          }

                          const dragState = { action: "add-component-template", sourceType: value?.component?.type, type: value?.type };

                          e.dataTransfer.setData("text/plain", JSON.stringify(dragState));

                          setDragState(dragState);
                        }}
                        type="button"
                      >
                        {value?.label}
                      </DarkButton>
                    ))}
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
    <aside className={styles.template_accordion}>
      <section className={styles.body}>{renderComponentTemplateSection()}</section>
    </aside>
  );
}
