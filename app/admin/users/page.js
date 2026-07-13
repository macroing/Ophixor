// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Table from "@/lib/web-page-builder/components/table/Table";
import TableData from "@/lib/web-page-builder/components/table-data/TableData";
import TableHeader from "@/lib/web-page-builder/components/table-header/TableHeader";
import TableRow from "@/lib/web-page-builder/components/table-row/TableRow";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-admin.json" with { type: "json" };

export default function AdminUsersPage(props) {
  const { language } = useLanguage();

  const [platformUsers, setPlatformUsers] = useState([]);

  useEffect(() => {
    async function loadPlatformUsers() {
      try {
        const { data } = await axios.get("/api/platform-user");

        if (data?.platformUsers) {
          setPlatformUsers(data.platformUsers);
        }
      } catch (error) {}
    }

    loadPlatformUsers();
  }, []);

  return (
    <>
      <Heading color="#0f172a" level="1" text={platform.admin.users.title[language]} />
      <Table borderCollapse="collapse">
        {{
          slots: {
            header: [
              <TableRow key="1">
                <TableHeader textAlign="left">{platform.admin.users.email[language]}</TableHeader>
                <TableHeader>{platform.admin.users.administrator[language]}</TableHeader>
                <TableHeader>{platform.admin.users.plan[language]}</TableHeader>
                <TableHeader textAlign="right">{platform.admin.users.createdAt[language]}</TableHeader>
                <TableHeader textAlign="right">{platform.admin.users.updatedAt[language]}</TableHeader>
              </TableRow>,
            ],
            body: [
              ...platformUsers.map((currentPlatformUser) => (
                <TableRow key={currentPlatformUser._id}>
                  <TableData textAlign="left">
                    <Link href={"/admin/users/" + currentPlatformUser._id.toString()}>{currentPlatformUser.email}</Link>
                  </TableData>
                  <TableData>{currentPlatformUser.isPlatformAdmin ? platform.admin.users.yes[language] : platform.admin.users.no[language]}</TableData>
                  <TableData>{currentPlatformUser.plan}</TableData>
                  <TableData textAlign="right">{new Date(currentPlatformUser.createdAt).toLocaleString("sv-SE")}</TableData>
                  <TableData textAlign="right">{new Date(currentPlatformUser.updatedAt).toLocaleString("sv-SE")}</TableData>
                </TableRow>
              )),
            ],
          },
        }}
      </Table>
    </>
  );
}
