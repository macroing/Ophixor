// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { createPageSchema } from "@/lib/web-page-builder/components/page/PageSchema";
import { findLanguage } from "@/lib/language";
import { getActionSchema } from "@/lib/web-page-builder/components/runtime/action/action-schema";
import { getExpressionSchema } from "@/lib/web-page-builder/components/runtime/expression/expression-schema";

import platform from "@/definitions/platform-resources.json" with { type: "json" };
import platformData from "@/definitions/platform-data.json" with { type: "json" };

export default function Layout({ children }) {
  return children;
}

export async function generateMetadata({ params, searchParams }, parent) {
  const headersList = await headers();

  const resolvedParams = await params;
  const resolvedParent = await parent;

  const language = findLanguage(headersList);

  const rawType = resolvedParams?.type;
  const rawName = resolvedParams?.name;

  const type = Array.isArray(rawType) ? rawType[0]?.toLowerCase() : rawType?.toLowerCase();
  const name = Array.isArray(rawName) ? rawName[0]?.toLowerCase() : rawName?.toLowerCase();

  let descriptionToUse = "";
  let keywordsToUse = "";
  let titleToUse = "";
  let urlToUse = resolvedParent.openGraph.url + "/docs";

  if (typeof type === "string" && typeof name === "string") {
    urlToUse += `/${type}/${name}`;
  }

  if (type === "action") {
    const actionSchemas = getActionSchema();
    const actionSchema = findSchemaByName(actionSchemas, name);

    if (actionSchema && actionSchema.type) {
      descriptionToUse = platform.resources.docs.metadata.descriptionAction[language].replace("$ACTION", platformData.action?.types?.[actionSchema.type]?.label?.[language] || actionSchema.label);
      titleToUse = platform.resources.docs.metadata.titleAction[language].replace("$ACTION", platformData.action?.types?.[actionSchema.type]?.label?.[language] || actionSchema.label);
    } else {
      notFound();
    }
  } else if (type === "component") {
    const pageSchema = createPageSchema();
    const componentSchema = name === "page" ? { ...pageSchema, type: "Page" } : findSchemaByName(pageSchema.componentSchemas, name);

    if (componentSchema && componentSchema.type) {
      descriptionToUse = platform.resources.docs.metadata.descriptionComponent[language].replace("$COMPONENT", platformData.component?.types?.[componentSchema.type]?.label?.[language] || componentSchema.label);
      titleToUse = platform.resources.docs.metadata.titleComponent[language].replace("$COMPONENT", platformData.component?.types?.[componentSchema.type]?.label?.[language] || componentSchema.label);
    } else {
      notFound();
    }
  } else if (type === "expression") {
    const expressionSchemas = getExpressionSchema();
    const expressionSchema = findSchemaByName(expressionSchemas, name);

    if (expressionSchema && expressionSchema.type) {
      descriptionToUse = platform.resources.docs.metadata.descriptionExpression[language].replace("$EXPRESSION", platformData.expression?.types?.[expressionSchema.type]?.label?.[language] || expressionSchema.label);
      titleToUse = platform.resources.docs.metadata.titleExpression[language].replace("$EXPRESSION", platformData.expression?.types?.[expressionSchema.type]?.label?.[language] || expressionSchema.label);
    } else {
      notFound();
    }
  } else {
    notFound();
  }

  return {
    description: descriptionToUse,
    keywords: keywordsToUse,
    openGraph: {
      ...resolvedParent.openGraph,
      description: descriptionToUse,
      title: titleToUse,
      url: urlToUse,
    },
    title: titleToUse,
  };
}

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
  } else {
    return null;
  }
}
