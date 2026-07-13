// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useState } from "react";

import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import Checkbox from "@/lib/web-page-builder/components/checkbox/Checkbox";
import Label from "@/lib/web-page-builder/components/label/Label";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useConsent } from "@/lib/web-page-builder/components/runtime/privacy/useConsent";
import { useLanguage } from "@/context/language";
import { useViewport } from "@/hooks/useViewport";

import platform from "@/definitions/platform.json" with { type: "json" };

const cookieBanner = platform.cookieBanner;

export default function CookieBanner(props) {
  const { consent, revoke, grantAll, isVisible, setIsVisible } = useConsent();

  const { language } = useLanguage();

  const [showModal, setShowModal] = useState(false);

  const { isMobile, isTablet } = useViewport();

  function acceptAll() {
    grantAll();

    setIsVisible(false);
  }

  function rejectAll() {
    revoke("analytics");
    revoke("marketing");

    setIsVisible(false);
  }

  useEffect(() => {
    if (consent?.loading) {
      return;
    }

    const hasMadeChoice = Object.keys(consent).length > 0;

    if (hasMadeChoice) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [consent]);

  if (!isVisible) {
    return null;
  }

  return (
    <Section bottom="1rem" maxWidth="900px" padding="0 1rem" position="fixed" right="0px" width="100%" zIndex="9999">
      <Card backdropFilter="blur(16px)" backgroundColor="rgba(255, 255, 255, 0.6)" backgroundColorHover="rgba(255, 255, 255, 0.6)" borderColor="rgba(255, 255, 255, 0.4)" borderColorHover="rgba(255, 255, 255, 0.4)" borderRadius="14px" boxShadow="0 20px 60px rgba(15, 23, 42, 0.2)" boxShadowHover="0 20px 60px rgba(15, 23, 42, 0.2)" paddingBody="1.25rem">
        {{
          slots: {
            body: [
              <Section alignItems={isMobile || isTablet ? "flex-start" : "center"} flexDirection={isMobile || isTablet ? "column" : "row"} gap="1rem" justifyContent={isMobile || isTablet ? "flex-start" : "space-between"} key="content" padding="0px">
                <Text color="#0f172a" text={cookieBanner.text[language]} />
                <Section flexDirection="row" gap="0.5rem" key="actions" padding="0px" width="auto">
                  <Button onClick={() => rejectAll()} text={cookieBanner.reject[language]} />
                  <Button onClick={() => acceptAll()} text={cookieBanner.acceptAll[language]} theme="primary" />
                  <Button onClick={() => setShowModal(true)} text={cookieBanner.preferences[language]} />
                </Section>
              </Section>,
            ],
          },
        }}
      </Card>
      {showModal && <CookiePreferences language={language} onClose={() => setShowModal(false)} />}
    </Section>
  );
}

function CookiePreferences(props) {
  const language = props.language;
  const onClose = props.onClose;

  const { consent, grant, revoke } = useConsent();

  const [settings, setSettings] = useState({
    necessary: true,
    analytics: consent.analytics ?? false,
    marketing: consent.marketing ?? false,
  });

  function onClickCancel(e) {
    onClose();
  }

  function onClickSave() {
    if (settings.analytics) {
      grant("analytics");
    } else {
      revoke("analytics");
    }

    if (settings.marketing) {
      grant("marketing");
    } else {
      revoke("marketing");
    }

    onClose();
  }

  return (
    <Section alignItems="center" backdropFilter="blur(4px)" backgroundColor="rgba(15, 23, 42, 0.45)" height="100vh" inset="0" justifyContent="center" left="0px" padding="0px" position="fixed" top="1rem" width="100vw" zIndex="10000">
      <Card borderRadius="14px" flexGrow="0" flexGrowBody="0" maxWidth="500px" padding="0px" paddingBody="1.5rem">
        {{
          slots: {
            body: [
              <Text key="1" text={cookieBanner.preferencesTitle[language]} />,
              <Section flexDirection="row" key="2" padding="0px">
                <Checkbox checked={true} disabled={true} id="necessary" onChange={(e) => {}} />
                <Label htmlFor="necessary" text={cookieBanner.necessary[language]} />
              </Section>,
              <Section flexDirection="row" key="3" padding="0px">
                <Checkbox checked={settings.analytics} id="analytics" onChange={(e) => setSettings({ ...settings, analytics: e.target.checked })} />
                <Label htmlFor="analytics" text={cookieBanner.analytics[language]} />
              </Section>,
              <Section flexDirection="row" key="4" padding="0px">
                <Checkbox checked={settings.marketing} id="marketing" onChange={(e) => setSettings({ ...settings, marketing: e.target.checked })} />
                <Label htmlFor="marketing" text={cookieBanner.marketing[language]} />
              </Section>,
              <Section flexDirection="row" key="5" padding="0px">
                <Button onClick={onClickSave} text={cookieBanner.save[language]} theme="primary" width="100%" />
                <Button onClick={onClickCancel} text={cookieBanner.cancel[language]} width="100%" />
              </Section>,
            ],
          },
        }}
      </Card>
    </Section>
  );
}
