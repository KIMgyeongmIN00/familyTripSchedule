-- Add completed column to schedules table
ALTER TABLE schedules ADD COLUMN completed BOOLEAN DEFAULT FALSE;
