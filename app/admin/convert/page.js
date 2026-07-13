// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useState } from "react";

import Button from "@/lib/web-page-builder/components/button/Button";
import Form from "@/lib/web-page-builder/components/form/Form";
import Input from "@/lib/web-page-builder/components/input/Input";
import Label from "@/lib/web-page-builder/components/label/Label";
import PageViewer from "@/lib/web-page-builder/components/editor/PageViewer";
import Section from "@/lib/web-page-builder/components/section/Section";
import { createPageSchema } from "@/lib/web-page-builder/components/page/PageSchema";
import { CurrentWebsiteUserProvider } from "@/context/current-website-user";
import { SocketProvider } from "@/context/socket";
import { WebPageBuilderProvider } from "@/lib/web-page-builder/context/WebPageBuilderProvider";
import { WebsitePageProvider } from "@/context/website-page";
import { WebsiteProvider } from "@/context/website";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-admin.json" with { type: "json" };

const PAGE_SCHEMA = createPageSchema();

const WEBSITE = {
  _id: "id",
  code: "demo",
  collaborators: [],
  createdAt: new Date().toISOString(),
  defaultLanguage: "en",
  description: "",
  firstPublishedAt: null,
  name: "Demo",
  owner: null,
  publishedAt: null,
  settings: {},
  status: "active",
  updateNumber: 0,
  updatedAt: new Date().toISOString(),
  visibility: "public",
};

const WEBSITE_PAGE = {
  _id: "id",
  createdAt: new Date().toISOString(),
  createdBy: null,
  description: "",
  firstPublishedAt: null,
  isHome: true,
  isSocketConnectingAutomatically: false,
  isSocketEnabled: true,
  name: "Home",
  passwordHash: "",
  parentWebsitePage: null,
  path: "/",
  publishedAt: null,
  seo: {
    canonicalUrl: "/",
    description: "",
    keywords: [],
    og: {
      description: "",
      image: "",
      title: "",
    },
    robots: {
      noFollow: true,
      noIndex: true,
    },
    title: "",
  },
  slug: "",
  status: "published",
  type: "landing",
  updateNumber: 0,
  updatedAt: new Date().toISOString(),
  visibility: "public",
  website: WEBSITE,
  websitePageDataDraft: null,
  websitePageDataPublished: null,
  websitePageDataVersions: [],
};

export default function AdminConvertPage(props) {
  const { language } = useLanguage();

  const [data, setData] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [models, setModels] = useState({});
  const [pageData, setPageData] = useState({});
  const [state, setState] = useState({});
  const [url, setUrl] = useState("");

  async function onSubmit(e) {
    try {
      e.preventDefault();

      setHasSubmitted(true);

      const { data } = await axios.post("/api/convert", { url });

      setData(data);
    } catch (error) {
      setData(null);
    } finally {
      setHasSubmitted(false);
    }
  }

  function resolveUrlImpl(href) {
    return href;
  }

  return (
    <>
      {data?.json && (
        <div style={{ height: "60vh", overflow: "auto", position: "relative", width: "auto" }}>
          <WebsiteProvider code={WEBSITE.code} website={WEBSITE}>
            <CurrentWebsiteUserProvider websiteCode={WEBSITE.code}>
              <WebsitePageProvider models={models} pageData={pageData} path={WEBSITE_PAGE.path} websitePage={WEBSITE_PAGE}>
                <SocketProvider>
                  <WebPageBuilderProvider initialComponentTemplates={{}} initialNow={Date.now()} initialPage={data.json} isShowingContentOnly={true} models={models} pageData={pageData} pageSchema={PAGE_SCHEMA} resolveUrl={resolveUrlImpl} setPageData={setPageData} setState={setState} state={state}>
                    <PageViewer />
                  </WebPageBuilderProvider>
                </SocketProvider>
              </WebsitePageProvider>
            </CurrentWebsiteUserProvider>
          </WebsiteProvider>
        </div>
      )}
      <Form onSubmit={onSubmit}>
        <Label text={platform.admin.convert.url[language]} />
        <Input onChange={(e) => setUrl(e.target.value)} value={url} />
        <Section alignItems="center" flexDirection="row" justifyContent="flex-start" padding="0px">
          <Button disabled={hasSubmitted} theme="primary">
            {platform.admin.convert.convert[language]}
          </Button>
        </Section>
      </Form>
    </>
  );
}
