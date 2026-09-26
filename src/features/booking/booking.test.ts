import { beforeEach, describe, expect, it } from "vitest";
import { buildBookingEmail } from "./mailer";
import { checkRateLimit, resetRateLimit } from "./rate-limit";
import { createBookingSchema, formatPhoneInput, normalizePhone } from "./schema";

const now = new Date("2026-09-26T12:00:00+03:00"); // суббота

const valid = {
  name: "Иван",
  phone: "+7 (920) 053-07-30",
  category: "M1",
  date: "2026-09-29",
  consent: true,
};

describe("телефон", () => {
  it("нормализует номер", () => {
    expect(normalizePhone("+7 (920) 053-07-30")).toBe("79200530730");
    expect(normalizePhone("89200530730")).toBe("79200530730");
    expect(normalizePhone("920053")).toBeNull();
  });

  it("форматирует ввод по маске", () => {
    expect(formatPhoneInput("9")).toBe("+7 (9");
    expect(formatPhoneInput("8920")).toBe("+7 (920");
    expect(formatPhoneInput("79200530730")).toBe("+7 (920) 053-07-30");
    expect(formatPhoneInput("")).toBe("");
  });
});

describe("схема заявки", () => {
  const schema = createBookingSchema(now);

  it("принимает корректную заявку", () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it("отклоняет пустое и слишком длинное имя", () => {
    expect(schema.safeParse({ ...valid, name: " " }).success).toBe(false);
    expect(schema.safeParse({ ...valid, name: "а".repeat(61) }).success).toBe(false);
  });

  it("отклоняет неполный телефон", () => {
    expect(schema.safeParse({ ...valid, phone: "+7 (920) 05" }).success).toBe(false);
  });

  it("отклоняет выходной и пустую категорию", () => {
    expect(schema.safeParse({ ...valid, date: "2026-09-28" }).success).toBe(false);
    expect(schema.safeParse({ ...valid, category: "" }).success).toBe(false);
  });

  it("требует согласия", () => {
    expect(schema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });
});

describe("ограничение частоты", () => {
  beforeEach(() => resetRateLimit());

  it("пускает 3 заявки и отклоняет четвертую", () => {
    const t = 1_000_000;
    expect(checkRateLimit("ip", t)).toBe(true);
    expect(checkRateLimit("ip", t + 1)).toBe(true);
    expect(checkRateLimit("ip", t + 2)).toBe(true);
    expect(checkRateLimit("ip", t + 3)).toBe(false);
    expect(checkRateLimit("other", t + 3)).toBe(true);
  });

  it("снова пускает через 10 минут", () => {
    const t = 1_000_000;
    for (let i = 0; i < 3; i++) checkRateLimit("ip", t);
    expect(checkRateLimit("ip", t + 10 * 60 * 1000)).toBe(true);
  });
});

describe("письмо о заявке", () => {
  it("содержит категорию и дату в теме и ссылку на звонок", () => {
    const parsed = createBookingSchema(now).parse(valid);
    const email = buildBookingEmail(parsed, now);
    expect(email.subject).toBe("Заявка на ТО: M1, 29.09.2026");
    expect(email.html).toContain('href="tel:+79200530730"');
    expect(email.text).toContain("Имя: Иван");
    expect(email.text).toContain("26.09.2026 12:00 (МСК)");
  });

  it("экранирует HTML в имени", () => {
    const parsed = createBookingSchema(now).parse({ ...valid, name: "<b>Иван</b>" });
    const email = buildBookingEmail(parsed, now);
    expect(email.html).not.toContain("<b>Иван</b>");
    expect(email.html).toContain("&lt;b&gt;");
  });
});
