-- comments 테이블
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_comments_schedule_id ON comments(schedule_id);

-- RLS 비활성화
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
