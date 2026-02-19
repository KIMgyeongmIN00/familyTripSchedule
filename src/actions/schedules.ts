'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { ScheduleInsert, ScheduleUpdate } from '@/lib/supabase/types';

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

// 서버 사이드에서 패스워드 검증 (환경변수 사용)
function getAccessPassword(): string {
  return process.env.NEXT_PUBLIC_ACCESS_PASSWORD || '';
}

export async function addSchedule(input: ScheduleInsert) {
  const supabase = await createClient();
  const password = getAccessPassword();

  const { error } = await supabase.rpc('add_schedule', {
    p_password: password,
    p_date: input.date,
    p_title: input.title,
    p_start_time: input.start_time || null,
    p_end_time: input.end_time || null,
    p_location: input.location || null,
    p_description: input.description || null,
    p_created_by: input.created_by || null,
  });

  if (error) {
    console.error('addSchedule error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateSchedule(id: string, input: ScheduleUpdate) {
  const supabase = await createClient();
  const password = getAccessPassword();

  const { error } = await supabase.rpc('update_schedule', {
    p_password: password,
    p_id: id,
    p_title: input.title,
    p_start_time: input.start_time || null,
    p_end_time: input.end_time || null,
    p_location: input.location || null,
    p_description: input.description || null,
  });

  if (error) {
    console.error('updateSchedule error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteSchedule(id: string) {
  const supabase = await createClient();
  const password = getAccessPassword();

  const { error } = await supabase.rpc('delete_schedule', {
    p_password: password,
    p_id: id,
  });

  if (error) {
    console.error('deleteSchedule error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function toggleScheduleComplete(id: string, completed: boolean) {
  const supabase = await createClient();
  const password = getAccessPassword();

  const { error } = await supabase.rpc('toggle_schedule_complete', {
    p_password: password,
    p_id: id,
    p_completed: completed,
  });

  if (error) {
    console.error('toggleScheduleComplete error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
