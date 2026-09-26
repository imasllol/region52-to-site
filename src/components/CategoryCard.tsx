import type { ReactNode } from "react";
import type { VehicleCategory } from "@/content/site";
import { VehicleIconView } from "./Icons";

interface CategoryCardProps {
  category: VehicleCategory;
  /** Слот для кнопки записи с этой категорией */
  action?: ReactNode;
}

export function CategoryCard({ category, action }: CategoryCardProps) {
  return (
    <article className="card group relative flex h-full flex-col overflow-hidden p-6 transition-colors duration-300 hover:border-accent/40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-accent/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-0"
      />
      <div className="flex items-start justify-between gap-4">
        <span className="font-display text-5xl font-bold leading-none text-accent">{category.code}</span>
        <span className="grid size-12 place-items-center rounded-2xl border border-line bg-white/5 text-ink">
          <VehicleIconView icon={category.icon} className="size-6" />
        </span>
      </div>
      <h3 className="mt-6 font-display text-lg font-bold">{category.shortLabel}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{category.description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </article>
  );
}
