import { siteContent } from "@/content/site";
import { MailIcon, PhoneIcon } from "./Icons";

export function ContactsSection() {
  const { phone, email } = siteContent;

  return (
    <div>
      <p className="eyebrow">Контакты</p>
      <h2 id="contacts-title" className="section-title mt-4">
        Как с нами связаться
      </h2>
      <div className="mt-8 grid gap-3">
        <a
          href={`tel:${phone.tel}`}
          className="card group flex items-center gap-4 p-6 transition-colors hover:border-accent/40"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-night">
            <PhoneIcon className="size-5" />
          </span>
          <span>
            <span className="block text-sm text-muted">Телефон</span>
            <span className="font-display text-xl font-bold group-hover:text-accent">{phone.display}</span>
          </span>
        </a>
        <a
          href={`mailto:${email}`}
          className="card group flex items-center gap-4 p-6 transition-colors hover:border-accent/40"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line bg-white/5 text-accent">
            <MailIcon className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm text-muted">Электронная почта</span>
            <span className="block break-all text-lg font-semibold group-hover:text-accent">{email}</span>
          </span>
        </a>
      </div>
    </div>
  );
}
