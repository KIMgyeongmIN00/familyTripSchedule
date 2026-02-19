'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode, startTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TRIP_DATES } from '@/lib/constants';
import type { Schedule } from '@/lib/supabase/types';

interface ScheduleContextType {
  schedules: Schedule[];
  loading: boolean;
  fetchSchedules: () => Promise<void>;
  getSchedulesByDate: (date: string) => Schedule[];
}

const ScheduleContext = createContext<ScheduleContextType | null>(null);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);

  const fetchSchedules = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('schedules')
      .select('*')
      .gte('date', TRIP_DATES[0])
      .lte('date', TRIP_DATES[TRIP_DATES.length - 1])
      .order('date')
      .order('start_time', { nullsFirst: false });

    startTransition(() => {
      if (data) {
        setSchedules(data);
      }
      setLoading(false);
    });
  }, []);

  const getSchedulesByDate = useCallback((date: string) => {
    return schedules.filter((s) => s.date === date);
  }, [schedules]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    fetchSchedules();

    const supabase = createClient();
    const channel = supabase
      .channel('schedules-global')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schedules' },
        () => {
          fetchSchedules();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSchedules]);

  return (
    <ScheduleContext.Provider value={{ schedules, loading, fetchSchedules, getSchedulesByDate }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedules() {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedules must be used within ScheduleProvider');
  }
  return context;
}
