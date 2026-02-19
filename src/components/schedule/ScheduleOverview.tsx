'use client';

import { useEffect, useState, useCallback } from 'react';
import { Stack, Title, Text, ActionIcon, Group, Loader, Center } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { DayCard } from './DayCard';
import { TRIP_DATES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import type { Schedule } from '@/lib/supabase/types';

interface ScheduleOverviewProps {
  userName: string;
  onLogout: () => void;
}

export function ScheduleOverview({ userName, onLogout }: ScheduleOverviewProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('schedules')
      .select('*')
      .gte('date', TRIP_DATES[0])
      .lte('date', TRIP_DATES[TRIP_DATES.length - 1])
      .order('date')
      .order('start_time', { nullsFirst: false });

    if (data) {
      setSchedules(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial data fetch is intentional
    fetchSchedules();

    const supabase = createClient();
    const channel = supabase
      .channel('schedules-overview')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schedules' },
        (payload) => {
          console.log('[Realtime] Overview change:', payload);
          fetchSchedules();
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Overview subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSchedules]);

  const getSchedulesByDate = (date: string) => {
    return schedules.filter((s) => s.date === date);
  };

  if (loading) {
    return (
      <Center className="min-h-screen">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 bg-white border-b p-4 z-10">
        <Group justify="space-between">
          <div>
            <Title order={3}>가족 여행 일정</Title>
            <Text size="sm" c="dimmed">안녕하세요, {userName}님</Text>
          </div>
          <ActionIcon variant="subtle" color="gray" onClick={onLogout} title="로그아웃">
            <IconLogout size={20} />
          </ActionIcon>
        </Group>
      </header>

      <main className="p-4">
        <Stack gap="md">
          {TRIP_DATES.map((date, index) => (
            <DayCard
              key={date}
              date={date}
              dayNumber={index + 1}
              schedules={getSchedulesByDate(date)}
            />
          ))}
        </Stack>
      </main>
    </div>
  );
}
