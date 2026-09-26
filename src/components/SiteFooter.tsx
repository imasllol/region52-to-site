import type { ReactNode } from "react";
import { siteContent } from "@/content/site";

interface SiteFooterProps {
  /** Слот для ссылки на политику конфиденциальности */
  links?: ReactNode;
}

export function SiteFooter({ links }: SiteFooterProps) {
  const { ownerName, address, phone, email, registryNumber } = siteContent;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="container-site grid gap-8 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="font-display text-sm font-bold">Контакты</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{address.full}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <a href={`tel:${phone.tel}`} className="font-semibold hover:text-accent">
            {phone.display}
          </a>
          <a href={`mailto:${email}`} className="break-all text-muted hover:text-accent">
            {email}
          </a>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted">
          <span>Реестр операторов ТО РСА: {registryNumber}</span>
          {links}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-site py-6 text-xs text-muted">
          © {year} {ownerName}
        </div>
      </div>
    </footer>
  );
}
