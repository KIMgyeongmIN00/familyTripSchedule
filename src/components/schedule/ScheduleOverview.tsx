'use client';

import { Stack, Title, Text, ActionIcon, Group } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { DayCard } from './DayCard';
import { OverviewSkeleton } from './ScheduleSkeleton';
import { TRIP_DATES } from '@/lib/constants';
import { useSchedules } from '@/contexts/ScheduleContext';

interface ScheduleOverviewProps {
  userName: string;
  onLogout: () => void;
}

export function ScheduleOverview({ userName, onLogout }: ScheduleOverviewProps) {
  const { loading, getSchedulesByDate } = useSchedules();

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
        {loading ? (
          <OverviewSkeleton />
        ) : (
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
        )}
      </main>
    </div>
  );
}
