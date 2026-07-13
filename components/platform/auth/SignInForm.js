// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { isEmail } from "validator";
import Link from "next/link";

import Button from "@/lib/web-page-builder/components/button/Button";
import Form from "@/lib/web-page-builder/components/form/Form";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Input from "@/lib/web-page-builder/components/input/Input";
import Label from "@/lib/web-page-builder/components/label/Label";
import Section from "@/lib/web-page-builder/components/section/Section";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useLanguage } from "@/context/language";

export default function SignInForm(props) {
  const isCustomDomain = props.isCustomDomain || false;
  const translation = props.translation;

  const { language } = useLanguage();

  const [disabled, setDisabled] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    try {
      e.preventDefault();

      setIsSubmitting(true);

      const { error } = await signIn("credentials", { email, password, redirect: false });

      if (error) {
        setMessage(error);
      } else {
        window.location.href = isCustomDomain ? "/admin" : "/website-admin";
      }
    } catch (error) {
      setMessage(error?.message || "");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const hasValidEmail = isEmail(email.trim());
    const hasValidPassword = password.trim().length >= 6;

    const enabled = hasValidEmail && hasValidPassword;

    setDisabled(!enabled);

    setMessage("");
  }, [email, password]);

  return (
    <Form gap="2rem" maxWidth="600px" onSubmit={onSubmit}>
      <Heading color="#0f172a" level="1" text={translation?.title?.[language]} />
      {message && (
        <Section backgroundColor="rgba(239, 68, 68, 0.08)" borderColor="rgba(239, 68, 68, 0.3)" borderRadius="14px" borderWidth="1px" padding="1rem">
          <Text color="#b91c1c" element="p" text={message} />
        </Section>
      )}
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="sign-in-email" text={translation?.email?.[language]} />
        <Input id="sign-in-email" onChange={(e) => setEmail(e.target.value)} placeholder={translation?.emailPlaceholder?.[language]} type="email" value={email} />
      </Section>
      <Section flexDirection="column" gap="0.5rem" padding="0px">
        <Label htmlFor="sign-in-password" text={translation?.password?.[language]} />
        <Input id="sign-in-password" onChange={(e) => setPassword(e.target.value)} type="password" value={password} />
      </Section>
      <Section alignItems="center" flexDirection="row" gap="1rem" justifyContent="flex-start" padding="0px">
        <Button disabled={disabled || isSubmitting} text={isSubmitting ? translation?.signingIn?.[language] : translation?.signIn?.[language]} theme="primary" />
        {!isCustomDomain && (
          <Text color="#475569" fontSize="14px">
            {translation?.noAccount?.[language]}
            <Link href="/sign-up">{translation?.signUp?.[language]}</Link>.
          </Text>
        )}
      </Section>
    </Form>
  );
}
