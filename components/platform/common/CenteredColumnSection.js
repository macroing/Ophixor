// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import Section from "@/lib/web-page-builder/components/section/Section";

export default function CenteredColumnSection(props) {
  const children = props.children;
  const element = props.element;
  const isCenteringWithin = props.isCenteringWithin;
  const isIgnoringMenuBarPadding = props.isIgnoringMenuBarPadding;

  return <Section {...createProps(element, isCenteringWithin, isIgnoringMenuBarPadding)}>{children}</Section>;
}

function createProps(element, isCenteringWithin, isIgnoringMenuBarPadding) {
  return {
    alignItems: isCenteringWithin ? "center" : "stretch",
    borderWidth: "0px",
    element,
    flexDirection: "column",
    flexGrow: "1",
    gap: "2rem",
    justifyContent: isCenteringWithin ? "center" : "stretch",
    margin: "0 auto",
    maxWidth: "1200px",
    padding: `calc(${isIgnoringMenuBarPadding ? "" : "66px + "}clamp(1rem, 3vw, 4rem)) clamp(1rem, 3vw, 4rem) clamp(1rem, 3vw, 4rem) clamp(1rem, 3vw, 4rem)`,
    width: "100%",
  };
}
