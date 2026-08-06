// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Table from "@/lib/web-page-builder/components/table/Table";
import TableData from "@/lib/web-page-builder/components/table-data/TableData";
import TableHeader from "@/lib/web-page-builder/components/table-header/TableHeader";
import TableRow from "@/lib/web-page-builder/components/table-row/TableRow";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useWebsite } from "@/context/website";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function UsersPage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const { isCustomDomain, website } = useWebsite();

  const [websiteUsers, setWebsiteUsers] = useState([]);

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canCreate = can(permissions, "user", "create");
  const canDelete = can(permissions, "user", "delete");
  const canRead = can(permissions, "user", "read");

  useEffect(() => {
    async function loadWebsiteUsers() {
      try {
        const { data } = await axios.get("/api/website-user?websiteCode=" + website.code);

        if (data?.websiteUsers) {
          setWebsiteUsers(data.websiteUsers);
        }
      } catch (error) {}
    }

    if (canRead && website) {
      loadWebsiteUsers();
    }
  }, [canRead, website]);

  if (!canRead) {
    return (
      <Alert theme="error">
        <Heading level="3" text={platform.websiteAdmin.users.title[language]} />
        <Text text={platform.websiteAdmin.users.notAllowed[language]} />
      </Alert>
    );
  }

  return (
    <>
      <Heading color="#0f172a" level="1" text={platform.websiteAdmin.users.title[language]} />
      <Table borderCollapse="collapse">
        {{
          slots: {
            header: [
              <TableRow key="1">
                <TableHeader textAlign="left">{platform.websiteAdmin.users.email[language]}</TableHeader>
                <TableHeader textAlign="left">{platform.websiteAdmin.users.name[language]}</TableHeader>
                <TableHeader textAlign="right">{platform.websiteAdmin.users.createdAt[language]}</TableHeader>
                <TableHeader textAlign="right">{platform.websiteAdmin.users.updatedAt[language]}</TableHeader>
              </TableRow>,
            ],
            body: [
              ...websiteUsers.map((currentWebsiteUser) => (
                <TableRow key={currentWebsiteUser._id}>
                  <TableData textAlign="left">
                    <Link href={(isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/users/" + currentWebsiteUser._id.toString()}>{currentWebsiteUser.email}</Link>
                  </TableData>
                  <TableData textAlign="left">{currentWebsiteUser.name}</TableData>
                  <TableData textAlign="right">{new Date(currentWebsiteUser.createdAt).toLocaleString(language === "sv" ? "sv-SE" : "en-US")}</TableData>
                  <TableData textAlign="right">{new Date(currentWebsiteUser.updatedAt).toLocaleString(language === "sv" ? "sv-SE" : "en-US")}</TableData>
                </TableRow>
              )),
            ],
          },
        }}
      </Table>
    </>
  );
}
