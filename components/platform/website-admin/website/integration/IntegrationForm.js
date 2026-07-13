// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useState } from "react";
import { faAdd, faCog, faEdit, faSave, faTrash } from "@fortawesome/pro-solid-svg-icons";

import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import EndpointTester from "./EndpointTester";
import Grid from "@/lib/web-page-builder/components/grid/Grid";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Icon from "@/lib/web-page-builder/components/editor/Icon";
import Input from "@/lib/web-page-builder/components/input/Input";
import JSONSchemaEditorDialog from "./JSONSchemaEditorDialog";
import Section from "@/lib/web-page-builder/components/section/Section";
import Select from "@/lib/web-page-builder/components/select/Select";
import Switch from "@/lib/web-page-builder/components/switch/Switch";
import Text from "@/lib/web-page-builder/components/text/Text";
import TextArea from "@/lib/web-page-builder/components/text-area/TextArea";
import { useLanguage } from "@/context/language";
import { useViewport } from "@/hooks/useViewport";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function IntegrationForm(props) {
  const canUpdate = props.canUpdate;
  const initialValue = props.initialValue;
  const message = props.message;
  const messageStatus = props.messageStatus;
  const onSubmit = props.onSubmit;

  const { language } = useLanguage();

  const [dialog, setDialog] = useState({
    field: null,
    index: null,
    isKeyValue: false,
    isOpen: false,
  });
  const [integration, setIntegration] = useState(
    initialValue || {
      name: "",
      description: "",
      baseUrl: "",
      auth: {
        type: "none",
        apiKey: "",
        apiKeyHeader: "",
        basicUsername: "",
        basicPassword: "",
        bearerToken: "",
      },
      defaultHeaders: {},
      endpoints: [],
    },
  );

  function addEndpoint() {
    setIntegration((prev) => ({
      ...prev,
      endpoints: [
        ...prev.endpoints,
        {
          key: "",
          method: "GET",
          path: "",
          headers: {},
          query: {},
          body: {},
          transform: null,
          cache: {
            enabled: false,
            ttl: 60,
          },
        },
      ],
    }));
  }

  function closeDialog() {
    setDialog({
      field: null,
      index: null,
      isKeyValue: false,
      isOpen: false,
    });
  }

  function openDialog(index, field) {
    setDialog({
      field,
      index,
      isKeyValue: field === "headers" || field === "query",
      isOpen: true,
    });
  }

  function removeEndpoint(index) {
    setIntegration((prev) => ({
      ...prev,
      endpoints: prev.endpoints.filter((_, i) => i !== index),
    }));
  }

  function update(path, value) {
    setIntegration((prev) => {
      const copy = structuredClone(prev);

      let obj = copy;

      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]];
      }

      obj[path[path.length - 1]] = value;

      return copy;
    });
  }

  function updateEndpoint(index, key, value) {
    setIntegration((prev) => {
      const endpoints = [...prev.endpoints];

      endpoints[index] = { ...endpoints[index], [key]: value };

      return { ...prev, endpoints };
    });
  }

  useEffect(() => {
    if (initialValue) {
      setIntegration(initialValue);
    }
  }, [initialValue]);

  return (
    <Section flexDirection="column" gap="2rem" padding="0px">
      <Card paddingBody="clamp(1rem, 3vw, 4rem)">
        {{
          slots: {
            header: [],
            body: [
              <Section flexDirection="column" gap="1rem" key="1" padding="0px">
                <Heading level="3" text={platform.websiteAdmin.integrationForm.generalInformationTitle[language]} />
                <Input isDebounceDisabled={true} onChange={(e) => update(["name"], e.target.value)} placeholder={platform.websiteAdmin.integrationForm.namePlaceholder[language]} readOnly={!canUpdate} value={integration.name} />
                <TextArea isDebounceDisabled={true} onChange={(e) => update(["description"], e.target.value)} placeholder={platform.websiteAdmin.integrationForm.descriptionPlaceholder[language]} readOnly={!canUpdate} value={integration.description} />
                <Input isDebounceDisabled={true} onChange={(e) => update(["baseUrl"], e.target.value)} placeholder={platform.websiteAdmin.integrationForm.baseUrlPlaceholder[language]} readOnly={!canUpdate} value={integration.baseUrl} />
              </Section>,
            ],
            footer: [],
          },
        }}
      </Card>
      <Card paddingBody="clamp(1rem, 3vw, 4rem)">
        {{
          slots: {
            header: [],
            body: [
              <Section flexDirection="column" gap="1rem" key="1" padding="0px">
                <Heading level="3" text={platform.websiteAdmin.integrationForm.authenticationTitle[language]} />
                <Select
                  disabled={!canUpdate}
                  onChange={(e) => update(["auth", "type"], e.target.value)}
                  options={[
                    { label: platform.websiteAdmin.integrationForm.none[language], value: "none" },
                    { label: platform.websiteAdmin.integrationForm.apiKey[language], value: "apiKey" },
                    { label: platform.websiteAdmin.integrationForm.basic[language], value: "basic" },
                    { label: platform.websiteAdmin.integrationForm.bearer[language], value: "bearer" },
                  ]}
                  value={integration.auth.type}
                />
                {integration.auth.type === "apiKey" && (
                  <>
                    <Input isDebounceDisabled={true} onChange={(e) => update(["auth", "apiKey"], e.target.value)} placeholder={platform.websiteAdmin.integrationForm.apiKeyPlaceholder[language]} readOnly={!canUpdate} value={integration.auth.apiKey} />
                    <Input isDebounceDisabled={true} onChange={(e) => update(["auth", "apiKeyHeader"], e.target.value)} placeholder={platform.websiteAdmin.integrationForm.apiKeyHeaderPlaceholder[language]} readOnly={!canUpdate} value={integration.auth.apiKeyHeader} />
                  </>
                )}
                {integration.auth.type === "basic" && (
                  <>
                    <Input isDebounceDisabled={true} onChange={(e) => update(["auth", "basicUsername"], e.target.value)} placeholder={platform.websiteAdmin.integrationForm.basicUsernamePlaceholder[language]} readOnly={!canUpdate} value={integration.auth.basicUsername} />
                    <Input isDebounceDisabled={true} onChange={(e) => update(["auth", "basicPassword"], e.target.value)} placeholder={platform.websiteAdmin.integrationForm.basicPasswordPlaceholder[language]} readOnly={!canUpdate} type="password" value={integration.auth.basicPassword} />
                  </>
                )}
                {integration.auth.type === "bearer" && <Input isDebounceDisabled={true} onChange={(e) => update(["auth", "bearerToken"], e.target.value)} placeholder={platform.websiteAdmin.integrationForm.bearerTokenPlaceholder[language]} readOnly={!canUpdate} value={integration.auth.bearerToken} />}
              </Section>,
            ],
            footer: [],
          },
        }}
      </Card>
      <Card paddingBody="clamp(1rem, 3vw, 4rem)">
        {{
          slots: {
            header: [],
            body: [
              <Section alignItems="flex-start" flexDirection="column" flexGrow="1" gap="1rem" key="1" padding="0px" width="100%">
                <Heading level="3" text={platform.websiteAdmin.integrationForm.endpointsTitle[language]} />
                {integration.endpoints.map((endpoint, i) => {
                  const showBody = ["POST", "PUT", "PATCH"].includes(endpoint.method);

                  return <Endpoint canUpdate={canUpdate} endpoint={endpoint} index={i} integration={integration} key={i} openDialog={openDialog} removeEndpoint={removeEndpoint} showBody={showBody} updateEndpoint={updateEndpoint} />;
                })}
                {canUpdate && (
                  <Button onClick={addEndpoint} type="button">
                    <Icon icon={faAdd} size={16} style={{ color: "inherit" }} /> {platform.websiteAdmin.integrationForm.addEndpoint[language]}
                  </Button>
                )}
              </Section>,
            ],
            footer: [],
          },
        }}
      </Card>
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
      {canUpdate && (
        <Section alignItems="flex-start" flexDirection="row" justifyContent="flex-start" padding="0px">
          <Button disabled={integration.name.trim() === "" || integration.baseUrl.trim() === ""} onClick={() => onSubmit?.(integration)} theme="primary" type="button">
            <Icon icon={faSave} size={16} style={{ color: "inherit" }} /> {initialValue ? platform.websiteAdmin.integrationForm.saveIntegration[language] : platform.websiteAdmin.integrationForm.createIntegration[language]}
          </Button>
        </Section>
      )}
      {dialog.isOpen && (
        <JSONSchemaEditorDialog
          canUpdate={canUpdate}
          isKeyValue={dialog.isKeyValue}
          onChange={(schema) => {
            updateEndpoint(dialog.index, dialog.field, schema);
          }}
          onClose={closeDialog}
          returnType="object"
          title={platform.websiteAdmin.integrationForm.edit[dialog.field][language]}
          value={
            integration.endpoints[dialog.index]?.[dialog.field] || {
              type: "object",
              fields: {},
            }
          }
        />
      )}
    </Section>
  );
}

function AdvancedSection(props) {
  const children = props.children;

  const { language } = useLanguage();

  const [open, setOpen] = useState(false);

  const { isMobile } = useViewport();

  return (
    <Section alignItems="flex-start" backgroundColor="#f8fafc" borderColor="#e5e7eb" borderRadius="8px" borderWidth="1px" flexDirection="column" padding="1rem">
      <Button minWidth="250px" onClick={() => setOpen(!open)} type="button" width={isMobile ? "100%" : "auto"}>
        <Icon icon={faCog} size={16} style={{ color: "inherit" }} /> {open ? platform.websiteAdmin.integrationForm.hideAdvanced[language] : platform.websiteAdmin.integrationForm.showAdvanced[language]}
      </Button>
      {open && (
        <Section backgroundColor="var(--pc-semantic-surface-base)" borderRadius="8px" borderColor="#e5e7eb" borderWidth="1px" flexDirection="column" gap="1rem" padding="1rem">
          {children}
        </Section>
      )}
    </Section>
  );
}

function Endpoint(props) {
  const canUpdate = props.canUpdate;
  const endpoint = props.endpoint;
  const index = props.index;
  const integration = props.integration;
  const openDialog = props.openDialog;
  const removeEndpoint = props.removeEndpoint;
  const showBody = props.showBody;
  const updateEndpoint = props.updateEndpoint;

  const { language } = useLanguage();

  return (
    <Card paddingBody="clamp(1rem, 3vw, 4rem)" width="100%">
      {{
        slots: {
          body: [
            <Section flexDirection="column" gap="1rem" key="root" padding="0px">
              <Section flexDirection="row" justifyContent="space-between" padding="0px">
                <Heading level="4" text={endpoint.key || platform.websiteAdmin.integrationForm.newEndpoint[language]} />
                {canUpdate && (
                  <Button onClick={() => removeEndpoint(index)} theme="danger" type="button">
                    <Icon icon={faTrash} size={16} style={{ color: "inherit" }} />
                  </Button>
                )}
              </Section>
              <Grid gridTemplateColumns="1fr 120px" gap="0.5rem" padding="0px">
                <Input isDebounceDisabled={true} onChange={(e) => updateEndpoint(index, "key", e.target.value)} placeholder={platform.websiteAdmin.integrationForm.keyPlaceholder[language]} readOnly={!canUpdate} value={endpoint.key} />
                <Select
                  disabled={!canUpdate}
                  onChange={(e) => updateEndpoint(index, "method", e.target.value)}
                  options={[
                    { label: "GET", value: "GET" },
                    { label: "POST", value: "POST" },
                    { label: "PUT", value: "PUT" },
                    { label: "PATCH", value: "PATCH" },
                    { label: "DELETE", value: "DELETE" },
                  ]}
                  value={endpoint.method}
                />
              </Grid>
              <Input isDebounceDisabled={true} onChange={(e) => updateEndpoint(index, "path", e.target.value)} placeholder={platform.websiteAdmin.integrationForm.pathPlaceholder[language]} readOnly={!canUpdate} value={endpoint.path} />
              <Section flexDirection="column" gap="0.5rem" padding="0px">
                <Heading level="6" text={platform.websiteAdmin.integrationForm.request[language]} />
                <SchemaRow count={Object.keys(endpoint.headers?.fields || {}).length} isDefault={true} label={platform.websiteAdmin.integrationForm.headers[language]} onClick={() => openDialog(index, "headers")} />
                <SchemaRow count={Object.keys(endpoint.query?.fields || {}).length} isDefault={true} label={platform.websiteAdmin.integrationForm.query[language]} onClick={() => openDialog(index, "query")} />
                <SchemaRow count={Object.keys(endpoint.body?.fields || {}).length} isDefault={showBody} label={platform.websiteAdmin.integrationForm.body[language]} onClick={() => openDialog(index, "body")} />
              </Section>
              <AdvancedSection>
                <Section flexDirection="row" gap="1rem" padding="0px">
                  <Switch
                    checked={endpoint.cache?.enabled}
                    disabled={!canUpdate}
                    id={"endpoint-" + index + "-cache"}
                    onChange={(e) =>
                      updateEndpoint(index, "cache", {
                        ...endpoint.cache,
                        enabled: e.target.checked,
                      })
                    }
                    text={platform.websiteAdmin.integrationForm.cache[language]}
                    width="50%"
                  />
                  <Input
                    isDebounceDisabled={true}
                    onChange={(e) =>
                      updateEndpoint(index, "cache", {
                        ...endpoint.cache,
                        ttl: Number(e.target.value),
                      })
                    }
                    placeholder={platform.websiteAdmin.integrationForm.ttlPlaceholder[language]}
                    readOnly={!canUpdate}
                    type="number"
                    value={endpoint.cache?.ttl}
                    width="50%"
                  />
                </Section>
              </AdvancedSection>
              <EndpointTesterSection>
                <EndpointTester endpoint={endpoint} integration={integration} />
              </EndpointTesterSection>
            </Section>,
          ],
        },
      }}
    </Card>
  );
}

function EndpointTesterSection(props) {
  const children = props.children;

  const { language } = useLanguage();

  const [open, setOpen] = useState(false);

  const { isMobile } = useViewport();

  return (
    <Section alignItems="flex-start" backgroundColor="#f8fafc" borderColor="#e5e7eb" borderRadius="8px" borderWidth="1px" flexDirection="column" padding="1rem">
      <Button minWidth="250px" onClick={() => setOpen(!open)} type="button" width={isMobile ? "100%" : "auto"}>
        <Icon icon={faCog} size={16} style={{ color: "inherit" }} /> {open ? platform.websiteAdmin.integrationForm.hideEndpointTest[language] : platform.websiteAdmin.integrationForm.showEndpointTest[language]}
      </Button>
      {open && (
        <Section flexDirection="column" gap="1rem" padding="0px">
          {children}
        </Section>
      )}
    </Section>
  );
}

function SchemaRow(props) {
  const count = props.count;
  const isDefault = props.isDefault;
  const label = props.label;
  const onClick = props.onClick;

  const { language } = useLanguage();

  return (
    <Section alignItems="center" backgroundColor={isDefault ? "#f8fafc" : "rgba(239, 68, 68, 0.1)"} borderColor={isDefault ? "#e5e7eb" : "rgba(239, 68, 68, 0.25)"} borderRadius="10px" borderWidth="1px" flexDirection="row" justifyContent="stretch" padding="0.5rem 0.75rem" width="100%">
      <Section alignItems="center" flexDirection="row" flexShrink="1" justifyContent="space-between" padding="0px" width="100%">
        <span style={{ color: isDefault ? "inherit" : "#7f1d1d" }}>{label}</span>
        <span style={{ color: isDefault ? "inherit" : "#7f1d1d", opacity: 0.6 }}>
          {count} {platform.websiteAdmin.integrationForm.fields[language]}
        </span>
      </Section>
      <Button onClick={onClick} theme={isDefault ? undefined : "danger"} width="100px">
        <Icon icon={faEdit} size={16} style={{ color: "inherit" }} />
      </Button>
    </Section>
  );
}
