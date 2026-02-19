'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Schedule } from '@/lib/supabase/types';

export function useRealtimeSchedules(date: string) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('schedules')
      .select('*')
      .eq('date', date)
      .order('start_time', { nullsFirst: false })
      .order('created_at');

    if (data) {
      setSchedules(data);
    }
    setLoading(false);
  }, [date, supabase]);

  useEffect(() => {
    fetchSchedules();

    const channel = supabase
      .channel(`schedules:${date}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'schedules',
          filter: `date=eq.${date}`,
        },
        () => {
          fetchSchedules();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [date, fetchSchedules, supabase]);

  return {
    schedules,
    loading,
    refetch: fetchSchedules,
  };
}
