"use client";

import type { Schedule } from "@/lib/supabase/types";
import { Center, Stack, Text } from "@mantine/core";
import { ScheduleItem } from "./ScheduleItem";

interface ScheduleListProps {
  schedules: Schedule[];
  userName: string;
  onRefresh: () => void;
}

export function ScheduleList({
  schedules,
  userName,
  onRefresh,
}: ScheduleListProps) {
  if (schedules.length === 0) {
    return (
      <Center py="xl">
        <Text c="dimmed" fs="italic">
          등록된 일정이 없습니다. 일정을 추가해보세요!
        </Text>
      </Center>
    );
  }

  return (
    <Stack gap="md">
      {schedules.map((schedule) => (
        <ScheduleItem
          key={schedule.id}
          schedule={schedule}
          userName={userName}
          onRefresh={onRefresh}
        />
      ))}
    </Stack>
  );
}
