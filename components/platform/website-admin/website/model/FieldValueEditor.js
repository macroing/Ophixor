// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import Button from "@/lib/web-page-builder/components/button/Button";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Input from "@/lib/web-page-builder/components/input/Input";
import RichText from "@/lib/web-page-builder/components/rich-text/RichText";
import Switch from "@/lib/web-page-builder/components/switch/Switch";
import TextArea from "@/lib/web-page-builder/components/text-area/TextArea";

import importedStyles from "./FieldValueEditor.module.css";

export default function FieldValueEditor(props) {
  const field = props.field;
  const name = props.name;
  const onChange = props.onChange;
  const styles = props.styles || importedStyles;
  const value = props.value;

  function update(val) {
    onChange(val);
  }

  switch (field.type) {
    case "boolean":
      return (
        <div className={styles.field_container}>
          <h6 className={styles.name}>{name}</h6>
          <Switch checked={!!value} onChange={(e) => update(e.target.checked)} text={name} />
        </div>
      );
    case "collection":
      return (
        <div className={styles.field_container}>
          <h6 className={styles.name}>{name}</h6>
          <CollectionEditor field={field} name={name} onChange={onChange} styles={styles} value={value} />
        </div>
      );
    case "number":
      return (
        <div className={styles.field_container}>
          <h6 className={styles.name}>{name}</h6>
          <Input isDebounceDisabled={true} onChange={(e) => update(e.target.value === "" ? "" : Number(e.target.value))} placeholder={name} type="number" value={value ?? ""} />
        </div>
      );
    case "relation":
      return (
        <div className={styles.field_container}>
          <h6 className={styles.name}>{name}</h6>
          <Input isDebounceDisabled={true} onChange={(e) => update(e.target.value)} placeholder={`Relation (${field.model})`} value={value ?? ""} />
        </div>
      );
    case "single":
      return (
        <div className={styles.field_container}>
          <h6 className={styles.name}>{name}</h6>
          <SingleEditor field={field} name={name} onChange={onChange} styles={styles} value={value} />
        </div>
      );
    case "string":
      if (field.textType === "rich-text") {
        return (
          <div className={styles.field_container}>
            <h6 className={styles.name}>{name}</h6>
            <RichText onChange={(e) => update(e.target.value)} value={value ?? ""} />
          </div>
        );
      } else if (field.lineType === "multi-line") {
        return (
          <div className={styles.field_container}>
            <h6 className={styles.name}>{name}</h6>
            <TextArea onChange={(e) => update(e.target.value)} placeholder={name} rows={10} value={value ?? ""} />
          </div>
        );
      } else {
        return (
          <div className={styles.field_container}>
            <h6 className={styles.name}>{name}</h6>
            <Input isDebounceDisabled={true} onChange={(e) => update(e.target.value)} placeholder={name} value={value ?? ""} />
          </div>
        );
      }
    default:
      return (
        <div className={styles.field_container}>
          <h6 className={styles.name}>{name}</h6>
          <Input isDebounceDisabled={true} onChange={(e) => update(e.target.value)} placeholder={name} value={value ?? ""} />
        </div>
      );
  }
}

function CollectionEditor(props) {
  const field = props.field;
  const name = props.name;
  const onChange = props.onChange;
  const styles = props.styles || importedStyles;
  const value = props.value || [];

  function addItem() {
    const emptyItem = {};

    for (const key of Object.keys(field.fields || {})) {
      emptyItem[key] = "";
    }

    onChange([...(value || []), emptyItem]);
  }

  function removeItem(index) {
    const newArray = [...value];

    newArray.splice(index, 1);

    onChange(newArray);
  }

  function updateItem(index, updatedItem) {
    const newArray = [...value];

    newArray[index] = updatedItem;

    onChange(newArray);
  }

  return (
    <div className={styles.collection}>
      <Heading level="5" text={name} />
      {(value || []).map((item, index) => (
        <div className={styles.field} key={index}>
          {Object.entries(field.fields || {}).map(([key, subField]) => (
            <FieldValueEditor
              field={subField}
              key={key}
              name={key}
              onChange={(val) =>
                updateItem(index, {
                  ...item,
                  [key]: val,
                })
              }
              styles={styles}
              value={item?.[key]}
            />
          ))}
          <div className={styles.actions}>
            <Button onClick={() => removeItem(index)} type="button">
              Remove
            </Button>
          </div>
        </div>
      ))}
      <div className={styles.actions}>
        <Button onClick={addItem} type="button">
          Add Item
        </Button>
      </div>
    </div>
  );
}

function SingleEditor(props) {
  const field = props.field;
  const name = props.name;
  const onChange = props.onChange;
  const styles = props.styles || importedStyles;
  const value = props.value || [];

  function updateItem(key, updatedItem) {
    const newValue = { ...value };

    newValue[key] = updatedItem;

    onChange(newValue);
  }

  return (
    <div className={styles.single}>
      <Heading level="5" text={name} />
      <div className={styles.field}>
        {Object.entries(field.fields || {}).map(([key, subField]) => (
          <FieldValueEditor field={subField} key={key} name={key} onChange={(val) => updateItem(key, val)} styles={styles} value={item?.[key]} />
        ))}
      </div>
    </div>
  );
}
