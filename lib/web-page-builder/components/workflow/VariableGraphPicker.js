// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useState } from "react";

import { useWebPageBuilderData, useWebPageBuilderPageState } from "../../context/useWebPageBuilder";

import importedStyles from "./VariableGraphPicker.module.css";

export default function VariableGraphPicker({ componentId, dataScope, isArray = false, onChange, prop, styles = importedStyles, type, value }) {
  const [open, setOpen] = useState({});

  const { models } = useWebPageBuilderData();

  const { componentIndex } = useWebPageBuilderPageState();

  const name = dataScope?.name;
  const treePath = dataScope?.treePath;

  const model = getModel(name, treePath, models);

  const scopeFields = [...getFieldsFromTreePath(treePath)];

  const selectedPath = type === "path" ? value : null;
  const selectedProp = type === "prop" ? `${componentId}.${prop}` : null;

  function isActivePath(path) {
    return selectedPath === path;
  }

  function isActiveProp(componentId, prop) {
    return selectedProp === `${componentId}.${prop}`;
  }

  function renderModelFields(fields, prefix = "", isArrayContext = false) {
    return Object.entries(fields).map(([key, field]) => {
      const path = prefix ? `${prefix}.${key}` : key;

      if (field.type === "collection") {
        if (isArrayContext) {
          return (
            <div key={path} className={`${styles.leaf} ${isActivePath(path) ? styles.active : ""}`} onClick={() => onChange("value", path)}>
              {key}
            </div>
          );
        }

        return (
          <div key={path}>
            <div className={styles.node} onClick={() => toggle(path)}>
              <span className={styles.caret}>{open[path] ? "▾" : "▸"}</span>
              <span className={styles.node_label}>{key}</span>
            </div>
            {open[path] && field.fields && <div className={styles.children}>{renderModelFields(field.fields, path, true)}</div>}
          </div>
        );
      }

      if (field.type === "relation") {
        const relatedModel = models[field.model];

        return (
          <div key={path}>
            <div className={styles.node} onClick={() => toggle(path)}>
              <span className={styles.caret}>{open[path] ? "▾" : "▸"}</span>
              <span className={styles.node_label}>{key}</span>
            </div>
            {open[path] && relatedModel?.fields && <div className={styles.children}>{renderModelFields(relatedModel.fields, path)}</div>}
          </div>
        );
      }

      if (field.type === "single") {
        return (
          <div key={path}>
            <div className={styles.node} onClick={() => toggle(path)}>
              <span className={styles.caret}>{open[path] ? "▾" : "▸"}</span>
              <span className={styles.node_label}>{key}</span>
            </div>
            {open[path] && field.fields && <div className={styles.children}>{renderModelFields(field.fields, path, true)}</div>}
          </div>
        );
      }

      return (
        <div key={path} className={`${styles.leaf} ${isActivePath(path) ? styles.active : ""}`} onClick={() => onChange("value", path)}>
          {key}
        </div>
      );
    });
  }

  function toggle(key) {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className={styles.graph}>
      {model && type === "path" && (
        <section className={styles.section}>
          <div className={styles.group} onClick={() => toggle("model")}>
            <span className={styles.caret}>{open.model ? "▾" : "▸"}</span>
            Model
          </div>
          {open.model && <div className={styles.children}>{renderModelFields(model.fields, "", isArray)}</div>}
        </section>
      )}
      {type === "path" && scopeFields.length >= 0 && (
        <section className={styles.section}>
          <div className={styles.group} onClick={() => toggle("runtime")}>
            <span className={styles.caret}>{open.runtime ? "▾" : "▸"}</span>
            Current item
          </div>
          {open.runtime && (
            <div className={styles.children}>
              {scopeFields.map((field) => (
                <div className={`${styles.leaf} ${isActivePath(field) ? styles.active : ""}`} key={field} onClick={() => onChange("value", field)}>
                  {field}
                </div>
              ))}
              <div className={`${styles.leaf} ${isActivePath("__item__") ? styles.active : ""}`} onClick={() => onChange("value", "__item__")}>
                (item)
              </div>
            </div>
          )}
        </section>
      )}
      {type === "prop" && (
        <section className={styles.section}>
          <div className={styles.group} onClick={() => toggle("components")}>
            <span className={styles.caret}>{open.components ? "▾" : "▸"}</span>
            Components
          </div>
          {open.components && (
            <div className={styles.children}>
              {Object.values(componentIndex || {}).map((comp) => (
                <div key={comp.id}>
                  <div className={styles.node} onClick={() => toggle(comp.id)}>
                    <span className={styles.caret}>{open[comp.id] ? "▾" : "▸"}</span>
                    <span className={styles.node_label}>{comp.type || comp.id}</span>
                  </div>
                  {open[comp.id] && (
                    <div className={styles.children}>
                      {Object.keys(comp.props || {}).map((prop) => (
                        <div className={`${styles.leaf} ${isActiveProp(comp.id, prop) ? styles.active : ""}`} key={prop} onClick={() => onChange("componentId", comp.id, "prop", prop)}>
                          {prop}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function getFieldsFromSample(sample, prefix = "") {
  const fields = new Set();

  if (Array.isArray(sample)) {
    if (sample.length === 0) {
      return [];
    }

    return getFieldsFromSample(sample[0], prefix);
  }

  if (sample && typeof sample === "object") {
    for (const key of Object.keys(sample)) {
      const path = prefix ? `${prefix}.${key}` : key;

      fields.add(path);

      const value = sample[key];

      if (value && typeof value === "object") {
        const nested = getFieldsFromSample(value, path);

        nested.forEach((f) => fields.add(f));
      }
    }
  }

  return Array.from(fields);
}

function getFieldsFromTreePath(treePath) {
  const fields = new Set();

  for (let i = treePath.length - 1; i >= 0; i--) {
    const node = treePath[i];

    if (node.scope && typeof node.scope === "object") {
      Object.keys(node.scope).forEach((key) => fields.add(key));
    }

    if (node.sample) {
      getFieldsFromSample(node.sample).forEach((f) => fields.add(f));
    }

    if (node.schema?.fields) {
      Object.keys(node.schema.fields).forEach((key) => fields.add(key));
    }
  }

  return Array.from(fields);
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
