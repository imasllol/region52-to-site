"use client";

import { siteContent } from "@/content/site";
import { formatTime } from "@/content/work-status";
import { useWorkStatus } from "@/hooks/useWorkStatus";
import { WorkStatusIndicator } from "./WorkStatusIndicator";

export function ScheduleSection() {
  const status = useWorkStatus();
  const today = status?.todayWeekday;

  return (
    <section id="schedule" aria-labelledby="schedule-title" className="section">
      <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div>
          <p className="eyebrow">График работы</p>
          <h2 id="schedule-title" className="section-title mt-4">
            Когда мы работаем
          </h2>
          <p className="mt-4 text-muted">Время московское.</p>
          <div className="mt-8 max-w-sm">
            <WorkStatusIndicator variant="full" />
          </div>
        </div>

        <ul className="card divide-y divide-line overflow-hidden">
          {siteContent.schedule.days.map((day) => {
            const isToday = day.weekday === today;
            return (
              <li
                key={day.weekday}
                aria-current={isToday ? "date" : undefined}
                className={`flex items-center justify-between gap-4 px-5 py-4 sm:px-6 ${
                  isToday ? "bg-accent-soft" : ""
                }`}
              >
                <span className="flex items-center gap-3 font-medium">
                  {day.label}
                  {isToday ? (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-night">
                      Сегодня
                    </span>
                  ) : null}
                </span>
                <span
                  className={
                    day.open && day.close
                      ? "font-display text-sm font-semibold tabular-nums"
                      : "text-sm text-muted"
                  }
                >
                  {day.open && day.close
                    ? `${formatTime(day.open)} – ${formatTime(day.close)}`
                    : "Выходной"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
