"use client";

import { useEffect, useState, type ReactNode } from "react";
import { siteContent } from "@/content/site";
import { MenuIcon, PhoneIcon, XIcon } from "./Icons";

export const navLinks = [
  { href: "#accreditation", label: "Аккредитация" },
  { href: "#price", label: "Стоимость" },
  { href: "#documents", label: "Документы" },
  { href: "#schedule", label: "График работы" },
  { href: "#contacts", label: "Контакты" },
];

interface SiteHeaderProps {
  /** Слот для кнопки записи (функция «Онлайн-запись на ТО») */
  action?: ReactNode;
  /** Слот для индикатора прогресса прокрутки */
  progress?: ReactNode;
}

export function SiteHeader({ action, progress }: SiteHeaderProps) {
  const { phone, brand } = siteContent;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        solid ? "border-line bg-night/80 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <div className="container-site flex h-16 items-center gap-3 md:h-20">
        <a href="#top" className="flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid size-10 place-items-center rounded-xl bg-accent font-display text-xs font-bold text-night">
            ТО
          </span>
          <span className="font-display text-sm font-bold leading-tight">
            {brand}
            <span className="block font-sans text-[11px] font-medium text-muted">Вознесенское</span>
          </span>
        </a>

        <nav aria-label="Разделы сайта" className="ml-4 hidden items-center md:flex lg:ml-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-2 py-2 text-sm text-muted transition-colors hover:text-ink lg:px-3"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={`tel:${phone.tel}`}
            className="hidden min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold transition-colors hover:text-accent xl:inline-flex"
          >
            <PhoneIcon className="size-4 text-accent" />
            {phone.display}
          </a>
          <a
            href={`tel:${phone.tel}`}
            aria-label={`Позвонить: ${phone.display}`}
            className="grid size-11 place-items-center rounded-full border border-line text-accent xl:hidden"
          >
            <PhoneIcon className="size-5" />
          </a>
          {action ? <div className="hidden lg:block">{action}</div> : null}
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line md:hidden"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>

      {progress}

      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-night/95 backdrop-blur-xl md:hidden"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <nav aria-label="Меню" className="container-site flex flex-col gap-1 py-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-4 font-display text-xl font-semibold transition-colors hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-6 flex flex-col gap-3" onClick={() => setOpen(false)}>
              {action}
              <a href={`tel:${phone.tel}`} className="btn btn-ghost">
                <PhoneIcon className="size-5 text-accent" />
                {phone.display}
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
