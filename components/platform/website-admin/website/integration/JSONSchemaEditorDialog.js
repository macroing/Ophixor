// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useState } from "react";
import { faAdd, faCancel, faSave, faTrash } from "@fortawesome/pro-solid-svg-icons";

import Button from "@/lib/web-page-builder/components/button/Button";
import Dialog from "@/lib/web-page-builder/components/dialog/Dialog";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Icon from "@/lib/web-page-builder/components/editor/Icon";
import Input from "@/lib/web-page-builder/components/input/Input";
import Section from "@/lib/web-page-builder/components/section/Section";
import Select from "@/lib/web-page-builder/components/select/Select";
import Switch from "@/lib/web-page-builder/components/switch/Switch";
import { useLanguage } from "@/context/language";
import { useViewport } from "@/hooks/useViewport";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function JSONSchemaEditorDialog(props) {
  const canUpdate = props.canUpdate;
  const isKeyValue = props.isKeyValue || false;
  const onChange = props.onChange;
  const onClose = props.onClose;
  const returnType = props.returnType || "object";
  const title = props.title;
  const value = props.value;

  const { language } = useLanguage();

  const [schema, setSchema] = useState(typeof value === "object" && value && !Array.isArray(value) && value.type === returnType ? encodeSchema(value) : encodeSchema(createDefaultSchema(returnType)));

  const { isMobile } = useViewport();

  function encodeSchema(currentSchema) {
    const newSchema = { ...currentSchema };

    if (newSchema.type === "array") {
      if (!newSchema.items) {
        newSchema.items = createDefaultSchema();
      }

      for (let i = 0; i < newSchema.items.length; i++) {
        newSchema.items[i] = encodeSchema(newSchema.items[i]);
      }
    } else if (newSchema.type === "object") {
      if (!newSchema.fields) {
        newSchema.fields = {};
      }

      newSchema.fields = fieldsObjectToArray(newSchema.fields || {});

      for (let i = 0; i < newSchema.fields.length; i++) {
        newSchema.fields[i] = {
          ...newSchema.fields[i],
          schema: encodeSchema(newSchema.fields[i].schema),
        };
      }
    }

    return newSchema;
  }

  function decodeSchema(currentSchema) {
    const newSchema = { ...currentSchema };

    if (newSchema.type === "array") {
      if (!newSchema.items) {
        newSchema.items = createDefaultSchema();
      }

      for (let i = 0; i < newSchema.items.length; i++) {
        newSchema.items[i] = decodeSchema(newSchema.items[i]);
      }
    } else if (newSchema.type === "object") {
      if (!newSchema.fields) {
        newSchema.fields = [];
      }

      for (let i = 0; i < newSchema.fields.length; i++) {
        newSchema.fields[i] = {
          ...newSchema.fields[i],
          schema: decodeSchema(newSchema.fields[i].schema),
        };
      }

      newSchema.fields = fieldsArrayToObject(newSchema.fields || []);
    }

    return newSchema;
  }

  function fieldsArrayToObject(fields) {
    const obj = {};

    fields.forEach((f) => {
      if (f.key) {
        obj[f.key] = f.schema;
      }
    });

    return obj;
  }

  function fieldsObjectToArray(obj) {
    return Object.entries(obj || {}).map(([key, schema]) => ({
      id: crypto.randomUUID(),
      key,
      schema,
    }));
  }

  function onClickClose(e) {
    onClose?.();
  }

  function onClickSave(e) {
    onChange?.(decodeSchema(schema));
    onClose?.();
  }

  return (
    <Dialog heightBody="100%" minHeight="75vh" minWidth="300px">
      {{
        slots: {
          header: [<Heading key="1" level="3" text={title} />],
          body: [
            <Section key="1" padding="0px">
              <SchemaNode canUpdate={canUpdate} id="root" isKeyValue={isKeyValue} isRootNode={true} onChange={setSchema} value={schema} />
            </Section>,
          ],
          footer: [
            <Button key="cancel" onClick={onClickClose} type="button" width={isMobile ? "100%" : "auto"}>
              <Icon icon={faCancel} size={16} style={{ color: "inherit" }} /> {platform.websiteAdmin.jsonSchemaEditorDialog.cancel[language]}
            </Button>,
            canUpdate && (
              <Button key="save" onClick={onClickSave} theme="primary" type="button" width={isMobile ? "100%" : "auto"}>
                <Icon icon={faSave} size={16} style={{ color: "inherit" }} /> {platform.websiteAdmin.jsonSchemaEditorDialog.save[language]}
              </Button>
            ),
          ],
        },
      }}
    </Dialog>
  );
}

function EnumEditor(props) {
  const canUpdate = props.canUpdate;
  const onChange = props.onChange;
  const type = props.type || "text";
  const value = props.value || [];

  const { language } = useLanguage();

  const [items, setItems] = useState(value || []);

  function add() {
    const next = [...items, ""];

    setItems(next);

    onChange(next);
  }

  function remove(i) {
    const next = items.filter((_, idx) => idx !== i);

    setItems(next);

    onChange(next);
  }

  function updateItem(i, val) {
    const next = [...items];

    next[i] = val;

    setItems(next);

    onChange(next);
  }

  if (items.length === 0 && !canUpdate) {
    return null;
  }

  return (
    <Section borderColor="#e5e7eb" borderRadius="8px" borderWidth="1px" flexDirection="column" gap="0.5rem" padding="0.5rem">
      {items.map((v, i) => (
        <Section flexDirection="row" gap="0.5rem" key={i} padding="0px">
          <Input isDebounceDisabled={true} onChange={(e) => updateItem(i, e.target.value)} readOnly={!canUpdate} type={type} value={v} />
          {canUpdate && (
            <Button onClick={() => remove(i)} theme="danger" type="button">
              <Icon icon={faTrash} size={16} style={{ color: "inherit" }} />
            </Button>
          )}
        </Section>
      ))}
      {canUpdate && (
        <Button onClick={add} type="button">
          <Icon icon={faAdd} size={16} style={{ color: "inherit" }} /> {platform.websiteAdmin.jsonSchemaEditorDialog.addEnumValue[language]}
        </Button>
      )}
    </Section>
  );
}

function ObjectFieldsEditor(props) {
  const canUpdate = props.canUpdate;
  const fields = props.fields;
  const id = props.id;
  const isKeyValue = props.isKeyValue;
  const isRootNode = props.isRootNode;
  const onChange = props.onChange;

  const { language } = useLanguage();

  function addField() {
    onChange([
      ...fields,
      {
        id: crypto.randomUUID(),
        key: "",
        schema: createDefaultSchema(),
      },
    ]);
  }

  function removeField(index) {
    onChange(fields.filter((_, i) => i !== index));
  }

  function updateField(index, patch) {
    const copy = [...fields];

    copy[index] = { ...copy[index], ...patch };

    onChange(copy);
  }

  if (fields.length === 0 && !canUpdate) {
    return null;
  }

  return (
    <Section flexDirection="column" gap={isRootNode ? "1rem" : "0.5rem"} padding="0px">
      {fields.map((field, i) => (
        <Section borderColor="#e5e7eb" borderRadius="8px" borderWidth="1px" key={field.id} flexDirection="column" gap="0.5rem" padding="0.5rem">
          <Section flexDirection="row" gap="0.5rem" padding="0px">
            <Input
              isDebounceDisabled={true}
              onChange={(e) => {
                updateField(i, {
                  key: e.target.value,
                });
              }}
              placeholder={platform.websiteAdmin.jsonSchemaEditorDialog.fieldNamePlaceholder[language]}
              readOnly={!canUpdate}
              value={field.key}
            />
            {canUpdate && (
              <Button onClick={() => removeField(i)} theme="danger" type="button">
                <Icon icon={faTrash} size={16} style={{ color: "inherit" }} />
              </Button>
            )}
          </Section>
          <SchemaNode canUpdate={canUpdate} id={id + "-field-" + i} isKeyValue={isKeyValue} isRootNode={false} onChange={(next) => updateField(i, { schema: next })} value={field.schema} />
        </Section>
      ))}
      {canUpdate && (
        <Button onClick={addField} type="button">
          <Icon icon={faAdd} size={16} style={{ color: "inherit" }} /> {platform.websiteAdmin.jsonSchemaEditorDialog.addObjectField[language]}
        </Button>
      )}
    </Section>
  );
}

function SchemaNode(props) {
  const canUpdate = props.canUpdate;
  const id = props.id;
  const isKeyValue = props.isKeyValue;
  const isRootNode = props.isRootNode;
  const onChange = props.onChange;
  const value = props.value;

  const { language } = useLanguage();

  function getOptions() {
    const options = [];

    if (!isKeyValue) {
      options.push({ label: platform.websiteAdmin.jsonSchemaEditorDialog.object[language], value: "object" });
      options.push({ label: platform.websiteAdmin.jsonSchemaEditorDialog.array[language], value: "array" });
    }

    options.push({ label: platform.websiteAdmin.jsonSchemaEditorDialog.string[language], value: "string" });
    options.push({ label: platform.websiteAdmin.jsonSchemaEditorDialog.number[language], value: "number" });
    options.push({ label: platform.websiteAdmin.jsonSchemaEditorDialog.boolean[language], value: "boolean" });

    return options;
  }

  function update(key, val) {
    onChange({ ...value, [key]: val });
  }

  return (
    <Section flexDirection="column" gap={isRootNode ? "1rem" : "0.5rem"} padding="0px">
      {!isRootNode && <Select disabled={!canUpdate} onChange={(e) => update("type", e.target.value)} options={getOptions()} value={value.type} />}
      {!isRootNode && (
        <Section alignItems="center" flexDirection="row" gap="0.5rem" justifyContent="space-between" padding="0px">
          <Switch checked={!!value.required} disabled={!canUpdate} id={id + "-required"} onChange={(e) => update("required", e.target.checked)} text={platform.websiteAdmin.jsonSchemaEditorDialog.required[language]} />
          <Switch checked={!!value.nullable} disabled={!canUpdate} id={id + "-nullable"} onChange={(e) => update("nullable", e.target.checked)} text={platform.websiteAdmin.jsonSchemaEditorDialog.nullable[language]} />
        </Section>
      )}
      {value.type === "array" && (
        <Section flexDirection="column" gap="0.5rem" padding="0px">
          <Input isDebounceDisabled={true} onChange={(e) => update("minLength", Number(e.target.value) || null)} placeholder={platform.websiteAdmin.jsonSchemaEditorDialog.minLengthPlaceholder[language]} readOnly={!canUpdate} type="number" value={value.minLength ?? ""} />
          <Input isDebounceDisabled={true} onChange={(e) => update("maxLength", Number(e.target.value) || null)} placeholder={platform.websiteAdmin.jsonSchemaEditorDialog.maxLengthPlaceholder[language]} readOnly={!canUpdate} type="number" value={value.maxLength ?? ""} />
        </Section>
      )}
      {value.type === "array" && (
        <Section flexDirection="column" gap="0.5rem" padding="0px">
          <Heading level="6" text={platform.websiteAdmin.jsonSchemaEditorDialog.items[language]} />
          <SchemaNode canUpdate={canUpdate} id={id + "-array"} isKeyValue={isKeyValue} isRootNode={false} onChange={(items) => update("items", items)} value={value.items || createDefaultSchema()} />
        </Section>
      )}
      {value.type === "number" && (
        <Section flexDirection="column" gap="0.5rem" padding="0px">
          <Input isDebounceDisabled={true} onChange={(e) => update("minValue", Number(e.target.value) || null)} placeholder={platform.websiteAdmin.jsonSchemaEditorDialog.minValuePlaceholder[language]} readOnly={!canUpdate} type="number" value={value.minValue ?? ""} />
          <Input isDebounceDisabled={true} onChange={(e) => update("maxValue", Number(e.target.value) || null)} placeholder={platform.websiteAdmin.jsonSchemaEditorDialog.maxValuePlaceholder[language]} readOnly={!canUpdate} type="number" value={value.maxValue ?? ""} />
          <EnumEditor canUpdate={canUpdate} onChange={(v) => update("enum", v)} type="number" value={value.enum} />
        </Section>
      )}
      {value.type === "object" && <ObjectFieldsEditor canUpdate={canUpdate} fields={value.fields || []} id={id + "-object"} isKeyValue={isKeyValue} isRootNode={isRootNode} onChange={(fields) => update("fields", fields)} />}
      {value.type === "string" && (
        <Section flexDirection="column" gap="0.5rem" padding="0px">
          <Input isDebounceDisabled={true} onChange={(e) => update("minLength", Number(e.target.value) || null)} placeholder={platform.websiteAdmin.jsonSchemaEditorDialog.minLengthPlaceholder[language]} readOnly={!canUpdate} type="number" value={value.minLength ?? ""} />
          <Input isDebounceDisabled={true} onChange={(e) => update("maxLength", Number(e.target.value) || null)} placeholder={platform.websiteAdmin.jsonSchemaEditorDialog.maxLengthPlaceholder[language]} readOnly={!canUpdate} type="number" value={value.maxLength ?? ""} />
          <EnumEditor canUpdate={canUpdate} onChange={(v) => update("enum", v)} type="text" value={value.enum} />
        </Section>
      )}
    </Section>
  );
}

function createDefaultSchema(type = "string") {
  switch (type) {
    case "array":
      return { type: "array", required: true, nullable: false, minLength: 0, maxLength: null, items: [] };
    case "boolean":
      return { type: "boolean", required: true, nullable: false };
    case "number":
      return { type: "number", required: true, nullable: false, minValue: null, maxValue: null, enum: null };
    case "object":
      return { type: "object", required: true, nullable: false, minFields: 0, maxFields: null, fields: {} };
    case "string":
      return { type: "string", required: true, nullable: false, enum: null, minLength: 0, maxLength: null };
    default:
      return { type: "string", required: true, nullable: false, enum: null, minLength: 0, maxLength: null };
  }
}
