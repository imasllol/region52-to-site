"use client";

import { useEffect, useState } from "react";
import { siteContent } from "@/content/site";
import { getWorkStatus, type WorkStatus } from "@/content/work-status";

/** Статус работы ПТО. Считается только на клиенте и обновляется раз в минуту. */
export function useWorkStatus(intervalMs = 60_000): WorkStatus | null {
  const [status, setStatus] = useState<WorkStatus | null>(null);

  useEffect(() => {
    const update = () =>
      setStatus(getWorkStatus(siteContent.schedule, new Date(), siteContent.timeZone));
    update();
    const id = window.setInterval(update, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return status;
}
