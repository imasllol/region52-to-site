import nodemailer from "nodemailer";
import { getCategory, siteContent } from "@/content/site";
import { formatDateRu, getZonedParts } from "@/content/work-status";
import { formatPhoneInput, normalizePhone, type BookingRequest } from "./schema";

export interface BookingEmail {
  subject: string;
  text: string;
  html: string;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildBookingEmail(data: BookingRequest, sentAt: Date): BookingEmail {
  const category = getCategory(data.category);
  const digits = normalizePhone(data.phone) ?? data.phone.replace(/\D/g, "");
  const phoneDisplay = formatPhoneInput(digits);
  const tel = `+${digits}`;
  const date = formatDateRu(data.date);
  const p = getZonedParts(sentAt, siteContent.timeZone);
  const sent = `${pad(p.day)}.${pad(p.month)}.${p.year} ${pad(p.hour)}:${pad(p.minute)} (МСК)`;
  const categoryLabel = `${category.code} — ${category.shortLabel}`;

  const subject = `Заявка на ТО: ${category.code}, ${date}`;

  const text = [
    "Новая заявка на техосмотр с сайта",
    "",
    `Имя: ${data.name}`,
    `Телефон: ${phoneDisplay}`,
    `Категория ТС: ${categoryLabel}`,
    `Желаемая дата: ${date}`,
    `Заявка отправлена: ${sent}`,
    "",
    "Перезвоните клиенту, чтобы подтвердить время.",
  ].join("\n");

  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 16px 8px 0;color:#71717a;white-space:nowrap">${label}</td><td style="padding:8px 0;font-weight:600">${value}</td></tr>`;

  const html = `<!doctype html>
<html lang="ru"><body style="margin:0;padding:24px;background:#f4f4f5;font-family:Arial,sans-serif;color:#18181b">
<div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;padding:24px">
<h1 style="margin:0 0 16px;font-size:20px">Новая заявка на техосмотр</h1>
<table style="border-collapse:collapse;font-size:15px">
${row("Имя", escapeHtml(data.name))}
${row("Телефон", `<a href="tel:${escapeHtml(tel)}" style="color:#ff5a1f">${escapeHtml(phoneDisplay)}</a>`)}
${row("Категория ТС", escapeHtml(categoryLabel))}
${row("Желаемая дата", escapeHtml(date))}
${row("Заявка отправлена", escapeHtml(sent))}
</table>
<p style="margin:20px 0 0;color:#52525b">Перезвоните клиенту, чтобы подтвердить время.</p>
</div></body></html>`;

  return { subject, text, html };
}

export async function sendBookingEmail(data: BookingRequest, sentAt: Date): Promise<void> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) {
    throw new Error("SMTP is not configured");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  });

  const email = buildBookingEmail(data, sentAt);

  await transporter.sendMail({
    from: process.env.BOOKING_FROM_EMAIL || user,
    to: process.env.BOOKING_RECIPIENT_EMAIL || siteContent.email,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
}
