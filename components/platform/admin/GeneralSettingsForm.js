// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Button from "@/lib/web-page-builder/components/button/Button";
import Form from "@/lib/web-page-builder/components/form/Form";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Label from "@/lib/web-page-builder/components/label/Label";
import Section from "@/lib/web-page-builder/components/section/Section";
import Select from "@/lib/web-page-builder/components/select/Select";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useLanguage } from "@/context/language";
import { PLAN_FREE, PLANS } from "@/definitions/plan-definitions";

import platformAdmin from "@/definitions/platform-admin.json" with { type: "json" };

export default function GeneralSettingsForm(props) {
  const initialPlatform = props.platform;

  const { language } = useLanguage();

  const [defaultPlan, setDefaultPlan] = useState(initialPlatform?.defaultPlan || PLAN_FREE);
  const [disabled, setDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [platform, setPlatform] = useState(initialPlatform);

  async function onSubmit(e) {
    try {
      e.preventDefault();

      setIsSubmitting(true);

      const { data } = await axios.put("/api/platform", { defaultPlan });

      if (data.platform) {
        setPlatform(data.platform);
      }

      setMessage(data.message);
      setMessageStatus("success");
    } catch (error) {
      setMessage(error?.message || "");
      setMessageStatus("failure");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (platform) {
      setDefaultPlan(platform.defaultPlan || PLAN_FREE);
    }
  }, [platform]);

  useEffect(() => {
    const hasDefaultPlanChanged = defaultPlan !== platform?.defaultPlan;

    const enabled = hasDefaultPlanChanged;

    setDisabled(!enabled);
  }, [defaultPlan, messageStatus]);

  useEffect(() => {
    setMessage("");
    setMessageStatus("");
  }, [defaultPlan]);

  return (
    <Form gap="2rem" onSubmit={onSubmit}>
      <Heading color="#0f172a" level="3" text={platformAdmin.admin.platform.generalSettingsForm.title[language]} />
      {message && messageStatus && (
        <Alert theme={messageStatus === "failure" ? "error" : "success"}>
          <Text text={message} />
        </Alert>
      )}
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="platform-default-plan" text={platformAdmin.admin.platform.generalSettingsForm.defaultPlan[language]} />
        <Select id="platform-default-plan" onChange={(e) => setDefaultPlan(e.target.value)} options={PLANS.map((plan) => ({ label: plan, value: plan }))} value={defaultPlan} />
      </Section>
      <Section alignItems="flex-start" flexDirection="row" gap="0.5rem" justifyContent="flex-start" padding="0px">
        <Button borderRadius="8px" disabled={disabled || isSubmitting} text={isSubmitting ? platformAdmin.admin.platform.generalSettingsForm.saving[language] : platformAdmin.admin.platform.generalSettingsForm.save[language]} theme="primary" />
      </Section>
    </Form>
  );
}
