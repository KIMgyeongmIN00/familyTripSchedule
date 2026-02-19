'use client';

import { Stack, Text, Center } from '@mantine/core';
import { ScheduleItem } from './ScheduleItem';
import type { Schedule } from '@/lib/supabase/types';

interface ScheduleListProps {
  schedules: Schedule[];
}

export function ScheduleList({ schedules }: ScheduleListProps) {
  if (schedules.length === 0) {
    return (
      <Center py="xl">
        <Text c="dimmed" fs="italic">등록된 일정이 없습니다. 일정을 추가해보세요!</Text>
      </Center>
    );
  }

  return (
    <Stack gap="md">
      {schedules.map((schedule) => (
        <ScheduleItem key={schedule.id} schedule={schedule} />
      ))}
    </Stack>
  );
}
