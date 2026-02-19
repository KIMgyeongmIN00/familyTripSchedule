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
  completed: boolean;
}

export type ScheduleInsert = Omit<Schedule, 'id' | 'created_at' | 'updated_at' | 'completed'> & { completed?: boolean };
export type ScheduleUpdate = Partial<Omit<Schedule, 'id' | 'created_at'>>;

export type Database = {
  public: {
    Tables: {
      schedules: {
        Row: Schedule;
        Insert: ScheduleInsert;
        Update: ScheduleUpdate;
      };
    };
  };
};
