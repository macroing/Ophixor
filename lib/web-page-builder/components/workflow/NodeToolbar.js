// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo, useState } from "react";
import { faAdd, faArrowRight, faBracketsCurly, faBug, faCalculator, faChevronLeft, faChevronRight, faCircle, faClock, faCodeBranch, faCubes, faDiagramProject, faDivide, faFont, faGlobe, faLayerGroup, faMobileScreen, faMultiply, faQuestion, faRandom, faRectangle, faRightLeft, faSquareRoot, faSubtract, faTable, faTowerBroadcast, faUser, faUserGear } from "@fortawesome/pro-solid-svg-icons";

import Icon from "../editor/Icon";
import NodeToolbarCategory from "./NodeToolbarCategory";
import { getActionSchema } from "../runtime/action/action-schema";
import { getExpressionSchema } from "../runtime/expression/expression-schema";
import { PLAN_PERSONAL, PLAN_PRO, PLAN_PRO_GOLD } from "@/definitions/plan-definitions";

import importedStyles from "./NodeToolbar.module.css";

const ACTION_GROUPS = ["Navigation", "Component", "State", "Flow Control", "Socket", "Canvas", "User", "Debugging"];
const ACTION_SCHEMA = getActionSchema();
const ACTION_CATEGORIES = createActionCategories();

const EXPRESSION_GROUPS = ["Constants", "Math", "Logic", "Text", "Collections", "Object", "Conversion", "Date & Time", "Component", "Viewport", "Socket", "Canvas", "Platform User", "User", "Website"];
const EXPRESSION_SCHEMA = getExpressionSchema();
const EXPRESSION_CATEGORIES = createExpressionCategories();

export default function NodeToolbar(props) {
  const componentType = props.componentType;
  const isExpressionOnly = props.isExpressionOnly;
  const isPlatformAdmin = props.isPlatformAdmin;
  const plan = props.plan;
  const styles = props.styles || importedStyles;

  const [isExpanded, setIsExpanded] = useState(true);

  const actionCategories = useMemo(
    () =>
      ACTION_CATEGORIES.map((actionCategory) => {
        const newActionCategory = { ...actionCategory };

        const newNodeTypes = newActionCategory.nodeTypes.filter((nodeType) => {
          if (typeof nodeType.componentType === "string") {
            return componentType === nodeType.componentType;
          }

          return isAllowedToView(isPlatformAdmin, nodeType.plan, plan);
        });

        if (newNodeTypes.length > 0) {
          newActionCategory.nodeTypes = newNodeTypes;

          return newActionCategory;
        }

        return null;
      }).filter(Boolean),
    [componentType, isPlatformAdmin, plan],
  );

  const expressionCategories = useMemo(
    () =>
      EXPRESSION_CATEGORIES.map((expressionCategory) => {
        const newExpressionCategory = { ...expressionCategory };

        const newNodeTypes = newExpressionCategory.nodeTypes.filter((nodeType) => {
          if (typeof nodeType.componentType === "string") {
            return componentType === nodeType.componentType;
          }

          return isAllowedToView(isPlatformAdmin, nodeType.plan, plan);
        });

        if (newNodeTypes.length > 0) {
          newExpressionCategory.nodeTypes = newNodeTypes;

          return newExpressionCategory;
        }

        return null;
      }).filter(Boolean),
    [componentType, isPlatformAdmin, plan],
  );

  function onClick(e) {
    e.stopPropagation();
  }

  function onClickToggleExpansion(e) {
    setIsExpanded((currentIsExpanded) => !currentIsExpanded);
  }

  return (
    <div className={styles.node_toolbar + (isExpanded ? " " + styles.node_toolbar_expanded : "")} onClick={onClick}>
      <div className={styles.header}>
        {isExpanded && <h4>Nodes</h4>}
        <Icon icon={isExpanded ? faChevronLeft : faChevronRight} onClick={onClickToggleExpansion} size={16} />
      </div>
      {isExpanded && (
        <div className={styles.content}>
          {!isExpressionOnly && actionCategories.length > 0 && (
            <>
              <h4 className={styles.title}>Action Nodes</h4>
              {actionCategories.map((category) => (
                <NodeToolbarCategory category={category} key={category.label} kind="action" />
              ))}
            </>
          )}
          {expressionCategories.length > 0 && (
            <>
              <h4 className={styles.title}>Expression Nodes</h4>
              {expressionCategories.map((category) => (
                <NodeToolbarCategory category={category} key={category.label} kind="expression" />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function createActionCategories() {
  const actionCategories = [];

  const actionSchemaEntries = Object.entries(ACTION_SCHEMA);

  for (const group of ACTION_GROUPS) {
    const actionCategory = {
      icon: getIcon(group),
      label: group,
      nodeTypes: [],
    };

    for (const [key, value] of actionSchemaEntries) {
      if (value.group === group) {
        const nodeType = {
          componentType: value.componentType,
          icon: getIcon(value.label),
          label: value.label,
          labelShort: value.labelShort || value.label,
          plan: value.plan,
          type: key,
        };

        actionCategory.nodeTypes.push(nodeType);
      }
    }

    actionCategories.push(actionCategory);
  }

  return actionCategories;
}

function createExpressionCategories() {
  const expressionCategories = [];

  const expressionSchemaEntries = Object.entries(EXPRESSION_SCHEMA);

  for (const group of EXPRESSION_GROUPS) {
    const expressionCategory = {
      icon: getIcon(group),
      label: group,
      nodeTypes: [],
    };

    for (const [key, value] of expressionSchemaEntries) {
      if (value.group === group) {
        const nodeType = {
          componentType: value.componentType,
          icon: getIcon(value.label),
          label: value.label,
          labelShort: value.labelShort || value.label,
          plan: value.plan,
          type: key,
        };

        expressionCategory.nodeTypes.push(nodeType);
      }
    }

    expressionCategories.push(expressionCategory);
  }

  return expressionCategories;
}

function getIcon(group) {
  switch (group) {
    case "Add":
      return faAdd;
    case "Canvas":
      return faRectangle;
    case "Collections":
      return faLayerGroup;
    case "Component":
      return faCubes;
    case "Constants":
      return faCircle;
    case "Conversion":
      return faRightLeft;
    case "Date & Time":
      return faClock;
    case "Debugging":
      return faBug;
    case "Divide":
      return faDivide;
    case "Flow Control":
      return faDiagramProject;
    case "Logic":
      return faCodeBranch;
    case "Math":
      return faCalculator;
    case "Multiply":
      return faMultiply;
    case "Navigation":
      return faArrowRight;
    case "Object":
      return faBracketsCurly;
    case "Platform User":
      return faUserGear;
    case "Random":
      return faRandom;
    case "Socket":
      return faTowerBroadcast;
    case "Sqrt":
      return faSquareRoot;
    case "State":
      return faTable;
    case "Subtract":
      return faSubtract;
    case "Text":
      return faFont;
    case "User":
      return faUser;
    case "Viewport":
      return faMobileScreen;
    case "Website":
      return faGlobe;
    default:
      return faQuestion;
  }
}

function isAllowedToView(isPlatformAdmin, nodePlan, userPlan) {
  if (isPlatformAdmin) {
    return true;
  } else if (nodePlan === PLAN_PERSONAL) {
    return userPlan === PLAN_PERSONAL || userPlan === PLAN_PRO || userPlan === PLAN_PRO_GOLD;
  } else if (nodePlan === PLAN_PRO) {
    return userPlan === PLAN_PRO || userPlan === PLAN_PRO_GOLD;
  } else if (nodePlan === PLAN_PRO_GOLD) {
    return userPlan === PLAN_PRO_GOLD;
  } else {
    return true;
  }
}
