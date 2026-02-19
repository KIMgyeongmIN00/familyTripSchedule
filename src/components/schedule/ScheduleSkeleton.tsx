'use client';

import { Card, Skeleton, Stack, Group } from '@mantine/core';

export function DayCardSkeleton() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="sm">
        <Group gap="sm">
          <Skeleton height={28} width={60} radius="xl" />
          <div>
            <Skeleton height={20} width={80} mb={4} />
            <Skeleton height={14} width={50} />
          </div>
        </Group>
        <Skeleton height={24} width={24} radius="sm" />
      </Group>
      <Stack gap="xs">
        <Skeleton height={14} width="90%" />
        <Skeleton height={14} width="70%" />
      </Stack>
    </Card>
  );
}

export function ScheduleItemSkeleton() {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Group justify="space-between" align="flex-start">
        <Stack gap="xs" className="flex-1">
          <Skeleton height={24} width="60%" />
          <Group gap="xs">
            <Skeleton height={16} width={16} radius="sm" />
            <Skeleton height={14} width={100} />
          </Group>
          <Group gap="xs">
            <Skeleton height={16} width={16} radius="sm" />
            <Skeleton height={14} width={120} />
          </Group>
          <Group gap="xs">
            <Skeleton height={14} width={14} radius="sm" />
            <Skeleton height={20} width={50} radius="xl" />
          </Group>
        </Stack>
        <Skeleton height={28} width={28} radius="sm" />
      </Group>
    </Card>
  );
}

export function OverviewSkeleton() {
  return (
    <Stack gap="md">
      <DayCardSkeleton />
      <DayCardSkeleton />
      <DayCardSkeleton />
      <DayCardSkeleton />
    </Stack>
  );
}

export function DetailSkeleton() {
  return (
    <Stack gap="md">
      <ScheduleItemSkeleton />
      <ScheduleItemSkeleton />
      <ScheduleItemSkeleton />
    </Stack>
  );
}
