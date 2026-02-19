"use client";

import { deleteSchedule, toggleScheduleComplete } from "@/actions/schedules";
import type { Schedule } from "@/lib/supabase/types";
import { formatTime } from "@/lib/utils";
import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Card,
  Checkbox,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconClock,
  IconMapPin,
  IconPencil,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { ReactNode, useState } from "react";
import { EditScheduleModal } from "./EditScheduleModal";

function linkifyText(text: string): ReactNode[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <Anchor
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </Anchor>
      );
    }
    return part;
  });
}

interface ScheduleItemProps {
  schedule: Schedule;
  userName: string;
  onRefresh: () => void;
}

export function ScheduleItem({
  schedule,
  userName,
  onRefresh,
}: ScheduleItemProps) {
  const [deleting, setDeleting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  const isOwner = schedule.created_by === userName;
  const isEdited = schedule.updated_at !== schedule.created_at;

  const handleToggleComplete = async () => {
    setCompleting(true);
    await toggleScheduleComplete(schedule.id, !schedule.completed);
    setCompleting(false);
    onRefresh();
  };

  const handleDelete = async () => {
    setDeleting(true);
    await deleteSchedule(schedule.id);
    closeDeleteModal();
    setDeleting(false);
    onRefresh();
  };

  const handleEditClose = () => {
    closeEditModal();
    onRefresh();
  };

  const timeDisplay = schedule.start_time
    ? schedule.end_time
      ? `${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`
      : formatTime(schedule.start_time)
    : null;

  return (
    <>
      <Card
        shadow="sm"
        padding="md"
        radius="md"
        withBorder
        className={schedule.completed ? "opacity-60" : ""}
      >
        <Group justify="space-between" align="flex-start">
          <Group align="flex-start" gap="sm" className="flex-1">
            <Checkbox
              checked={schedule.completed}
              onChange={handleToggleComplete}
              disabled={completing}
              className="mt-1"
            />
            <Stack gap="xs" className="flex-1">
              <Group gap="xs">
                <Text
                  fw={600}
                  size="lg"
                  td={schedule.completed ? "line-through" : undefined}
                >
                  {schedule.title}
                </Text>
                {schedule.completed && (
                  <Badge size="xs" variant="light" color="green">
                    완료
                  </Badge>
                )}
                {isEdited && !schedule.completed && (
                  <Badge size="xs" variant="light" color="gray">
                    수정됨
                  </Badge>
                )}
              </Group>

              {timeDisplay && (
                <Group gap="xs">
                  <IconClock size={16} className="text-gray-500" />
                  <Text size="sm" c="dimmed">
                    {timeDisplay}
                  </Text>
                </Group>
              )}

              {schedule.location && (
                <Group gap="xs">
                  <IconMapPin size={16} className="text-gray-500" />
                  <Text size="sm" c="dimmed">
                    {schedule.location}
                  </Text>
                </Group>
              )}

              {schedule.description && (
                <Text size="sm" c="dimmed" className="whitespace-pre-wrap">
                  {linkifyText(schedule.description)}
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
          </Group>

          <Group gap="xs">
            {isOwner && (
              <ActionIcon variant="subtle" color="blue" onClick={openEditModal}>
                <IconPencil size={18} />
              </ActionIcon>
            )}
            <ActionIcon variant="subtle" color="red" onClick={openDeleteModal}>
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </Card>

      <EditScheduleModal
        opened={editModalOpened}
        onClose={handleEditClose}
        schedule={schedule}
      />

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="일정 삭제"
        centered
      >
        <Text mb="lg">정말로 이 일정을 삭제하시겠습니까?</Text>
        <Text fw={500} mb="lg">
          &quot;{schedule.title}&quot;
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={closeDeleteModal}>
            취소
          </Button>
          <Button color="red" onClick={handleDelete} loading={deleting}>
            삭제
          </Button>
        </Group>
      </Modal>
    </>
  );
}
