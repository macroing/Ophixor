// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import Card from "@/lib/web-page-builder/components/card/Card";
import Text from "@/lib/web-page-builder/components/text/Text";

export default function ClickableCard(props) {
  const onClick = props.onClick;
  const text = props.text;

  return (
    <Card alignItemsBody="center" backgroundColorBodyHover="rgba(37, 99, 235, 0.05)" boxShadowHover="0 15px 35px rgba(15, 23, 42, 0.08)" color="#64748b" colorHover="#2563eb" cursor="pointer" justifyContentBody="center" onClick={onClick} paddingBody="1.5rem" transformHover="translateY(-4px)" transition="all 0.2s ease" width="100%" widthBody="100%">
      {{
        slots: {
          header: [],
          body: [<Text cursor="pointer" element="span" key="1" text={text} />],
          footer: [],
        },
      }}
    </Card>
  );
}
