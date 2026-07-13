// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";

export default function LeafletMap(props) {
  const attribution = props.attribution || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="https://leafletjs.com">Leaflet</a>';
  const center = props.center || [55.60930927366408, 12.999911968422987];
  const centerPopupContent = props.centerPopupContent;
  const isMapResizeRequired = props.isMapResizeRequired;
  const scrollWheelZoom = props.scrollWheelZoom;
  const setCenter = props.setCenter;
  const setContextMenuX = props.setContextMenuX;
  const setContextMenuY = props.setContextMenuY;
  const setIsContextMenuVisible = props.setIsContextMenuVisible;
  const setIsMapResizeRequired = props.setIsMapResizeRequired;
  const setPoint = props.setPoint;
  const url = props.url || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const zoom = props.zoom || 10;

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const tileLayerRef = useRef(null);

  function onMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      scrollWheelZoom: scrollWheelZoom,
    });

    const tileLayer = L.tileLayer(url, { attribution: attribution }).addTo(map);

    mapRef.current = map;

    tileLayerRef.current = tileLayer;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      tileLayerRef.current = null;

      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(url);

      const map = mapRef.current;

      if (map && map.attributionControl) {
        map.attributionControl.removeAttribution(tileLayerRef.current.options.attribution);
        map.attributionControl.addAttribution(attribution);
      }

      tileLayerRef.current.options.attribution = attribution;
    }
  }, [attribution, url]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    const handleClick = (e) => {
      setIsContextMenuVisible?.(false);

      if (setCenter) {
        setCenter([e.latlng.lat, e.latlng.lng]);
      }
    };

    const handleContextMenu = (e) => {
      const boundingClientRect = e.originalEvent.target.getBoundingClientRect();

      setContextMenuX?.(e.originalEvent.clientX - boundingClientRect.left);
      setContextMenuY?.(e.originalEvent.clientY - boundingClientRect.top);

      setIsContextMenuVisible?.(true);

      setPoint?.([e.latlng.lat, e.latlng.lng]);
    };

    map.on("click", handleClick);
    map.on("contextmenu", handleContextMenu);

    return () => {
      map.off("click", handleClick);
      map.off("contextmenu", handleContextMenu);
    };
  }, [setCenter, setContextMenuX, setContextMenuY, setIsContextMenuVisible, setPoint]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    if (!center || !Array.isArray(center) || center.length < 2) {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      return;
    }

    const targetLatLng = L.latLng(center[0], center[1]);
    const currentCenter = map.getCenter();

    if (currentCenter.distanceTo(targetLatLng) > 1) {
      map.flyTo(targetLatLng, map.getZoom());
    }

    if (!markerRef.current) {
      const customIcon = L.icon({
        iconAnchor: [12, 55],
        iconSize: [25, 41],
        iconUrl: "/images/marker-icon.png",
        popupAnchor: [-3, -76],
        shadowAnchor: [12, 55],
        shadowSize: [41, 41],
        shadowUrl: "/images/marker-shadow.png",
      });

      markerRef.current = L.marker(targetLatLng, { icon: customIcon }).addTo(map);
    } else {
      markerRef.current.setLatLng(targetLatLng);
    }

    if (centerPopupContent) {
      markerRef.current.bindPopup(centerPopupContent);
      markerRef.current.openPopup();
    } else {
      markerRef.current.unbindPopup();
    }
  }, [center, centerPopupContent]);

  useEffect(() => {
    const map = mapRef.current;

    if (map && zoom && map.getZoom() !== zoom) {
      map.setZoom(zoom);
    }
  }, [zoom]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    if (scrollWheelZoom) {
      map.scrollWheelZoom.enable();
    } else {
      map.scrollWheelZoom.disable();
    }
  }, [scrollWheelZoom]);

  useEffect(() => {
    const map = mapRef.current;

    if (isMapResizeRequired && map) {
      map.invalidateSize();

      setIsMapResizeRequired?.(false);
    }
  }, [isMapResizeRequired, setIsMapResizeRequired]);

  return <div onMouseDown={onMouseDown} ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />;
}
