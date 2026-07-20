// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import ActionEditorDialog from "./ActionEditorDialog";
import BindingWrapper from "./BindingWrapper";
import ColorPicker from "./ColorPicker";
import { DarkButton } from "../button/Button";
import { DarkInput } from "../input/Input";
import { DarkLabel } from "../label/Label";
import { DarkSelect } from "../select/Select";
import { DarkSwitch } from "../switch/Switch";
import { DarkTextArea } from "../text-area/TextArea";
import ItemsEditor from "./ItemsEditor";
import Segmented from "./Segmented";
import SelectorsEditor from "./SelectorsEditor";
import SizeProperty from "./SizeProperty";
import UnitInput from "./UnitInput";
import { generateId } from "../../page/identity/generateId";
import { useLanguage } from "@/context/language";
import { useWebPageBuilderActions, useWebPageBuilderData } from "../../context/useWebPageBuilder";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };
import platformData from "@/definitions/platform-data.json" with { type: "json" };

import importedStyles from "./PropertyRenderer.module.css";

const FIXED_VALUE_MAP = {
  "text-align": ["left", "center", "right", "justify"],
  "flex-direction": ["row", "column"],
  "flex-wrap": ["nowrap", "wrap"],
  position: ["static", "relative", "absolute", "fixed", "sticky"],
  "object-fit": ["contain", "cover", "fill", "none"],
  cursor: ["auto", "pointer", "default", "move", "not-allowed"],
  "font-style": ["normal", "italic", "oblique"],
};

const SIZE_PROPERTIES = ["width", "height", "min-width", "min-height", "max-width", "max-height"];

const TEXT_AREAS = ["background", "box-shadow", "text-shadow", "transform", "transition", "mask", "backdrop-filter", "grid-template-columns"];

const UNIT_INPUTS = ["gap", "margin", "padding", "border-radius", "border-width", "font-size", "letter-spacing", "line-height", "flex-grow", "flex-shrink", "top", "left", "inset"];

export default function PropertyRenderer(props) {
  const canUseAction = props.canUseAction;
  const canUseExpression = props.canUseExpression;
  const component = props.component;
  const dataScope = props.dataScope;
  const getValue = props.getValue;
  const isPlatformAdmin = props.isPlatformAdmin;
  const plan = props.plan;
  const property = props.property;
  const propertyKey = props.propertyKey;
  const styles = props.styles || importedStyles;
  const view = props.view;
  const viewPrevious = props.viewPrevious;

  const { language } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(getValue(propertyKey));

  const { updateComponent } = useWebPageBuilderActions();

  const { models } = useWebPageBuilderData();

  const computedModels = useMemo(
    () =>
      Object.keys(models || {}).map((name) => ({
        label: name,
        value: name,
      })),
    [models],
  );

  const safeAction = useMemo(() => (value && typeof value === "object" && !Array.isArray(value) ? value : { id: generateId("action"), type: "", config: {}, conditions: [], runAfter: [] }), [value]);

  const componentId = component.id;
  const componentType = component.type;

  useEffect(() => {
    setValue(getValue(propertyKey));
  }, [getValue, propertyKey, setValue]);

  const onChangeAction = useCallback(
    (next) => {
      updateComponent(componentId, {
        props: { [propertyKey]: next },
      });
    },
    [componentId, propertyKey, updateComponent],
  );

  if (!property?.type) {
    return null;
  }

  const css = property.cssProperty;

  function onChangeBindingWrapper(next) {
    if (view) {
      const old = component?.props?.[propertyKey];

      const isOldObject = old && typeof old === "object" && !Array.isArray(old);

      let oldDesktop = isOldObject ? old.desktop : old;
      let oldMobile = isOldObject ? old.mobile : old;
      let oldTablet = isOldObject ? old.tablet : old;

      const undefinedCount = (oldDesktop === undefined ? 1 : 0) + (oldMobile === undefined ? 1 : 0) + (oldTablet === undefined ? 1 : 0);

      const defined = undefinedCount >= 2 ? (oldDesktop !== undefined ? oldDesktop : oldMobile !== undefined ? oldMobile : oldTablet !== undefined ? oldTablet : null) : null;
      const definedView = undefinedCount >= 2 ? (oldDesktop !== undefined ? "desktop" : oldMobile !== undefined ? "mobile" : oldTablet !== undefined ? "tablet" : null) : null;

      if (isOldObject) {
        if (oldDesktop === undefined) {
          if (oldMobile !== undefined) {
            oldDesktop = oldMobile;
          } else if (oldTablet !== undefined) {
            oldDesktop = oldTablet;
          }
        }

        if (oldMobile === undefined) {
          if (oldTablet !== undefined) {
            oldMobile = oldTablet;
          } else if (oldDesktop !== undefined) {
            oldMobile = oldDesktop;
          }
        }

        if (oldTablet === undefined) {
          if (oldMobile !== undefined) {
            oldTablet = oldMobile;
          } else if (oldDesktop !== undefined) {
            oldTablet = oldDesktop;
          }
        }
      }

      if (view === "all" || (undefinedCount >= 2 && defined && definedView === view)) {
        updateComponent(componentId, { props: { [propertyKey]: next } });
      } else {
        updateComponent(componentId, { props: { [propertyKey]: { desktop: oldDesktop, mobile: oldMobile, tablet: oldTablet, [view]: next } } });
      }
    } else {
      updateComponent(componentId, { props: { [propertyKey]: next } });
    }
  }

  function onClose(e) {
    setIsOpen(false);
  }

  function renderByCssProperty(value, onChange) {
    if (FIXED_VALUE_MAP[css]) {
      return <Segmented cssProperty={css} onChange={onChange} options={FIXED_VALUE_MAP[css]} value={value} />;
    }

    if (css?.startsWith("align-") || css?.startsWith("justify-")) {
      return property.options ? <Segmented cssProperty={css} onChange={onChange} options={property.options.map((o) => o.value)} value={value} /> : null;
    }

    if (UNIT_INPUTS.includes(css)) {
      return <UnitInput cssProperty={css} onChange={onChange} value={value} />;
    }

    if (SIZE_PROPERTIES.includes(css)) {
      return <SizeProperty update={onChange} value={value} />;
    }

    if (TEXT_AREAS.includes(css)) {
      return <BufferedDarkTextArea onChange={onChange} rows={3} value={value} />;
    }

    return null;
  }

  function renderControl(currentValue, onChange) {
    if (property.type === "color") {
      return <ColorPicker componentId={componentId} onChange={onChange} value={currentValue || ""} />;
    }

    if (property.type === "switch") {
      return <DarkSwitch checked={!!currentValue} id={componentId + "-" + propertyKey} onChange={(e) => onChange(e.target.checked)} />;
    }

    if (property.type === "items") {
      return <ItemsEditor canUseExpression={canUseExpression} componentId={componentId} componentType={componentType} dataScope={dataScope} isPlatformAdmin={isPlatformAdmin} items={currentValue || []} onChange={onChange} plan={plan} schema={property.schema} />;
    }

    if (property.type === "selectors") {
      return <SelectorsEditor onChange={onChange} value={currentValue || []} />;
    }

    const smart = renderByCssProperty(currentValue, onChange);

    if (smart) {
      return smart;
    }

    if (property.type === "select") {
      return (
        <DarkSelect
          onChange={(e) => onChange(e.target.value)}
          options={[
            ...property.options?.map((opt) => {
              return { label: opt.label, value: opt.value };
            }),
          ]}
          value={currentValue || ""}
        />
      );
    }

    if (property.type === "textarea") {
      return <BufferedDarkTextArea onChange={onChange} rows={10} value={currentValue || ""} />;
    }

    if (property.type === "number") {
      return <DarkInput isDebounceDisabled={true} onChange={(e) => onChange(e.target.value)} type="number" value={currentValue || ""} />;
    }

    return <DarkInput isDebounceDisabled={true} onChange={(e) => onChange(e.target.value)} value={currentValue || ""} />;
  }

  if (property.type === "action") {
    if (canUseAction) {
      return (
        <div className={styles.field}>
          <DarkLabel text={platformData.component.props[propertyKey]?.[language] ?? property.label} />
          <DarkButton onClick={(e) => setIsOpen(true)}>{platform.websiteAdmin.pages.editor.configureAction[language]}</DarkButton>
          <ActionEditorDialog action={safeAction} componentType={componentType} dataScope={dataScope} isOpen={isOpen} isPlatformAdmin={isPlatformAdmin} models={computedModels} onChange={onChangeAction} onClose={onClose} plan={plan} />
        </div>
      );
    } else {
      return null;
    }
  }

  return (
    <div className={styles.field}>
      <DarkLabel text={platformData.component.props[propertyKey]?.[language] ?? property.label} />
      <BindingWrapper canUseExpression={canUseExpression} componentType={componentType} dataScope={dataScope} id={componentId + "-" + propertyKey} isPlatformAdmin={isPlatformAdmin} onChange={onChangeBindingWrapper} plan={plan} propertyType={property.type} value={value}>
        {({ value: innerValue, onChange: innerChange }) => renderControl(innerValue, innerChange)}
      </BindingWrapper>
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
