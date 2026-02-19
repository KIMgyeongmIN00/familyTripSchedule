'use client';

import { useState, useEffect, useCallback } from 'react';
import { Stack, Text, TextInput, Group, Paper, ActionIcon, Divider } from '@mantine/core';
import { IconSend, IconTrash } from '@tabler/icons-react';
import { addComment, deleteComment } from '@/actions/schedules';
import { createClient } from '@/lib/supabase/client';
import type { Comment } from '@/lib/supabase/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

interface CommentSectionProps {
  scheduleId: string;
  userName: string;
}

export function CommentSection({ scheduleId, userName }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('schedule_id', scheduleId)
      .order('created_at', { ascending: true });

    if (data) {
      setComments(data);
    }
  }, [scheduleId]);

  useEffect(() => {
    fetchComments();

    const supabase = createClient();
    const channel = supabase
      .channel(`comments:${scheduleId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `schedule_id=eq.${scheduleId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [scheduleId, fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    await addComment({
      schedule_id: scheduleId,
      content: newComment.trim(),
      created_by: userName,
    });
    setNewComment('');
    setLoading(false);
  };

  const handleDelete = async (commentId: string) => {
    await deleteComment(commentId);
  };

  return (
    <Stack gap="sm" mt="md">
      <Divider />
      <Text size="sm" fw={500} c="dimmed">
        댓글 {comments.length > 0 && `(${comments.length})`}
      </Text>

      {comments.length > 0 && (
        <Stack gap="xs">
          {comments.map((comment) => (
            <Paper key={comment.id} p="xs" bg="gray.0" radius="sm">
              <Group justify="space-between" align="flex-start">
                <Stack gap={2} className="flex-1">
                  <Group gap="xs">
                    <Text size="xs" fw={600}>{comment.created_by}</Text>
                    <Text size="xs" c="dimmed">
                      {dayjs(comment.created_at).fromNow()}
                    </Text>
                  </Group>
                  <Text size="sm">{comment.content}</Text>
                </Stack>
                {comment.created_by === userName && (
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="sm"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                )}
              </Group>
            </Paper>
          ))}
        </Stack>
      )}

      <form onSubmit={handleSubmit}>
        <Group gap="xs">
          <TextInput
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1"
            size="sm"
          />
          <ActionIcon
            type="submit"
            variant="filled"
            color="blue"
            size="lg"
            loading={loading}
            disabled={!newComment.trim()}
          >
            <IconSend size={16} />
          </ActionIcon>
        </Group>
      </form>
    </Stack>
  );
}
