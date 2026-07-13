// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { isEmail } from "validator";
import Link from "next/link";

import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import Form from "@/lib/web-page-builder/components/form/Form";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Input from "@/lib/web-page-builder/components/input/Input";
import Label from "@/lib/web-page-builder/components/label/Label";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useLanguage } from "@/context/language";

export default function SignUpForm(props) {
  const translation = props.translation;

  const { language } = useLanguage();

  const [disabled, setDisabled] = useState(true);
  const [email, setEmail] = useState("");
  const [hasCreatedAccount, setHasCreatedAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  async function onSubmit(e) {
    try {
      e.preventDefault();

      setIsSubmitting(true);

      const { data } = await axios.post("/api/platform-user", { email: email.trim(), password: password.trim() });

      if (data.platformUser) {
        setPassword("");
        setPasswordConfirmation("");

        setHasCreatedAccount(true);
      }

      setMessage(data?.message || "");
    } catch (error) {
      setMessage(error?.response?.data?.message || "");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const hasValidEmail = isEmail(email.trim());
    const hasValidPassword = password.trim().length >= 6;
    const hasValidPasswordConfirmation = passwordConfirmation.trim() === password.trim();

    const enabled = hasValidEmail && hasValidPassword && hasValidPasswordConfirmation;

    setDisabled(!enabled);

    if (!hasCreatedAccount) {
      setMessage("");
    }
  }, [email, hasCreatedAccount, password, passwordConfirmation]);

  if (hasCreatedAccount) {
    return (
      <Card flexGrow="0" flexGrowBody="0">
        {{
          slots: {
            header: [],
            body: [
              <Heading color="#0f172a" key="1" level="1" text={translation?.successTitle?.[language]} />,
              <Text color="#475569" key="2" text="">
                {translation?.successTextA?.[language]}
                <Text element="strong" fontWeight="600" text={email} />.
              </Text>,
              <Text color="#475569" key="3">
                {translation?.successTextB?.[language]}
              </Text>,
              <Text color="#475569" key="4">
                {translation?.successTextC?.[language]}
                <Link href="/sign-in">{translation?.successTextD?.[language]}</Link>.
              </Text>,
            ],
            footer: [],
          },
        }}
      </Card>
    );
  }

  return (
    <Form gap="2rem" maxWidth="600px" onSubmit={onSubmit}>
      <Heading color="#0f172a" level="1" text={translation?.title?.[language]} />
      {message && !hasCreatedAccount && (
        <Section backgroundColor="rgba(239, 68, 68, 0.08)" borderColor="rgba(239, 68, 68, 0.3)" borderRadius="14px" borderWidth="1px" padding="1rem">
          <Text color="#b91c1c" element="p" text={message} />
        </Section>
      )}
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="sign-up-email" text={translation?.email?.[language]} />
        <Input id="sign-up-email" onChange={(e) => setEmail(e.target.value)} placeholder={translation?.emailPlaceholder?.[language]} type="email" value={email} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="sign-up-password" text={translation?.password?.[language]} />
        <Input id="sign-up-password" onChange={(e) => setPassword(e.target.value)} type="password" value={password} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="sign-up-password-confirmation" text={translation?.passwordConfirmation?.[language]} />
        <Input id="sign-up-password-confirmation" onChange={(e) => setPasswordConfirmation(e.target.value)} type="password" value={passwordConfirmation} />
      </Section>
      <Section alignItems="center" flexDirection="row" gap="1rem" justifyContent="flex-start" padding="0px">
        <Button disabled={disabled || isSubmitting} text={isSubmitting ? translation?.signingUp?.[language] : translation?.signUp?.[language]} theme="primary" />
        <Text color="#475569" fontSize="14px">
          {translation?.haveAccount?.[language]}
          <Link href="/sign-in">{translation?.signIn?.[language]}</Link>.
        </Text>
      </Section>
    </Form>
  );
}
