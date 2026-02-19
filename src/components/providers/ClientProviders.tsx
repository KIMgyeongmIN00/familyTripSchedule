'use client';

import { ReactNode } from 'react';
import { ScheduleProvider } from '@/contexts/ScheduleContext';

export function ClientProviders({ children }: { children: ReactNode }) {
  return <ScheduleProvider>{children}</ScheduleProvider>;
}
