// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useState } from "react";

import Card from "@/lib/web-page-builder/components/card/Card";
import CenteredColumnSection from "@/components/platform/common/CenteredColumnSection";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import PageViewer from "@/lib/web-page-builder/components/editor/PageViewer";
import Text from "@/lib/web-page-builder/components/text/Text";
import { WebPageBuilderProvider } from "@/lib/web-page-builder/context/WebPageBuilderProvider";
import { createPageSchema } from "@/lib/web-page-builder/components/page/PageSchema";
import { resolveUrl } from "@/lib/url";
import { useWebsite } from "@/context/website";
import { useWebsitePage } from "@/context/website-page";

const PAGE_SCHEMA = createPageSchema();

export default function Page(props) {
  const [state, setState] = useState({});

  const { isCustomDomain, website } = useWebsite();

  const { isLoading, models, pageData, setPageData, websitePage } = useWebsitePage();

  const websitePageDataPublished = websitePage?.websitePageDataPublished?.page;

  function resolveUrlImpl(href) {
    return resolveUrl(href, website.code, isCustomDomain);
  }

  if (!websitePageDataPublished) {
    return (
      <CenteredColumnSection isCenteringWithin={true} isIgnoringMenuBarPadding={true}>
        <Card alignItemsBody="center" alignItemsHeader="center" backgroundColor="rgba(220, 38, 38, 0.03)" backgroundColorBody="transparent" backgroundColorBodyHover="transparent" backgroundColorHover="rgba(220, 38, 38, 0.03)" backgroundColorHeader="transparent" backgroundColorHeaderHover="transparent" borderColor="rgba(220, 38, 38, 0.2)" borderColorHover="rgba(220, 38, 38, 0.2)" flexGrow="0" maxWidth="600px">
          {{
            slots: {
              header: [<Heading color="#b91c1c" key="1" level="3" text="404 - Page Not Found" />],
              body: [<Text color="#b91c1c" key="1" text="The requested page could not be found." />],
              footer: [],
            },
          }}
        </Card>
      </CenteredColumnSection>
    );
  }

  return (
    <WebPageBuilderProvider initialComponentTemplates={{}} initialNow={Date.now()} initialPage={websitePageDataPublished} isShowingContentOnly={true} models={models} pageData={pageData} pageSchema={PAGE_SCHEMA} resolveUrl={resolveUrlImpl} setPageData={setPageData} setState={setState} state={state}>
      <PageViewer />
    </WebPageBuilderProvider>
  );
}
