"use client";

import type { Schedule } from "@/lib/supabase/types";
import { formatDateKorean, formatTime, getDayOfWeek } from "@/lib/utils";
import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

interface DayCardProps {
  date: string;
  dayNumber: number;
  schedules: Schedule[];
}

export function DayCard({ date, dayNumber, schedules }: DayCardProps) {
  return (
    <Link href={`/day/${date}`} className="no-underline">
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        className="hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <Group justify="space-between" mb="sm">
          <Group gap="sm">
            <Badge color="blue" variant="filled" size="lg">
              Day {dayNumber - 1}
            </Badge>
            <div>
              <Text fw={600} size="lg">
                {formatDateKorean(date)}
              </Text>
              <Text size="sm" c="dimmed">
                {getDayOfWeek(date)}
              </Text>
            </div>
          </Group>
          <IconChevronRight size={24} className="text-gray-400" />
        </Group>

        {schedules.length === 0 ? (
          <Text size="sm" c="dimmed" fs="italic">
            등록된 일정이 없습니다
          </Text>
        ) : (
          <Stack gap="xs">
            {schedules.slice(0, 3).map((schedule) => (
              <Text key={schedule.id} size="sm" lineClamp={1}>
                {schedule.start_time && (
                  <Text component="span" fw={500} c="blue">
                    {formatTime(schedule.start_time)}{" "}
                  </Text>
                )}
                {schedule.title}
              </Text>
            ))}
            {schedules.length > 3 && (
              <Text size="xs" c="dimmed">
                +{schedules.length - 3}개 더보기
              </Text>
            )}
          </Stack>
        )}
      </Card>
    </Link>
  );
}
