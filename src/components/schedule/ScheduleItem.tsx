'use client';

import { useState } from 'react';
import { Card, Text, Group, ActionIcon, Badge, Stack, Modal, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash, IconClock, IconMapPin, IconUser } from '@tabler/icons-react';
import { deleteSchedule } from '@/actions/schedules';
import { formatTime } from '@/lib/utils';
import type { Schedule } from '@/lib/supabase/types';

interface ScheduleItemProps {
  schedule: Schedule;
}

export function ScheduleItem({ schedule }: ScheduleItemProps) {
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteSchedule(schedule.id);
    closeDeleteModal();
    setDeleting(false);
  };

  const timeDisplay = schedule.start_time
    ? schedule.end_time
      ? `${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`
      : formatTime(schedule.start_time)
    : null;

  return (
    <>
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs" className="flex-1">
            <Text fw={600} size="lg">{schedule.title}</Text>

            {timeDisplay && (
              <Group gap="xs">
                <IconClock size={16} className="text-gray-500" />
                <Text size="sm" c="dimmed">{timeDisplay}</Text>
              </Group>
            )}

            {schedule.location && (
              <Group gap="xs">
                <IconMapPin size={16} className="text-gray-500" />
                <Text size="sm" c="dimmed">{schedule.location}</Text>
              </Group>
            )}

            {schedule.description && (
              <Text size="sm" c="dimmed" className="whitespace-pre-wrap">
                {schedule.description}
              </Text>
            )}

            {schedule.created_by && (
              <Group gap="xs">
                <IconUser size={14} className="text-gray-400" />
                <Badge size="sm" variant="light" color="gray">
                  {schedule.created_by}
                </Badge>
              </Group>
            )}
          </Stack>

          <ActionIcon
            variant="subtle"
            color="red"
            onClick={openDeleteModal}
          >
            <IconTrash size={18} />
          </ActionIcon>
        </Group>
      </Card>

      <Modal opened={deleteModalOpened} onClose={closeDeleteModal} title="일정 삭제" centered>
        <Text mb="lg">정말로 이 일정을 삭제하시겠습니까?</Text>
        <Text fw={500} mb="lg">&quot;{schedule.title}&quot;</Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={closeDeleteModal}>취소</Button>
          <Button color="red" onClick={handleDelete} loading={deleting}>삭제</Button>
        </Group>
      </Modal>
    </>
  );
}
