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

export default function AdminWebsitesPage(props) {
  const { language } = useLanguage();

  const [websites, setWebsites] = useState([]);

  function getStatus(website) {
    if (website?.status) {
      switch (website.status) {
        case "active":
          return platform.admin.websites.active[language];
        case "disabled":
          return platform.admin.websites.disabled[language];
        case "draft":
          return platform.admin.websites.draft[language];
        default:
          return platform.admin.websites.unknown[language];
      }
    } else {
      return platform.admin.websites.unknown[language];
    }
  }

  function getVisibility(website) {
    if (website?.visibility) {
      switch (website.visibility) {
        case "private":
          return platform.admin.websites.private[language];
        case "public":
          return platform.admin.websites.public[language];
        case "unlisted":
          return platform.admin.websites.unlisted[language];
        default:
          return platform.admin.websites.unknown[language];
      }
    } else {
      return platform.admin.websites.unknown[language];
    }
  }

  useEffect(() => {
    async function loadWebsites() {
      try {
        const { data } = await axios.get("/api/website");

        if (data?.websites) {
          setWebsites(data.websites);
        }
      } catch (error) {}
    }

    loadWebsites();
  }, []);

  return (
    <>
      <Heading color="#0f172a" level="1" text={platform.admin.websites.title[language]} />
      <Table borderCollapse="collapse">
        {{
          slots: {
            header: [
              <TableRow key="1">
                <TableHeader textAlign="left">{platform.admin.websites.name[language]}</TableHeader>
                <TableHeader>{platform.admin.websites.status[language]}</TableHeader>
                <TableHeader>{platform.admin.websites.visibility[language]}</TableHeader>
                <TableHeader textAlign="right">{platform.admin.websites.createdAt[language]}</TableHeader>
                <TableHeader textAlign="right">{platform.admin.websites.updatedAt[language]}</TableHeader>
              </TableRow>,
            ],
            body: [
              ...websites.map((currentWebsite) => (
                <TableRow key={currentWebsite._id}>
                  <TableData textAlign="left">
                    <Link href={"/website-admin/" + currentWebsite.code}>{currentWebsite.name}</Link>
                  </TableData>
                  <TableData>{getStatus(currentWebsite)}</TableData>
                  <TableData>{getVisibility(currentWebsite)}</TableData>
                  <TableData textAlign="right">{new Date(currentWebsite.createdAt).toLocaleString("sv-SE")}</TableData>
                  <TableData textAlign="right">{new Date(currentWebsite.updatedAt).toLocaleString("sv-SE")}</TableData>
                </TableRow>
              )),
            ],
          },
        }}
      </Table>
    </>
  );
}
