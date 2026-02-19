'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ActionIcon, Button, Group, Loader, Center, Title, Text, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowLeft, IconPlus } from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';
import { useRealtimeSchedules } from '@/hooks/useRealtimeSchedules';
import { ScheduleList } from '@/components/schedule/ScheduleList';
import { AddScheduleModal } from '@/components/schedule/AddScheduleModal';
import { formatDateKorean, getDayOfWeek } from '@/lib/utils';
import { TRIP_DATES } from '@/lib/constants';

interface PageProps {
  params: Promise<{ date: string }>;
}

export default function DayDetailPage({ params }: PageProps) {
  const { date } = use(params);
  const router = useRouter();
  const { isLoading: authLoading, isAuthenticated, userName } = useAuth();
  const { schedules, loading, refetch } = useRealtimeSchedules(date);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  const tripDates = TRIP_DATES as readonly string[];
  const dayNumber = tripDates.indexOf(date) + 1;
  const isValidDate = tripDates.includes(date);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <Center className="min-h-screen">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isValidDate) {
    return (
      <Center className="min-h-screen">
        <Stack align="center" gap="md">
          <Text c="dimmed">유효하지 않은 날짜입니다.</Text>
          <Button onClick={() => router.push('/')}>돌아가기</Button>
        </Stack>
      </Center>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 bg-white border-b p-4 z-10">
        <Group justify="space-between">
          <Group gap="sm">
            <ActionIcon variant="subtle" onClick={() => router.push('/')}>
              <IconArrowLeft size={20} />
            </ActionIcon>
            <div>
              <Title order={4}>Day {dayNumber} - {formatDateKorean(date)}</Title>
              <Text size="sm" c="dimmed">{getDayOfWeek(date)}</Text>
            </div>
          </Group>
          <Button
            leftSection={<IconPlus size={16} />}
            size="sm"
            onClick={openModal}
          >
            추가
          </Button>
        </Group>
      </header>

      <main className="p-4">
        {loading ? (
          <Center py="xl">
            <Loader />
          </Center>
        ) : (
          <ScheduleList schedules={schedules} userName={userName} onRefresh={refetch} />
        )}
      </main>

      <AddScheduleModal
        opened={modalOpened}
        onClose={closeModal}
        date={date}
        userName={userName}
        onSuccess={refetch}
      />
    </div>
  );
}
