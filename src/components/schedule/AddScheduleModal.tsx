'use client';

import { useState } from 'react';
import { Modal, TextInput, Textarea, Button, Group, Stack } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { addSchedule } from '@/actions/schedules';

interface AddScheduleModalProps {
  opened: boolean;
  onClose: () => void;
  date: string;
  userName: string;
  onSuccess?: () => void;
}

export function AddScheduleModal({ opened, onClose, date, userName, onSuccess }: AddScheduleModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    location: '',
    start_time: '',
    end_time: '',
    description: '',
  });

  const resetForm = () => {
    setForm({
      title: '',
      location: '',
      start_time: '',
      end_time: '',
      description: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    setLoading(true);

    await addSchedule({
      date,
      title: form.title.trim(),
      location: form.location.trim() || null,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      description: form.description.trim() || null,
      created_by: userName,
    });

    setLoading(false);
    handleClose();
    onSuccess?.();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="일정 추가" centered>
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
            <Button variant="subtle" onClick={handleClose}>
              취소
            </Button>
            <Button type="submit" loading={loading}>
              추가
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
