"use client";

import {
  Alert,
  Button,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useState } from "react";

interface AuthFormProps {
  onLogin: (name: string, password: string) => boolean;
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }

    if (!password) {
      setError("패스워드를 입력해주세요.");
      return;
    }

    const success = onLogin(name.trim(), password);
    if (!success) {
      setError("패스워드가 올바르지 않습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Stack gap="lg">
        <div className="text-center">
          <Title order={2} mb="xs">
            가족 여행 일정
          </Title>
          <Text c="dimmed" size="sm">
            2025년 5월 22일 ~ 25일
          </Text>
        </div>

        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            variant="light"
          >
            {error}
          </Alert>
        )}

        <TextInput
          label="닉네임"
          placeholder="앱에서 사용할 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="md"
        />

        <PasswordInput
          label="패스워드"
          placeholder="접속 패스워드"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="md"
        />

        <Button type="submit" fullWidth size="md" mt="sm">
          입장하기
        </Button>
      </Stack>
    </form>
  );
}
