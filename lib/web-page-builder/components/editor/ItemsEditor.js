// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { faAdd, faDown, faTrash, faUp } from "@fortawesome/pro-solid-svg-icons";

import BindingWrapper from "./BindingWrapper";
import ColorPicker from "./ColorPicker";
import Icon from "./Icon";
import { DarkButton } from "../button/Button";
import { DarkInput } from "../input/Input";
import { DarkSelect } from "../select/Select";
import { DarkSwitch } from "../switch/Switch";
import { DarkTextArea } from "../text-area/TextArea";

import importedStyles from "./ItemsEditor.module.css";

export default function ItemsEditor(props) {
  const canUseExpression = props.canUseExpression;
  const componentId = props.componentId;
  const componentType = props.componentType;
  const dataScope = props.dataScope;
  const isPlatformAdmin = props.isPlatformAdmin;
  const items = props.items || [];
  const onChange = props.onChange;
  const plan = props.plan;
  const schema = props.schema;
  const styles = props.styles || importedStyles;

  const isAllowingChildItems = schema?.isAllowingChildItems || false;

  function addItem() {
    const newItem = {
      id: crypto.randomUUID(),
      ...Object.fromEntries(Object.keys(schema?.props || {}).map((key) => [key, ""])),
      items: [],
    };

    onChange([...items, newItem]);
  }

  function moveItem(index, direction) {
    const target = index + direction;

    if (target < 0 || target >= items.length) {
      return;
    }

    const next = [...items];

    [next[index], next[target]] = [next[target], next[index]];

    onChange(next);
  }

  function removeItem(id) {
    onChange(items.filter((item) => item.id !== id));
  }

  function updateItem(id, patch) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function updateItems(id, items) {
    updateItem(id, { items });
  }

  return (
    <div className={styles.list}>
      {items.map((item, itemIndex) => {
        const treePath = dataScope?.treePath;

        const itemPath = [...(treePath || []), itemIndex];

        const itemDataScope = { ...(treePath || {}), treePath: itemPath };

        return (
          <div className={styles.item} key={item.id + "-" + itemIndex}>
            <div className={styles.header}>
              <strong>{typeof item.label === "string" ? item.label : item.label?.fallback || "Object"}</strong>
              <div className={styles.controls}>
                <DarkButton disabled={itemIndex <= 0} onClick={() => moveItem(itemIndex, -1)} type="button">
                  <Icon icon={faUp} size={16} />
                </DarkButton>
                <DarkButton disabled={itemIndex + 1 >= items.length} onClick={() => moveItem(itemIndex, +1)} type="button">
                  <Icon icon={faDown} size={16} />
                </DarkButton>
                <DarkButton onClick={() => removeItem(item.id)} theme="danger" type="button">
                  <Icon icon={faTrash} size={16} />
                </DarkButton>
              </div>
            </div>
            <div className={styles.fields}>
              {Object.entries(schema?.props || {}).map(([key, definition]) => {
                return (
                  <label key={key}>
                    {definition.label}
                    <BindingWrapper canUseExpression={canUseExpression} componentType={componentType} dataScope={{ ...(itemDataScope || {}), treePath: [...itemPath, key] }} id={item.id + "-" + key} isPlatformAdmin={isPlatformAdmin} onChange={(next) => updateItem(item.id, { [key]: next })} plan={plan} propertyType={definition.type} value={item[key] || ""}>
                      {({ value, onChange }) => {
                        if (definition.type === "color") {
                          return <ColorPicker componentId={componentId} label={definition.label} onChange={onChange} value={value || ""} />;
                        }

                        if (definition.type === "number") {
                          return <DarkInput onChange={(e) => onChange(e.target.value)} type="number" value={value || ""} />;
                        }

                        if (definition.type === "text") {
                          return <DarkInput onChange={(e) => onChange(e.target.value)} value={value || ""} />;
                        }

                        if (definition.type === "textarea") {
                          return <BufferedDarkTextArea onChange={onChange} rows={10} value={value || ""} />;
                        }

                        if (definition.type === "select") {
                          return <DarkSelect onChange={(e) => onChange(e.target.value)} options={definition.options.map((option) => ({ label: option.label, value: option.value }))} value={value || ""} />;
                        }

                        if (definition.type === "switch") {
                          return <DarkSwitch checked={!!value} id={item.id} onChange={(e) => onChange(e.target.checked)} />;
                        }

                        return null;
                      }}
                    </BindingWrapper>
                  </label>
                );
              })}
            </div>
            {isAllowingChildItems && schema?.schema && (
              <div className={styles.items}>
                <ItemsEditor canUseExpression={canUseExpression} componentId={componentId} componentType={componentType} dataScope={dataScope} isPlatformAdmin={isPlatformAdmin} items={item.items || []} onChange={(items) => updateItems(item.id, items)} plan={plan} schema={schema.schema} />
              </div>
            )}
          </div>
        );
      })}
      <DarkButton onClick={addItem} type="button">
        <Icon icon={faAdd} size={16} /> Add
      </DarkButton>
    </div>
  );
}

function BufferedDarkTextArea({ onChange, value, ...rest }) {
  const [localValue, setLocalValue] = useState(value || "");

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  return (
    <DarkTextArea
      onBlur={() => {
        onChange(localValue);
      }}
      onChange={(e) => {
        setLocalValue(e.target.value);
      }}
      value={localValue}
      {...rest}
    />
  );
}
