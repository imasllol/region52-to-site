"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type SetStateAction,
} from "react";
import { CheckIcon, PhoneIcon, XIcon } from "@/components/Icons";
import { siteContent, type VehicleCategoryCode } from "@/content/site";
import {
  formatDateRu,
  getScheduleDay,
  getWorkingDates,
  weekdayOfDateKey,
} from "@/content/work-status";
import {
  BOOKING_DAYS_AHEAD,
  createBookingSchema,
  formatPhoneInput,
  toFieldErrors,
  type BookingResponse,
} from "./schema";

interface Draft {
  name: string;
  phone: string;
  category: VehicleCategoryCode | "";
  date: string;
  consent: boolean;
}

const EMPTY_DRAFT: Draft = { name: "", phone: "", category: "", date: "", consent: false };

type FieldName = "name" | "phone" | "category" | "date";

type Status = "idle" | "submitting" | "success" | "error" | "rate_limited";

interface BookingContextValue {
  openBooking: (category?: VehicleCategoryCode) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking(): BookingContextValue {
  const value = useContext(BookingContext);
  if (!value) throw new Error("useBooking must be used inside BookingProvider");
  return value;
}

/** BookingDialogProvider: состояние окна записи и черновик формы (живет до перезагрузки). */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);

  const openBooking = useCallback((category?: VehicleCategoryCode) => {
    if (category) setDraft((current) => ({ ...current, category }));
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openBooking }), [openBooking]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingDialog
        open={open}
        onClose={() => setOpen(false)}
        draft={draft}
        setDraft={setDraft}
      />
    </BookingContext.Provider>
  );
}

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  draft: Draft;
  setDraft: Dispatch<SetStateAction<Draft>>;
}

function validate(draft: Draft): Record<string, string> {
  const result = createBookingSchema(new Date()).safeParse(draft);
  return result.success ? {} : toFieldErrors(result.error);
}

const inputClass =
  "mt-1.5 block w-full min-h-12 rounded-xl border bg-night px-4 text-base text-ink placeholder:text-muted/60 outline-none transition-colors focus:border-accent";

function BookingDialog({ open, onClose, draft, setDraft }: BookingDialogProps) {
  const { phone, schedule, timeZone } = siteContent;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openedAtRef = useRef(0);
  const [status, setStatus] = useState<Status>("idle");
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState("");
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      openedAtRef.current = Date.now();
      setDates(getWorkingDates(schedule, new Date(), BOOKING_DAYS_AHEAD, timeZone));
      setStatus((current) => (current === "success" || current === "rate_limited" ? "idle" : current));
      document.body.style.overflow = "hidden";
    } else {
      if (dialog.open) dialog.close();
      document.body.style.overflow = "";
    }
  }, [open, schedule, timeZone]);

  const liveErrors = useMemo(() => validate(draft), [draft]);

  const errorFor = (field: FieldName): string | undefined =>
    serverErrors[field] ?? (touched[field] ? liveErrors[field] : undefined);

  const update = <K extends keyof Draft>(field: K, value: Draft[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
    if (field in serverErrors) {
      setServerErrors((current) => {
        const next = { ...current };
        delete next[field as string];
        return next;
      });
    }
  };

  const touch = (field: FieldName) => setTouched((current) => ({ ...current, [field]: true }));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setTouched({ name: true, phone: true, category: true, date: true });
    if (Object.keys(liveErrors).length > 0) return;

    setStatus("submitting");
    setServerErrors({});
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, website, fillMs: Date.now() - openedAtRef.current }),
      });
      const data = (await response.json().catch(() => null)) as BookingResponse | null;

      if (response.ok && data && data.ok) {
        setStatus("success");
        setDraft(EMPTY_DRAFT);
        setTouched({});
        return;
      }
      if (data && !data.ok && data.error === "rate_limited") {
        setStatus("rate_limited");
        return;
      }
      if (data && !data.ok && data.error === "validation" && data.fieldErrors) {
        setServerErrors(data.fieldErrors);
        setStatus("idle");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const submitting = status === "submitting";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="booking-title"
      className="booking-dialog m-0 mt-auto w-full max-w-none rounded-t-3xl border border-line bg-surface p-0 text-ink shadow-2xl sm:m-auto sm:max-w-lg sm:rounded-3xl"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92dvh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Онлайн-запись</p>
            <h2 id="booking-title" className="mt-3 font-display text-2xl font-bold">
              Запись на ТО
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-line hover:bg-white/5"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {status === "success" ? (
          <div className="py-8 text-center" role="status">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-success/15 text-success">
              <CheckIcon className="size-8" strokeWidth={2.4} />
            </span>
            <p className="mt-6 text-lg font-semibold">
              Заявка принята. Мы перезвоним вам для подтверждения времени.
            </p>
            <button type="button" onClick={onClose} className="btn btn-primary mt-8">
              Готово
            </button>
          </div>
        ) : (
          <form className="mt-6 grid gap-5" onSubmit={onSubmit} noValidate>
            <label className="block">
              <span className="text-sm font-medium">Имя</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={draft.name}
                onChange={(event) => update("name", event.target.value)}
                onBlur={() => touch("name")}
                aria-invalid={Boolean(errorFor("name"))}
                aria-describedby="booking-name-error"
                className={`${inputClass} ${errorFor("name") ? "border-danger" : "border-line"}`}
                placeholder="Как к вам обращаться"
              />
              {errorFor("name") ? (
                <span id="booking-name-error" className="mt-1.5 block text-sm text-danger">
                  {errorFor("name")}
                </span>
              ) : null}
            </label>

            <label className="block">
              <span className="text-sm font-medium">Телефон</span>
              <input
                type="tel"
                name="phone"
                inputMode="tel"
                autoComplete="tel"
                value={draft.phone}
                onChange={(event) => update("phone", formatPhoneInput(event.target.value))}
                onBlur={() => touch("phone")}
                aria-invalid={Boolean(errorFor("phone"))}
                aria-describedby="booking-phone-error"
                className={`${inputClass} ${errorFor("phone") ? "border-danger" : "border-line"}`}
                placeholder="+7 (___) ___-__-__"
              />
              {errorFor("phone") ? (
                <span id="booking-phone-error" className="mt-1.5 block text-sm text-danger">
                  {errorFor("phone")}
                </span>
              ) : null}
            </label>

            <label className="block">
              <span className="text-sm font-medium">Категория ТС</span>
              <select
                name="category"
                value={draft.category}
                onChange={(event) =>
                  update("category", event.target.value as VehicleCategoryCode | "")
                }
                onBlur={() => touch("category")}
                aria-invalid={Boolean(errorFor("category"))}
                aria-describedby="booking-category-error"
                className={`${inputClass} ${errorFor("category") ? "border-danger" : "border-line"}`}
              >
                <option value="">Выберите категорию</option>
                {siteContent.categories.map((category) => (
                  <option key={category.code} value={category.code}>
                    {category.code} — {category.shortLabel}
                  </option>
                ))}
              </select>
              {errorFor("category") ? (
                <span id="booking-category-error" className="mt-1.5 block text-sm text-danger">
                  {errorFor("category")}
                </span>
              ) : null}
            </label>

            <label className="block">
              <span className="text-sm font-medium">Желаемая дата</span>
              <select
                name="date"
                value={draft.date}
                onChange={(event) => update("date", event.target.value)}
                onBlur={() => touch("date")}
                aria-invalid={Boolean(errorFor("date"))}
                aria-describedby="booking-date-error"
                className={`${inputClass} ${errorFor("date") ? "border-danger" : "border-line"}`}
              >
                <option value="">Выберите дату</option>
                {dates.map((date) => (
                  <option key={date} value={date}>
                    {getScheduleDay(schedule, weekdayOfDateKey(date)).short}, {formatDateRu(date)}
                  </option>
                ))}
              </select>
              {errorFor("date") ? (
                <span id="booking-date-error" className="mt-1.5 block text-sm text-danger">
                  {errorFor("date")}
                </span>
              ) : (
                <span className="mt-1.5 block text-xs text-muted">
                  Только рабочие дни: вторник – суббота. Точное время согласуем по телефону.
                </span>
              )}
            </label>

            {/* Поле-ловушка для ботов: скрыто от людей */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Сайт
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
              </label>
            </div>

            <label className="flex items-start gap-3 text-sm leading-relaxed">
              <input
                type="checkbox"
                name="consent"
                checked={draft.consent}
                onChange={(event) => update("consent", event.target.checked)}
                className="mt-0.5 size-5 shrink-0 accent-[#ff5a1f]"
              />
              <span className="text-muted">
                Я согласен на обработку персональных данных в соответствии с{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline underline-offset-4 hover:text-accent"
                >
                  политикой конфиденциальности
                </a>
              </span>
            </label>

            {status === "error" ? (
              <p role="alert" className="rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm">
                Не удалось отправить заявку. Попробуйте еще раз или позвоните нам:{" "}
                <a href={`tel:${phone.tel}`} className="font-semibold text-accent">
                  {phone.display}
                </a>
              </p>
            ) : null}

            {status === "rate_limited" ? (
              <p role="alert" className="rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm">
                Слишком много заявок. Позвоните нам:{" "}
                <a href={`tel:${phone.tel}`} className="font-semibold text-accent">
                  {phone.display}
                </a>
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!draft.consent || submitting}
              className="btn btn-primary w-full text-base disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {submitting ? (
                <>
                  <span
                    aria-hidden="true"
                    className="size-4 animate-spin rounded-full border-2 border-night/30 border-t-night"
                  />
                  Отправляем…
                </>
              ) : (
                "Отправить"
              )}
            </button>
          </form>
        )}

        <p className="mt-6 flex items-center justify-center gap-2 border-t border-line pt-5 text-sm text-muted">
          <PhoneIcon className="size-4 text-accent" />
          Или позвоните:
          <a href={`tel:${phone.tel}`} className="font-semibold text-ink hover:text-accent">
            {phone.display}
          </a>
        </p>
      </div>
    </dialog>
  );
}
