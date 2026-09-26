import { z } from "zod";
import { siteContent, vehicleCategoryCodes, type VehicleCategoryCode } from "@/content/site";
import { isWorkingDate } from "@/content/work-status";

/** На сколько дней вперед можно выбрать дату */
export const BOOKING_DAYS_AHEAD = 30;

export const PHONE_ERROR = "Введите номер в формате +7 (XXX) XXX-XX-XX";

/** Любая запись номера -> "7XXXXXXXXXX" или null */
export function normalizePhone(value: string): string | null {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  return digits.length === 11 && digits.startsWith("7") ? digits : null;
}

/** Маска поля телефона: цифры -> "+7 (XXX) XXX-XX-XX" */
export function formatPhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (digits.length === 0) return "";
  let out = `+7 (${digits.slice(0, 3)}`;
  if (digits.length > 3) out += `) ${digits.slice(3, 6)}`;
  if (digits.length > 6) out += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) out += `-${digits.slice(8, 10)}`;
  return out;
}

const categoryCodes = vehicleCategoryCodes as [VehicleCategoryCode, ...VehicleCategoryCode[]];

/** Схема заявки на ТО. Одна и та же для формы и для сервера. */
export function createBookingSchema(now: Date = new Date()) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, "Укажите имя")
      .max(60, "Имя должно быть не длиннее 60 символов"),
    phone: z.string().refine((value) => normalizePhone(value) !== null, PHONE_ERROR),
    category: z.enum(categoryCodes, {
      errorMap: () => ({ message: "Выберите категорию ТС" }),
    }),
    date: z
      .string()
      .min(1, "Выберите желаемую дату")
      .refine(
        (value) =>
          value === "" ||
          isWorkingDate(siteContent.schedule, value, now, BOOKING_DAYS_AHEAD, siteContent.timeZone),
        "Выберите рабочий день из списка",
      ),
    consent: z.literal(true, {
      errorMap: () => ({ message: "Нужно согласие на обработку персональных данных" }),
    }),
    /** Поле-ловушка для ботов, должно быть пустым */
    website: z.string().optional(),
    /** Сколько миллисекунд форма была открыта до отправки */
    fillMs: z.number().optional(),
  });
}

export type BookingRequest = z.infer<ReturnType<typeof createBookingSchema>>;

export type BookingErrorCode = "validation" | "rate_limited" | "send_failed";

export type BookingResponse =
  | { ok: true }
  | { ok: false; error: BookingErrorCode; fieldErrors?: Record<string, string> };

/** Первая ошибка для каждого поля */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}
