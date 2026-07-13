// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useState } from "react";

import Button from "@/lib/web-page-builder/components/button/Button";
import FieldValueEditor from "./FieldValueEditor";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";

import importedStyles from "./ModelDataEditor.module.css";

export default function ModelDataEditor(props) {
  const setWebsiteModelData = props.setWebsiteModelData;
  const styles = props.styles || importedStyles;
  const websiteModel = props.websiteModel;
  const websiteModelData = props.websiteModelData;

  const isCreating = !websiteModelData;

  const [data, setData] = useState(websiteModelData?.data || {});
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");

  async function onSubmit(e) {
    try {
      e.preventDefault();

      const url = isCreating ? "/api/website-model-data" : "/api/website-model-data/" + websiteModelData._id.toString();

      const config = {
        data,
      };

      if (isCreating) {
        config.websiteModelId = websiteModel?._id?.toString();
      }

      const response = isCreating ? await axios.post(url, config) : await axios.put(url, config);

      if (response.data.websiteModelData) {
        if (setWebsiteModelData) {
          setWebsiteModelData(response.data.websiteModelData);
        } else if (!websiteModelData) {
          setData({});
        }
      }

      setMessage(response.data.message || "");
      setMessageStatus("success");
    } catch (error) {
      setMessage(error?.response?.data?.message || "");
      setMessageStatus("failure");
    }
  }

  function updateField(key, value) {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));

    setMessage("");
    setMessageStatus("");
  }

  return (
    <form className={styles.model_data_editor} onSubmit={onSubmit}>
      <Heading level="2" text={websiteModel?.name} />
      {Object.entries(websiteModel?.fields || {}).map(([key, field]) => (
        <FieldValueEditor field={field} key={key} name={key} onChange={(val) => updateField(key, val)} value={data?.[key]} />
      ))}
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
        <Button theme="primary">Save</Button>
      </div>
    </form>
  );
}
