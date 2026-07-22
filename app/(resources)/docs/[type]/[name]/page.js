// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";
import { notFound, useParams } from "next/navigation";

import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Link from "@/lib/web-page-builder/components/link/Link";
import Section from "@/lib/web-page-builder/components/section/Section";
import Table from "@/lib/web-page-builder/components/table/Table";
import TableData from "@/lib/web-page-builder/components/table-data/TableData";
import TableHeader from "@/lib/web-page-builder/components/table-header/TableHeader";
import TableRow from "@/lib/web-page-builder/components/table-row/TableRow";
import Text from "@/lib/web-page-builder/components/text/Text";
import { createPageSchema } from "@/lib/web-page-builder/components/page/PageSchema";
import { generateJsonLdPlatformGraph } from "@/definitions/platform";
import { getActionSchema } from "@/lib/web-page-builder/components/runtime/action/action-schema";
import { getExpressionSchema } from "@/lib/web-page-builder/components/runtime/expression/expression-schema";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-resources.json" with { type: "json" };
import platformData from "@/definitions/platform-data.json" with { type: "json" };

import importedStyles from "./page.module.css";

export default function DocsTypeNamePage(props) {
  const styles = props.styles || importedStyles;

  const { language } = useLanguage();

  const actionSchemas = useMemo(() => getActionSchema(), []);

  const expressionSchemas = useMemo(() => getExpressionSchema(), []);

  const pageSchema = useMemo(() => createPageSchema(), []);

  const params = useParams();

  const rawType = params?.type;
  const rawName = params?.name;

  const type = Array.isArray(rawType) ? rawType[0]?.toLowerCase() : rawType?.toLowerCase();
  const name = Array.isArray(rawName) ? rawName[0]?.toLowerCase() : rawName?.toLowerCase();

  const schema = type === "action" ? findSchemaByName(actionSchemas, name) : type === "expression" ? findSchemaByName(expressionSchemas, name) : type === "component" ? (name === "page" ? { ...pageSchema, type: "Page" } : findSchemaByName(pageSchema.componentSchemas, name)) : null;

  function findSchemaByName(schemas, name) {
    if (schemas && typeof schemas === "object" && !Array.isArray(schemas) && typeof name === "string") {
      for (const key of Object.keys(schemas)) {
        const keyLowerCase = key.toLowerCase();

        if (keyLowerCase === name) {
          return {
            ...schemas[key],
            type: key,
          };
        }
      }

      return null;
    } else {
      return null;
    }
  }

  const jsonLd = useMemo(() => {
    const hasValidName = typeof name === "string";
    const hasValidSchema = schema && typeof schema === "object" && !Array.isArray(schema);
    const hasValidType = type === "action" || type === "component" || type === "expression";

    const label = platformData[type]?.types?.[schema?.type]?.label?.[language] || schema?.label;

    const descriptionAction = platform.resources.docs.metadata.descriptionAction[language].replace("$ACTION", label);
    const descriptionComponent = platform.resources.docs.metadata.descriptionComponent[language].replace("$COMPONENT", label);
    const descriptionExpression = platform.resources.docs.metadata.descriptionExpression[language].replace("$EXPRESSION", label);
    const description = type === "action" ? descriptionAction : type === "component" ? descriptionComponent : type === "expression" ? descriptionExpression : "";

    const titleAction = platform.resources.docs.metadata.titleAction[language].replace("$ACTION", label);
    const titleComponent = platform.resources.docs.metadata.titleComponent[language].replace("$COMPONENT", label);
    const titleExpression = platform.resources.docs.metadata.titleExpression[language].replace("$EXPRESSION", label);
    const title = type === "action" ? titleAction : type === "component" ? titleComponent : type === "expression" ? titleExpression : "";

    const descriptionToUse = hasValidName && hasValidSchema && hasValidType ? description : "";
    const nameToUse = hasValidName && hasValidSchema && hasValidType ? title : "";
    const urlToUse = hasValidName && hasValidSchema && hasValidType ? `${platform.url}/docs/${type}/${name}` : `${platform.url}/docs`;

    return JSON.stringify(
      generateJsonLdPlatformGraph({
        description: descriptionToUse,
        language,
        name: nameToUse,
        url: urlToUse,
      }),
    ).replace(/</g, "\\u003c");
  }, [language, name, schema, type]);

  if (!schema) {
    notFound();
  }

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: jsonLd,
        }}
        type="application/ld+json"
      />
      <SchemaPage actionSchemas={actionSchemas} expressionSchemas={expressionSchemas} language={language} name={name} pageSchema={pageSchema} schema={schema} type={type} />
    </>
  );
}

function SchemaPage({ actionSchemas, expressionSchemas, language, name, pageSchema, schema, styles = importedStyles, type }) {
  const paragraphs = useMemo(() => {
    const description = platformData[type]?.types?.[schema?.type]?.description?.[language] || schema?.description || platform.resources.docs.comingSoon[language];

    const paragraphs = description.includes("\n") ? description.split(/\n+/) : [description];

    return paragraphs;
  }, [language, schema]);

  const parameterEntries = useMemo(() => Object.entries(schema?.parameters || {}), [schema]);
  const propEntries = useMemo(() => Object.entries(schema?.props || {}), [schema]);
  const variantEntries = useMemo(() => Object.entries(schema?.variants || {}), [schema]);

  const relatedActions = useMemo(() => {
    return Object.entries(actionSchemas)
      .filter(([actionType, actionSchema]) => actionSchema.componentType?.toLowerCase() === name)
      .map(([actionType, actionSchema]) => ({ ...actionSchema, actionType }));
  }, [actionSchemas, name]);

  const relatedExpressions = useMemo(() => {
    return Object.entries(expressionSchemas)
      .filter(([expressionType, expressionSchema]) => expressionSchema.componentType?.toLowerCase() === name)
      .map(([expressionType, expressionSchema]) => ({ ...expressionSchema, expressionType }));
  }, [expressionSchemas, name]);

  function getFirstParagraph(text) {
    if (typeof text === "string") {
      const paragraphs = text.includes("\n") ? text.split(/\n+/) : [text];

      return paragraphs[0];
    }

    return "";
  }

  function translateType(type) {
    if (typeof type === "string") {
      return platformData.dataTypes[type][language];
    } else if (Array.isArray(type)) {
      return type
        .map((currentType) => translateType(currentType))
        .filter(Boolean)
        .join(" | ");
    } else if (typeof type === "object" && type !== null) {
      return JSON.stringify(type, null, 2);
    } else {
      return "";
    }
  }

  if (!schema) {
    return (
      <Section flexDirection="column" gap="clamp(1rem, 3vw, 4rem)" padding="1rem 0rem">
        <Link href="/docs" text={platform.resources.docs.backToDocumentation[language]} />
        <Heading level="1" text={platform.resources.docs.notFound[language]} />
      </Section>
    );
  }

  return (
    <Section alignItems="flex-start" flexDirection="column" gap="clamp(1rem, 3vw, 4rem)" justifyContent="flex-start" padding="1rem 0rem" width="100%">
      <Link href="/docs" text={platform.resources.docs.backToDocumentation[language]} />
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Heading color="#0f172a" level="1" text={platformData[type]?.types?.[schema?.type]?.label?.[language] || schema.label} />
        {paragraphs.map((paragraph, paragraphIndex) => (
          <Text color="#475569" key={"paragraph-" + paragraphIndex} text={paragraph} />
        ))}
      </Section>
      {(schema.componentType || schema.group || schema.plan || schema.returnType) && (
        <Section flexDirection="column" gap="0.5rem" padding="0px">
          <Heading color="#0f172a" level="2" text={platform.resources.docs.information[language]} />
          {schema.componentType && (
            <Text color="#475569" text={platform.resources.docs.componentType[language] + ": "}>
              <Link color="#2563eb" fontWeight="600" href={"/docs/component/" + schema.componentType.toLowerCase()} text={platformData.component.types[schema.componentType]?.label?.[language] || pageSchema?.componentSchemas?.[schema.componentType]?.label || ""} textDecorationHover="underline" />
            </Text>
          )}
          {schema.group && (
            <Text color="#475569" text={platform.resources.docs.group[language] + ": "}>
              <Text element="span" fontWeight="600" text={platformData[type]?.groups?.[schema.group]?.[language] || schema.group || ""} />
            </Text>
          )}
          {schema.plan && (
            <Text color="#475569" text={platform.resources.docs.plan[language] + ": "}>
              <Text element="span" fontWeight="600" text={schema.plan || ""} />
            </Text>
          )}
          {schema.returnType && (
            <Text color="#475569" element="div" text={platform.resources.docs.returnType[language] + ": "}>
              <pre className={styles.pre + " " + styles.pre_inline}>{translateType(schema.returnType)}</pre>
            </Text>
          )}
        </Section>
      )}
      {parameterEntries.length > 0 && (
        <>
          <Heading color="#0f172a" level="2" text={platform.resources.docs.parameters[language]} />
          <Table borderCollapse="collapse" width="100%">
            {{
              slots: {
                header: [
                  <TableRow key="header">
                    <TableHeader textAlign="left">{platform.resources.docs.parameter[language]}</TableHeader>
                    <TableHeader textAlign="left">{platform.resources.docs.type[language]}</TableHeader>
                    <TableHeader textAlign="left">{platform.resources.docs.default[language]}</TableHeader>
                    <TableHeader textAlign="left">{platform.resources.docs.expressions[language]}</TableHeader>
                  </TableRow>,
                ],
                body: parameterEntries.map(([key, parameter]) => (
                  <TableRow key={key}>
                    <TableData textAlign="left" verticalAlign="middle">
                      <Text color="#475569" element="span" text={platformData[type]?.parameters?.[key]?.[schema?.type]?.[language] || platformData[type]?.parameters?.[key]?.[language] || parameter.label || key} />
                    </TableData>
                    <TableData textAlign="left">
                      <pre className={styles.pre}>{translateType(parameter.type)}</pre>
                    </TableData>
                    <TableData textAlign="left">
                      <pre className={styles.pre}>{JSON.stringify(parameter.defaultValue, null, 2)}</pre>
                    </TableData>
                    <TableData textAlign="left" verticalAlign="middle">
                      <Text color="#475569" element="span" text={parameter.isExpressionAllowed ? platform.resources.docs.yes[language] : platform.resources.docs.no[language]} />
                    </TableData>
                  </TableRow>
                )),
              },
            }}
          </Table>
        </>
      )}
      {propEntries.length > 0 && (
        <>
          <Heading color="#0f172a" level="2" text={platform.resources.docs.properties[language]} />
          <Table borderCollapse="collapse" width="100%">
            {{
              slots: {
                header: [
                  <TableRow key="header">
                    <TableHeader textAlign="left">{platform.resources.docs.property[language]}</TableHeader>
                    <TableHeader textAlign="left">{platform.resources.docs.type[language]}</TableHeader>
                    <TableHeader textAlign="left">{platform.resources.docs.default[language]}</TableHeader>
                  </TableRow>,
                ],
                body: propEntries.map(([key, prop]) => (
                  <TableRow key={key}>
                    <TableData textAlign="left" verticalAlign="middle">
                      <Text color="#475569" element="span" text={platformData.component.props[key]?.[language] ?? (prop.label || key)} whiteSpace="nowrap" />
                    </TableData>
                    <TableData textAlign="left">
                      <pre className={styles.pre}>{translateType(prop.schemaType)}</pre>
                    </TableData>
                    <TableData textAlign="left">
                      <pre className={styles.pre}>{JSON.stringify(prop.defaultValue, null, 2)}</pre>
                    </TableData>
                  </TableRow>
                )),
              },
            }}
          </Table>
        </>
      )}
      {variantEntries.length > 0 && (
        <>
          <Heading color="#0f172a" level="2" text={platform.resources.docs.variants[language]} />
          <Table borderCollapse="collapse" width="100%">
            {{
              slots: {
                header: [
                  <TableRow key="header">
                    <TableHeader textAlign="left">{platform.resources.docs.variant[language]}</TableHeader>
                    <TableHeader textAlign="left">{platform.resources.docs.description[language]}</TableHeader>
                  </TableRow>,
                ],
                body: variantEntries.map(([key, variant]) => (
                  <TableRow key={key}>
                    <TableData textAlign="left" verticalAlign="middle">
                      <Text color="#475569" element="span" text={platformData.component.variants[variant.label]?.[language] ?? (variant.label || key)} />
                    </TableData>
                    <TableData textAlign="left">
                      <Text color="#475569" element="span" text={getFirstParagraph(variant.description || platform.resources.docs.comingSoon[language])} />
                    </TableData>
                  </TableRow>
                )),
              },
            }}
          </Table>
        </>
      )}
      {relatedActions.length > 0 && (
        <>
          <Heading color="#0f172a" level="2" text={platform.resources.docs.relatedActions[language]} />
          <Table borderCollapse="collapse" width="100%">
            {{
              slots: {
                header: [
                  <TableRow key="header">
                    <TableHeader textAlign="left">{platform.resources.docs.action[language]}</TableHeader>
                    <TableHeader textAlign="left">{platform.resources.docs.description[language]}</TableHeader>
                    <TableHeader textAlign="left">{platform.resources.docs.plan[language]}</TableHeader>
                  </TableRow>,
                ],
                body: relatedActions.map((actionSchema) => (
                  <TableRow key={actionSchema.actionType}>
                    <TableData textAlign="left">
                      <Link color="#2563eb" href={"/docs/action/" + actionSchema.actionType} text={platformData.action.types[actionSchema.actionType]?.label?.[language] || actionSchema.label} textDecorationHover="underline" />
                    </TableData>
                    <TableData textAlign="left">
                      <Text color="#475569" element="span" text={getFirstParagraph(platformData.action.types[actionSchema.actionType]?.description?.[language] || actionSchema.description || platform.resources.docs.comingSoon[language])} />
                    </TableData>
                    <TableData textAlign="left">
                      <Text color="#475569" element="span" text={actionSchema.plan} />
                    </TableData>
                  </TableRow>
                )),
              },
            }}
          </Table>
        </>
      )}
      {relatedExpressions.length > 0 && (
        <>
          <Heading color="#0f172a" level="2" text={platform.resources.docs.relatedExpressions[language]} />
          <Table borderCollapse="collapse" width="100%">
            {{
              slots: {
                header: [
                  <TableRow key="header">
                    <TableHeader textAlign="left">{platform.resources.docs.expression[language]}</TableHeader>
                    <TableHeader textAlign="left">{platform.resources.docs.description[language]}</TableHeader>
                    <TableHeader textAlign="left">{platform.resources.docs.plan[language]}</TableHeader>
                  </TableRow>,
                ],
                body: relatedExpressions.map((expressionSchema) => (
                  <TableRow key={expressionSchema.expressionType}>
                    <TableData textAlign="left">
                      <Link color="#2563eb" href={"/docs/expression/" + expressionSchema.expressionType} text={platformData.expression.types[expressionSchema.expressionType]?.label?.[language] || expressionSchema.label} textDecorationHover="underline" />
                    </TableData>
                    <TableData textAlign="left">
                      <Text color="#475569" element="span" text={getFirstParagraph(platformData.expression.types[expressionSchema.expressionType]?.description?.[language] || expressionSchema.description || platform.resources.docs.comingSoon[language])} />
                    </TableData>
                    <TableData textAlign="left">
                      <Text color="#475569" element="span" text={expressionSchema.plan} />
                    </TableData>
                  </TableRow>
                )),
              },
            }}
          </Table>
        </>
      )}
    </Section>
  );
}
