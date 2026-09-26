import { describe, expect, it } from "vitest";
import { siteContent } from "./site";
import {
  describeWorkStatus,
  formatDateRu,
  getWorkingDates,
  getWorkStatus,
  getZonedParts,
  isWorkingDate,
  weekdayOfDateKey,
} from "./work-status";

const schedule = siteContent.schedule;
// Москва = UTC+3 без перехода на летнее время. 26.09.2026 — суббота.
const msk = (iso: string) => new Date(`${iso}+03:00`);

describe("getZonedParts", () => {
  it("считает день недели по московскому времени", () => {
    // В UTC это еще воскресенье 22:30, в Москве уже понедельник 01:30
    const parts = getZonedParts(new Date("2026-09-27T22:30:00Z"));
    expect(parts.weekday).toBe(1);
    expect(parts.hour).toBe(1);
    expect(parts.minute).toBe(30);
  });
});

describe("getWorkStatus", () => {
  it("открыто в субботу в 12:00", () => {
    const status = getWorkStatus(schedule, msk("2026-09-26T12:00:00"));
    expect(status.isOpen).toBe(true);
    expect(status.closesAt).toBe("16:00");
    expect(status.todayWeekday).toBe(6);
    expect(describeWorkStatus(status)).toEqual({ title: "Сейчас открыто", detail: "до 16:00" });
  });

  it("закрыто в субботу в 16:00, откроется во вторник", () => {
    const status = getWorkStatus(schedule, msk("2026-09-26T16:00:00"));
    expect(status.isOpen).toBe(false);
    expect(status.nextOpen?.weekday).toBe(2);
    expect(status.nextOpen?.time).toBe("09:00");
    expect(describeWorkStatus(status).detail).toBe("откроется во вторник в 9:00");
  });

  it("закрыто в понедельник, откроется завтра", () => {
    const status = getWorkStatus(schedule, msk("2026-09-28T10:00:00"));
    expect(status.isOpen).toBe(false);
    expect(status.nextOpen?.isTomorrow).toBe(true);
    expect(describeWorkStatus(status).detail).toBe("откроется завтра в 9:00");
  });

  it("в четверг утром закрыто, откроется сегодня в 13:00", () => {
    const status = getWorkStatus(schedule, msk("2026-10-01T10:00:00"));
    expect(status.isOpen).toBe(false);
    expect(status.nextOpen?.isToday).toBe(true);
    expect(describeWorkStatus(status).detail).toBe("откроется сегодня в 13:00");
  });

  it("закрыто за минуту до открытия и открыто в момент открытия", () => {
    expect(getWorkStatus(schedule, msk("2026-09-29T08:59:00")).isOpen).toBe(false);
    expect(getWorkStatus(schedule, msk("2026-09-29T09:00:00")).isOpen).toBe(true);
  });

  it("в воскресенье закрыто, откроется во вторник", () => {
    const status = getWorkStatus(schedule, msk("2026-09-27T11:00:00"));
    expect(status.isOpen).toBe(false);
    expect(status.todayWeekday).toBe(7);
    expect(status.nextOpen?.weekday).toBe(2);
  });

  it("не зависит от часового пояса устройства", () => {
    // Один и тот же момент, записанный в разных часовых поясах
    const a = getWorkStatus(schedule, new Date("2026-09-26T09:00:00Z"));
    const b = getWorkStatus(schedule, new Date("2026-09-26T17:00:00+08:00"));
    expect(a).toEqual(b);
    expect(a.isOpen).toBe(true);
  });
});

describe("getWorkingDates", () => {
  it("включает сегодня и пропускает выходные", () => {
    const dates = getWorkingDates(schedule, msk("2026-09-26T12:00:00"), 7);
    expect(dates).toEqual([
      "2026-09-26",
      "2026-09-29",
      "2026-09-30",
      "2026-10-01",
      "2026-10-02",
      "2026-10-03",
    ]);
  });

  it("не включает сегодня после закрытия", () => {
    const dates = getWorkingDates(schedule, msk("2026-09-26T17:00:00"), 7);
    expect(dates[0]).toBe("2026-09-29");
  });

  it("на 30 дней вперед дает только дни со вторника по субботу", () => {
    const dates = getWorkingDates(schedule, msk("2026-09-26T12:00:00"));
    expect(dates.length).toBeGreaterThan(20);
    for (const date of dates) {
      const weekday = weekdayOfDateKey(date);
      expect(weekday).toBeGreaterThanOrEqual(2);
      expect(weekday).toBeLessThanOrEqual(6);
    }
    expect(dates[dates.length - 1] <= "2026-10-26").toBe(true);
  });

  it("isWorkingDate отклоняет выходной и прошедшую дату", () => {
    const now = msk("2026-09-26T12:00:00");
    expect(isWorkingDate(schedule, "2026-09-28", now)).toBe(false);
    expect(isWorkingDate(schedule, "2026-09-25", now)).toBe(false);
    expect(isWorkingDate(schedule, "2026-09-29", now)).toBe(true);
  });
});

describe("formatDateRu", () => {
  it("форматирует дату", () => {
    expect(formatDateRu("2026-09-29")).toBe("29.09.2026");
  });
});
