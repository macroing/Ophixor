// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useMemo, useState } from "react";
import { faAdd, faTrash } from "@fortawesome/pro-solid-svg-icons";

import { DarkButton } from "../button/Button";
import { DarkInput } from "../input/Input";
import { DarkLabel } from "../label/Label";
import { DarkSelect } from "../select/Select";
import ExpressionEditorDialog from "./ExpressionEditorDialog";
import Icon from "./Icon";
import { useWebPageBuilderData } from "../../context/useWebPageBuilder";
import { generateId } from "../../page/identity/generateId";
import { getExpressionSchema } from "../runtime/expression/expression-schema";

import importedStyles from "./DataSourceEditor.module.css";

const OPERATORS = [
  { label: "Equals", value: "equals" },
  { label: "Contains", value: "contains" },
  { label: "Greater than", value: "greater_than" },
  { label: "Greater than or equal to", value: "greater_than_or_equal_to" },
  { label: "Less than", value: "less_than" },
  { label: "Less than or equal to", value: "less_than_or_equal_to" },
];

const EXPRESSION_SCHEMA = getExpressionSchema();

export default function DataSourceEditor(props) {
  const canUseDataSourceExpression = props.canUseDataSourceExpression;
  const canUseDataSourceIntegration = props.canUseDataSourceIntegration;
  const canUseDataSourceModel = props.canUseDataSourceModel;
  const component = props.component;
  const dataScope = props.dataScope;
  const integrations = props.integrations;
  const isPlatformAdmin = props.isPlatformAdmin;
  const plan = props.plan;
  const selectedIntegration = props.selectedIntegration;
  const setIsIntegrationPickerOpen = props.setIsIntegrationPickerOpen;
  const styles = props.styles || importedStyles;
  const updateComponent = props.updateComponent;

  const [paramDialog, setParamDialog] = useState({ key: null, open: false });
  const [isOpen, setIsOpen] = useState(false);

  const { models } = useWebPageBuilderData();

  const componentType = component?.type;

  const dataSource = component?.dataSource || null;

  const sourceType = dataSource?.type || "none";
  const query = dataSource?.query || {};

  const isExpression = sourceType === "expression" && dataSource?.expression;
  const isArray = isExpression && isExpressionArray(dataSource?.expression);

  const from = query.from || "";
  const filter = query.filter || [];
  const sort = query.sort || [];
  const limit = query.limit ?? "";

  const fromOptions = useMemo(() => {
    const result = new Set();

    Object.keys(models || {}).forEach((name) => {
      result.add(name);
    });

    collectAvailableCollections(dataScope?.treePath || []).forEach((name) => {
      result.add(name);
    });

    return Array.from(result)
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({
        label: value,
        value,
      }));
  }, [dataScope, models]);

  const fields = useMemo(() => {
    const result = new Set();

    const model = models[dataScope?.name];

    if (model?.fields) {
      collectSchemaFields(model.fields).forEach((f) => result.add(f));
    }

    if (dataScope?.scope && typeof dataScope.scope === "object") {
      collectScopeFields(dataScope.scope).forEach((f) => result.add(f));
    }

    return Array.from(result).sort((a, b) => a.localeCompare(b));
  }, [dataScope, models]);

  function addFilter() {
    updateQuery({
      filter: [...filter, { field: "", operator: "equals", value: "" }],
    });
  }

  function addSort() {
    updateQuery({
      sort: [...sort, { field: "", direction: "asc" }],
    });
  }

  function createOptions() {
    const newOptions = [];

    newOptions.push({ label: "None", value: "none" });

    if (canUseDataSourceModel) {
      newOptions.push({ label: "Model", value: "model" });
    }

    if (canUseDataSourceExpression) {
      newOptions.push({ label: "Expression", value: "expression" });
    }

    if (canUseDataSourceIntegration) {
      newOptions.push({ label: "Integration", value: "integration" });
    }

    return newOptions;
  }

  function getExpectedType() {
    if (isArray) {
      return "array";
    } else {
      return "any";
    }
  }

  function isExpressionArray(expr) {
    if (!expr) {
      return false;
    }

    const schema = EXPRESSION_SCHEMA[expr.type];

    const returnType = schema?.returnType || "";

    return returnType.startsWith("array");
  }

  function isPathArray(path) {
    if (!path) {
      return false;
    }

    const parts = path.split(".");

    let current = getModel(dataScope?.name, dataScope?.treePath || [], models);

    for (const part of parts) {
      if (!current?.fields?.[part]) {
        return false;
      }

      const field = current.fields[part];

      if (field.type === "collection") {
        return true;
      }

      if (field.type === "relation") {
        current = models[field.model];

        continue;
      }

      current = field;
    }

    return false;
  }

  function onChangeSourceType(e) {
    const type = e.target.value;

    if (type === "none") {
      updateComponent(component.id, { dataSource: null });

      return;
    }

    if (type === "model") {
      updateComponent(component.id, {
        dataSource: {
          type: "model",
          query: {
            from: "",
            filter: [],
            sort: [],
            limit: null,
          },
        },
      });
      return;
    }

    if (type === "expression") {
      updateComponent(component.id, {
        dataSource: {
          type: "expression",
          expression: {
            id: generateId("expression"),
            type: "literal",
            value: [],
          },
        },
      });
    }

    if (type === "integration") {
      updateComponent(component.id, {
        dataSource: {
          type: "integration",
          integrationId: null,
          endpointKey: null,
          params: {},
        },
      });
    }
  }

  function onClose(e) {
    setIsOpen(false);
  }

  function onCloseDialog(e) {
    setParamDialog({ key: null, open: false });
  }

  function openParamExpression(key) {
    setParamDialog({ key, open: true });
  }

  function removeFilter(index) {
    updateQuery({
      filter: filter.filter((_, i) => i !== index),
    });
  }

  function removeSort(index) {
    updateQuery({
      sort: sort.filter((_, i) => i !== index),
    });
  }

  function updateFilter(index, next) {
    const nextFilters = [...filter];

    nextFilters[index] = { ...nextFilters[index], ...next };

    updateQuery({ filter: nextFilters });
  }

  function updateQuery(next) {
    updateComponent(component.id, {
      dataSource: {
        type: "model",
        query: {
          ...query,
          ...next,
        },
      },
    });
  }

  function updateSort(index, next) {
    const nextSort = [...sort];

    nextSort[index] = { ...nextSort[index], ...next };

    updateQuery({ sort: nextSort });
  }

  useEffect(() => {
    if (!selectedIntegration) {
      return;
    }

    const currentId = component?.dataSource?.integrationId;

    if (currentId === selectedIntegration._id) {
      return;
    }

    updateComponent(component.id, {
      dataSource: {
        type: "integration",
        integrationId: selectedIntegration._id,
        endpointKey: null,
        method: null,
        schema: {},
        params: {},
      },
    });
  }, [component?.dataSource?.integrationId, component?.id, selectedIntegration, updateComponent]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.column_2}>
        <DarkLabel htmlFor="source-type" text="Source" />
        <DarkSelect id="source-type" onChange={onChangeSourceType} options={createOptions()} value={sourceType} />
      </div>
      {sourceType === "model" && canUseDataSourceModel && (
        <>
          <div className={styles.column_2}>
            <DarkLabel htmlFor="from" text="From" />
            <DarkSelect onChange={(e) => updateQuery({ from: e.target.value })} options={[{ label: "Select source", value: "" }, ...fromOptions]} value={from} />
          </div>
          <div className={styles.section}>
            <DarkLabel text="Filter" />
            {filter.map((filter, filterIndex) => (
              <div className={styles.grid_2} key={filterIndex}>
                <DarkSelect
                  onChange={(e) => updateFilter(filterIndex, { field: e.target.value })}
                  options={[
                    { label: "Field", value: "" },
                    ...fields.map((field) => {
                      return { label: field, value: field };
                    }),
                  ]}
                  value={filter.field}
                />
                <DarkSelect
                  onChange={(e) => updateFilter(filterIndex, { operator: e.target.value })}
                  options={[
                    ...OPERATORS.map((operator) => {
                      return { label: operator.label, value: operator.value };
                    }),
                  ]}
                  value={filter.operator}
                />
                <DarkInput onChange={(e) => updateFilter(filterIndex, { value: e.target.value })} value={filter.value} />
                <DarkButton onClick={() => removeFilter(filterIndex)} type="button">
                  <Icon icon={faTrash} size={16} />
                </DarkButton>
              </div>
            ))}
            <DarkButton onClick={addFilter} type="button">
              <Icon icon={faAdd} size={16} />
            </DarkButton>
          </div>
          <div className={styles.section}>
            <DarkLabel text="Sort" />
            {sort.map((sortElement, sortElementIndex) => (
              <div className={styles.grid_2} key={sortElementIndex}>
                <DarkSelect
                  onChange={(e) => updateSort(sortElementIndex, { field: e.target.value })}
                  options={[
                    { label: "Field", value: "" },
                    ...fields.map((field) => {
                      return { label: field, value: field };
                    }),
                  ]}
                  value={sortElement.field}
                />
                <DarkSelect
                  onChange={(e) => updateSort(sortElementIndex, { direction: e.target.value })}
                  options={[
                    { label: "ASC", value: "asc" },
                    { label: "DESC", value: "desc" },
                  ]}
                  value={sortElement.direction}
                />
                <div></div>
                <DarkButton onClick={() => removeSort(sortElementIndex)} type="button">
                  <Icon icon={faTrash} size={16} />
                </DarkButton>
              </div>
            ))}
            <DarkButton onClick={addSort} type="button">
              <Icon icon={faAdd} size={16} />
            </DarkButton>
          </div>
          <div className={styles.column_2}>
            <DarkLabel htmlFor="limit" text="Limit" />
            <DarkInput id="limit" onChange={(e) => updateQuery({ limit: Number(e.target.value) || null })} type="number" value={limit} />
          </div>
        </>
      )}
      {sourceType === "expression" && canUseDataSourceExpression && (
        <>
          <div className={styles.section}>
            <DarkLabel text="Expression" />
            <DarkButton onClick={(e) => setIsOpen(true)}>Change expression</DarkButton>
            <ExpressionEditorDialog
              componentType={componentType}
              dataScope={dataScope}
              expectedType={getExpectedType()}
              expression={dataSource?.expression}
              isOpen={isOpen}
              isPlatformAdmin={isPlatformAdmin}
              onChange={(expr) =>
                updateComponent(component.id, {
                  dataSource: {
                    ...dataSource,
                    type: "expression",
                    expression: expr,
                  },
                })
              }
              onClose={onClose}
              plan={plan}
            />
          </div>
          <div className={styles.column_2}>
            <DarkLabel text="Fallback" />
            <DarkInput
              onChange={(e) =>
                updateComponent(component.id, {
                  dataSource: {
                    ...dataSource,
                    fallback: e.target.value,
                  },
                })
              }
              value={dataSource?.fallback || ""}
            />
          </div>
        </>
      )}
      {sourceType === "integration" && canUseDataSourceIntegration && (
        <>
          <div className={styles.section}>
            <DarkLabel text="Integration" />
            <DarkButton onClick={() => setIsIntegrationPickerOpen(true)}>Select integration</DarkButton>
          </div>
          {dataSource?.integrationId && (
            <>
              <div className={styles.column_2}>
                <DarkLabel text="Endpoint" />
                <DarkSelect
                  onChange={(e) => {
                    const endpointKey = e.target.value;

                    const endpoint = getEndpoint(dataSource.integrationId, endpointKey, integrations);

                    const newParams = {
                      ...buildParamsFromSchema(endpoint?.query),
                      ...buildParamsFromSchema(endpoint?.body),
                      ...buildParamsFromSchema(endpoint?.headers),
                    };

                    const mergedParams = {};

                    for (const key of Object.keys(newParams)) {
                      mergedParams[key] = dataSource.params?.[key] ?? newParams[key];
                    }

                    updateComponent(component.id, {
                      dataSource: {
                        ...dataSource,
                        endpointKey,
                        method: endpoint.method,
                        schema: {
                          query: endpoint?.query || {},
                          headers: endpoint?.headers || {},
                          body: endpoint?.body || {},
                        },
                        params: mergedParams,
                      },
                    });
                  }}
                  options={getEndpointOptions(dataSource.integrationId, integrations)}
                  value={dataSource.endpointKey || ""}
                />
              </div>
              <div className={styles.section}>
                <DarkLabel text="Params" />
                {Object.entries(dataSource.params || {}).map(([key, val]) => (
                  <div className={styles.grid_2} key={key}>
                    <span>{key}</span>
                    <DarkButton onClick={() => openParamExpression(key)}>Edit</DarkButton>
                  </div>
                ))}
              </div>
              <ExpressionEditorDialog
                componentType={componentType}
                dataScope={dataScope}
                expression={dataSource.params[paramDialog.key]}
                isOpen={paramDialog.open}
                isPlatformAdmin={isPlatformAdmin}
                onChange={(expr) => {
                  updateComponent(component.id, {
                    dataSource: {
                      ...dataSource,
                      params: {
                        ...dataSource.params,
                        [paramDialog.key]: expr,
                      },
                    },
                  });
                }}
                onClose={onCloseDialog}
                plan={plan}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

function buildParamsFromSchema(schema) {
  if (!schema || schema.type !== "object") {
    return {};
  }

  const params = {};

  for (const [key, field] of Object.entries(schema.fields || {})) {
    params[key] = createDefaultExpression(field);
  }

  return params;
}

function collectAvailableCollections(treePath) {
  const result = new Set();

  for (const node of treePath || []) {
    if (node.collection) {
      result.add(node.name);
    }

    const schema = node.schema;

    if (schema?.fields) {
      for (const [key, field] of Object.entries(schema.fields)) {
        if (field.type === "collection") {
          result.add(key);
        }
      }
    }
  }

  return Array.from(result);
}

function collectSchemaFields(fields, prefix = "") {
  const paths = [];

  for (const [key, field] of Object.entries(fields)) {
    const path = prefix ? `${prefix}.${key}` : key;

    paths.push(path);

    if (field.type === "collection" && field.fields) {
      paths.push(...collectSchemaFields(field.fields, path));
    }

    if (field.type === "relation") {
      paths.push(path);
    }
  }

  return paths;
}

function collectScopeFields(scope, prefix = "") {
  if (!scope || typeof scope !== "object") {
    return [];
  }

  const paths = [];

  for (const key of Object.keys(scope)) {
    const value = scope[key];
    const path = prefix ? `${prefix}.${key}` : key;

    paths.push(path);

    if (Array.isArray(value)) {
      const first = value[0];

      if (first && typeof first === "object") {
        paths.push(...collectScopeFields(first, path));
      }
    } else if (value && typeof value === "object") {
      paths.push(...collectScopeFields(value, path));
    }
  }

  return paths;
}

function createDefaultExpression(field) {
  switch (field?.type) {
    case "number":
      return { type: "literal", value: 0 };
    case "boolean":
      return { type: "literal", value: false };
    case "array":
      return { type: "literal", value: [] };
    case "object":
      return { type: "literal", value: {} };
    default:
      return { type: "literal", value: "" };
  }
}

function getEndpoint(integrationId, endpointKey, integrations) {
  const integration = integrations?.find((i) => i._id.toString() === integrationId);

  return integration?.endpoints?.find((e) => e.key === endpointKey);
}

function getEndpointOptions(integrationId, integrations) {
  const integration = integrations?.find((i) => i._id.toString() === integrationId);

  if (!integration) {
    return [];
  }

  return integration.endpoints
    .filter((e) => e.method === "GET")
    .map((e) => ({
      label: `${e.method} ${e.path}`,
      value: e.key,
    }));
}

function getModel(modelName, modelTreePath, models) {
  if (typeof modelName !== "string") {
    return null;
  }

  if (Array.isArray(modelTreePath)) {
    for (let i = modelTreePath.length - 1; i >= 0; i--) {
      const node = modelTreePath[i];
      const schema = node?.schema;

      if (schema?.fields?.[modelName]) {
        return schema.fields[modelName];
      }
    }
  }

  if (models?.[modelName]) {
    return models[modelName];
  }

  return null;
}
