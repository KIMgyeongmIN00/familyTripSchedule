'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { ScheduleInsert, ScheduleUpdate, CommentInsert } from '@/lib/supabase/types';

async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // ignore
          }
        },
      },
    }
  );
}

export async function addSchedule(input: ScheduleInsert) {
  const supabase = await createClient();

  const { error } = await supabase.from('schedules').insert(input);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateSchedule(id: string, input: ScheduleUpdate) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('schedules')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteSchedule(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('schedules').delete().eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function addComment(input: CommentInsert) {
  const supabase = await createClient();

  const { error } = await supabase.from('comments').insert(input);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteComment(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('comments').delete().eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
