// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { faCancel, faTrash } from "@fortawesome/pro-solid-svg-icons";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Button from "@/lib/web-page-builder/components/button/Button";
import Dialog from "@/lib/web-page-builder/components/dialog/Dialog";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Icon from "@/lib/web-page-builder/components/editor/Icon";
import Link from "@/lib/web-page-builder/components/link/Link";
import ModelDataEditor from "@/components/platform/website-admin/website/model/ModelDataEditor";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useWebsite } from "@/context/website";
import { useWebsiteModel } from "@/context/website-model";
import { useWebsiteModelData } from "@/context/website-model-data";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function ModelsModelDataPage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const router = useRouter();

  const { isCustomDomain, website } = useWebsite();

  const { websiteModel } = useWebsiteModel();

  const { setWebsiteModelData, websiteModelData } = useWebsiteModelData();

  const dialogRef = useRef();

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canCreateData = can(permissions, "modelData", "create");
  const canDeleteData = can(permissions, "modelData", "delete");
  const canRead = can(permissions, "model", "read");
  const canReadData = can(permissions, "modelData", "read");
  const canUpdateData = can(permissions, "modelData", "update");

  function onClickCancel(e) {
    setIsDialogVisible(false);
  }

  async function onClickDelete(e) {
    try {
      setIsDialogVisible(false);

      const { data } = await axios.delete("/api/website-model-data/" + websiteModelData._id.toString());

      router.push((isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/models/" + websiteModel._id.toString());
    } catch (error) {}
  }

  if (!canRead || !canReadData || !(canDeleteData || canUpdateData)) {
    return (
      <>
        <div>
          <Link color="#64748b" colorHover="#2563eb" fontSize="0.9rem" href={(isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/models/" + websiteModel._id.toString()} text={platform.websiteAdmin.models.model.data.backToModel[language]} />
        </div>
        <Alert theme="error">
          <Heading level="3" text={platform.websiteAdmin.models.model.data.title[language]} />
          <Text text={platform.websiteAdmin.models.model.data.notAllowed[language]} />
        </Alert>
      </>
    );
  }

  return (
    <>
      <div>
        <Link color="#64748b" colorHover="#2563eb" fontSize="0.9rem" href={(isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/models/" + websiteModel._id.toString()} text={platform.websiteAdmin.models.model.data.backToModel[language]} />
      </div>
      {canUpdateData && <ModelDataEditor setWebsiteModelData={setWebsiteModelData} websiteModel={websiteModel} websiteModelData={websiteModelData} />}
      {canDeleteData && (
        <div>
          <Button onClick={(e) => setIsDialogVisible(true)} text={platform.websiteAdmin.models.model.data.delete[language]} theme="danger" />
        </div>
      )}
      {isDialogVisible && (
        <Dialog dialogRef={dialogRef}>
          {{
            slots: {
              header: [<Heading color="#0f172a" key="1" level="6" text={platform.websiteAdmin.models.model.data.deleteTitle[language]} />],
              body: [<Text key="1" text={platform.websiteAdmin.models.model.data.deleteText[language]} />],
              footer: [
                <Button key="1" onClick={onClickCancel}>
                  <Icon icon={faCancel} size={16} style={{ color: "inherit" }} /> {platform.websiteAdmin.models.model.data.deleteCancel[language]}
                </Button>,
                <Button key="2" onClick={onClickDelete} theme="danger">
                  <Icon icon={faTrash} size={16} style={{ color: "inherit" }} /> {platform.websiteAdmin.models.model.data.deleteDelete[language]}
                </Button>,
              ],
            },
          }}
        </Dialog>
      )}
    </>
  );
}
