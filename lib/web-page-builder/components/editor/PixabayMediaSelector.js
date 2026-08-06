// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { faChevronDoubleLeft, faChevronDoubleRight } from "@fortawesome/pro-solid-svg-icons";

import { DarkCard } from "../card/Card";
import Grid from "../grid/Grid";
import Icon from "./Icon";
import Image from "../image/Image";
import Section from "../section/Section";
import Text from "../text/Text";
import { useViewport } from "@/hooks/useViewport";

import importedStyles from "./PixabayMediaSelector.module.css";

export default function PixabayMediaSelector(props) {
  const isSearching = props.isSearching;
  const searchTerm = props.searchTerm;
  const selectedImagePixabay = props.selectedImagePixabay;
  const setIsSearching = props.setIsSearching;
  const setSelectedImagePixabay = props.setSelectedImagePixabay;
  const styles = props.styles || importedStyles;

  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [isSearchingNewPage, setIsSearchingNewPage] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [pagination, setPagination] = useState([]);

  const { isMobileOriginal, isTabletOriginal } = useViewport();

  function handleSelect(image) {
    setSelectedImagePixabay(image);
  }

  async function loadImagesOnPage(pageToLoad) {
    try {
      setIsSearchingNewPage(true);

      const response = await axios.get("/api/image", {
        params: { query: searchTerm, page: pageToLoad },
      });

      const data = response.data;
      const images = data.images;
      const page = data.page;
      const pages = data.pages;

      setImages(images);

      setPage(page);
      setPages(pages);

      setPagination(computePagination(page, pages));

      setError(null);
    } catch (error) {
      setImages([]);

      setPage(1);
      setPages(0);

      setPagination([]);

      setError("Could not load images.");
    } finally {
      setIsSearchingNewPage(false);
    }
  }

  useEffect(() => {
    const fetchCachedImages = async () => {
      try {
        const response = await axios.get("/api/image", {
          params: { query: searchTerm },
        });

        const data = response.data;
        const images = data.images;
        const page = data.page;
        const pages = data.pages;

        setImages(images);

        setPage(page);
        setPages(pages);

        setPagination(computePagination(page, pages));

        setError(null);
      } catch (error) {
        setImages([]);

        setPage(1);
        setPages(0);

        setPagination([]);

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
      {isSearching || isSearchingNewPage ? (
        <Section backgroundColor="rgba(96, 165, 250, 0.1)" borderColor="#1e3a8a" borderRadius="4px" borderWidth="1px" padding="0.5rem 1rem">
          <Text color="#60a5fa" text="Loading images..." />
        </Section>
      ) : error ? (
        <Section backgroundColor="rgba(248, 113, 113, 0.1)" borderColor="#7f1d1d" borderRadius="4px" borderWidth="1px" padding="0.5rem 1rem">
          <Text color={"#f87171"} text={error} />
        </Section>
      ) : (
        <>
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
          {pagination.length > 0 && (
            <div className={styles.pagination}>
              <div
                className={styles.page + (page === 1 ? " " + styles.page_disabled : "")}
                onClick={
                  page === 1
                    ? undefined
                    : (e) => {
                        setImages([]);

                        loadImagesOnPage(1);
                      }
                }
              >
                <Icon icon={faChevronDoubleLeft} size={16} />
              </div>
              {pagination.map((currentPage) => (
                <div
                  className={styles.page + (currentPage === page ? " " + styles.page_active : "")}
                  key={currentPage}
                  onClick={
                    currentPage === page
                      ? undefined
                      : (e) => {
                          setImages([]);

                          loadImagesOnPage(currentPage);
                        }
                  }
                >
                  {currentPage}
                </div>
              ))}
              <div
                className={styles.page + (page === pages ? " " + styles.page_disabled : "")}
                onClick={
                  page === pages
                    ? undefined
                    : (e) => {
                        setImages([]);

                        loadImagesOnPage(pages);
                      }
                }
              >
                <Icon icon={faChevronDoubleRight} size={16} />
              </div>
            </div>
          )}
        </>
      )}
    </Section>
  );
}

function computePagination(page, pages) {
  const maximumPagesPerSide = 5;

  let pageMinimum = page - maximumPagesPerSide;
  let pageMaximum = page + maximumPagesPerSide;

  if (pageMinimum < 1 && pageMaximum > pages) {
    pageMinimum = 1;
    pageMaximum = pages;
  } else if (pageMinimum < 1) {
    pageMaximum = Math.min(pageMaximum + (1 - pageMinimum), pages);
    pageMinimum = 1;
  } else if (pageMaximum > pages) {
    pageMinimum = Math.max(pageMinimum - (pageMaximum - pages), 1);
    pageMaximum = pages;
  }

  const pagination = [];

  for (let i = pageMinimum; i <= pageMaximum; i++) {
    pagination.push(i);
  }

  return pagination;
}
