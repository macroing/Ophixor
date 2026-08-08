// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useMemo } from "react";
import { faAdd, faDown, faTrash, faUp } from "@fortawesome/pro-solid-svg-icons";

import BindingWrapper from "./BindingWrapper";
import ColorPicker from "./ColorPicker";
import Icon from "./Icon";
import { DarkButton } from "../button/Button";
import { DarkInput } from "../input/Input";
import { DarkSelect } from "../select/Select";
import { DarkSwitch } from "../switch/Switch";
import { DarkTextArea } from "../text-area/TextArea";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };
import platformData from "@/definitions/platform-data.json" with { type: "json" };

import importedStyles from "./ItemsEditor.module.css";

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

export default function ItemsEditor(props) {
  const canUseExpression = props.canUseExpression;
  const componentId = props.componentId;
  const componentType = props.componentType;
  const dataScope = props.dataScope;
  const isPlatformAdmin = props.isPlatformAdmin;
  const items = props.items || EMPTY_ARRAY;
  const onChange = props.onChange;
  const plan = props.plan;
  const schema = props.schema;
  const styles = props.styles || importedStyles;

  const isAllowingChildItems = schema?.isAllowingChildItems || false;

  const { language } = useLanguage();

  function addItem() {
    const newItem = {
      id: crypto.randomUUID(),
      ...Object.fromEntries(Object.keys(schema?.props || {}).map((key) => [key, ""])),
      items: [],
    };

    onChange([...items, newItem]);
  }

  const moveItem = useCallback(
    (index, direction) => {
      const target = index + direction;

      if (target < 0 || target >= items.length) {
        return;
      }

      const next = [...items];

      [next[index], next[target]] = [next[target], next[index]];

      onChange(next);
    },
    [items, onChange],
  );

  const removeItem = useCallback(
    (id) => {
      onChange(items.filter((item) => item.id !== id));
    },
    [items, onChange],
  );

  const updateItem = useCallback(
    (id, patch) => {
      onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    },
    [items, onChange],
  );

  const updateItems = useCallback(
    (id, items) => {
      updateItem(id, { items });
    },
    [updateItem],
  );

  return (
    <div className={styles.list}>
      {items.map((item, itemIndex) => (
        <ItemEditor canUseExpression={canUseExpression} componentId={componentId} componentType={componentType} dataScope={dataScope} isAllowingChildItems={isAllowingChildItems} isPlatformAdmin={isPlatformAdmin} item={item} itemIndex={itemIndex} items={items} key={item.id + "-" + itemIndex} language={language} moveItem={moveItem} plan={plan} removeItem={removeItem} schema={schema} styles={styles} updateItem={updateItem} updateItems={updateItems} />
      ))}
      <DarkButton onClick={addItem} type="button">
        <Icon icon={faAdd} size={16} /> {platform.websiteAdmin.pages.editor.add[language]}
      </DarkButton>
    </div>
  );
}

function ItemEditor(props) {
  const canUseExpression = props.canUseExpression;
  const componentId = props.componentId;
  const componentType = props.componentType;
  const dataScope = props.dataScope;
  const isAllowingChildItems = props.isAllowingChildItems;
  const isPlatformAdmin = props.isPlatformAdmin;
  const item = props.item;
  const itemIndex = props.itemIndex;
  const items = props.items;
  const language = props.language;
  const moveItem = props.moveItem;
  const plan = props.plan;
  const removeItem = props.removeItem;
  const schema = props.schema;
  const styles = props.styles || importedStyles;
  const updateItem = props.updateItem;
  const updateItems = props.updateItems;

  const treePath = dataScope?.treePath;

  const itemPath = useMemo(() => [...(treePath || EMPTY_ARRAY), itemIndex], [itemIndex, treePath]);

  const itemDataScope = useMemo(() => ({ ...(treePath || EMPTY_OBJECT), treePath: itemPath }), [itemPath, treePath]);

  const onClickMoveItemDown = useCallback(() => {
    moveItem(itemIndex, +1);
  }, [itemIndex, moveItem]);

  const onClickMoveItemUp = useCallback(() => {
    moveItem(itemIndex, -1);
  }, [itemIndex, moveItem]);

  const onClickRemoveItem = useCallback(() => {
    removeItem(item.id);
  }, [item.id, removeItem]);

  return (
    <div className={styles.item}>
      <div className={styles.header}>
        <strong>{typeof item.label === "string" ? item.label : item.label?.fallback || "Object"}</strong>
        <div className={styles.controls}>
          <DarkButton disabled={itemIndex <= 0} onClick={onClickMoveItemUp} type="button">
            <Icon icon={faUp} size={12} />
          </DarkButton>
          <DarkButton disabled={itemIndex + 1 >= items.length} onClick={onClickMoveItemDown} type="button">
            <Icon icon={faDown} size={12} />
          </DarkButton>
          <DarkButton onClick={onClickRemoveItem} theme="danger" type="button">
            <Icon icon={faTrash} size={12} />
          </DarkButton>
        </div>
      </div>
      <div className={styles.fields}>
        {Object.entries(schema?.props || EMPTY_OBJECT).map(([key, definition]) => (
          <ItemFieldEditor canUseExpression={canUseExpression} componentId={componentId} componentType={componentType} definition={definition} isPlatformAdmin={isPlatformAdmin} item={item} itemDataScope={itemDataScope} itemPath={itemPath} itemPathCurrent={key} key={key} language={language} plan={plan} updateItem={updateItem} />
        ))}
      </div>
      {isAllowingChildItems && schema?.schema && (
        <div className={styles.items}>
          <ItemsEditor canUseExpression={canUseExpression} componentId={componentId} componentType={componentType} dataScope={dataScope} isPlatformAdmin={isPlatformAdmin} items={item.items || []} onChange={(items) => updateItems(item.id, items)} plan={plan} schema={schema.schema} />
        </div>
      )}
    </div>
  );
}

function ItemFieldEditor(props) {
  const canUseExpression = props.canUseExpression;
  const componentId = props.componentId;
  const componentType = props.componentType;
  const definition = props.definition;
  const isPlatformAdmin = props.isPlatformAdmin;
  const item = props.item;
  const itemDataScope = props.itemDataScope;
  const itemPath = props.itemPath;
  const itemPathCurrent = props.itemPathCurrent;
  const language = props.language;
  const plan = props.plan;
  const updateItem = props.updateItem;

  const dataScope = useMemo(() => ({ ...(itemDataScope || EMPTY_OBJECT), treePath: [...itemPath, itemPathCurrent] }), [itemDataScope, itemPath, itemPathCurrent]);

  const onChange = useCallback(
    (next) => {
      updateItem(item.id, { [itemPathCurrent]: next });
    },
    [item, itemPathCurrent, updateItem],
  );

  const options = useMemo(() => {
    if (definition?.type === "select" && Array.isArray(definition?.options)) {
      return definition.options.map((option) => ({ label: platformData.component.props[option.value]?.[language] ?? option.label, value: option.value }));
    } else {
      return EMPTY_ARRAY;
    }
  }, [definition, language]);

  function renderControl(value, onChange) {
    if (definition.type === "color") {
      return <ColorPicker componentId={componentId} onChange={onChange} value={value || ""} />;
    }

    if (definition.type === "number") {
      return <DarkInput isDebounceDisabled={false} onChangeValue={onChange} type="number" value={value || ""} />;
    }

    if (definition.type === "text") {
      return <DarkInput isDebounceDisabled={false} onChangeValue={onChange} value={value || ""} />;
    }

    if (definition.type === "textarea") {
      return <DarkTextArea isDebounceDisabled={false} onChangeValue={onChange} rows={10} value={value || ""} />;
    }

    if (definition.type === "select") {
      return <DarkSelect onChangeValue={onChange} options={options} value={value || ""} />;
    }

    if (definition.type === "switch") {
      return <DarkSwitch checked={!!value} id={item.id} onChangeChecked={onChange} />;
    }

    return null;
  }

  return (
    <label>
      {platformData.component.props[itemPathCurrent]?.[language] ?? definition.label}
      <BindingWrapper canUseExpression={canUseExpression} componentType={componentType} dataScope={dataScope} id={item.id + "-" + itemPathCurrent} isPlatformAdmin={isPlatformAdmin} onChange={onChange} plan={plan} property={definition} propertyType={definition.type} value={item[itemPathCurrent] || ""}>
        {({ value, onChange }) => renderControl(value, onChange)}
      </BindingWrapper>
    </label>
  );
}
