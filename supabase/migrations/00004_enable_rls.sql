-- Enable RLS on schedules table
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (public view is OK)
CREATE POLICY "allow_read_all" ON schedules
  FOR SELECT USING (true);

-- Block direct writes (force use of RPC functions)
CREATE POLICY "block_direct_insert" ON schedules
  FOR INSERT WITH CHECK (false);

CREATE POLICY "block_direct_update" ON schedules
  FOR UPDATE USING (false);

CREATE POLICY "block_direct_delete" ON schedules
  FOR DELETE USING (false);

-- Create settings table for storing access password
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Enable RLS on settings (no read access for anon)
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- RPC: Add schedule with password validation
CREATE OR REPLACE FUNCTION add_schedule(
  p_password TEXT,
  p_date DATE,
  p_title TEXT,
  p_start_time TIME DEFAULT NULL,
  p_end_time TIME DEFAULT NULL,
  p_location TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_created_by TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  stored_password TEXT;
  new_id UUID;
BEGIN
  SELECT value INTO stored_password FROM app_settings WHERE key = 'access_password';

  IF stored_password IS NULL OR p_password != stored_password THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  INSERT INTO schedules (date, title, start_time, end_time, location, description, created_by)
  VALUES (p_date, p_title, p_start_time, p_end_time, p_location, p_description, p_created_by)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

-- RPC: Update schedule with password validation
CREATE OR REPLACE FUNCTION update_schedule(
  p_password TEXT,
  p_id UUID,
  p_title TEXT,
  p_start_time TIME DEFAULT NULL,
  p_end_time TIME DEFAULT NULL,
  p_location TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  stored_password TEXT;
BEGIN
  SELECT value INTO stored_password FROM app_settings WHERE key = 'access_password';

  IF stored_password IS NULL OR p_password != stored_password THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE schedules
  SET title = p_title,
      start_time = p_start_time,
      end_time = p_end_time,
      location = p_location,
      description = p_description,
      updated_at = NOW()
  WHERE id = p_id;

  RETURN FOUND;
END;
$$;

-- RPC: Delete schedule with password validation
CREATE OR REPLACE FUNCTION delete_schedule(
  p_password TEXT,
  p_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  stored_password TEXT;
BEGIN
  SELECT value INTO stored_password FROM app_settings WHERE key = 'access_password';

  IF stored_password IS NULL OR p_password != stored_password THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  DELETE FROM schedules WHERE id = p_id;

  RETURN FOUND;
END;
$$;

-- RPC: Toggle schedule completion with password validation
CREATE OR REPLACE FUNCTION toggle_schedule_complete(
  p_password TEXT,
  p_id UUID,
  p_completed BOOLEAN
) RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  stored_password TEXT;
BEGIN
  SELECT value INTO stored_password FROM app_settings WHERE key = 'access_password';

  IF stored_password IS NULL OR p_password != stored_password THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE schedules
  SET completed = p_completed,
      updated_at = NOW()
  WHERE id = p_id;

  RETURN FOUND;
END;
$$;
