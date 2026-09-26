"use client";

import type { VehicleCategoryCode } from "@/content/site";
import { useBooking } from "./BookingProvider";

type Variant = "primary" | "compact" | "card";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "btn btn-primary text-base",
  compact: "btn btn-primary min-h-11 px-5 py-2 text-sm",
  card: "btn btn-ghost w-full text-sm hover:border-accent/50 hover:text-accent",
};

interface BookingButtonProps {
  variant?: Variant;
  category?: VehicleCategoryCode;
  className?: string;
}

/** Кнопка «Записаться на ТО». Состояния не хранит, только открывает форму. */
export function BookingButton({ variant = "primary", category, className = "" }: BookingButtonProps) {
  const { openBooking } = useBooking();
  return (
    <button
      type="button"
      onClick={() => openBooking(category)}
      className={`${VARIANT_CLASS[variant]} ${className}`}
    >
      Записаться на ТО
    </button>
  );
}
