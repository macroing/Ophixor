// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Text from "@/lib/web-page-builder/components/text/Text";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-auth.json" with { type: "json" };

export default function ActivateTokenPage() {
  const params = useParams();

  const router = useRouter();

  const rawToken = params?.token;

  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  const { language } = useLanguage();

  const [status, setStatus] = useState("loading");

  const [message, setMessage] = useState("");

  useEffect(() => {
    async function activate() {
      try {
        const { data } = await axios.put(`/api/activate/${token}`, {});

        setMessage(data.message);
        setStatus("success");
      } catch (error) {
        setMessage(error?.response?.data?.message || platform?.auth?.activate?.failureMessage?.[language]);
        setStatus("error");
      }
    }

    if (token) {
      activate();
    }
  }, [language, token]);

  return (
    <Card height="100%">
      {{
        slots: {
          header: [],
          body: [<Heading color="#0f172a" key="1" level="3" text={platform?.auth?.activate?.title?.[language]} />, status === "loading" && <Text key="2" element="p" text={platform?.auth?.activate?.text?.[language]} />, status !== "loading" && <Text key="3" element="p" text={message} />],
          footer: [
            status === "success" && (
              <Button key="5" onClick={() => router.push("/sign-in")} theme="primary">
                {platform?.auth?.activate?.button?.[language]}
              </Button>
            ),
          ],
        },
      }}
    </Card>
  );
}
