// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useState } from "react";
import { faAdd, faTrash } from "@fortawesome/pro-solid-svg-icons";

import { DarkButton } from "../button/Button";
import { DarkInput } from "../input/Input";
import { DarkSelect } from "../select/Select";
import Icon from "./Icon";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function SelectorsEditor(props) {
  const onChange = props.onChange;
  const value = props.value || [];

  const { language } = useLanguage();

  const [rules, setRules] = useState(value);

  function addRule() {
    update([
      ...rules,
      {
        selector: "&:hover",
        styles: {},
        media: "",
      },
    ]);
  }

  function removeRule(index) {
    update(rules.filter((_, i) => i !== index));
  }

  function update(next) {
    setRules(next);

    onChange(next);
  }

  function updateRule(index, nextRule) {
    const next = [...rules];

    next[index] = nextRule;

    update(next);
  }

  useEffect(() => {
    setRules(value || []);
  }, [value]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {rules.map((rule, index) => (
        <RuleEditor key={index} language={language} onChange={(next) => updateRule(index, next)} onRemove={() => removeRule(index)} rule={rule} />
      ))}
      <DarkButton onClick={addRule} type="button">
        <Icon icon={faAdd} size={16} /> {platform.websiteAdmin.pages.editor.selectors.addSelector[language]}
      </DarkButton>
    </div>
  );
}

function RuleEditor(props) {
  const language = props.language;
  const onChange = props.onChange;
  const onRemove = props.onRemove;
  const rule = props.rule;

  function addStyle() {
    updateStyle("color", "#000000");
  }

  function removeStyle(key) {
    const next = { ...rule.styles };

    delete next[key];

    onChange({
      ...rule,
      styles: next,
    });
  }

  function updateField(key, value) {
    onChange({
      ...rule,
      [key]: value,
    });
  }

  function updateStyle(key, value) {
    onChange({
      ...rule,
      styles: {
        ...rule.styles,
        [key]: value,
      },
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "0px" }}>
      <DarkInput isDebounceDisabled={true} onChange={(e) => updateField("selector", e.target.value)} placeholder={platform.websiteAdmin.pages.editor.selectors.placeholder[language]} value={rule.selector || ""} />
      <DarkSelect
        onChange={(e) => updateField("media", e.target.value)}
        options={[
          { label: platform.websiteAdmin.pages.editor.selectors.noMedia[language], value: "" },
          { label: platform.websiteAdmin.pages.editor.selectors.mobile[language], value: "mobile" },
          { label: platform.websiteAdmin.pages.editor.selectors.tablet[language], value: "tablet" },
          { label: platform.websiteAdmin.pages.editor.selectors.desktop[language], value: "desktop" },
        ]}
        value={rule.media || ""}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {Object.entries(rule.styles || {}).map(([key, value]) => (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <BufferedDarkInput
              onChange={(newKey) => {
                const next = { ...rule.styles };

                delete next[key];

                next[newKey] = value;

                updateField("styles", next);
              }}
              value={key}
            />
            <DarkInput isDebounceDisabled={true} onChange={(e) => updateStyle(key, e.target.value)} value={value} />
            <DarkButton onClick={() => removeStyle(key)} type="button">
              <Icon icon={faTrash} size={16} />
            </DarkButton>
          </div>
        ))}
      </div>
      <DarkButton onClick={addStyle} type="button">
        <Icon icon={faAdd} size={16} /> {platform.websiteAdmin.pages.editor.selectors.addStyle[language]}
      </DarkButton>
      <DarkButton onClick={onRemove} type="button">
        <Icon icon={faTrash} size={16} /> {platform.websiteAdmin.pages.editor.selectors.removeRule[language]}
      </DarkButton>
    </div>
  );
}

function BufferedDarkInput({ onChange, value, ...rest }) {
  const [localValue, setLocalValue] = useState(value || "");

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  return (
    <DarkInput
      isDebounceDisabled={true}
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
