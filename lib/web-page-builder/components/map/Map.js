// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import Spinner from "../spinner/Spinner";
import { classNames } from "../runtime/style/classNames";
import { createMapSchema } from "./MapSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./Map.module.css";

const SCHEMA = createMapSchema();

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <Spinner />,
});

export default function Map({ attribution, centerLatitude, centerLongitude, centerPopupContent, componentId, editor, scrollWheelZoom, styles = importedStyles, url, zoom, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "map", true);
  const editorProps = getEditorProps(editor, true);

  const divRef = useRef();

  const [center, setCenter] = useState([getSafeCenterLatitude(centerLatitude), getSafeCenterLongitude(centerLongitude)]);
  const [contextMenuId, setContextMenuId] = useState(0);
  const [contextMenuItems, setContextMenuItems] = useState([]);
  const [contextMenuX, setContextMenuX] = useState(0);
  const [contextMenuY, setContextMenuY] = useState(0);
  const [currentAttribution, setCurrentAttribution] = useState(getSafeAttribution(attribution));
  const [currentCenterPopupContent, setCurrentCenterPopupContent] = useState(getSafeCenterPopupContent(centerPopupContent));
  const [currentScrollWheelZoom, setCurrentScrollWheelZoom] = useState(getSafeScrollWheelZoom(scrollWheelZoom));
  const [currentUrl, setCurrentUrl] = useState(getSafeUrl(url));
  const [currentZoom, setCurrentZoom] = useState(getSafeZoom(zoom));
  const [elements, setElements] = useState({});
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [isMapResizeRequired, setIsMapResizeRequired] = useState(true);
  const [isUpdatingLefts, setIsUpdatingLefts] = useState(false);
  const [key, setKey] = useState("");
  const [lefts, setLefts] = useState({});
  const [point, setPoint] = useState(null);

  const onUpdateRef = useCallback(
    (element) => {
      if (element) {
        const currentKey = element.id;

        if (elements && (!(currentKey in elements) || elements[currentKey].id !== currentKey)) {
          const newElements = { ...elements };

          newElements[currentKey] = element;

          setElements(newElements);
        }
      }
    },
    [elements, setElements],
  );

  function onClickItemButton(e, item) {
    e.stopPropagation();

    if (item.onClick) {
      item.onClick(e);
    }

    setIsContextMenuVisible(false);
  }

  function onClickItemButtonMenu(e, itemIndex, keyPrefix) {
    e.stopPropagation();

    setKey(key.startsWith(keyPrefix + itemIndex) ? keyPrefix : keyPrefix + itemIndex);
  }

  function renderItems(items, keyPrefix = contextMenuId) {
    return items.map((item, itemIndex) => (
      <li key={keyPrefix + itemIndex}>
        {item.items && item.items.length > 0 && (
          <>
            <button className={key.startsWith(keyPrefix + itemIndex) ? styles.button_selected : undefined} onClick={(e) => onClickItemButtonMenu(e, itemIndex, keyPrefix)}>
              <span>{item.text}</span>
              <span aria-hidden className="fa fa-chevron-right"></span>
            </button>
            <ul className={styles.context_menu} id={keyPrefix + itemIndex} ref={onUpdateRef} style={{ display: key.startsWith(keyPrefix + itemIndex) ? "flex" : "none", left: lefts[keyPrefix] ? lefts[keyPrefix] : "0px", top: "-10px" }}>
              {renderItems(item.items, keyPrefix + itemIndex)}
            </ul>
          </>
        )}
        {(!item.items || item.items.length === 0) && (
          <button onClick={(e) => onClickItemButton(e, item)}>
            <span>{item.text}</span>
            {item.icon && <span className={item.icon}></span>}
          </button>
        )}
      </li>
    ));
  }

  useEffect(() => {
    setElements({});
    setKey("");
    setLefts({});
  }, [contextMenuItems, setElements, setKey, setLefts]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      setIsMapResizeRequired(true);
    });

    if (divRef.current) {
      observer.observe(divRef.current);
    }

    return () => observer.disconnect();
  }, [divRef.current]);

  useEffect(() => {
    if (elements && key) {
      setIsUpdatingLefts(true);
    }
  }, [elements, key, setIsUpdatingLefts]);

  useEffect(() => {
    if (elements && key && isUpdatingLefts) {
      const newLefts = {};

      for (const [currentKey, currentElement] of Object.entries(elements)) {
        const boundingClientRect = currentElement.getBoundingClientRect();

        const left = Math.ceil(boundingClientRect.right - boundingClientRect.left) - 11 + "px";

        newLefts[currentKey] = left;
      }

      setIsUpdatingLefts(false);
      setLefts(newLefts);
    }
  }, [elements, key, isUpdatingLefts, setIsUpdatingLefts, setLefts]);

  useEffect(() => {
    setCurrentAttribution(getSafeAttribution(attribution));
  }, [attribution, setCurrentAttribution]);

  useEffect(() => {
    setCenter([getSafeCenterLatitude(centerLatitude), getSafeCenterLongitude(centerLongitude)]);
  }, [centerLatitude, centerLongitude, setCenter]);

  useEffect(() => {
    setCurrentCenterPopupContent(getSafeCenterPopupContent(centerPopupContent));
  }, [centerPopupContent, setCurrentCenterPopupContent]);

  useEffect(() => {
    setCurrentScrollWheelZoom(getSafeScrollWheelZoom(scrollWheelZoom));
  }, [scrollWheelZoom, setCurrentScrollWheelZoom]);

  useEffect(() => {
    setCurrentUrl(getSafeUrl(url));
  }, [setCurrentUrl, url]);

  useEffect(() => {
    setCurrentZoom(getSafeZoom(zoom));
  }, [setCurrentZoom, zoom]);

  return (
    <div className={classNames(styles.map, ...editorClasses)} data-pc-id={componentId} ref={divRef} style={style} {...editorProps}>
      <LeafletMap attribution={currentAttribution} center={center} centerPopupContent={currentCenterPopupContent} isMapResizeRequired={isMapResizeRequired} scrollWheelZoom={currentScrollWheelZoom} setCenter={setCenter} setContextMenuX={setContextMenuX} setContextMenuY={setContextMenuY} setIsContextMenuVisible={setIsContextMenuVisible} setIsMapResizeRequired={setIsMapResizeRequired} setPoint={setPoint} url={currentUrl} zoom={currentZoom} />
      {isContextMenuVisible && contextMenuItems && contextMenuItems.length > 0 && (
        <ul className={styles.context_menu} id={contextMenuId} onClick={(e) => e.stopPropagation()} ref={onUpdateRef} style={{ left: contextMenuX + "px", top: contextMenuY + "px" }}>
          {renderItems(contextMenuItems)}
        </ul>
      )}
    </div>
  );
}

function getSafeCenterLatitude(centerLatitude) {
  return getSafeNumber(centerLatitude, 55.60930927366408);
}

function getSafeCenterLongitude(centerLongitude) {
  return getSafeNumber(centerLongitude, 12.999911968422987);
}

function getSafeCenterPopupContent(centerPopupContent) {
  return typeof centerPopupContent === "string" || typeof centerPopupContent === "number" ? centerPopupContent : "";
}

function getSafeAttribution(attribution) {
  return typeof attribution === "string" ? attribution : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="https://leafletjs.com">Leaflet</a>';
}

function getSafeNumber(value, defaultValue = 0) {
  if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    const coercedValue = Number(value);

    if (Number.isFinite(coercedValue)) {
      return coercedValue;
    }

    return defaultValue;
  } else {
    return defaultValue;
  }
}

function getSafeScrollWheelZoom(scrollWheelZoom) {
  return typeof scrollWheelZoom === "boolean" ? scrollWheelZoom : true;
}

function getSafeUrl(url) {
  return typeof url === "string" ? url : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
}

function getSafeZoom(zoom) {
  return getSafeNumber(zoom, 10);
}
