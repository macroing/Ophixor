// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useState } from "react";
import { faChevronDown, faChevronUp, faTrash } from "@fortawesome/pro-solid-svg-icons";

import Button from "@/lib/web-page-builder/components/button/Button";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Icon from "@/lib/web-page-builder/components/editor/Icon";
import Input from "@/lib/web-page-builder/components/input/Input";
import Select from "@/lib/web-page-builder/components/select/Select";

import importedStyles from "./FieldEditor.module.css";

export default function FieldEditor(props) {
  const field = props.field;
  const name = props.name;
  const onChange = props.onChange;
  const removeField = props.removeField;
  const styles = props.styles || importedStyles;

  const [isExpanded, setIsExpanded] = useState(false);

  function normalizeFieldType(oldField, type) {
    const newField = { type };

    if (type === "collection") {
      newField.fields = oldField.fields || {};
    }

    if (type === "relation") {
      newField.model = oldField.model || "";
    }

    if (type === "string") {
      newField.lineType = oldField.lineType || "single-line";
      newField.textType = oldField.textType || "plain-text";
    }

    return newField;
  }

  return (
    <div className={styles.field_editor_container}>
      <div className={styles.header}>
        <div>{name}</div>
        <div>{field.type}</div>
        <div className={styles.right}>
          <Icon icon={isExpanded ? faChevronUp : faChevronDown} onClick={(e) => setIsExpanded((currentIsExpanded) => !currentIsExpanded)} size={16} style={{ color: "#475569" }} />
        </div>
      </div>
      <div className={styles.field_editor + (isExpanded ? " " + styles.field_editor_expanded : "")}>
        <Select
          onChange={(e) => onChange(normalizeFieldType(field, e.target.value))}
          options={[
            { label: "Boolean", value: "boolean" },
            { label: "Collection", value: "collection" },
            { label: "Number", value: "number" },
            { label: "Relation", value: "relation" },
            { label: "String", value: "string" },
          ]}
          value={field.type}
        />
        {field.type === "collection" && (
          <div className={styles.collection_fields}>
            <Heading color="#0f172a" level="5" text="Fields" />
            {Object.entries(field.fields || {}).map(([key, subField]) => (
              <FieldEditor
                field={subField}
                key={key}
                name={key}
                onChange={(updated) => {
                  onChange({
                    ...field,
                    fields: {
                      ...(field.fields || {}),
                      [key]: updated,
                    },
                  });
                }}
                removeField={(name) => {
                  const newFields = { ...(field.fields || {}) };

                  delete newFields[name];

                  onChange({
                    ...field,
                    fields: newFields,
                  });
                }}
              />
            ))}
            <AddNestedField field={field} onChange={onChange} />
          </div>
        )}
        {field.type === "relation" && (
          <Input
            isDebounceDisabled={true}
            onChange={(e) =>
              onChange({
                ...field,
                model: e.target.value,
              })
            }
            placeholder="Model"
            value={field.model || ""}
          />
        )}
        {field.type === "string" && (
          <Select
            onChange={(e) => onChange({ ...field, textType: e.target.value })}
            options={[
              { label: "Plain-text", value: "plain-text" },
              { label: "Rich-text", value: "rich-text" },
            ]}
            value={field.textType || "plain-text"}
          />
        )}
        {field.type === "string" && field.textType !== "rich-text" && (
          <Select
            onChange={(e) => onChange({ ...field, lineType: e.target.value })}
            options={[
              { label: "Multi-line", value: "multi-line" },
              { label: "Single-line", value: "single-line" },
            ]}
            value={field.lineType || "single-line"}
          />
        )}
        <div className={styles.actions}>
          <Button onClick={(e) => removeField(name)} theme="danger" type="button">
            <Icon icon={faTrash} size={16} style={{ color: "inherit" }} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function AddNestedField(props) {
  const field = props.field;
  const onChange = props.onChange;
  const styles = props.styles || importedStyles;

  const [name, setName] = useState("");

  function addField() {
    if (!name.trim()) {
      return;
    }

    onChange({
      ...field,
      fields: {
        ...(field.fields || {}),
        [name]: { type: "string" },
      },
    });

    setName("");
  }

  return (
    <div className={styles.add_field}>
      <Input isDebounceDisabled={true} onChange={(e) => setName(e.target.value)} placeholder="FieldName" value={name} />
      <Button disabled={!name.trim()} onClick={addField} type="button">
        Add Field
      </Button>
    </div>
  );
}
