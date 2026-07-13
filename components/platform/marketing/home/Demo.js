// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import PageEditorDialog from "@/lib/web-page-builder/components/editor/PageEditorDialog";
import { createDefaultComponentTemplates } from "@/lib/web-page-builder/page/templates/createDefaultComponentTemplates";
import { createLandingPage, createPageSchema } from "@/lib/web-page-builder/components/page/PageSchema";
import { equals } from "@/lib/web-page-builder/transform/core/equals";
import { resolveUrl } from "@/lib/url";
import { validatePage } from "@/lib/web-page-builder/validation/validators";
import { CurrentWebsiteUserProvider } from "@/context/current-website-user";
import { SocketProvider } from "@/context/socket";
import { WebPageBuilderProvider } from "@/lib/web-page-builder/context/WebPageBuilderProvider";
import { WebsitePageProvider } from "@/context/website-page";
import { WebsiteProvider } from "@/context/website";
import { useLanguage } from "@/context/language";
import { useOverflow } from "@/context/overflow";
import { createWebsiteDemo } from "@/lib/data/website-demo";
import { WEBSITE_PAGE_DEMO } from "@/context/website-page-demo";

export default function Demo(props) {
  const isVisible = props.isVisible;
  const setIsVisible = props.setIsVisible;

  const { language } = useLanguage();

  const pageSchema = useMemo(() => createPageSchema(), []);

  const initialPage = useMemo(() => validatePage(createLandingPage(language), pageSchema, language), [language, pageSchema]);

  const initialWebsite = useMemo(() => createWebsiteDemo(language), [language]);

  const initialWebsitePage = useMemo(() => WEBSITE_PAGE_DEMO, []);

  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadedComponentTemplates, setLoadedComponentTemplates] = useState({});
  const [loadedModels, setLoadedModels] = useState({});
  const [loadedPageData, setLoadedPageData] = useState({});
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [models, setModels] = useState({});
  const [page, setPage] = useState(initialPage);
  const [pageSaved, setPageSaved] = useState(initialPage);
  const [pageData, setPageData] = useState({});
  const [state, setState] = useState({});
  const [website, setWebsite] = useState(initialWebsite);
  const [websiteComponentTemplates, setWebsiteComponentTemplates] = useState([]);
  const [websiteModelDatas, setWebsiteModelDatas] = useState([]);
  const [websiteModels, setWebsiteModels] = useState([]);
  const [websitePage, setWebsitePage] = useState(initialWebsitePage);

  const { isOverflowHidden, setIsOverflowHidden } = useOverflow();

  const hasChanged = !equals(stripMetadata(page), stripMetadata(pageSaved));

  const initialComponentTemplates = useMemo(() => {
    return { ...createDefaultComponentTemplates(), ...loadedComponentTemplates };
  }, [loadedComponentTemplates]);

  const onClickCancel = useCallback(
    (e) => {
      setIsVisible(false);

      setMessage("");
      setMessageStatus("");

      setPage(pageSaved);

      setIsOverflowHidden(false);
    },
    [pageSaved, setIsOverflowHidden, setIsVisible, setMessage, setMessageStatus, setPage],
  );

  const onClickSave = useCallback(
    (e) => {
      setMessage("Your page has been successfully saved!");
      setMessageStatus("success");

      setPageSaved(page);
    },
    [page, setMessage, setMessageStatus, setPageSaved],
  );

  const onClickSaveComponentTemplate = useCallback((e, componentTemplate) => {}, []);

  const onPageChange = useCallback(
    (page, isDraftEnabled) => {
      if (isDraftEnabled) {
        setMessage("");
        setMessageStatus("");
      }

      if (!isDraftEnabled) {
        setPage(page);
      }
    },
    [setMessage, setMessageStatus, setPage],
  );

  const resolveUrlImpl = useCallback(
    (href) => {
      if (href === "/" || href === "/changelog" || href === "/docs" || href === "/sign-in" || href === "/sign-up") {
        return href;
      }

      return resolveUrl(href, website.code, false);
    },
    [website.code],
  );

  useEffect(() => {
    if (!hasLoaded) {
      setHasLoaded(true);
    }
  }, [hasLoaded, setHasLoaded]);

  useEffect(() => {
    if (isVisible) {
      setIsOverflowHidden(true);
    }
  }, [isVisible, setIsOverflowHidden]);

  if (!isVisible || !hasLoaded) {
    return null;
  }

  return (
    <WebsiteProvider code={website.code} website={website}>
      <CurrentWebsiteUserProvider websiteCode={website.code}>
        <WebsitePageProvider models={models} pageData={pageData} path={websitePage.path} websitePage={websitePage}>
          <SocketProvider>
            <WebPageBuilderProvider initialComponentTemplates={initialComponentTemplates} initialPage={page} isShowingContentOnly={false} models={loadedModels} onPageChange={onPageChange} pageData={loadedPageData} pageSchema={pageSchema} resolveUrl={resolveUrlImpl} setPageData={setLoadedPageData} setState={setState} state={state}>
              <PageEditorDialog hasChanged={hasChanged} isDemo={true} isVisible={isVisible} message={message} messageStatus={messageStatus} onClickCancel={onClickCancel} onClickSave={onClickSave} onClickSaveComponentTemplate={onClickSaveComponentTemplate} setIsVisible={setIsVisible} website={website} />
            </WebPageBuilderProvider>
          </SocketProvider>
        </WebsitePageProvider>
      </CurrentWebsiteUserProvider>
    </WebsiteProvider>
  );
}

function stripMetadata(page) {
  const { metadata, ...rest } = page;

  return rest;
}
