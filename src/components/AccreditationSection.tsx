import type { ReactNode } from "react";
import { siteContent, type VehicleCategoryCode } from "@/content/site";
import { CategoryCard } from "./CategoryCard";

interface AccreditationSectionProps {
  renderAction?: (code: VehicleCategoryCode) => ReactNode;
}

export function AccreditationSection({ renderAction }: AccreditationSectionProps) {
  return (
    <section id="accreditation" aria-labelledby="accreditation-title" className="section">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow">Область аккредитации</p>
          <h2 id="accreditation-title" className="section-title mt-4">
            Какие транспортные средства мы проверяем
          </h2>
          <p className="mt-4 text-muted">
            Пункт аккредитован на технический осмотр {siteContent.categories.length} категорий транспортных
            средств.
          </p>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteContent.categories.map((category) => (
            <li key={category.code}>
              <CategoryCard category={category} action={renderAction?.(category.code)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
