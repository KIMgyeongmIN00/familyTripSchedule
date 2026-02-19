"use client";

import { updateSchedule } from "@/actions/schedules";
import type { Schedule } from "@/lib/supabase/types";
import {
  Button,
  Group,
  Modal,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useState } from "react";

interface EditScheduleModalProps {
  opened: boolean;
  onClose: () => void;
  schedule: Schedule;
}

function EditScheduleForm({
  schedule,
  onClose,
}: {
  schedule: Schedule;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: schedule.title,
    location: schedule.location || "",
    start_time: schedule.start_time?.slice(0, 5) || "",
    end_time: schedule.end_time?.slice(0, 5) || "",
    description: schedule.description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    setLoading(true);

    await updateSchedule(schedule.id, {
      title: form.title.trim(),
      location: form.location.trim() || null,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      description: form.description.trim() || null,
    });

    setLoading(false);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="일정명"
          placeholder="일정 제목을 입력하세요"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <TextInput
          label="장소"
          placeholder="장소 (선택)"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <Group grow>
          <TimeInput
            label="시작 시간"
            value={form.start_time}
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
          />
          <TimeInput
            label="종료 시간"
            value={form.end_time}
            onChange={(e) => setForm({ ...form, end_time: e.target.value })}
          />
        </Group>

        <Textarea
          label="메모"
          placeholder="추가 메모 (선택)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" loading={loading}>
            저장
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export function EditScheduleModal({
  opened,
  onClose,
  schedule,
}: EditScheduleModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="일정 수정" centered>
      {opened && (
        <EditScheduleForm
          key={schedule.id}
          schedule={schedule}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}
