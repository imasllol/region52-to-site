"use client";

import { describeWorkStatus } from "@/content/work-status";
import { useWorkStatus } from "@/hooks/useWorkStatus";

export function StatusDot({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      className={`relative inline-flex size-2.5 shrink-0 rounded-full ${isOpen ? "bg-success" : "bg-danger"}`}
    />
  );
}

interface WorkStatusIndicatorProps {
  variant?: "compact" | "full";
}

export function WorkStatusIndicator({ variant = "compact" }: WorkStatusIndicatorProps) {
  const status = useWorkStatus();

  if (!status) {
    return variant === "full" ? (
      <span aria-hidden="true" className="block h-[74px] rounded-2xl bg-white/5" />
    ) : (
      <span aria-hidden="true" className="inline-block h-[30px] w-52 rounded-full bg-white/5" />
    );
  }

  const { title, detail } = describeWorkStatus(status);

  if (variant === "full") {
    return (
      <div
        role="status"
        className={`flex items-center gap-4 rounded-2xl border px-5 py-4 ${
          status.isOpen ? "border-success/30 bg-success/10" : "border-danger/30 bg-danger/10"
        }`}
      >
        <StatusDot isOpen={status.isOpen} />
        <div>
          <p className="font-display text-lg font-bold">{title}</p>
          {detail ? <p className="text-sm text-muted">{detail}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <span
      role="status"
      className="inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-3 py-1.5 text-xs font-semibold"
    >
      <StatusDot isOpen={status.isOpen} />
      <span>{title}</span>
      {detail ? <span className="font-normal text-muted">· {detail}</span> : null}
    </span>
  );
}
