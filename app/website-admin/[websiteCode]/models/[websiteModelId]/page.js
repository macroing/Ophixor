// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Button from "@/lib/web-page-builder/components/button/Button";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Link from "@/lib/web-page-builder/components/link/Link";
import ModelEditor from "@/components/platform/website-admin/website/model/ModelEditor";
import Table from "@/lib/web-page-builder/components/table/Table";
import TableData from "@/lib/web-page-builder/components/table-data/TableData";
import TableHeader from "@/lib/web-page-builder/components/table-header/TableHeader";
import TableRow from "@/lib/web-page-builder/components/table-row/TableRow";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useWebsite } from "@/context/website";
import { useWebsiteModel } from "@/context/website-model";

export default function ModelsModelPage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { isCustomDomain, website } = useWebsite();

  const { setWebsiteModel, websiteModel } = useWebsiteModel();

  const router = useRouter();

  const [websiteModelDatas, setWebsiteModelDatas] = useState([]);

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canCreateData = can(permissions, "modelData", "create");
  const canRead = can(permissions, "model", "read");
  const canReadData = can(permissions, "modelData", "read");
  const canUpdate = can(permissions, "model", "update");

  function onClick(e) {
    router.push((isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/models/" + websiteModel._id.toString() + "/data-new");
  }

  useEffect(() => {
    async function loadWebsiteModelDatas() {
      try {
        const { data } = await axios.get("/api/website-model-data?websiteModelId=" + websiteModel._id.toString());

        if (data.websiteModelDatas) {
          setWebsiteModelDatas(data.websiteModelDatas);
        }
      } catch (error) {}
    }

    if (canReadData && websiteModel) {
      loadWebsiteModelDatas();
    }
  }, [canReadData, websiteModel]);

  if (!canRead) {
    return (
      <>
        <div>
          <Link color="#64748b" colorHover="#2563eb" fontSize="0.9rem" href={(isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/models"} text="← Back to Models" />
        </div>
        <Alert theme="error">
          <Heading level="3" text="Model" />
          <Text text="You do not have permission to view this page." />
        </Alert>
      </>
    );
  }

  return (
    <>
      <div>
        <Link color="#64748b" colorHover="#2563eb" fontSize="0.9rem" href={(isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/models"} text="← Back to Models" />
      </div>
      {canUpdate && <ModelEditor setWebsiteModel={setWebsiteModel} websiteModel={websiteModel} />}
      {canCreateData && canReadData && (
        <div>
          <Button onClick={onClick}>Create Data</Button>
        </div>
      )}
      {canReadData && (
        <Table borderCollapse="collapse">
          {{
            slots: {
              header: [
                <TableRow key="1">
                  <TableHeader>View</TableHeader>
                  <TableHeader>Created at</TableHeader>
                  <TableHeader>Updated at</TableHeader>
                </TableRow>,
              ],
              body: [
                ...websiteModelDatas.map((currentWebsiteModelData) => (
                  <TableRow key={currentWebsiteModelData._id}>
                    <TableData>
                      <NextLink href={(isCustomDomain ? "/admin" : "/website-admin/" + website?.code) + "/models/" + websiteModel._id.toString() + "/data/" + currentWebsiteModelData._id.toString()}>View</NextLink>
                    </TableData>
                    <TableData>{new Date(currentWebsiteModelData.createdAt).toLocaleString()}</TableData>
                    <TableData>{new Date(currentWebsiteModelData.updatedAt).toLocaleString()}</TableData>
                  </TableRow>
                )),
              ],
            },
          }}
        </Table>
      )}
    </>
  );
}
