import type { ReactNode } from "react";
import { siteContent, type VehicleCategoryCode } from "@/content/site";
import { Reveal } from "@/features/motion/Reveal";
import { TiltCard } from "@/features/motion/TiltCard";
import { CategoryCard } from "./CategoryCard";

interface AccreditationSectionProps {
  renderAction?: (code: VehicleCategoryCode) => ReactNode;
}

export function AccreditationSection({ renderAction }: AccreditationSectionProps) {
  return (
    <section id="accreditation" aria-labelledby="accreditation-title" className="section">
      <div className="container-site">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Область аккредитации</p>
          <h2 id="accreditation-title" className="section-title mt-4">
            Какие транспортные средства мы проверяем
          </h2>
          <p className="mt-4 text-muted">
            Пункт аккредитован на технический осмотр {siteContent.categories.length} категорий транспортных
            средств.
          </p>
        </Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteContent.categories.map((category, index) => (
            <li key={category.code} className="h-full">
              <Reveal className="h-full" delay={index * 0.06}>
                <TiltCard className="h-full">
                  <CategoryCard category={category} action={renderAction?.(category.code)} />
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
