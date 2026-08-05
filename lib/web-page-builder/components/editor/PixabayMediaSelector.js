// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import { DarkCard } from "../card/Card";
import Grid from "../grid/Grid";
import Image from "../image/Image";
import Section from "../section/Section";
import Text from "../text/Text";
import { useViewport } from "@/hooks/useViewport";

export default function PixabayMediaSelector(props) {
  const isSearching = props.isSearching;
  const searchTerm = props.searchTerm;
  const selectedImagePixabay = props.selectedImagePixabay;
  const setIsSearching = props.setIsSearching;
  const setSelectedImagePixabay = props.setSelectedImagePixabay;

  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);

  const { isMobileOriginal, isTabletOriginal } = useViewport();

  function handleSelect(image) {
    setSelectedImagePixabay(image);
  }

  useEffect(() => {
    const fetchCachedImages = async () => {
      try {
        const response = await axios.get("/api/image", {
          params: { query: searchTerm },
        });

        setImages(response.data);

        setError(null);
      } catch (error) {
        setImages([]);

        setError("Could not load images.");
      } finally {
        setIsSearching(false);
      }
    };

    if (searchTerm.length > 3 && isSearching) {
      fetchCachedImages();
    }
  }, [isSearching, searchTerm]);

  return (
    <Section padding="0px">
      {isSearching ? (
        <Section backgroundColor="rgba(96, 165, 250, 0.1)" borderColor="#1e3a8a" borderRadius="4px" borderWidth="1px" padding="0.5rem 1rem">
          <Text color="#60a5fa" text="Loading images..." />
        </Section>
      ) : error ? (
        <Section backgroundColor="rgba(248, 113, 113, 0.1)" borderColor="#7f1d1d" borderRadius="4px" borderWidth="1px" padding="0.5rem 1rem">
          <Text color={"#f87171"} text={error} />
        </Section>
      ) : (
        <Grid gridTemplateColumns={isMobileOriginal ? "1fr" : isTabletOriginal ? "repeat(2, 1fr)" : "repeat(3, 1fr)"} padding="0px">
          {images.map((image) => (
            <DarkCard alignItemsBody="center" borderColor={selectedImagePixabay?.id?.toString() === image.id.toString() ? "#2563eb" : "#374151"} borderColorHover={selectedImagePixabay?.id?.toString() === image.id.toString() ? "#2563eb" : "#1e3a8a"} boxShadowHover="0 16px 48px rgba(15, 23, 42, 0.18)" cursor="pointer" isHoverEffect={true} key={image.id} onClick={() => handleSelect(image)} paddingBody="0.75rem" transformHover="translateY(-4px)" transition="all 0.3s ease">
              {{
                slots: {
                  header: [],
                  body: [<Image alt={image.tags} borderColor="#2d3748" borderWidth="1px" cursor="pointer" height="150px" key="1" objectFit="contain" src={image.webformatURL} width="100%" />, <Text color="#e5e7eb" cursor="pointer" key="2" style={{ fontSize: "0.8rem", textAlign: "center" }} text={image.user} />],
                  footer: [],
                },
              }}
            </DarkCard>
          ))}
        </Grid>
      )}
    </Section>
  );
}
