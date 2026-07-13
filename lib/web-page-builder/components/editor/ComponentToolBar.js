// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useMemo, useState } from "react";
import { faBolt, faCode, faEye, faFont, faDatabase, faGaugeHigh, faImage, faObjectGroup, faPalette, faQuestion, faShield, faTableLayout } from "@fortawesome/pro-solid-svg-icons";

import Icon from "./Icon";
import ComponentGroupAccordion from "./ComponentGroupAccordion";
import ComponentToolBarPanel from "./ComponentToolBarPanel";
import { DarkButton } from "../button/Button";
import { DarkSelect } from "../select/Select";
import DataSourceEditor from "./DataSourceEditor";
import { clone } from "../../transform/core/clone";
import { isPlainObject } from "../../validation/isPlainObject";
import { resolveDataScope } from "./editor-helpers";
import { useLanguage } from "@/context/language";
import { useWebPageBuilderActions, useWebPageBuilderData, useWebPageBuilderRuntime, useWebPageBuilderPageSchema, useWebPageBuilderPageState, useWebPageBuilderUI } from "../../context/useWebPageBuilder";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

import importedStyles from "./ComponentToolBar.module.css";

const DEFAULT_ROLE_ORDER = ["content", "layout", "styling"];

export default function ComponentToolBar(props) {
  const canReadMedia = props.canReadMedia;
  const canUseAction = props.canUseAction;
  const canUseDataSourceExpression = props.canUseDataSourceExpression;
  const canUseDataSourceIntegration = props.canUseDataSourceIntegration;
  const canUseDataSourceModel = props.canUseDataSourceModel;
  const canUseExpression = props.canUseExpression;
  const canUseSelectors = props.canUseSelectors;
  const canUseVisibility = props.canUseVisibility;
  const integrations = props.integrations;
  const isPlatformAdmin = props.isPlatformAdmin;
  const plan = props.plan;
  const schema = props.schema;
  const selected = props.selected;
  const selectedIntegration = props.selectedIntegration;
  const setIsIntegrationPickerOpen = props.setIsIntegrationPickerOpen;
  const setIsMediaPickerOpen = props.setIsMediaPickerOpen;
  const styles = props.styles || importedStyles;

  const { language } = useLanguage();

  const { updateComponent } = useWebPageBuilderActions();

  const { integrationDataMap, models, pageData, relationIndexes } = useWebPageBuilderData();

  const { pageSchema } = useWebPageBuilderPageSchema();

  const { page } = useWebPageBuilderPageState();

  const { expressionEngine } = useWebPageBuilderRuntime();

  const { selectedId } = useWebPageBuilderUI();

  const componentSchemas = pageSchema?.componentSchemas || {};

  const id = page?.id;

  const roleOrder = schema?.editor?.roleOrder || DEFAULT_ROLE_ORDER;

  const dataScope = useMemo(() => resolveDataScope(selectedId, page, models, pageData, relationIndexes, integrationDataMap, expressionEngine), [expressionEngine, integrationDataMap, models, page, pageData, relationIndexes, selectedId]);

  const sortedRoles = useMemo(() => createSortedRoles(), [componentSchemas, id, pageSchema, roleOrder, selectedId]);

  const [active, setActive] = useState("");
  const [variantLabel, setVariantLabel] = useState("");

  function createGroupsAndSortedGroupNames(role) {
    const schema = selectedId === id ? pageSchema : componentSchemas?.[selected?.type];

    const propsSource = schema?.props || {};

    const filtered = Object.entries(propsSource).filter(([_, property]) => property?.role === role);

    if (!filtered.length) {
      return { groups: null, sortedGroupNames: null };
    }

    const groups = {};

    for (const [key, property] of filtered) {
      const groupName = property.roleGroup || "General";

      if (!groups[groupName]) {
        groups[groupName] = [];
      }

      groups[groupName].push([key, property]);
    }

    const desiredOrder = schema?.editor?.roleGroupOrder?.[role] || [];

    const sortedGroupNames = Object.keys(groups).sort((a, b) => {
      const indexA = desiredOrder.indexOf(a);
      const indexB = desiredOrder.indexOf(b);

      if (indexA === -1 && indexB === -1) {
        return a.localeCompare(b);
      }

      if (indexA === -1) {
        return 1;
      }

      if (indexB === -1) {
        return -1;
      }

      return indexA - indexB;
    });

    return { groups, sortedGroupNames };
  }

  function createSortedRoles() {
    const sortedRoles = {};

    for (let i = 0; i < roleOrder.length; i++) {
      const currentRoleOrder = roleOrder[i];

      const { groups, sortedGroupNames } = createGroupsAndSortedGroupNames(currentRoleOrder);

      if (groups !== null && sortedGroupNames !== null) {
        sortedRoles[currentRoleOrder] = {
          icon: getRoleIcon(currentRoleOrder),
          groups,
          roleLabel: getRoleLabel(currentRoleOrder),
          sortedGroupNames,
        };
      }
    }

    return sortedRoles;
  }

  function filterSortedRole([key, sortedRole]) {
    switch (key) {
      case "action":
        return canUseAction;
      case "content":
        return true;
      case "layout":
        return true;
      case "optimization":
        return true;
      case "privacy":
        return true;
      case "selectors":
        return canUseSelectors;
      case "styling":
        return true;
      case "visibility":
        return canUseVisibility;
      default:
        return false;
    }
  }

  function renderGroups(role) {
    const currentRole = sortedRoles[role];

    if (currentRole) {
      const groups = currentRole.groups;
      const sortedGroupNames = currentRole.sortedGroupNames;

      if (groups && sortedGroupNames) {
        return <ComponentGroupAccordion canUseAction={canUseAction} canUseExpression={canUseExpression} component={selected} dataScope={dataScope} groups={groups} isPlatformAdmin={isPlatformAdmin} plan={plan} role={role} schema={schema} sortedGroupNames={sortedGroupNames} />;
      }
    }

    return null;
  }

  function renderPanel() {
    if (selectedId) {
      switch (active) {
        case "action":
          return (
            <ComponentToolBarPanel active={active} setActive={setActive} title={platform.websiteAdmin.pages.editor.tabs.action[language]}>
              {renderGroups("action")}
            </ComponentToolBarPanel>
          );
        case "content":
          return (
            <ComponentToolBarPanel active={active} setActive={setActive} title={platform.websiteAdmin.pages.editor.tabs.content[language]}>
              {renderGroups("content")}
            </ComponentToolBarPanel>
          );
        case "data-source":
          return (
            <ComponentToolBarPanel active={active} setActive={setActive} title={platform.websiteAdmin.pages.editor.tabs.dataSource[language]}>
              <DataSourceEditor canUseDataSourceExpression={canUseDataSourceExpression} canUseDataSourceIntegration={canUseDataSourceIntegration} canUseDataSourceModel={canUseDataSourceModel} component={selected} dataScope={dataScope} integrations={integrations} isPlatformAdmin={isPlatformAdmin} page={page} plan={plan} selectedIntegration={selectedIntegration} setIsIntegrationPickerOpen={setIsIntegrationPickerOpen} updateComponent={updateComponent} />
            </ComponentToolBarPanel>
          );
        case "layout":
          return (
            <ComponentToolBarPanel active={active} setActive={setActive} title={platform.websiteAdmin.pages.editor.tabs.layout[language]}>
              {renderGroups("layout")}
            </ComponentToolBarPanel>
          );
        case "media":
          return (
            <ComponentToolBarPanel active={active} setActive={setActive} title={platform.websiteAdmin.pages.editor.tabs.media[language]}>
              <DarkButton onClick={(e) => setIsMediaPickerOpen(true)} type="button" width="100%">
                Select Media
              </DarkButton>
            </ComponentToolBarPanel>
          );
        case "optimization":
          return (
            <ComponentToolBarPanel active={active} setActive={setActive} title={platform.websiteAdmin.pages.editor.tabs.optimization[language]}>
              {renderGroups("optimization")}
            </ComponentToolBarPanel>
          );
        case "privacy":
          return (
            <ComponentToolBarPanel active={active} setActive={setActive} title={platform.websiteAdmin.pages.editor.tabs.privacy[language]}>
              {renderGroups("privacy")}
            </ComponentToolBarPanel>
          );
        case "selectors":
          return (
            <ComponentToolBarPanel active={active} setActive={setActive} title={platform.websiteAdmin.pages.editor.tabs.selectors[language]}>
              {renderGroups("selectors")}
            </ComponentToolBarPanel>
          );
        case "styling":
          return (
            <ComponentToolBarPanel active={active} setActive={setActive} title={platform.websiteAdmin.pages.editor.tabs.appearance[language]}>
              {renderGroups("styling")}
            </ComponentToolBarPanel>
          );
        case "variants":
          return (
            <ComponentToolBarPanel active={active} setActive={setActive} title={platform.websiteAdmin.pages.editor.tabs.variants[language]}>
              <DarkSelect
                onChange={(e) => setVariantLabel(e.target.value)}
                options={[
                  { label: platform.websiteAdmin.pages.editor.notSelected[language], value: "" },
                  { label: platform.websiteAdmin.pages.editor.default[language], value: "Default" },
                  ...(schema?.variants || []).map((variant, variantIndex) => {
                    return { label: variant.label, value: variant.label };
                  }),
                ]}
                value={variantLabel}
              />
            </ComponentToolBarPanel>
          );
        case "visibility":
          return (
            <ComponentToolBarPanel active={active} setActive={setActive} title={platform.websiteAdmin.pages.editor.tabs.visibility[language]}>
              {renderGroups("visibility")}
            </ComponentToolBarPanel>
          );
        default:
          return null;
      }
    } else {
      return null;
    }
  }

  useEffect(() => {
    const entries = Object.entries(sortedRoles);

    const firstSortedRole = entries.length > 0 ? entries[0] : null;

    const active = Array.isArray(firstSortedRole) && firstSortedRole.length === 2 ? firstSortedRole[0] : "";

    setActive(active);
    setVariantLabel("");
  }, [setActive, setVariantLabel, sortedRoles]);

  useEffect(() => {
    if (!selectedId || !variantLabel || !schema) {
      return;
    }

    if (variantLabel === "Default") {
      updateComponent(selectedId, {
        props: getDefaultVariantProps(schema),
      });

      setVariantLabel("");

      return;
    }

    const variant = (schema.variants || []).find((currentVariant) => currentVariant?.label === variantLabel);

    if (isPlainObject(variant?.props)) {
      updateComponent(selectedId, {
        props: clone(variant.props),
      });

      setVariantLabel("");
    }
  }, [schema, selectedId, setVariantLabel, updateComponent, variantLabel]);

  return (
    <nav className={styles.tool_bar}>
      <ul>
        {selected &&
          Object.entries(sortedRoles)
            .filter(filterSortedRole)
            .map(([key, sortedRole]) => (
              <li className={active === key ? styles.active : undefined} key={key} onClick={(e) => setActive(key)}>
                <Icon icon={sortedRole.icon} size={16} />
              </li>
            ))}
        {selected && schema?.mediaPicker && canReadMedia && (
          <li className={active === "media" ? styles.active : undefined} onClick={(e) => setActive("media")}>
            <Icon icon={faImage} size={16} />
          </li>
        )}
        {selected && (canUseDataSourceExpression || canUseDataSourceIntegration || canUseDataSourceModel) && (
          <li className={active === "data-source" ? styles.active : undefined} onClick={(e) => setActive("data-source")}>
            <Icon icon={faDatabase} size={16} />
          </li>
        )}
        {selected && Array.isArray(schema?.variants) && (
          <li className={active === "variants" ? styles.active : undefined} onClick={(e) => setActive("variants")}>
            <Icon icon={faObjectGroup} size={16} />
          </li>
        )}
      </ul>
      {renderPanel()}
    </nav>
  );
}

function getDefaultVariantProps(schema) {
  const variantKeys = getVariantKeys(schema);

  return Object.fromEntries(variantKeys.map((key) => [key, schema?.props?.[key]?.defaultValue]));
}

function getRoleIcon(role) {
  switch (role) {
    case "action":
      return faBolt;
    case "content":
      return faFont;
    case "layout":
      return faTableLayout;
    case "optimization":
      return faGaugeHigh;
    case "privacy":
      return faShield;
    case "selectors":
      return faCode;
    case "styling":
      return faPalette;
    case "visibility":
      return faEye;
    default:
      return faQuestion;
  }
}

function getRoleLabel(role) {
  switch (role) {
    case "action":
      return "Action";
    case "content":
      return "Content";
    case "layout":
      return "Layout";
    case "optimization":
      return "Optimization";
    case "privacy":
      return "Privacy";
    case "selectors":
      return "Selectors";
    case "styling":
      return "Appearance";
    case "visibility":
      return "Visibility";
    default:
      return role;
  }
}

function getVariantKeys(schema) {
  return [...new Set((schema?.variants || []).flatMap((variant) => Object.keys(variant?.props || {})))];
}
