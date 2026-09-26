import { siteContent } from "@/content/site";
import { ArrowUpRightIcon, FileTextIcon } from "./Icons";

export function LegalDocumentsSection() {
  const documents = siteContent.legalDocuments.filter(
    (doc): doc is { title: string; href: string } => Boolean(doc.href),
  );

  if (documents.length === 0) return null;

  return (
    <div>
      <h3 className="font-display text-xl font-bold">Нормативные документы</h3>
      <ul className="mt-6 grid gap-3">
        {documents.map((doc) => (
          <li key={doc.href}>
            <a
              href={doc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card group flex min-h-16 items-center gap-4 p-4 transition-colors hover:border-accent/40"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                <FileTextIcon className="size-5" />
              </span>
              <span className="flex-1 font-medium leading-snug">{doc.title}</span>
              <ArrowUpRightIcon className="size-5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
