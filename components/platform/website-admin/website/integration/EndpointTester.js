// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useState } from "react";
import { faAdd, faBolt, faTrash } from "@fortawesome/pro-solid-svg-icons";

import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Icon from "@/lib/web-page-builder/components/editor/Icon";
import Input from "@/lib/web-page-builder/components/input/Input";
import Label from "@/lib/web-page-builder/components/label/Label";
import Section from "@/lib/web-page-builder/components/section/Section";
import Switch from "@/lib/web-page-builder/components/switch/Switch";
import { useLanguage } from "@/context/language";
import { useViewport } from "@/hooks/useViewport";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function EndpointTester(props) {
  const endpoint = props.endpoint;
  const integration = props.integration;

  const { language } = useLanguage();

  const [body, setBody] = useState({});
  const [headers, setHeaders] = useState({});
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({});
  const [response, setResponse] = useState(null);

  const { isMobile } = useViewport();

  async function run() {
    setLoading(true);

    try {
      const url = buildUrl(integration.baseUrl, endpoint.path, query);

      const res = await fetch(url, {
        method: endpoint.method,
        headers: {
          ...buildAuthHeaders(integration.auth),
          ...headers,
        },
        body: ["POST", "PUT", "PATCH"].includes(endpoint.method) ? JSON.stringify(body) : undefined,
      });

      const text = await res.text();

      let parsed;

      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }

      setResponse({
        status: res.status,
        data: parsed,
      });
    } catch (e) {
      setResponse({
        error: String(e),
      });
    }

    setLoading(false);
  }

  return (
    <Card borderRadius="8px" paddingBody="clamp(1rem, 3vw, 4rem)" width="100%">
      {{
        slots: {
          body: [
            <Section alignItems="flex-start" flexDirection="column" gap="1rem" key="root" padding="0px">
              <Heading level="4" text={platform.websiteAdmin.endpointTester.title[language]} />
              {endpoint.headers && <SchemaForm id="headers" label={platform.websiteAdmin.endpointTester.headers[language]} onChange={setHeaders} schema={endpoint.headers} value={headers} />}
              {endpoint.query && <SchemaForm id="query" label={platform.websiteAdmin.endpointTester.query[language]} onChange={setQuery} schema={endpoint.query} value={query} />}
              {["POST", "PUT", "PATCH"].includes(endpoint.method) && endpoint.body && <SchemaForm id="body" label={platform.websiteAdmin.endpointTester.body[language]} onChange={setBody} schema={endpoint.body} value={body} />}
              <RequestPreview body={body} endpoint={endpoint} headers={headers} integration={integration} query={query} />
              <Button onClick={run} theme="primary" type="button" width={isMobile ? "100%" : "auto"}>
                <Icon icon={faBolt} size={16} style={{ color: "inherit" }} /> {loading ? platform.websiteAdmin.endpointTester.running[language] : platform.websiteAdmin.endpointTester.run[language]}
              </Button>
              {response && <ResponseViewer response={response} />}
            </Section>,
          ],
        },
      }}
    </Card>
  );
}

function ArrayField(props) {
  const id = props.id;
  const onChange = props.onChange;
  const schema = props.schema;
  const value = props.value;

  const { language } = useLanguage();

  function addItem() {
    onChange([...(value || []), null]);
  }

  function removeItem(i) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function updateItem(i, v) {
    const copy = [...value];

    copy[i] = v;

    onChange(copy);
  }

  return (
    <Section flexDirection="column" gap="0.5rem" padding="0px">
      {value.map((v, i) => (
        <Section flexDirection="row" gap="0.5rem" key={i} padding="0px">
          <SchemaField id={id + "-" + i} onChange={(next) => updateItem(i, next)} schema={schema.items} value={v} />
          <Button onClick={() => removeItem(i)} type="button">
            <Icon icon={faTrash} size={16} style={{ color: "inherit" }} />
          </Button>
        </Section>
      ))}
      <Button onClick={addItem} type="button">
        <Icon icon={faAdd} size={16} style={{ color: "inherit" }} /> {platform.websiteAdmin.endpointTester.addItem[language]}
      </Button>
    </Section>
  );
}

function RequestPreview(props) {
  const body = props.body;
  const endpoint = props.endpoint;
  const headers = props.headers;
  const integration = props.integration;
  const query = props.query;

  const url = buildUrlPreview(integration.baseUrl, endpoint.path, query);

  const showBody = ["POST", "PUT", "PATCH"].includes(endpoint.method);

  const { language } = useLanguage();

  return (
    <pre
      style={{
        background: "#f6f8fa",
        border: "1px solid #d0d7de",
        borderRadius: "8px",
        color: "#24292f",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: "0.85rem",
        lineHeight: "1.45",
        overflow: "auto",
        padding: "0.75rem 1rem",
        width: "100%",
      }}
    >
      <div>
        <span style={{ color: "#0550ae", fontWeight: 600 }}>{endpoint.method}</span> <span style={{ color: "#57606a" }}>{url}</span>
      </div>
      {Object.keys(headers || {}).length > 0 && (
        <>
          {"\n\n"}
          <span style={{ fontWeight: 600 }}>{platform.websiteAdmin.endpointTester.headers[language]}:</span>
          {"\n"}
          {Object.entries(headers).map(([k, v]) => (
            <div key={k}>
              <span style={{ color: "#57606a" }}>{k}:</span> <span>{maskIfSensitive(k, v)}</span>
            </div>
          ))}
        </>
      )}
      {showBody && body && Object.keys(body).length > 0 && (
        <>
          {"\n\n"}
          <span style={{ fontWeight: 600 }}>{platform.websiteAdmin.endpointTester.body[language]}:</span>
          {"\n"}
          {JSON.stringify(body, null, 2)}
        </>
      )}
    </pre>
  );
}

function ResponseViewer(props) {
  const response = props.response;

  return (
    <pre
      style={{
        background: "#f6f8fa",
        border: "1px solid #d0d7de",
        borderRadius: "6px",
        color: "#24292f",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: "0.85rem",
        padding: "0.2em 0.4em",
        width: "100%",
      }}
    >
      {JSON.stringify(response, null, 2)}
    </pre>
  );
}

function SchemaField(props) {
  const id = props.id;
  const name = props.name;
  const onChange = props.onChange;
  const schema = props.schema;
  const value = props.value;

  if (!schema) {
    return null;
  }

  switch (schema.type) {
    case "object":
      return (
        <Section flexDirection="column" gap="0.5rem" padding="0px">
          <Label text={name} />
          {Object.entries(schema.fields || {}).map(([key, fieldSchema]) => (
            <SchemaField
              id={id + "-field-" + key.replace(/[^a-zA-Z0-9_-]/g, "_")}
              key={key}
              name={key}
              onChange={(v) =>
                onChange({
                  ...value,
                  [key]: v,
                })
              }
              schema={fieldSchema}
              value={value?.[key]}
            />
          ))}
        </Section>
      );
    case "array":
      return (
        <Section flexDirection="column" gap="0.5rem" padding="0px">
          <Label text={name} />
          <ArrayField id={id + "-array"} onChange={onChange} schema={schema} value={value || []} />
        </Section>
      );
    case "string":
      return (
        <Section flexDirection="column" gap="0.5rem" padding="0px">
          <Label text={name} />
          <Input isDebounceDisabled={true} onChange={(e) => onChange(e.target.value)} placeholder={name} value={value || ""} />
        </Section>
      );
    case "number":
      return (
        <Section flexDirection="column" gap="0.5rem" padding="0px">
          <Label text={name} />
          <Input isDebounceDisabled={true} onChange={(e) => onChange(Number(e.target.value))} placeholder={name} type="number" value={value ?? ""} />
        </Section>
      );
    case "boolean":
      return (
        <Section flexDirection="column" gap="0.5rem" padding="0px">
          <Label text={name} />
          <Switch checked={!!value} id={id + "-switch"} onChange={(e) => onChange(e.target.checked)} />
        </Section>
      );
    default:
      return null;
  }
}

function SchemaForm(props) {
  const id = props.id;
  const label = props.label;
  const onChange = props.onChange;
  const schema = props.schema;
  const value = props.value;

  return (
    <Section borderColor="#e5e7eb" borderRadius="8px" borderWidth="1px" flexDirection="column" gap="1rem" padding="1rem">
      <strong>{label}</strong>
      <SchemaField id={id + "-field"} onChange={onChange} schema={schema} value={value} />
    </Section>
  );
}

function buildAuthHeaders(auth) {
  if (!auth) {
    return {};
  }

  switch (auth.type) {
    case "apiKey":
      return {
        [auth.apiKeyHeader || "x-api-key"]: auth.apiKey,
      };
    case "bearer":
      return {
        Authorization: `Bearer ${auth.bearerToken}`,
      };
    case "basic":
      return {
        Authorization: "Basic " + btoa(`${auth.basicUsername}:${auth.basicPassword}`),
      };
    default:
      return {};
  }
}

function buildUrl(base, path, query) {
  const url = new URL(path, base);

  Object.entries(query || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, v);
    }
  });

  return url.toString();
}

function buildUrlPreview(base, path, query) {
  let url = joinUrl(base, path);

  const queryString = Object.entries(query || {})
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  if (queryString) {
    url += (url.includes("?") ? "&" : "?") + queryString;
  }

  return url;
}

function joinUrl(base, path) {
  const cleanBase = (base || "").replace(/\/+$/, "");
  const cleanPath = (path || "").replace(/^\/+/, "");

  return cleanBase + "/" + cleanPath;
}

function maskIfSensitive(key, value) {
  const k = key.toLowerCase();

  if (k.includes("authorization") || k.includes("token") || k.includes("api") || k.includes("key")) {
    return "****";
  }

  return value;
}
