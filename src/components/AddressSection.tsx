"use client";

import { useEffect, useRef, useState } from "react";
import { siteContent } from "@/content/site";
import { MapPinIcon, NavigationIcon } from "./Icons";

type MapState = "idle" | "loading" | "loaded" | "failed";

const MAP_TIMEOUT_MS = 8000;

export function AddressSection() {
  const { address, geo, brand } = siteContent;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<MapState>("idle");

  // Карта загружается, когда блок подходит к видимой области.
  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setState("loading");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState((current) => (current === "idle" ? "loading" : current));
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Если карта не загрузилась за 8 секунд, прячем ее.
  useEffect(() => {
    if (state !== "loading") return;
    const timer = window.setTimeout(() => {
      setState((current) => (current === "loaded" ? current : "failed"));
    }, MAP_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [state]);

  const mapSrc = `https://yandex.ru/map-widget/v1/?ll=${geo.lon}%2C${geo.lat}&z=16&pt=${geo.lon}%2C${geo.lat}%2Cpm2rdm`;
  const routeHref = `https://yandex.ru/maps/?rtext=~${geo.lat}%2C${geo.lon}&rtt=auto`;

  return (
    <div ref={wrapperRef} className="flex flex-col gap-4">
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
            <MapPinIcon className="size-5" />
          </span>
          <div>
            <p className="text-sm text-muted">Адрес ПТО</p>
            <p className="mt-1 font-semibold leading-snug">{address.full}</p>
          </div>
        </div>
        <a
          href={routeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-6 w-full sm:w-auto"
        >
          <NavigationIcon className="size-5" />
          Построить маршрут
        </a>
      </div>

      {state !== "failed" ? (
        <div className="card relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
          {state === "loading" || state === "loaded" ? (
            <iframe
              src={mapSrc}
              title={`Карта: ${brand}, ${address.short}`}
              className="absolute inset-0 h-full w-full border-0"
              onLoad={() => setState("loaded")}
              onError={() => setState("failed")}
            />
          ) : null}
          {state !== "loaded" ? (
            <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-white/5" />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
