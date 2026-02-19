"use client";

import { ScheduleProvider } from "@/contexts/ScheduleContext";
import { ReactNode } from "react";

export function ClientProviders({ children }: { children: ReactNode }) {
  return <ScheduleProvider>{children}</ScheduleProvider>;
}
