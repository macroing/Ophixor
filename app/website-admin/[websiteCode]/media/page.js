// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Alert from "@/lib/web-page-builder/components/alert/Alert";
import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import ClickableCard from "@/components/platform/common/ClickableCard";
import Dialog from "@/lib/web-page-builder/components/dialog/Dialog";
import Grid from "@/lib/web-page-builder/components/grid/Grid";
import Heading from "@/lib/web-page-builder/components/heading/Heading";
import Image from "@/lib/web-page-builder/components/image/Image";
import Text from "@/lib/web-page-builder/components/text/Text";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useViewport } from "@/hooks/useViewport";
import { useWebsite } from "@/context/website";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function MediaPage(props) {
  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const dialogRef = useRef();

  const router = useRouter();

  const [copiedLinks, setCopiedLinks] = useState({});
  const [websiteMediaToDelete, setWebsiteMediaToDelete] = useState(null);
  const [websiteMedias, setWebsiteMedias] = useState([]);

  const { isMobile, isTablet } = useViewport();

  const { isCustomDomain, website } = useWebsite();

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const canCreate = can(permissions, "media", "create");
  const canDelete = can(permissions, "media", "delete");
  const canRead = can(permissions, "media", "read");

  function onClickCancel(e) {
    setWebsiteMediaToDelete(null);
  }

  function onClickCopyLink(e, websiteMedia) {
    const id = websiteMedia?._id?.toString();
    const url = websiteMedia?.url;

    if (id && url && navigator) {
      navigator.clipboard.writeText(url);

      setCopiedLinks((newCopiedLinks) => {
        return { ...newCopiedLinks, [id]: true };
      });

      setTimeout(() => {
        setCopiedLinks((newCopiedLinks) => {
          return { ...newCopiedLinks, [id]: false };
        });
      }, 1000);
    }
  }

  async function onClickDelete(e) {
    try {
      const { data } = await axios.delete("/api/website-media/" + websiteMediaToDelete._id.toString());

      setWebsiteMedias([...websiteMedias].filter((currentWebsiteMedia) => currentWebsiteMedia._id.toString() !== websiteMediaToDelete._id.toString()));
      setWebsiteMediaToDelete(null);
    } catch (error) {}
  }

  function onClickUploadImage(e) {
    router.push((isCustomDomain ? "/admin" : "/website-admin/" + website.code) + "/media/upload-image");
  }

  useEffect(() => {
    async function loadWebsiteMedias(website) {
      try {
        const { data } = await axios.get("/api/website-media/list?websiteId=" + website._id.toString());

        if (data.websiteMedias) {
          setWebsiteMedias(data.websiteMedias);
        }
      } catch (error) {}
    }

    if (canRead && website) {
      loadWebsiteMedias(website);
    }
  }, [canRead, website]);

  useEffect(() => {
    if (websiteMediaToDelete) {
      dialogRef?.current?.showModal();
    } else {
      dialogRef?.current?.close();
    }
  }, [websiteMediaToDelete]);

  if (!canRead) {
    return (
      <Alert theme="error">
        <Heading level="3" text={platform.websiteAdmin.media.title[language]} />
        <Text text={platform.websiteAdmin.media.notAllowed[language]} />
      </Alert>
    );
  }

  return (
    <>
      <Heading color="#0f172a" level="1" text={platform.websiteAdmin.media.title[language]} />
      <Text color="#64748b" element="p" text={platform.websiteAdmin.media.text[language]} />
      <Grid gridTemplateColumns={isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)"} padding="0px">
        {canCreate && <ClickableCard onClick={onClickUploadImage} text={platform.websiteAdmin.media.uploadImage[language]} />}
        {websiteMedias.map((websiteMedia) => {
          if (websiteMedia.type === "image") {
            return (
              <Card key={websiteMedia._id} paddingBody="1rem" paddingFooter="1rem" width="100%" widthFooter="100%">
                {{
                  slots: {
                    header: [],
                    body: [<Image alt={websiteMedia.alt} height={websiteMedia.height} key="1" src={websiteMedia.url} width={websiteMedia.width} />, <Heading color="#0f172a" key="2" level="6" text={websiteMedia.name} textAlign="center" />],
                    footer: [
                      <Button borderRadius="8px" disabled={copiedLinks[websiteMedia?._id?.toString()]} key="1" onClick={(e) => onClickCopyLink(e, websiteMedia)} width="calc(50% - 0.5rem)">
                        {copiedLinks[websiteMedia?._id?.toString()] ? platform.websiteAdmin.media.linkCopied[language] : platform.websiteAdmin.media.copyLink[language]}
                      </Button>,
                      canDelete && (
                        <Button borderRadius="8px" key="2" onClick={(e) => setWebsiteMediaToDelete(websiteMedia)} theme="danger" width="calc(50% - 0.5rem)">
                          {platform.websiteAdmin.media.delete[language]}
                        </Button>
                      ),
                    ],
                  },
                }}
              </Card>
            );
          }
        })}
      </Grid>
      {websiteMediaToDelete && (
        <Dialog dialogRef={dialogRef}>
          {{
            slots: {
              header: [<Heading color="#0f172a" key="1" level="6" text={platform.websiteAdmin.media.dialogTitle[language]} />],
              body: [<Text key="1" text={platform.websiteAdmin.media.dialogText[language]} />],
              footer: [
                <Button key="1" onClick={onClickCancel}>
                  {platform.websiteAdmin.media.dialogCancel[language]}
                </Button>,
                <Button key="2" onClick={onClickDelete} theme="danger">
                  {platform.websiteAdmin.media.dialogDelete[language]}
                </Button>,
              ],
            },
          }}
        </Dialog>
      )}
    </>
  );
}
