// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import Link from "@/lib/web-page-builder/components/link/Link";
import PageEditorDialog from "@/lib/web-page-builder/components/editor/PageEditorDialog";
import { WebPageBuilderProvider } from "@/lib/web-page-builder/context/WebPageBuilderProvider";
import { createDefaultComponentTemplates } from "@/lib/web-page-builder/page/templates/createDefaultComponentTemplates";
import { createPageSchema } from "@/lib/web-page-builder/components/page/PageSchema";
import { equals } from "@/lib/web-page-builder/transform/core/equals";
import { resolveUrl } from "@/lib/url";
import { useLanguage } from "@/context/language";
import { useOverflow } from "@/context/overflow";
import { useWebsite } from "@/context/website";
import { useWebsitePage } from "@/context/website-page";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

const PAGE_SCHEMA = createPageSchema();

export default function OperationsCard(props) {
  const { language } = useLanguage();

  const { isOverflowHidden, setIsOverflowHidden } = useOverflow();

  const [isVisible, setIsVisible] = useState(false);

  const { isCustomDomain, website } = useWebsite();

  const { saveWebsitePage, websitePage } = useWebsitePage();

  const websitePageDataDraft = websitePage?.websitePageDataDraft?.page;

  const [hasInitializedModelsAndPageData, setHasInitializedModelsAndPageData] = useState(false);
  const [hasLoadedComponentTemplates, setHasLoadedComponentTemplates] = useState(false);
  const [hasLoadedWebsiteModelDatas, setHasLoadedWebsiteModelDatas] = useState(false);
  const [hasLoadedWebsiteModels, setHasLoadedWebsiteModels] = useState(false);
  const [loadedComponentTemplates, setLoadedComponentTemplates] = useState({});
  const [loadedModels, setLoadedModels] = useState({});
  const [loadedPageData, setLoadedPageData] = useState({});
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [page, setPage] = useState(websitePageDataDraft);
  const [pageSaved, setPageSaved] = useState(websitePageDataDraft);
  const [state, setState] = useState({});
  const [websiteComponentTemplates, setWebsiteComponentTemplates] = useState([]);
  const [websiteModelDatas, setWebsiteModelDatas] = useState([]);
  const [websiteModels, setWebsiteModels] = useState([]);

  const hasChanged = !equals(stripMetadata(page), stripMetadata(pageSaved));

  const initialComponentTemplates = useMemo(() => {
    return { ...createDefaultComponentTemplates(), ...loadedComponentTemplates };
  }, [loadedComponentTemplates]);

  function buildRuntimeData(models, dataEntries) {
    const result = {};

    const modelMap = {};

    for (const model of models) {
      modelMap[model._id.toString()] = normalizeModelName(model.name);
    }

    for (const entry of dataEntries) {
      const modelKey = modelMap[entry.websiteModel.toString()];

      if (!modelKey) {
        continue;
      }

      if (!result[modelKey]) {
        result[modelKey] = [];
      }

      result[modelKey].push({
        id: entry._id.toString(),
        createdAt: new Date(entry.createdAt).toISOString(),
        updatedAt: new Date(entry.updatedAt).toISOString(),
        ...entry.data,
      });
    }

    return result;
  }

  function buildRuntimeModels(models) {
    const result = {};

    for (const model of models) {
      const key = normalizeModelName(model.name);

      result[key] = {
        type: model.type || "collection",
        fields: model.fields || {},
      };
    }

    return result;
  }

  async function loadWebsiteComponentTemplates() {
    try {
      const { data } = await axios.get("/api/website-component-template?websiteId=" + website._id.toString());

      if (data.websiteComponentTemplates) {
        setWebsiteComponentTemplates(data.websiteComponentTemplates);
      }
    } catch (error) {
    } finally {
      setHasLoadedComponentTemplates(true);
    }
  }

  async function loadWebsiteModelDatas() {
    try {
      const { data } = await axios.get("/api/website-model-data?websiteId=" + website._id.toString());

      if (data.websiteModelDatas) {
        setWebsiteModelDatas(data.websiteModelDatas);
      }
    } catch (error) {
    } finally {
      setHasLoadedWebsiteModelDatas(true);
    }
  }

  async function loadWebsiteModels() {
    try {
      const { data } = await axios.get("/api/website-model?websiteId=" + website._id.toString());

      if (data.websiteModels) {
        setWebsiteModels(data.websiteModels);
      }
    } catch (error) {
    } finally {
      setHasLoadedWebsiteModels(true);
    }
  }

  function normalizeModelName(name) {
    return name.trim().toLowerCase().replace(/\s+/g, "_");
  }

  function onClickCancel(e) {
    setHasInitializedModelsAndPageData(false);

    setHasLoadedComponentTemplates(false);
    setHasLoadedWebsiteModelDatas(false);
    setHasLoadedWebsiteModels(false);

    setIsVisible(false);

    setMessage("");
    setMessageStatus("");

    setPage(websitePageDataDraft);
    setPageSaved(websitePageDataDraft);

    setIsOverflowHidden(false);
  }

  function onClickEdit(e) {
    setHasInitializedModelsAndPageData(false);

    setHasLoadedComponentTemplates(false);
    setHasLoadedWebsiteModelDatas(false);
    setHasLoadedWebsiteModels(false);

    loadWebsiteComponentTemplates();
    loadWebsiteModelDatas();
    loadWebsiteModels();

    setIsVisible(true);

    setMessage("");
    setMessageStatus("");

    setIsOverflowHidden(true);
  }

  async function onClickSave(e) {
    const { error, message, websitePage } = await saveWebsitePage({ pageDraft: page });

    if (!error) {
      setMessage(message);
      setMessageStatus("success");

      const savedWebsitePageDataDraft = websitePage?.websitePageDataDraft?.page;

      if (savedWebsitePageDataDraft) {
        setPage(savedWebsitePageDataDraft);
        setPageSaved(savedWebsitePageDataDraft);
      }
    } else {
      setMessage(message);
      setMessageStatus("failure");
    }
  }

  async function onClickSaveComponentTemplate(e, componentTemplate) {
    try {
      const { data } = await axios.post("/api/website-component-template", { componentTemplate, websiteId: website._id.toString() });
    } catch (error) {}
  }

  function onPageChange(page, isDraftEnabled) {
    if (isDraftEnabled) {
      setMessage("");
      setMessageStatus("");
    }

    if (!isDraftEnabled) {
      setPage(page);
    }
  }

  function resolveUrlImpl(href) {
    return resolveUrl(href, website.code, isCustomDomain);
  }

  function stripMetadata(page) {
    const { metadata, ...rest } = page;

    return rest;
  }

  useEffect(() => {
    const newLoadedComponentTemplates = {};

    for (let i = 0; i < websiteComponentTemplates.length; i++) {
      const websiteComponentTemplate = websiteComponentTemplates[i];

      const componentTemplate = websiteComponentTemplate?.componentTemplate;

      if (componentTemplate?.type) {
        newLoadedComponentTemplates[componentTemplate.type] = componentTemplate;
      }
    }

    setLoadedComponentTemplates(newLoadedComponentTemplates);
  }, [websiteComponentTemplates]);

  useEffect(() => {
    if (hasLoadedWebsiteModelDatas && hasLoadedWebsiteModels) {
      setLoadedModels(buildRuntimeModels(websiteModels));
      setLoadedPageData(buildRuntimeData(websiteModels, websiteModelDatas));

      setHasInitializedModelsAndPageData(true);
    }
  }, [hasLoadedWebsiteModelDatas, hasLoadedWebsiteModels, websiteModelDatas, websiteModels]);

  return (
    <>
      <Card alignItemsBody="center" flexDirectionBody="row" flexGrow="0" gapBody="2rem" justifyContentBody="space-between">
        {{
          slots: {
            header: [],
            body: [
              <Button borderRadius="8px" key="1" onClick={onClickEdit} theme="primary">
                {platform.websiteAdmin.pages.operationsCard.edit[language]}
              </Button>,
              <Link href={"/website/" + website.code + websitePage.path} key="2" target="_blank" text={platform.websiteAdmin.pages.operationsCard.view[language]} />,
            ],
            footer: [],
          },
        }}
      </Card>
      {isVisible && page && hasLoadedComponentTemplates && websiteComponentTemplates.length === Object.keys(loadedComponentTemplates).length && hasInitializedModelsAndPageData && (
        <WebPageBuilderProvider initialComponentTemplates={initialComponentTemplates} initialPage={page} isShowingContentOnly={false} models={loadedModels} onPageChange={onPageChange} pageData={loadedPageData} pageSchema={PAGE_SCHEMA} resolveUrl={resolveUrlImpl} setPageData={setLoadedPageData} setState={setState} state={state}>
          <PageEditorDialog hasChanged={hasChanged} isVisible={isVisible} message={message} messageStatus={messageStatus} onClickCancel={onClickCancel} onClickSave={onClickSave} onClickSaveComponentTemplate={onClickSaveComponentTemplate} setIsVisible={setIsVisible} website={website} />
        </WebPageBuilderProvider>
      )}
    </>
  );
}
