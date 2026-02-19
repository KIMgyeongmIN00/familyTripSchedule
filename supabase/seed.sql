-- app_settings에 접근 패스워드 설정
-- 이 파일은 supabase db push 후 Supabase Dashboard의 SQL Editor에서 실행하세요
-- 또는 service role key로 실행해야 합니다 (RLS가 활성화되어 있으므로 anon key로는 불가)

-- 패스워드를 .env.local의 NEXT_PUBLIC_ACCESS_PASSWORD와 동일하게 설정하세요
INSERT INTO app_settings (key, value)
VALUES ('access_password', 'YOUR_PASSWORD_HERE')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
