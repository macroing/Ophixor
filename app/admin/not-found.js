// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import Card from "@/lib/web-page-builder/components/card/Card";
import CenteredColumnSection from "@/components/platform/common/CenteredColumnSection";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-admin.json" with { type: "json" };

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <CenteredColumnSection isCenteringWithin={true} isIgnoringMenuBarPadding={true}>
      <Card alignItemsBody="center" alignItemsHeader="center" backgroundColor="rgba(220, 38, 38, 0.03)" backgroundColorBody="transparent" backgroundColorBodyHover="transparent" backgroundColorHover="rgba(220, 38, 38, 0.03)" backgroundColorHeader="transparent" backgroundColorHeaderHover="transparent" borderColor="rgba(220, 38, 38, 0.2)" borderColorHover="rgba(220, 38, 38, 0.2)" flexGrow="0" maxWidth="600px">
        {{
          slots: {
            header: [<Heading color="#b91c1c" key="1" level="3" text={platform.admin.notFound.title[language]} />],
            body: [<Text color="#b91c1c" key="1" text={platform.admin.notFound.text[language]} />],
            footer: [],
          },
        }}
      </Card>
    </CenteredColumnSection>
  );
}
