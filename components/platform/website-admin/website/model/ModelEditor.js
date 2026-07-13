// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useState } from "react";

import Button from "@/lib/web-page-builder/components/button/Button";
import FieldEditor from "./FieldEditor";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Input from "@/lib/web-page-builder/components/input/Input";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { equals } from "@/lib/web-page-builder/transform/core/equals";
import { useWebsite } from "@/context/website";

import importedStyles from "./ModelEditor.module.css";

export default function ModelEditor(props) {
  const setWebsiteModel = props.setWebsiteModel;
  const styles = props.styles || importedStyles;
  const websiteModel = props.websiteModel;

  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [model, setModel] = useState({ name: websiteModel?.name || "", fields: websiteModel?.fields || [] });
  const [newFieldName, setNewFieldName] = useState("");

  const { website } = useWebsite();

  const isCreating = websiteModel === null || websiteModel === undefined;

  const hasChanged = !isCreating && (!equals(model?.name, websiteModel?.name) || !equals(model?.fields, websiteModel?.fields));

  function addField() {
    updateField("fields", {
      ...(model.fields || {}),
      [newFieldName]: { type: "string" },
    });

    setNewFieldName("");

    setMessage("");
    setMessageStatus("");
  }

  async function onSubmit(e) {
    try {
      e.preventDefault();

      const url = isCreating ? "/api/website-model" : "/api/website-model/" + websiteModel._id.toString();

      const config = {
        fields: model?.fields,
        name: model?.name,
      };

      if (isCreating) {
        config.websiteId = website?._id?.toString();
      }

      const { data } = isCreating ? await axios.post(url, config) : await axios.put(url, config);

      if (data.websiteModel) {
        if (setWebsiteModel) {
          setWebsiteModel(data.websiteModel);
        } else if (!websiteModel) {
          setModel({ name: "", fields: {} });
        }
      }

      setMessage(data.message || "");
      setMessageStatus("success");
    } catch (error) {
      setMessage(error?.response?.data?.message || "");
      setMessageStatus("failure");
    }
  }

  function removeField(name) {
    const newModel = { ...model, fields: { ...(model.fields || {}) } };

    delete newModel.fields[name];

    setModel(newModel);

    setMessage("");
    setMessageStatus("");
  }

  function updateField(name, value) {
    setModel({
      ...model,
      [name]: value,
    });

    setMessage("");
    setMessageStatus("");
  }

  return (
    <form className={styles.model_editor} onSubmit={onSubmit}>
      <Heading color="#0f172a" level="2" text="Model" />
      <Input isDebounceDisabled={true} onChange={(e) => updateField("name", e.target.value)} placeholder="Name" value={model.name || ""} />
      <Heading color="#0f172a" level="4" text="Fields" />
      {Object.entries(model.fields || {}).map(([key, field]) => (
        <FieldEditor
          field={field}
          key={key}
          name={key}
          onChange={(updated) => {
            updateField("fields", {
              ...model.fields,
              [key]: updated,
            });
          }}
          removeField={removeField}
        />
      ))}
      <div className={styles.add_field}>
        <Input isDebounceDisabled={true} onChange={(e) => setNewFieldName(e.target.value)} placeholder="FieldName" value={newFieldName} />
        <Button disabled={newFieldName.trim() === ""} onClick={addField} type="button">
          Add Field
        </Button>
      </div>
      <div className={styles.actions}>
        {message && messageStatus === "failure" && (
          <Section backgroundColor="rgba(239, 68, 68, 0.08)" borderColor="rgba(239, 68, 68, 0.3)" borderRadius="14px" borderWidth="1px" padding="1rem">
            <Text color="#b91c1c" element="p" text={message} />
          </Section>
        )}
        {message && messageStatus === "success" && (
          <Section backgroundColor="rgba(34, 197, 94, 0.08)" borderColor="rgba(34, 197, 94, 0.3)" borderRadius="14px" borderWidth="1px" padding="1rem">
            <Text color="#166534" element="p" text={message} />
          </Section>
        )}
        <Button disabled={model?.name?.trim() === "" || Object.keys(model?.fields || {}).length === 0 || (!isCreating && !hasChanged)} theme="primary">
          Save
        </Button>
      </div>
    </form>
  );
}
