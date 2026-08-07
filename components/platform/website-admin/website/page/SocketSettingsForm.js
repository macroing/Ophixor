// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useMemo, useState } from "react";
import { faSave } from "@fortawesome/pro-solid-svg-icons";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Button from "@/lib/web-page-builder/components/button/Button";
import Form from "@/lib/web-page-builder/components/form/Form";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Icon from "@/lib/web-page-builder/components/editor/Icon";
import Label from "@/lib/web-page-builder/components/label/Label";
import Section from "@/lib/web-page-builder/components/section/Section";
import Switch from "@/lib/web-page-builder/components/switch/Switch";
import Text from "@/lib/web-page-builder/components/text/Text";
import { getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useWebsite } from "@/context/website";
import { useWebsitePage } from "@/context/website-page";
import { PLAN_FREE, PLAN_PRO_GOLD } from "@/definitions/plan-definitions";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function SocketSettingsForm(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const { website } = useWebsite();

  const { saveWebsitePage, websitePage } = useWebsitePage();

  const [disabled, setDisabled] = useState(true);
  const [isSocketConnectingAutomatically, setIsSocketConnectingAutomatically] = useState(websitePage?.isSocketConnectingAutomatically || false);
  const [isSocketConnectingAutomaticallyTheme, setIsSocketConnectingAutomaticallyTheme] = useState("");
  const [isSocketEnabled, setIsSocketEnabled] = useState(websitePage?.isSocketEnabled || false);
  const [isSocketEnabledTheme, setIsSocketEnabledTheme] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const isCollaborator = permissions?.isCollaborator ? true : false;
  const isPlatformAdmin = platformUser?.isPlatformAdmin || false;

  const plan = isCollaborator ? PLAN_PRO_GOLD : platformUser?.plan || PLAN_FREE;

  const hasProGold = isPlatformAdmin || plan === PLAN_PRO_GOLD;

  const canUseSocket = hasProGold;

  async function onSubmit(e) {
    try {
      e.preventDefault();

      setIsSubmitting(true);

      const { error, message } = await saveWebsitePage({ isSocketConnectingAutomatically, isSocketEnabled });

      if (!error) {
        setMessage(message);
        setMessageStatus("success");
      } else {
        setMessage(message);
        setMessageStatus("failure");
      }
    } catch (error) {
      setMessage(error?.message || "");
      setMessageStatus("failure");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (websitePage) {
      setIsSocketConnectingAutomatically(websitePage?.isSocketConnectingAutomatically || false);
      setIsSocketConnectingAutomaticallyTheme("");
      setIsSocketEnabled(websitePage?.isSocketEnabled || false);
      setIsSocketEnabledTheme("");
    }
  }, [websitePage]);

  useEffect(() => {
    const hasIsSocketConnectingAutomaticallyChanged = isSocketConnectingAutomatically !== websitePage?.isSocketConnectingAutomatically;
    const hasIsSocketEnabledChanged = isSocketEnabled !== websitePage?.isSocketEnabled;

    const newIsSocketConnectingAutomaticallyTheme = hasIsSocketConnectingAutomaticallyChanged ? "success" : "";
    const newIsSocketEnabledTheme = hasIsSocketEnabledChanged ? "success" : "";

    const enabled = hasIsSocketConnectingAutomaticallyChanged || hasIsSocketEnabledChanged;

    setDisabled(!enabled);

    setIsSocketConnectingAutomaticallyTheme(newIsSocketConnectingAutomaticallyTheme);
    setIsSocketEnabledTheme(newIsSocketEnabledTheme);
  }, [isSocketConnectingAutomatically, isSocketEnabled, websitePage]);

  useEffect(() => {
    setMessage("");
    setMessageStatus("");
  }, [isSocketConnectingAutomatically, isSocketEnabled]);

  if (!canUseSocket) {
    return false;
  }

  return (
    <Form gap="2rem" onSubmit={onSubmit}>
      <Heading color="#0f172a" level="3" text={platform.websiteAdmin.pages.socketSettingsForm.title[language]} />
      {message && messageStatus && (
        <Alert theme={messageStatus === "failure" ? "error" : "success"}>
          <Text text={message} />
        </Alert>
      )}
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-socket-enabled" text={platform.websiteAdmin.pages.socketSettingsForm.enabled[language]} theme={isSocketEnabledTheme} />
        <Switch checked={isSocketEnabled} id="website-page-socket-enabled" onChange={(e) => setIsSocketEnabled(e.target.checked)} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="website-page-socket-connecting-automatically" text={platform.websiteAdmin.pages.socketSettingsForm.connectingAutomatically[language]} theme={isSocketConnectingAutomaticallyTheme} />
        <Switch checked={isSocketConnectingAutomatically} id="website-page-socket-connecting-automatically" onChange={(e) => setIsSocketConnectingAutomatically(e.target.checked)} />
      </Section>
      <Section alignItems="flex-start" flexDirection="row" gap="0.5rem" justifyContent="flex-start" padding="0px">
        <Button borderRadius="8px" disabled={disabled || isSubmitting} theme="primary">
          <Icon icon={faSave} size={16} style={{ color: "inherit" }} /> {isSubmitting ? platform.websiteAdmin.pages.socketSettingsForm.saving[language] : platform.websiteAdmin.pages.socketSettingsForm.save[language]}
        </Button>
      </Section>
    </Form>
  );
}
