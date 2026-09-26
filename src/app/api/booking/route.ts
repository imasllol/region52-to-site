import { NextResponse } from "next/server";
import { sendBookingEmail } from "@/features/booking/mailer";
import { checkRateLimit } from "@/features/booking/rate-limit";
import {
  createBookingSchema,
  toFieldErrors,
  type BookingResponse,
} from "@/features/booking/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Форма, отправленная быстрее 3 секунд, считается спамом */
const MIN_FILL_MS = 3000;

function reply(body: BookingResponse, status: number) {
  return NextResponse.json(body, { status });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  if (!checkRateLimit(clientIp(request))) {
    return reply({ ok: false, error: "rate_limited" }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reply({ ok: false, error: "validation", fieldErrors: { form: "Некорректный запрос" } }, 400);
  }

  // Ловушка для ботов: отвечаем «успехом», но письмо не отправляем.
  const raw = (body ?? {}) as Record<string, unknown>;
  const honeypot = typeof raw.website === "string" ? raw.website.trim() : "";
  const fillMs = typeof raw.fillMs === "number" ? raw.fillMs : 0;
  if (honeypot !== "" || fillMs < MIN_FILL_MS) {
    return reply({ ok: true }, 200);
  }

  const parsed = createBookingSchema(new Date()).safeParse(body);
  if (!parsed.success) {
    return reply({ ok: false, error: "validation", fieldErrors: toFieldErrors(parsed.error) }, 400);
  }

  try {
    await sendBookingEmail(parsed.data, new Date());
  } catch (error) {
    // Персональные данные в журнал не пишем.
    console.error("booking: send failed:", error instanceof Error ? error.message : "unknown error");
    return reply({ ok: false, error: "send_failed" }, 502);
  }

  return reply({ ok: true }, 200);
}
