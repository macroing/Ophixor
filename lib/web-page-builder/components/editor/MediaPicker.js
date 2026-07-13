// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { faBrowser, faCancel, faCheck, faUpload } from "@fortawesome/pro-solid-svg-icons";

import { DarkButton } from "../button/Button";
import { DarkCard } from "../card/Card";
import { DarkDialog } from "../dialog/Dialog";
import { DarkInput } from "../input/Input";
import Grid from "../grid/Grid";
import Heading from "../heading/Heading";
import Icon from "./Icon";
import Image from "../image/Image";
import ImageUploader from "./ImageUploader";
import Text from "../text/Text";
import { useViewport } from "@/hooks/useViewport";

export default function MediaPicker(props) {
  const accept = props.accept || "image";
  const canCreateMedia = props.canCreateMedia;
  const canReadMedia = props.canReadMedia;
  const isDemo = props.isDemo;
  const isOpen = props.isOpen;
  const onClose = props.onClose;
  const onSelect = props.onSelect;
  const website = props.website;

  const dialogRef = useRef();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [websiteMedias, setWebsiteMedias] = useState([]);

  const { isMobileOriginal, isTabletOriginal } = useViewport();

  function formDataConfigurator(formData) {
    formData.append("websiteId", website._id.toString());
  }

  function handleConfirm() {
    const selected = websiteMedias.find((m) => m._id.toString() === selectedId);

    if (!selected) {
      return;
    }

    setShowUploader(false);

    onSelect?.(selected);
    onClose?.();

    setSelectedId(null);
    setUploadMessage("");
    setUploadStatus("");
    setWebsiteMedias([]);
  }

  function handleSelect(media) {
    setSelectedId(media._id.toString());
  }

  function handleUploadComplete(isSuccessful) {
    if (isSuccessful) {
      setUploadMessage("Your image has been successfully uploaded!");
      setUploadStatus("success");

      setSelectedId(null);

      loadWebsiteMedias();
    } else {
      setUploadMessage("Your image could not be uploaded!");
      setUploadStatus("failure");

      setSelectedId(null);
    }
  }

  async function loadWebsiteMedias() {
    if (!website) {
      return;
    }

    setLoading(true);

    if (isDemo) {
      setWebsiteMedias(getDemoWebsiteMedias());
    } else {
      try {
        const { data } = await axios.get(`/api/website-media/list?websiteId=${website._id}`);

        if (data.websiteMedias) {
          setWebsiteMedias(data.websiteMedias);
        }
      } catch (error) {}
    }

    setLoading(false);
  }

  function onClickClose(e) {
    setShowUploader(false);

    setSelectedId(null);
    setUploadMessage("");
    setUploadStatus("");
    setWebsiteMedias([]);

    onClose?.();
  }

  useEffect(() => {
    if (isOpen) {
      loadWebsiteMedias();

      dialogRef?.current?.showModal();
    } else {
      dialogRef?.current?.close();
    }
  }, [isOpen]);

  const filteredMedia = websiteMedias.filter((media) => {
    if (accept && media.type !== accept) {
      return false;
    }

    if (!search) {
      return true;
    }

    return media.name.toLowerCase().includes(search.toLowerCase());
  });

  if (!isOpen || !canReadMedia) {
    return null;
  }

  return (
    <DarkDialog dialogRef={dialogRef} height="100%" heightBody="100%" maxHeight="90vh" maxWidth="1200px" width="100%" widthBody="100%">
      {{
        slots: {
          header: [<Heading color="#e5e7eb" key="1" level="5" text="Select Media" />],
          body: [
            <div key="1" style={{ display: "grid", gap: "1rem" }}>
              {showUploader && canCreateMedia ? (
                <div style={{ alignItems: "center", display: "flex", gap: "1rem", justifyContent: uploadMessage ? "space-between" : "flex-end" }}>
                  {uploadMessage && uploadStatus && <Text color={uploadStatus === "success" ? "#4ade80" : "#f87171"} text={uploadMessage} />}
                  <DarkButton onClick={() => setShowUploader(false)} theme="primary" type="button">
                    <Icon icon={faBrowser} size={16} /> Browse
                  </DarkButton>
                </div>
              ) : (
                <div style={{ alignItems: "center", display: "flex", gap: "1rem" }}>
                  <DarkInput onChange={(e) => setSearch(e.target.value)} placeholder="Search media..." value={search} />
                  <DarkButton disabled={!canCreateMedia} onClick={() => setShowUploader(true)} theme="primary" type="button">
                    <Icon icon={faUpload} size={16} /> Upload
                  </DarkButton>
                </div>
              )}
              {showUploader && canCreateMedia ? (
                <ImageUploader formDataConfigurator={formDataConfigurator} key="uploader" onUploadComplete={handleUploadComplete} uploadUrl="/api/website-media/upload" />
              ) : loading ? (
                <Text color="#e5e7eb" text="Loading media..." />
              ) : (
                <Grid gridTemplateColumns={isMobileOriginal ? "1fr" : isTabletOriginal ? "repeat(2, 1fr)" : "repeat(3, 1fr)"} padding="0px">
                  {filteredMedia.map((media) => (
                    <DarkCard alignItemsBody="center" borderColor={selectedId === media._id.toString() ? "#2563eb" : undefined} borderColorHover={selectedId === media._id.toString() ? "#2563eb" : undefined} boxShadowHover="0 16px 48px rgba(15, 23, 42, 0.18)" cursor="pointer" key={media._id} onClick={() => handleSelect(media)} paddingBody="0.75rem" transformHover="translateY(-4px)" transition="all 0.3s ease">
                      {{
                        slots: {
                          header: [],
                          body: [<Image alt={media.alt} cursor="pointer" height="150px" key="1" objectFit="cover" src={media.url} width="100%" />, <Text color="#e5e7eb" cursor="pointer" key="2" style={{ fontSize: "0.8rem", textAlign: "center" }} text={media.name} />],
                          footer: [],
                        },
                      }}
                    </DarkCard>
                  ))}
                </Grid>
              )}
            </div>,
          ],
          footer: [
            <DarkButton key="1" onClick={onClickClose} type="button">
              <Icon icon={faCancel} size={16} /> Cancel
            </DarkButton>,
            <DarkButton disabled={!selectedId} key="2" onClick={handleConfirm} theme="primary" type="button">
              <Icon icon={faCheck} size={16} /> Select
            </DarkButton>,
          ],
        },
      }}
    </DarkDialog>
  );
}

function getDemoWebsiteMedias() {
  return [
    {
      _id: "1",
      alt: "Hero",
      name: "hero",
      type: "image",
      url: "/images/hero.webp",
    },
    {
      _id: "2",
      alt: "Logo",
      name: "logo",
      type: "image",
      url: "/images/logo.webp",
    },
  ];
}
