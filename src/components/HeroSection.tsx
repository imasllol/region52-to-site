import type { ReactNode } from "react";
import { siteContent } from "@/content/site";
import { MagneticButton } from "@/features/motion/MagneticButton";
import { MapPinIcon, PhoneIcon, ShieldCheckIcon } from "./Icons";

interface HeroSectionProps {
  /** Слот для главной кнопки записи */
  primaryAction?: ReactNode;
  /** Фоновый слот (3D-сцена) */
  background?: ReactNode;
  /** Компактный индикатор статуса работы */
  status?: ReactNode;
  /** Замена заголовка (анимированная версия) */
  title?: ReactNode;
}

function HeroBackdrop() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(255,90,31,0.28),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_90%,rgba(255,90,31,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
    </>
  );
}

export function HeroTitle() {
  const { title, ownerName } = siteContent;
  const lead = title.slice(0, title.length - ownerName.length).trim();
  return (
    <h1 className="font-display font-bold tracking-tight">
      <span className="block text-[clamp(2.25rem,7vw,5.25rem)] leading-[1.02]">{lead}</span>{" "}
      <span className="mt-3 block text-[clamp(1.25rem,3.2vw,2.25rem)] leading-tight text-accent">
        {ownerName}
      </span>
    </h1>
  );
}

export function HeroSection({ primaryAction, background, status, title }: HeroSectionProps) {
  const { registryNumber, busNotice, phone, address, categories } = siteContent;
  const codes = categories.map((c) => c.code);

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 md:pt-32"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <HeroBackdrop />
        {background}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
      </div>

      <div className="container-site">
        <div className="max-w-3xl lg:max-w-2xl xl:max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent backdrop-blur">
              <ShieldCheckIcon className="size-4" />
              Реестр операторов техосмотра РСА: {registryNumber}
            </span>
            {status}
          </div>

          <div className="mt-6">{title ?? <HeroTitle />}</div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Техосмотр мототехники, легковых и грузовых автомобилей, автобусов и прицепов.
            Категории {codes.join(", ")}.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {primaryAction}
            <MagneticButton>
              <a
                href={`tel:${phone.tel}`}
                className={`btn ${primaryAction ? "btn-ghost" : "btn-primary"} text-base`}
              >
                <PhoneIcon className="size-5" />
                Позвонить
              </a>
            </MagneticButton>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <p className="card flex items-start gap-3 bg-surface/80 p-4 text-sm leading-relaxed backdrop-blur">
              <PhoneIcon className="mt-0.5 size-5 shrink-0 text-accent" />
              <span>
                {busNotice}:{" "}
                <a href={`tel:${phone.tel}`} className="font-semibold text-ink underline-offset-4 hover:underline">
                  {phone.display}
                </a>
              </span>
            </p>
            <p className="card flex items-start gap-3 bg-surface/80 p-4 text-sm leading-relaxed backdrop-blur">
              <MapPinIcon className="mt-0.5 size-5 shrink-0 text-accent" />
              <span>
                <span className="block text-muted">Адрес ПТО</span>
                <a href="#contacts" className="font-semibold underline-offset-4 hover:underline">
                  {address.short}
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
