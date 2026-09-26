import { siteContent } from "@/content/site";
import { CheckIcon } from "./Icons";

export function RequiredDocumentsSection() {
  return (
    <div>
      <h3 className="font-display text-xl font-bold">При себе иметь документы</h3>
      <ul className="mt-6 grid gap-3">
        {siteContent.requiredDocuments.map((item) => (
          <li key={item} className="card flex items-start gap-4 p-5">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-night">
              <CheckIcon className="size-4" strokeWidth={2.6} />
            </span>
            <span className="font-medium leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
