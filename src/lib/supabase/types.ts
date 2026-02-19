export interface Schedule {
  id: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  title: string;
  location: string | null;
  description: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  schedule_id: string;
  content: string;
  created_by: string;
  created_at: string;
}

export type ScheduleInsert = Omit<Schedule, 'id' | 'created_at' | 'updated_at'>;
export type ScheduleUpdate = Partial<Omit<Schedule, 'id' | 'created_at'>>;

export type CommentInsert = Omit<Comment, 'id' | 'created_at'>;

export type Database = {
  public: {
    Tables: {
      schedules: {
        Row: Schedule;
        Insert: ScheduleInsert;
        Update: ScheduleUpdate;
      };
      comments: {
        Row: Comment;
        Insert: CommentInsert;
        Update: Partial<Omit<Comment, 'id' | 'created_at'>>;
      };
    };
  };
};
