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
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

import importedStyles from "./FieldEditor.module.css";

export default function FieldEditor(props) {
  const field = props.field;
  const name = props.name;
  const onChange = props.onChange;
  const removeField = props.removeField;
  const styles = props.styles || importedStyles;

  const { language } = useLanguage();

  const [isExpanded, setIsExpanded] = useState(false);

  function normalizeFieldType(oldField, type) {
    const newField = { type };

    if (type === "collection") {
      newField.fields = oldField.fields || {};
    }

    if (type === "relation") {
      newField.model = oldField.model || "";
    }

    if (type === "single") {
      newField.fields = oldField.fields || {};
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
        <div>{platform.websiteAdmin.models.fieldEditor[field.type][language]}</div>
        <div className={styles.right}>
          <Icon icon={isExpanded ? faChevronUp : faChevronDown} onClick={(e) => setIsExpanded((currentIsExpanded) => !currentIsExpanded)} size={16} style={{ color: "#475569" }} />
        </div>
      </div>
      <div className={styles.field_editor + (isExpanded ? " " + styles.field_editor_expanded : "")}>
        <Select
          onChange={(e) => onChange(normalizeFieldType(field, e.target.value))}
          options={[
            { label: platform.websiteAdmin.models.fieldEditor.boolean[language], value: "boolean" },
            { label: platform.websiteAdmin.models.fieldEditor.collection[language], value: "collection" },
            { label: platform.websiteAdmin.models.fieldEditor.number[language], value: "number" },
            { label: platform.websiteAdmin.models.fieldEditor.relation[language], value: "relation" },
            { label: platform.websiteAdmin.models.fieldEditor.single[language], value: "single" },
            { label: platform.websiteAdmin.models.fieldEditor.string[language], value: "string" },
          ]}
          value={field.type}
        />
        {(field.type === "collection" || field.type === "single") && (
          <div className={styles.collection_fields}>
            <Heading color="#0f172a" level="5" text={platform.websiteAdmin.models.fieldEditor.fields[language]} />
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
            placeholder={platform.websiteAdmin.models.fieldEditor.modelPlaceholder[language]}
            value={field.model || ""}
          />
        )}
        {field.type === "string" && (
          <Select
            onChange={(e) => onChange({ ...field, textType: e.target.value })}
            options={[
              { label: platform.websiteAdmin.models.fieldEditor["plain-text"][language], value: "plain-text" },
              { label: platform.websiteAdmin.models.fieldEditor["rich-text"][language], value: "rich-text" },
            ]}
            value={field.textType || "plain-text"}
          />
        )}
        {field.type === "string" && field.textType !== "rich-text" && (
          <Select
            onChange={(e) => onChange({ ...field, lineType: e.target.value })}
            options={[
              { label: platform.websiteAdmin.models.fieldEditor["multi-line"][language], value: "multi-line" },
              { label: platform.websiteAdmin.models.fieldEditor["single-line"][language], value: "single-line" },
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

  const { language } = useLanguage();

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
      <Input isDebounceDisabled={true} onChange={(e) => setName(e.target.value)} placeholder={platform.websiteAdmin.models.fieldEditor.fieldPlaceholder[language]} value={name} />
      <Button disabled={!name.trim()} onClick={addField} type="button">
        {platform.websiteAdmin.models.fieldEditor.addField[language]}
      </Button>
    </div>
  );
}
