/**
 * WorkStatusService (блупринт «Контент сайта»).
 * Чистые функции: текущее время передается параметром. Время всегда считается
 * в часовом поясе ПТО, независимо от часового пояса устройства.
 */
import type { ScheduleDay, Weekday, WorkSchedule } from "./site";

export const DEFAULT_TIME_ZONE = "Europe/Moscow";

export interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: Weekday;
}

export interface NextOpen {
  weekday: Weekday;
  label: string;
  onLabel: string;
  time: string;
  isToday: boolean;
  isTomorrow: boolean;
}

export interface WorkStatus {
  isOpen: boolean;
  todayWeekday: Weekday;
  closesAt: string | null;
  nextOpen: NextOpen | null;
}

const WEEKDAY_BY_SHORT_NAME: Record<string, Weekday> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function getZonedParts(now: Date, timeZone: string = DEFAULT_TIME_ZONE): ZonedParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  });
  const parts: Record<string, string> = {};
  for (const part of formatter.formatToParts(now)) {
    parts[part.type] = part.value;
  }
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    weekday: WEEKDAY_BY_SHORT_NAME[parts.weekday] ?? 1,
  };
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** "09:00" -> "9:00" */
export function formatTime(time: string): string {
  const [h, m] = time.split(":");
  return `${Number(h)}:${m}`;
}

export function getScheduleDay(schedule: WorkSchedule, weekday: Weekday): ScheduleDay {
  const day = schedule.days.find((d) => d.weekday === weekday);
  if (!day) throw new Error(`No schedule for weekday ${weekday}`);
  return day;
}

function addWeekdays(weekday: Weekday, offset: number): Weekday {
  return ((((weekday - 1 + offset) % 7) + 7) % 7) + 1 as Weekday;
}

export function getWorkStatus(
  schedule: WorkSchedule,
  now: Date,
  timeZone: string = DEFAULT_TIME_ZONE,
): WorkStatus {
  const parts = getZonedParts(now, timeZone);
  const nowMinutes = parts.hour * 60 + parts.minute;
  const today = getScheduleDay(schedule, parts.weekday);

  if (today.open && today.close) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    if (nowMinutes >= open && nowMinutes < close) {
      return { isOpen: true, todayWeekday: parts.weekday, closesAt: today.close, nextOpen: null };
    }
  }

  for (let offset = 0; offset <= 7; offset++) {
    const day = getScheduleDay(schedule, addWeekdays(parts.weekday, offset));
    if (!day.open) continue;
    if (offset === 0 && nowMinutes >= toMinutes(day.open)) continue;
    return {
      isOpen: false,
      todayWeekday: parts.weekday,
      closesAt: null,
      nextOpen: {
        weekday: day.weekday,
        label: day.label,
        onLabel: day.onLabel,
        time: day.open,
        isToday: offset === 0,
        isTomorrow: offset === 1,
      },
    };
  }

  return { isOpen: false, todayWeekday: parts.weekday, closesAt: null, nextOpen: null };
}

/** Текст индикатора: «Сейчас открыто · до 18:00» / «Сейчас закрыто · откроется завтра в 9:00» */
export function describeWorkStatus(status: WorkStatus): { title: string; detail: string } {
  if (status.isOpen && status.closesAt) {
    return { title: "Сейчас открыто", detail: `до ${formatTime(status.closesAt)}` };
  }
  if (status.nextOpen) {
    const when = status.nextOpen.isToday
      ? "сегодня"
      : status.nextOpen.isTomorrow
        ? "завтра"
        : status.nextOpen.onLabel;
    return {
      title: "Сейчас закрыто",
      detail: `откроется ${when} в ${formatTime(status.nextOpen.time)}`,
    };
  }
  return { title: "Сейчас закрыто", detail: "" };
}

function formatDateKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function weekdayOfUtcDate(date: Date): Weekday {
  return (((date.getUTCDay() + 6) % 7) + 1) as Weekday;
}

/** Дата "YYYY-MM-DD" -> день недели (1 = понедельник) */
export function weekdayOfDateKey(dateKey: string): Weekday {
  const [y, m, d] = dateKey.split("-").map(Number);
  return weekdayOfUtcDate(new Date(Date.UTC(y, m - 1, d)));
}

/** "2026-09-29" -> "29.09.2026" */
export function formatDateRu(dateKey: string): string {
  const [y, m, d] = dateKey.split("-");
  return `${d}.${m}.${y}`;
}

/**
 * Рабочие даты от сегодня до сегодня + days (включительно) по местному времени ПТО.
 * Сегодняшняя дата входит, только если ПТО сегодня еще не закрылся.
 */
export function getWorkingDates(
  schedule: WorkSchedule,
  now: Date,
  days = 30,
  timeZone: string = DEFAULT_TIME_ZONE,
): string[] {
  const parts = getZonedParts(now, timeZone);
  const nowMinutes = parts.hour * 60 + parts.minute;
  const base = Date.UTC(parts.year, parts.month - 1, parts.day);
  const result: string[] = [];

  for (let offset = 0; offset <= days; offset++) {
    const date = new Date(base + offset * DAY_MS);
    const day = getScheduleDay(schedule, weekdayOfUtcDate(date));
    if (!day.open || !day.close) continue;
    if (offset === 0 && nowMinutes >= toMinutes(day.close)) continue;
    result.push(formatDateKey(date));
  }

  return result;
}

export function isWorkingDate(
  schedule: WorkSchedule,
  dateKey: string,
  now: Date,
  days = 30,
  timeZone: string = DEFAULT_TIME_ZONE,
): boolean {
  return getWorkingDates(schedule, now, days, timeZone).includes(dateKey);
}
