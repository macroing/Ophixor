// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { faAdd, faCancel, faLinkSlash, faTrash } from "@fortawesome/pro-solid-svg-icons";

import { DarkButton } from "../button/Button";
import { DarkDialog } from "../dialog/Dialog";
import { DarkInput } from "../input/Input";
import { DarkLabel } from "../label/Label";
import { DarkSelect } from "../select/Select";
import { DarkSwitch } from "../switch/Switch";
import { DarkTextArea } from "../text-area/TextArea";
import Heading from "../heading/Heading";
import Icon from "../editor/Icon";
import Text from "../text/Text";
import VariableGraphPicker from "./VariableGraphPicker";
import { generateId } from "../../page/identity/generateId";
import { ACTION_SCHEMA, EXPRESSION_SCHEMA, addDynamicPort, createDynamicPort, isVariadicParameter, isVariadicParameterArray, removeDynamicPort } from "./workflow-utilities";

import importedStyles from "./NodeEditor.module.css";

export default function NodeEditor(props) {
  const dataScope = props.dataScope;
  const deleteNode = props.deleteNode;
  const disconnectNode = props.disconnectNode;
  const node = props.node;
  const parentNode = props.parentNode;
  const styles = props.styles || importedStyles;
  const updateNode = props.updateNode;

  const dialogRef = useRef();

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const data = useMemo(() => {
    const kind = node?.kind;

    if (kind === "action") {
      return node?.data?.config ?? {};
    } else if (kind === "expression") {
      return node?.data ?? {};
    } else {
      return {};
    }
  }, [node]);

  const parameters = useMemo(() => {
    const kind = node?.kind;
    const type = node?.type;

    if (kind === "action" && type) {
      return Object.entries(ACTION_SCHEMA[type]?.parameters || {}).filter(([key, value]) => !!value);
    } else if (kind === "expression" && type) {
      return Object.entries(EXPRESSION_SCHEMA[type]?.parameters || {}).filter(([key, value]) => !!value);
    } else {
      return [];
    }
  }, [node?.kind, node?.type]);

  function onClick(e) {
    e.stopPropagation();
  }

  function onClickDelete(e) {
    e.stopPropagation();

    setIsDialogVisible(true);
  }

  function onClickDeleteCancel(e) {
    e.stopPropagation();

    setIsDialogVisible(false);
  }

  function onClickDeleteOK(e) {
    e.stopPropagation();

    setIsDialogVisible(false);

    deleteNode(node.id);
  }

  function onClickDisconnect(e) {
    e.stopPropagation();

    disconnectNode(node.id);
  }

  const updateParameterValue = useCallback(
    (key, value, optionalKey = null, optionalValue = null) => {
      let updatedNode;

      if (node.kind === "action") {
        updatedNode = {
          ...node,
          data: {
            ...node.data,
            config: {
              ...node.data.config,
              [key]: value,
            },
          },
        };

        if (optionalKey && optionalValue) {
          updatedNode.data.config[optionalKey] = optionalValue;
        }
      } else if (node.kind === "expression") {
        updatedNode = {
          ...node,
          data: {
            ...node.data,
            [key]: value,
          },
        };

        if (optionalKey && optionalValue) {
          updatedNode.data[optionalKey] = optionalValue;
        }
      } else {
        return;
      }

      updateNode(updatedNode);
    },
    [node, updateNode],
  );

  function renderControlsForParameter(key, parameter) {
    return (
      <>
        <DarkLabel text={parameter.label} />
        {node.type !== "literal" && !parameter.isExpressionAllowed && parameter.type === "boolean" && <DarkSwitch checked={!!data[key]} id={key} onChange={(e) => updateParameterValue(key, e.target.checked)} />}
        {node.type !== "literal" && !parameter.isExpressionAllowed && (parameter.type === "number" || (Array.isArray(parameter.type) && parameter.type.includes("number"))) && (
          <DarkInput
            id={key}
            onChange={(e) => {
              let value = e.target.value;

              if (typeof value === "string") {
                value = value.trim();
              }

              let number = 0;

              try {
                number = Number.parseFloat(value);

                if (!Number.isFinite(number)) {
                  number = 0;
                }
              } catch {
                number = 0;
              }

              updateParameterValue(key, number);
            }}
            type="number"
            value={data[key] ?? ""}
          />
        )}
        {node.type !== "literal" && !parameter.isExpressionAllowed && (parameter.type === "string" || (Array.isArray(parameter.type) && parameter.type.includes("string"))) && <DarkInput id={key} onChange={(e) => updateParameterValue(key, e.target.value)} value={data[key] ?? ""} />}
        {node.type !== "literal" && !parameter.isExpressionAllowed && parameter.type === "enum<string>" && <DarkSelect onChange={(e) => updateParameterValue(key, e.target.value)} options={parameter.options.map((currentOption) => ({ label: currentOption.label, value: currentOption.value }))} value={data[key] ?? ""} />}
        {node.type !== "literal" && parameter.isExpressionAllowed && !isVariadicParameter(parameter) && <span className={styles.information}>This parameter requires a node to be configured.</span>}
        {node.type !== "literal" && parameter.isExpressionAllowed && isVariadicParameter(parameter) && <ObjectNodeEditor dataKey={key} isArray={isVariadicParameterArray(parameter)} node={node} updateNode={updateNode} />}
        {node.type === "literal" && <LiteralNodeEditor dataKey={key} initialValue={data[key] ?? ""} updateParameterValue={updateParameterValue} />}
        {node.type === "path" && key === "value" && <VariableGraphPicker dataScope={dataScope} onChange={updateParameterValue} type="path" value={data.value} />}
        {node.type === "prop" && key === "prop" && <VariableGraphPicker componentId={data.componentId} dataScope={dataScope} onChange={updateParameterValue} prop={data.prop} type="prop" />}
      </>
    );
  }

  if (!node) {
    return null;
  }

  return (
    <div className={styles.node_editor} onClick={onClick}>
      <h4 className={styles.title}>{node.label}</h4>
      <div className={styles.parameters}>
        {node.kind === "action" && (
          <>
            <DarkLabel text="Conditions" />
            <ObjectNodeEditor dataKey={"conditions"} isConditions={true} node={node} updateNode={updateNode} />
          </>
        )}
        {parameters.map(([key, parameter]) => (
          <div className={styles.parameter} key={key}>
            {renderControlsForParameter(key, parameter)}
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <DarkButton onClick={onClickDisconnect} type="button">
          <Icon icon={faLinkSlash} size={16} /> Disconnect
        </DarkButton>
        <DarkButton onClick={onClickDelete} theme="danger" type="button">
          <Icon icon={faTrash} size={16} /> Delete
        </DarkButton>
        {isDialogVisible && (
          <DarkDialog dialogRef={dialogRef} minWidth="300px">
            {{
              slots: {
                header: [<Heading color="#e5e7eb" key="1" level="5" text="Delete Node" />],
                body: [<Text key="1" text="Are you sure you want to delete the node?" />],
                footer: [
                  <DarkButton key="1" onClick={onClickDeleteCancel} type="button">
                    <Icon icon={faCancel} size={16} /> Cancel
                  </DarkButton>,
                  <DarkButton key="2" onClick={onClickDeleteOK} theme="danger" type="button">
                    <Icon icon={faTrash} size={16} /> Delete
                  </DarkButton>,
                ],
              },
            }}
          </DarkDialog>
        )}
      </div>
    </div>
  );
}

const TYPES = [
  { label: "Array", value: "array" },
  { label: "Boolean", value: "boolean" },
  { label: "Number", value: "number" },
  { label: "Object", value: "object" },
  { label: "String", value: "string" },
];

function LiteralNodeEditor(props) {
  const dataKey = props.dataKey;
  const initialValue = props.initialValue;
  const updateParameterValue = props.updateParameterValue;

  const [array, setArray] = useState(getInitialArray(initialValue));
  const [object, setObject] = useState(getInitialObject(initialValue));
  const [type, setType] = useState(getInitialType(initialValue));
  const [value, setValue] = useState(getInitialValue(initialValue));

  function onChangeArray(e) {
    const newValue = e.target.value;

    setValue(newValue);

    try {
      const newArray = JSON.parse(newValue.trim());

      if (Array.isArray(newArray)) {
        setArray(newArray);

        updateParameterValue(dataKey, newArray);
      } else {
        setArray(null);

        updateParameterValue(dataKey, null);
      }
    } catch {
      setArray(null);

      updateParameterValue(dataKey, null);
    }
  }

  function onChangeBoolean(e) {
    const newValue = e.target.checked;

    setValue(newValue);

    if (typeof newValue === "boolean") {
      updateParameterValue(dataKey, newValue);
    }
  }

  function onChangeNumber(e) {
    const newValue = e.target.value;

    setValue(newValue);

    if (typeof newValue === "number") {
      updateParameterValue(dataKey, newValue);
    } else if (typeof newValue === "string") {
      try {
        let parsedNumber = Number.parseFloat(newValue);

        if (!Number.isFinite(parsedNumber)) {
          parsedNumber = 0;
        }

        updateParameterValue(dataKey, parsedNumber);
      } catch {
        updateParameterValue(dataKey, null);
      }
    } else {
      updateParameterValue(dataKey, null);
    }
  }

  function onChangeObject(e) {
    const newValue = e.target.value;

    setValue(newValue);

    try {
      const newObject = JSON.parse(newValue.trim());

      if (newObject && typeof newObject === "object") {
        setObject(newObject);

        updateParameterValue(dataKey, newObject);
      } else {
        setObject(null);

        updateParameterValue(dataKey, null);
      }
    } catch {
      setObject(null);

      updateParameterValue(dataKey, null);
    }
  }

  function onChangeString(e) {
    const newValue = e.target.value;

    setValue(newValue);

    if (typeof newValue === "string") {
      updateParameterValue(dataKey, newValue);
    } else {
      updateParameterValue(dataKey, null);
    }
  }

  function onChangeType(e) {
    const newType = e.target.value;

    setType(newType);

    switch (newType) {
      case "array":
        setValue("[]");

        setArray([]);

        updateParameterValue(dataKey, []);

        break;
      case "boolean":
        setValue(false);

        updateParameterValue(dataKey, false);

        break;
      case "number":
        setValue(0);

        updateParameterValue(dataKey, 0);

        break;
      case "object":
        setValue("{}");

        setObject({});

        updateParameterValue(dataKey, {});

        break;
      case "string":
        setValue("");

        updateParameterValue(dataKey, "");

        break;
      default:
        break;
    }
  }

  useEffect(() => {
    setArray(getInitialArray(initialValue));
    setObject(getInitialObject(initialValue));
    setType(getInitialType(initialValue));
    setValue(getInitialValue(initialValue));
  }, [initialValue]);

  return (
    <>
      <DarkSelect onChange={onChangeType} options={TYPES.map((currentType) => ({ label: currentType.label, value: currentType.value }))} value={type} />
      {type === "array" && <DarkTextArea color={Array.isArray(array) ? "#22c55e" : "#ef4444"} onChange={onChangeArray} rows={5} value={value} />}
      {type === "boolean" && <DarkSwitch checked={!!value} id={dataKey} onChange={onChangeBoolean} />}
      {type === "number" && <DarkInput onChange={onChangeNumber} type="number" value={value} />}
      {type === "object" && <DarkTextArea color={object && typeof object === "object" ? "#22c55e" : "#ef4444"} onChange={onChangeObject} rows={5} value={value} />}
      {type === "string" && <DarkTextArea onChange={onChangeString} rows={5} value={value} />}
    </>
  );
}

function getInitialArray(value) {
  if (Array.isArray(value)) {
    return value;
  } else {
    return null;
  }
}

function getInitialObject(value) {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value;
  } else {
    return null;
  }
}

function getInitialType(value) {
  if (Array.isArray(value)) {
    return "array";
  } else if (typeof value === "boolean") {
    return "boolean";
  } else if (typeof value === "number") {
    return "number";
  } else if (typeof value === "string") {
    return "string";
  } else if (value && typeof value === "object") {
    return "object";
  } else {
    return "string";
  }
}

function getInitialValue(value) {
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  } else if (typeof value === "boolean") {
    return value;
  } else if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    return value;
  } else if (value !== null && typeof value === "object") {
    return JSON.stringify(value);
  } else {
    return "";
  }
}

function ObjectNodeEditor(props) {
  const dataKey = props.dataKey;
  const isArray = props.isArray;
  const isConditions = props.isConditions;
  const node = props.node;
  const styles = props.styles || importedStyles;
  const updateNode = props.updateNode;

  const [value, setValue] = useState("");

  const fields = useMemo(() => {
    return node.data.dynamicPorts?.[dataKey] || [];
  }, [dataKey, node.data.dynamicPorts]);

  function addValue() {
    const updatedNode = addDynamicPort(node, dataKey, createDynamicPort(isArray ? generateId("item") : isConditions ? generateId("condition") : value));

    const rebuiltNode = {
      ...updatedNode,
      ports: {
        ...updatedNode.ports,
        inputs: [],
      },
    };

    const schema = updatedNode.kind === "action" ? ACTION_SCHEMA[updatedNode.type] : EXPRESSION_SCHEMA[updatedNode.type];

    if (updatedNode.kind === "action") {
      const ports = updatedNode.data.dynamicPorts?.["conditions"] || [];

      ports.forEach((portInfo) => {
        rebuiltNode.ports.inputs.push({
          id: `conditions["${portInfo.id}"]`,
          key: "conditions",
          label: "Condition " + (portInfo.label || portInfo.id),
          side: "right",
          kind: "input",
          dataType: "boolean",
          variadic: true,
          subKey: portInfo.id,
          isConnectable: true,
          schema: schema.condition,
        });
      });
    }

    Object.entries(schema.parameters || {}).forEach(([key, parameter]) => {
      const variadic = typeof parameter?.type === "string" && (parameter.type.startsWith("array") || parameter.type === "object");

      if (variadic) {
        const ports = updatedNode.data.dynamicPorts?.[key] || [];

        ports.forEach((portInfo) => {
          rebuiltNode.ports.inputs.push({
            id: `${key}["${portInfo.id}"]`,
            key,
            label: parameter.label + " " + (portInfo.label || portInfo.id),
            side: "right",
            kind: "input",
            dataType: parameter.type,
            variadic: true,
            subKey: portInfo.id,
            isConnectable: parameter.isExpressionAllowed,
            schema: parameter,
          });
        });
      } else {
        rebuiltNode.ports.inputs.push({
          id: key,
          key,
          label: parameter.label,
          side: "right",
          kind: "input",
          dataType: parameter.type,
          variadic: false,
          isConnectable: parameter.isExpressionAllowed,
          schema: parameter,
        });
      }
    });

    updateNode(rebuiltNode);

    setValue("");
  }

  function deleteByKey(portId) {
    const updatedNode = removeDynamicPort(node, dataKey, portId);

    const rebuiltNode = {
      ...updatedNode,
      ports: {
        ...updatedNode.ports,
        inputs: [],
      },
    };

    const schema = updatedNode.kind === "action" ? ACTION_SCHEMA[updatedNode.type] : EXPRESSION_SCHEMA[updatedNode.type];

    if (updatedNode.kind === "action") {
      const ports = updatedNode.data.dynamicPorts?.["conditions"] || [];

      ports.forEach((portInfo) => {
        rebuiltNode.ports.inputs.push({
          id: `conditions["${portInfo.id}"]`,
          key: "conditions",
          label: "Condition " + (portInfo.label || portInfo.id),
          side: "right",
          kind: "input",
          dataType: "boolean",
          variadic: true,
          subKey: portInfo.id,
          isConnectable: true,
          schema: schema.condition,
        });
      });
    }

    Object.entries(schema.parameters || {}).forEach(([key, parameter]) => {
      const variadic = typeof parameter?.type === "string" && (parameter.type.startsWith("array") || parameter.type === "object");

      if (variadic) {
        const ports = updatedNode.data.dynamicPorts?.[key] || [];

        ports.forEach((portInfo) => {
          rebuiltNode.ports.inputs.push({
            id: `${key}["${portInfo.id}"]`,
            key,
            label: parameter.label + " " + (portInfo.label || portInfo.id),
            side: "right",
            kind: "input",
            dataType: parameter.type,
            variadic: true,
            subKey: portInfo.id,
            isConnectable: parameter.isExpressionAllowed,
            schema: parameter,
          });
        });
      } else {
        rebuiltNode.ports.inputs.push({
          id: key,
          key,
          label: parameter.label,
          side: "right",
          kind: "input",
          dataType: parameter.type,
          variadic: false,
          isConnectable: parameter.isExpressionAllowed,
          schema: parameter,
        });
      }
    });

    updateNode(rebuiltNode);
  }

  return (
    <>
      {fields.length > 0 && (
        <div className={styles.object_node_editor_fields}>
          {fields.map((field, fieldIndex) => (
            <div className={styles.object_node_editor_field} key={field.id}>
              {isArray ? "Item " + (fieldIndex + 1) : isConditions ? "Condition " + (fieldIndex + 1) : field.label || field.id}
              <DarkButton minWidth="50px" onClick={(e) => deleteByKey(field.id)} theme="danger">
                <Icon icon={faTrash} size={16} />
              </DarkButton>
            </div>
          ))}
        </div>
      )}
      <div className={styles.object_node_editor_actions + (isArray ? " " + styles.object_node_editor_actions_array : "") + (isConditions ? " " + styles.object_node_editor_actions_conditions : "")}>
        {!isArray && !isConditions && <DarkInput onChange={(e) => setValue(e.target.value)} value={value} />}
        <DarkButton disabled={!isArray && !isConditions && value.trim() === ""} minWidth="50px" onClick={(e) => addValue()}>
          <Icon icon={faAdd} size={16} />
        </DarkButton>
      </div>
    </>
  );
}
