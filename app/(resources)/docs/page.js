// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { Fragment, useMemo } from "react";

import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Link from "@/lib/web-page-builder/components/link/Link";
import Section from "@/lib/web-page-builder/components/section/Section";
import Table from "@/lib/web-page-builder/components/table/Table";
import TableData from "@/lib/web-page-builder/components/table-data/TableData";
import TableHeader from "@/lib/web-page-builder/components/table-header/TableHeader";
import TableRow from "@/lib/web-page-builder/components/table-row/TableRow";
import { createPageSchema } from "@/lib/web-page-builder/components/page/PageSchema";
import { generateJsonLdPlatformGraph } from "@/definitions/platform";
import { getActionSchema } from "@/lib/web-page-builder/components/runtime/action/action-schema";
import { getExpressionSchema } from "@/lib/web-page-builder/components/runtime/expression/expression-schema";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-resources.json" with { type: "json" };
import platformData from "@/definitions/platform-data.json" with { type: "json" };

export default function DocsPage(props) {
  const { language } = useLanguage();

  const jsonLd = useMemo(
    () =>
      JSON.stringify(
        generateJsonLdPlatformGraph({
          description: platform.resources.docs.metadata.description[language],
          language,
          name: platform.resources.docs.metadata.title[language],
          url: platform.url + "/docs",
        }),
      ).replace(/</g, "\\u003c"),
    [language],
  );

  const actionSchema = useMemo(() => getActionSchema(), []);

  const actionGroupEntries = useMemo(() => {
    const actionGroupDefinitions = ["Navigation", "Component", "State", "Flow Control", "Socket", "Canvas", "User", "Debugging"];

    const actionGroups = {};

    const actionSchemaEntries = Object.entries(actionSchema);

    for (const actionGroup of actionGroupDefinitions) {
      actionGroups[actionGroup] = [...actionSchemaEntries].filter(([actionType, actionSchema]) => actionSchema.group === actionGroup).map(([actionType, actionSchema]) => ({ ...actionSchema, actionType }));
    }

    return Object.entries(actionGroups);
  }, [actionSchema]);

  const expressionSchema = useMemo(() => getExpressionSchema(), []);

  const expressionGroupEntries = useMemo(() => {
    const expressionGroupDefinitions = ["Constants", "Math", "Logic", "Text", "Collections", "Object", "Conversion", "Date & Time", "Component", "Viewport", "Socket", "Canvas", "Platform User", "User", "Website"];

    const expressionGroups = {};

    const expressionSchemaEntries = Object.entries(expressionSchema);

    for (const expressionGroup of expressionGroupDefinitions) {
      expressionGroups[expressionGroup] = [...expressionSchemaEntries].filter(([expressionType, expressionSchema]) => expressionSchema.group === expressionGroup).map(([expressionType, expressionSchema]) => ({ ...expressionSchema, expressionType }));
    }

    return Object.entries(expressionGroups);
  }, [expressionSchema]);

  const pageSchema = useMemo(() => createPageSchema(), []);

  const componentGroupEntries = useMemo(() => {
    const componentGroups = {};

    for (const componentGroup of pageSchema.componentGroups) {
      componentGroups[componentGroup.label] = [...componentGroup.componentTypes].sort().map((componentType) => ({ ...pageSchema.componentSchemas[componentType], componentType }));
    }

    return Object.entries(componentGroups);
  }, [pageSchema]);

  function getFirstParagraph(text) {
    if (typeof text === "string") {
      const paragraphs = text.includes("\n") ? text.split(/\n+/) : [text];

      return paragraphs[0];
    }

    return "";
  }

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: jsonLd,
        }}
        type="application/ld+json"
      />
      <Section flexDirection="column" gap="clamp(1rem, 3vw, 4rem)" padding="1rem 0rem">
        <Heading color="#0f172a" level="1" text={platform.resources.docs.documentation[language]} />
        <Heading color="#0f172a" level="2" text={platform.resources.docs.components[language]} />
        <Heading color="#0f172a" level="3" text={platform.resources.docs.page[language]} />
        <Table borderCollapse="collapse">
          {{
            slots: {
              header: [
                <TableRow key={"page-component-header"}>
                  <TableHeader textAlign="left">{platform.resources.docs.component[language]}</TableHeader>
                  <TableHeader textAlign="left">{platform.resources.docs.description[language]}</TableHeader>
                  <TableHeader textAlign="left">{platform.resources.docs.plan[language]}</TableHeader>
                </TableRow>,
              ],
              body: [
                <TableRow key={"page-component-body"}>
                  <TableData textAlign="left">
                    <Link color="#2563eb" href={"/docs/component/page"} text={platformData.component.types.Page.label[language] ?? pageSchema.label} textDecorationHover="underline" />
                  </TableData>
                  <TableData textAlign="left">{getFirstParagraph(platformData.component.types.Page.description[language] || pageSchema.description || platform.resources.docs.comingSoon[language])}</TableData>
                  <TableData textAlign="left">{pageSchema.plan}</TableData>
                </TableRow>,
              ],
            },
          }}
        </Table>
        {componentGroupEntries.map(([groupLabel, componentSchemas]) => (
          <Fragment key={groupLabel}>
            <Heading color="#0f172a" level="3" text={platformData.component.groups[groupLabel]?.[language] || groupLabel} />
            <Table borderCollapse="collapse">
              {{
                slots: {
                  header: [
                    <TableRow key={groupLabel + "-component-header"}>
                      <TableHeader textAlign="left">{platform.resources.docs.component[language]}</TableHeader>
                      <TableHeader textAlign="left">{platform.resources.docs.description[language]}</TableHeader>
                      <TableHeader textAlign="left">{platform.resources.docs.plan[language]}</TableHeader>
                    </TableRow>,
                  ],
                  body: componentSchemas.map((componentSchema) => (
                    <TableRow key={groupLabel + "-component-" + componentSchema.componentType}>
                      <TableData textAlign="left">
                        <Link color="#2563eb" href={"/docs/component/" + componentSchema.componentType.toLowerCase()} text={platformData.component.types[componentSchema.componentType]?.labelShort?.[language] || platformData.component.types[componentSchema.componentType]?.label?.[language] || componentSchema.label} textDecorationHover="underline" />
                      </TableData>
                      <TableData textAlign="left">{getFirstParagraph(platformData.component.types[componentSchema.componentType]?.description?.[language] || componentSchema.description || platform.resources.docs.comingSoon[language])}</TableData>
                      <TableData textAlign="left">{componentSchema.plan}</TableData>
                    </TableRow>
                  )),
                },
              }}
            </Table>
          </Fragment>
        ))}
        <Heading color="#0f172a" level="2" text={platform.resources.docs.expressions[language]} />
        {expressionGroupEntries.map(([groupLabel, expressionSchemas]) => (
          <Fragment key={groupLabel}>
            <Heading color="#0f172a" level="3" text={platformData.expression.groups[groupLabel]?.[language] || groupLabel} />
            <Table borderCollapse="collapse">
              {{
                slots: {
                  header: [
                    <TableRow key={groupLabel + "-expression-header"}>
                      <TableHeader textAlign="left">{platform.resources.docs.expression[language]}</TableHeader>
                      <TableHeader textAlign="left">{platform.resources.docs.description[language]}</TableHeader>
                      <TableHeader textAlign="left">{platform.resources.docs.plan[language]}</TableHeader>
                    </TableRow>,
                  ],
                  body: expressionSchemas.map((expressionSchema) => (
                    <TableRow key={groupLabel + "-expression-" + expressionSchema.expressionType}>
                      <TableData textAlign="left">
                        <Link color="#2563eb" href={"/docs/expression/" + expressionSchema.expressionType.toLowerCase()} text={platformData.expression?.types?.[expressionSchema.expressionType]?.labelShort?.[language] || platformData.expression?.types?.[expressionSchema.expressionType]?.label?.[language] || expressionSchema.label} textDecorationHover="underline" />
                      </TableData>
                      <TableData textAlign="left">{getFirstParagraph(platformData.expression?.types?.[expressionSchema.expressionType]?.description?.[language] || expressionSchema.description || platform.resources.docs.comingSoon[language])}</TableData>
                      <TableData textAlign="left">{expressionSchema.plan}</TableData>
                    </TableRow>
                  )),
                },
              }}
            </Table>
          </Fragment>
        ))}
        <Heading level="2" text={platform.resources.docs.actions[language]} />
        {actionGroupEntries.map(([groupLabel, actionSchemas]) => (
          <Fragment key={groupLabel}>
            <Heading color="#0f172a" level="3" text={platformData.action.groups[groupLabel]?.[language] || groupLabel} />
            <Table borderCollapse="collapse">
              {{
                slots: {
                  header: [
                    <TableRow key={groupLabel + "-action-header"}>
                      <TableHeader textAlign="left">{platform.resources.docs.action[language]}</TableHeader>
                      <TableHeader textAlign="left">{platform.resources.docs.description[language]}</TableHeader>
                      <TableHeader textAlign="left">{platform.resources.docs.plan[language]}</TableHeader>
                    </TableRow>,
                  ],
                  body: actionSchemas.map((actionSchema) => (
                    <TableRow key={groupLabel + "-action-" + actionSchema.actionType}>
                      <TableData textAlign="left">
                        <Link color="#2563eb" href={"/docs/action/" + actionSchema.actionType.toLowerCase()} text={platformData.action?.types?.[actionSchema.actionType]?.labelShort?.[language] || platformData.action?.types?.[actionSchema.actionType]?.label?.[language] || actionSchema.label} textDecorationHover="underline" />
                      </TableData>
                      <TableData textAlign="left">{getFirstParagraph(platformData.action?.types?.[actionSchema.actionType]?.description?.[language] || actionSchema.description || platform.resources.docs.comingSoon[language])}</TableData>
                      <TableData textAlign="left">{actionSchema.plan}</TableData>
                    </TableRow>
                  )),
                },
              }}
            </Table>
          </Fragment>
        ))}
      </Section>
    </>
  );
}
