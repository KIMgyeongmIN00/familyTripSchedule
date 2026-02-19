-- schedules 테이블
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  title VARCHAR(200) NOT NULL,
  location VARCHAR(200),
  description TEXT,
  created_by VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(date);

-- RLS 비활성화 (단순 앱용)
ALTER TABLE schedules DISABLE ROW LEVEL SECURITY;

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE schedules;
