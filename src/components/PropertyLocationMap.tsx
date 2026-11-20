"use client";

import { useEffect, useRef, useState } from "react";
import type { PropertyMapPoint } from "@/lib/propertyMapGeocode";
import {
  propertyMapSearch,
  storedTenerifeCoordinates,
  type PropertyMapLocation,
} from "@/lib/propertyMapQuery";
import "maplibre-gl/dist/maplibre-gl.css";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

function circleRing(lng: number, lat: number, radiusMeters: number) {
  const steps = 64;
  const earth = 6378137;
  const coordinates: [number, number][] = [];
  for (let index = 0; index <= steps; index += 1) {
    const angle = (index / steps) * Math.PI * 2;
    const dx = radiusMeters * Math.cos(angle);
    const dy = radiusMeters * Math.sin(angle);
    const dLat = (dy / earth) * (180 / Math.PI);
    const dLng =
      (dx / (earth * Math.cos((lat * Math.PI) / 180))) * (180 / Math.PI);
    coordinates.push([lng + dLng, lat + dLat]);
  }
  return {
    type: "Feature" as const,
    geometry: { type: "Polygon" as const, coordinates: [coordinates] },
    properties: {},
  };
}

export function PropertyLocationMap(location: PropertyMapLocation) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [point, setPoint] = useState<PropertyMapPoint | null>(null);
  const [phase, setPhase] = useState<"loading" | "ready" | "hidden">("loading");

  const canPlace =
    propertyMapSearch(location) !== null ||
    storedTenerifeCoordinates(location) !== null;

  useEffect(() => {
    if (!canPlace) return;
    let cancelled = false;
    const params = new URLSearchParams();
    if (location.address) params.set("address", location.address);
    if (location.city) params.set("city", location.city);
    if (location.region) params.set("region", location.region);
    if (location.latitude) params.set("latitude", String(location.latitude));
    if (location.longitude) params.set("longitude", String(location.longitude));

    fetch(`/api/property-map?${params.toString()}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { point?: PropertyMapPoint | null } | null) => {
        if (cancelled) return;
        if (!body?.point || !Number.isFinite(body.point.lat)) {
          setPhase("hidden");
          return;
        }
        setPoint(body.point);
      })
      .catch(() => {
        if (!cancelled) setPhase("hidden");
      });

    return () => {
      cancelled = true;
    };
  }, [
    canPlace,
    location.address,
    location.city,
    location.region,
    location.latitude,
    location.longitude,
  ]);

  useEffect(() => {
    if (!point || !containerRef.current) return;
    let map: import("maplibre-gl").Map | null = null;
    let cancelled = false;

    (async () => {
      const maplibre = await import("maplibre-gl");
      if (cancelled || !containerRef.current) return;

      map = new maplibre.Map({
        container: containerRef.current,
        style: MAP_STYLE,
        center: [point.lng, point.lat],
        zoom: point.zoom,
        cooperativeGestures: true,
        dragRotate: false,
        pitchWithRotate: false,
        attributionControl: { compact: true },
      });
      map.addControl(
        new maplibre.NavigationControl({
          showCompass: false,
          visualizePitch: false,
        }),
        "top-right"
      );

      const marker = document.createElement("div");
      marker.style.width = "18px";
      marker.style.height = "18px";
      marker.style.borderRadius = "999px";
      marker.style.background = "#1d4ed8";
      marker.style.border = "3px solid white";
      marker.style.boxShadow = "0 6px 16px rgba(29, 78, 216, 0.45)";
      new maplibre.Marker({ element: marker, anchor: "center" })
        .setLngLat([point.lng, point.lat])
        .addTo(map);

      map.on("load", () => {
        containerRef.current
          ?.querySelector(".maplibregl-ctrl-attrib")
          ?.classList.remove("maplibregl-compact-show");
        if (!map || point.radiusMeters <= 0) {
          setPhase("ready");
          return;
        }
        map.addSource("property-area", {
          type: "geojson",
          data: circleRing(point.lng, point.lat, point.radiusMeters),
        });
        map.addLayer({
          id: "property-area-fill",
          type: "fill",
          source: "property-area",
          paint: { "fill-color": "#2563eb", "fill-opacity": 0.16 },
        });
        map.addLayer({
          id: "property-area-line",
          type: "line",
          source: "property-area",
          paint: {
            "line-color": "#1d4ed8",
            "line-width": 2,
            "line-opacity": 0.75,
          },
        });
        setPhase("ready");
      });
    })().catch(() => {
      if (!cancelled) setPhase("hidden");
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [point]);

  if (!canPlace || phase === "hidden") return null;

  return (
    <div
      className="property-location-map relative mt-5 h-72 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm md:h-80"
      role="region"
      aria-label={point?.label ?? "Map"}
    >
      <div ref={containerRef} className="h-full w-full" />
      {phase !== "ready" ? (
        <div className="absolute inset-0 animate-pulse bg-slate-100" />
      ) : null}
      {point ? (
        <div className="pointer-events-none absolute left-3 top-3 z-10 max-w-[75%] truncate rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-slate-800 shadow-sm">
          {point.label}
        </div>
      ) : null}
      <style>{`
        .property-location-map .maplibregl-ctrl-attrib {
          font-size: 10px;
          background: rgba(255, 255, 255, 0.86);
        }
        .property-location-map .maplibregl-ctrl-top-right {
          top: 44px;
        }
      `}</style>
    </div>
  );
}
