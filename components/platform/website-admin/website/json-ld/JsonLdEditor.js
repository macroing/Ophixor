// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useState } from "react";

import Button from "@/lib/web-page-builder/components/button/Button";
import Form from "@/lib/web-page-builder/components/form/Form";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Section from "@/lib/web-page-builder/components/section/Section";
import Select from "@/lib/web-page-builder/components/select/Select";

import importedStyles from "./JsonLdEditor.module.css";

export default function JSONLDEditor(props) {
  const styles = props.styles || importedStyles;

  const [jsonLd, setJsonLd] = useState({});

  async function onSubmit(e) {
    try {
      e.preventDefault();
    } catch (error) {}
  }

  return (
    <Form onSubmit={onSubmit}>
      <Heading color="#0f172a" level="1" text="JSON-LD" />
    </Form>
  );
}

const JSON_LD_SCHEMAS = [
  {
    type: "BusinessAudience",
    typeExtended: "Audience",
    fields: [
      {
        name: "audienceType",
        type: "string",
      },
    ],
  },
  {
    type: "ImageObject",
    fields: [
      {
        name: "height",
        type: "number",
      },
      {
        name: "url",
        stringFormat: "url",
        type: "string",
      },
      {
        name: "width",
        type: "number",
      },
    ],
  },
  {
    type: "Organization",
    fields: [
      {
        name: "email",
        stringFormat: "email",
        type: "string",
      },
      {
        name: "founder",
        type: "object",
      },
      {
        name: "foundingDate",
        type: "string",
      },
      {
        name: "logo",
        type: [{ stringFormat: "url", type: "string" }, "ImageObject"],
      },
      {
        name: "name",
        type: "string",
      },
      {
        name: "url",
        stringFormat: "url",
        type: "string",
      },
    ],
  },
  {
    type: "Person",
    fields: [
      {
        name: "jobTitle",
        type: "string",
      },
      {
        name: "name",
        type: "string",
      },
      {
        name: "sameAs",
        type: "array<string>",
      },
      {
        name: "url",
        stringFormat: "url",
        type: "string",
      },
      {
        name: "worksFor",
        type: "object",
      },
    ],
  },
  {
    type: "SoftwareApplication",
    fields: [
      {
        name: "applicationCategory",
        type: "string",
      },
      {
        name: "applicationSubCategory",
        type: "string",
      },
      {
        name: "audience",
        type: "Audience",
      },
      {
        name: "description",
        type: "string",
      },
      {
        name: "featureList",
        type: "array<string>",
      },
      {
        name: "name",
        type: "string",
      },
      {
        name: "operatingSystem",
        type: "string",
      },
      {
        name: "url",
        stringFormat: "url",
        type: "string",
      },
    ],
  },
  {
    type: "WebPage",
    fields: [
      {
        name: "about",
        type: "object",
      },
      {
        name: "description",
        type: "string",
      },
      {
        name: "inLanguage",
        type: "string",
      },
      {
        name: "isPartOf",
        type: "WebSite",
      },
      {
        name: "name",
        type: "string",
      },
      {
        name: "provider",
        type: "Organization",
      },
      {
        name: "url",
        stringFormat: "url",
        type: "string",
      },
    ],
  },
  {
    type: "WebSite",
    fields: [
      {
        name: "name",
        type: "string",
      },
      {
        name: "publisher",
        type: "object",
      },
      {
        name: "url",
        stringFormat: "url",
        type: "string",
      },
    ],
  },
];

function createJsonLdBase() {
  return {
    "@context": "https://schema.org",
    "@graph": [],
  };
}
