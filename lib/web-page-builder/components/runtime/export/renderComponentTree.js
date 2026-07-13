// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { cleanResolvedProps, containsBinding, resolveBindings, resolveDataSource, retrieveViewProps } from "../../editor/editor-helpers";
import { resolveIntegration } from "./resolveIntegration";

const EMPTY_OBJECT = {};

export async function renderComponentTree({ component, context, indentation = "", models, pageData, pageSchema, relationIndexes, scope }) {
  const componentSchema = pageSchema?.componentSchemas?.[component.type];

  if (!componentSchema) {
    return "";
  }

  const hasBindings = component.props ? Object.values(component.props).some(containsBinding) : false;

  if (component.dataSource?.type === "integration") {
    const data = await resolveIntegration({
      component,
      componentSchema,
      context: {
        ...context,
        modelScope: scope,
      },
      scope,
    });

    const componentWithoutDataSource = {
      ...component,
      dataSource: null,
    };

    return await renderFromResolvedData({
      component: componentWithoutDataSource,
      context: {
        ...context,
        modelScope: scope,
      },
      indentation,
      models,
      pageData,
      pageSchema,
      relationIndexes,
      resolved: data,
      scope,
    });
  }

  if (component.dataSource) {
    const resolved = resolveDataSource(component.dataSource, scope, models, pageData, relationIndexes, { ...context, modelScope: scope });

    const componentWithoutDataSource = {
      ...component,
      dataSource: null,
    };

    return await renderFromResolvedData({
      component: componentWithoutDataSource,
      context: { ...context, modelScope: scope },
      hasBindings,
      indentation,
      models,
      pageData,
      pageSchema,
      relationIndexes,
      resolved,
      scope,
    });
  }

  const resolvedProps = hasBindings ? resolveBindings(component.props || {}, scope, context.componentIndex, component.id, componentSchema, context.nowTick, context.viewport, context.platformUser, context.website, null, { ...context, modelScope: scope }) : component.props || {};

  const retrievedViewProps = retrieveViewProps(resolvedProps, context.viewport);

  const cleanedProps = cleanResolvedProps(retrievedViewProps);

  const renderedSlots = await renderSlots({
    component,
    context: { ...context, modelScope: scope },
    indentation,
    models,
    pageData,
    pageSchema,
    relationIndexes,
    scope,
  });

  if (component.type === "Map" || component.type === "RichText") {
    return "";
  }

  return (
    componentSchema.exportHTML(
      {
        ...component,
        props: cleanedProps,
        slots: renderedSlots,
      },
      componentSchema,
      pageSchema,
      indentation,
    ) + "\n"
  );
}

export function collectResolvedComponents({ component, context, models, pageData, pageSchema, relationIndexes, result = [], scope }) {
  const componentSchema = component.type === "Page" ? pageSchema : pageSchema?.componentSchemas?.[component.type];

  if (!componentSchema) {
    return result;
  }

  const hasBindings = component.props ? Object.values(component.props).some(containsBinding) : false;

  if (component.dataSource) {
    const data = component.dataSource.type === "integration" ? null : resolveDataSource(component.dataSource, scope, models, pageData, relationIndexes, { ...context, modelScope: scope });

    if (Array.isArray(data)) {
      data.forEach((item) =>
        collectResolvedComponents({
          component: { ...component, dataSource: null },
          context: {
            ...context,
            modelScope: item,
          },
          models,
          pageData,
          pageSchema,
          relationIndexes,
          result,
          scope: item,
        }),
      );

      return result;
    }

    return collectResolvedComponents({
      component: { ...component, dataSource: null },
      context: {
        ...context,
        modelScope: data ?? {},
      },
      models,
      pageData,
      pageSchema,
      relationIndexes,
      result,
      scope: data ?? {},
    });
  }

  const resolvedProps = hasBindings ? resolveBindings(component.props || {}, scope, context.componentIndex, component.id, componentSchema, context.nowTick, context.viewport, context.platformUser, context.website, null, { ...context, modelScope: scope }) : component.props || {};

  const retrievedViewProps = retrieveViewProps(resolvedProps, context.viewport);

  const cleanedProps = cleanResolvedProps(retrievedViewProps);

  const resolvedComponent = {
    ...component,
    props: cleanedProps,
  };

  result.push(resolvedComponent);

  for (const slot of Object.values(component.slots || EMPTY_OBJECT)) {
    for (const child of slot) {
      collectResolvedComponents({
        component: child,
        context: {
          ...context,
          modelScope: scope,
        },
        models,
        pageData,
        pageSchema,
        relationIndexes,
        result,
        scope,
      });
    }
  }

  return result;
}

async function renderFromResolvedData({ component, context, hasBindings, indentation, models, pageData, pageSchema, relationIndexes, resolved, scope }) {
  if (Array.isArray(resolved)) {
    if (resolved.length === 0) {
      return renderComponentTree({
        component,
        context: { ...context, modelScope: EMPTY_OBJECT },
        indentation,
        models,
        pageData,
        pageSchema,
        relationIndexes,
        scope: EMPTY_OBJECT,
      });
    }

    const results = await Promise.all(
      resolved.map((item, index) =>
        renderComponentTree({
          component,
          context: { ...context, modelScope: item },
          indentation,
          models,
          pageData,
          pageSchema,
          relationIndexes,
          scope: item,
        }),
      ),
    );

    return results.join("");
  }

  if (resolved !== null && typeof resolved !== "object") {
    return renderComponentTree({
      component,
      context: { ...context, modelScope: resolved },
      indentation,
      models,
      pageData,
      pageSchema,
      relationIndexes,
      scope: resolved,
    });
  }

  return renderComponentTree({
    component,
    context: { ...context, modelScope: resolved ?? EMPTY_OBJECT },
    indentation,
    models,
    pageData,
    pageSchema,
    relationIndexes,
    scope: resolved ?? EMPTY_OBJECT,
  });
}

async function renderSlots({ component, context, indentation, models, pageData, pageSchema, relationIndexes, scope }) {
  const slots = {};

  for (const [slotName, slotComponents] of Object.entries(component.slots || EMPTY_OBJECT)) {
    const rendered = await Promise.all(
      (slotComponents || []).map((child, childIndex) =>
        renderComponentTree({
          component: child,
          context: { ...context, modelScope: scope },
          indentation: indentation + "  " + (component.type === "Card" || component.type === "Table" ? "  " : ""),
          models,
          pageData,
          pageSchema,
          relationIndexes,
          scope,
        }),
      ),
    );

    slots[slotName] = rendered.join("");
  }

  return slots;
}
