// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useEffect, useState } from "react";

import PropertyRenderer from "./PropertyRenderer";
import { DarkSelect } from "../select/Select";
import { useLanguage } from "@/context/language";
import { useViewport } from "@/hooks/useViewport";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };
import platformData from "@/definitions/platform-data.json" with { type: "json" };

import importedStyles from "./ComponentGroupAccordion.module.css";

export default function ComponentGroupAccordion(props) {
  const canUseAction = props.canUseAction;
  const canUseExpression = props.canUseExpression;
  const component = props.component;
  const dataScope = props.dataScope;
  const groups = props.groups;
  const isPlatformAdmin = props.isPlatformAdmin;
  const plan = props.plan;
  const role = props.role;
  const schema = props.schema;
  const sortedGroupNames = props.sortedGroupNames;
  const styles = props.styles || importedStyles;

  const [openGroups, setOpenGroups] = useState({});

  function renderComponentGroupSection() {
    if (!Array.isArray(sortedGroupNames) || !sortedGroupNames.length || !groups) {
      return null;
    }

    return (
      <>
        {sortedGroupNames.map((groupName) => (
          <ComponentGroupSection canUseAction={canUseAction} canUseExpression={canUseExpression} component={component} dataScope={dataScope} groupName={groupName} groups={groups} isPlatformAdmin={isPlatformAdmin} key={groupName} openGroups={openGroups} plan={plan} role={role} schema={schema} toggleGroup={toggleGroup} />
        ))}
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

        defaultOpen = schema?.editor?.defaultOpenGroups?.[role]?.includes(groupName);
      }

      const current = prev[key] === undefined ? defaultOpen : prev[key];

      return {
        ...prev,
        [key]: !current,
      };
    });
  }

  useEffect(() => {
    if (!role || !schema || !sortedGroupNames) {
      return;
    }

    const newOpenGroups = {};

    for (let i = 0; i < sortedGroupNames.length; i++) {
      const groupName = sortedGroupNames[i];
      const groupKey = `${role}-${groupName}`;
      const defaultOpen = schema?.editor?.defaultOpenGroups?.[role]?.includes(groupName);
      const groupOpen = defaultOpen ?? false;

      newOpenGroups[groupKey] = groupOpen;
    }

    setOpenGroups(newOpenGroups);
  }, [role, schema, setOpenGroups, sortedGroupNames]);

  return (
    <aside className={styles.component_group_accordion}>
      <section className={styles.body}>{renderComponentGroupSection()}</section>
    </aside>
  );
}

function ComponentGroupSection(props) {
  const canUseAction = props.canUseAction;
  const canUseExpression = props.canUseExpression;
  const component = props.component;
  const dataScope = props.dataScope;
  const groupName = props.groupName;
  const groups = props.groups;
  const isPlatformAdmin = props.isPlatformAdmin;
  const openGroups = props.openGroups;
  const plan = props.plan;
  const role = props.role;
  const schema = props.schema;
  const styles = props.styles || importedStyles;
  const toggleGroup = props.toggleGroup;

  const { language } = useLanguage();

  const { isMobile, isTablet } = useViewport();

  const [view, setView] = useState(isMobile ? "mobile" : isTablet ? "tablet" : "desktop");
  const [viewPrevious, setViewPrevious] = useState(isMobile ? "mobile" : isTablet ? "tablet" : "desktop");

  const getValue = useCallback(
    (key) => {
      const componentProp = component?.props?.[key];
      const schemaProp = schema?.props?.[key];

      if (schemaProp) {
        if (schemaProp.cssProperty) {
          if (view === "all" && viewPrevious) {
            const value = componentProp !== null && componentProp !== undefined && (Object.hasOwn(componentProp, "desktop") || Object.hasOwn(componentProp, "mobile") || Object.hasOwn(componentProp, "tablet")) ? componentProp?.[viewPrevious] : componentProp;

            if (typeof value !== "undefined" && value !== null) {
              return value;
            }

            const defaultValue = schemaProp.defaultValue;

            if (defaultValue && typeof defaultValue === "object" && !Array.isArray(defaultValue) && viewPrevious in defaultValue) {
              return defaultValue[viewPrevious];
            } else if (typeof defaultValue === "string") {
              return defaultValue;
            } else {
              return "";
            }
          } else if (view === "desktop" || view === "mobile" || view === "tablet") {
            const value = componentProp !== null && componentProp !== undefined && (Object.hasOwn(componentProp, "desktop") || Object.hasOwn(componentProp, "mobile") || Object.hasOwn(componentProp, "tablet")) ? componentProp?.[view] : componentProp;

            if (typeof value !== "undefined" && value !== null) {
              return value;
            }

            const defaultValue = schemaProp.defaultValue;

            if (defaultValue && typeof defaultValue === "object" && !Array.isArray(defaultValue) && view in defaultValue) {
              return defaultValue[view];
            } else if (typeof defaultValue === "string") {
              return defaultValue;
            } else {
              return "";
            }
          } else {
            return "";
          }
        } else {
          return componentProp ?? schemaProp?.defaultValue ?? "";
        }
      } else {
        return "";
      }
    },
    [component, schema, view, viewPrevious],
  );

  const groupKey = `${role}-${groupName}`;
  const defaultOpen = schema?.editor?.defaultOpenGroups?.[role]?.includes(groupName);
  const groupOpen = openGroups[groupKey] ?? defaultOpen ?? false;

  return (
    <div className={styles.group + (groupOpen ? " " + styles.group_open : "")} key={groupName}>
      <button className={styles.group_header + (groupOpen ? " " + styles.group_header_open : "")} onClick={() => toggleGroup(groupKey)} type="button">
        <span>{platformData.component.groups[groupName]?.[language] ?? groupName}</span>
        <span className={`${styles.chevron} ${groupOpen ? styles.open : ""}`}>▸</span>
      </button>
      <div className={`${styles.group_body} ${groupOpen ? styles.expanded : styles.collapsed}`}>
        {groups[groupName].some(([key, property]) => !!schema?.props?.[key]?.cssProperty) && (
          <DarkSelect
            onChange={(e) => {
              setViewPrevious(view);
              setView(e.target.value);
            }}
            options={[
              { label: platform.websiteAdmin.pages.editor.all[language], value: "all" },
              { label: platform.websiteAdmin.pages.editor.mobile[language], value: "mobile" },
              { label: platform.websiteAdmin.pages.editor.tablet[language], value: "tablet" },
              { label: platform.websiteAdmin.pages.editor.desktop[language], value: "desktop" },
            ]}
            value={view}
          />
        )}
        {groups[groupName].map(([key, property]) => (
          <PropertyRenderer canUseAction={canUseAction} canUseExpression={canUseExpression} component={component} dataScope={dataScope} getValue={getValue} isPlatformAdmin={isPlatformAdmin} key={key} plan={plan} property={property} propertyKey={key} view={schema?.props?.[key]?.cssProperty ? view : null} viewPrevious={schema?.props?.[key]?.cssProperty ? viewPrevious : null} />
        ))}
      </div>
    </div>
  );
}
