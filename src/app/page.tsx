'use client';

import { Center, Loader } from '@mantine/core';
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/auth/AuthForm';
import { ScheduleOverview } from '@/components/schedule/ScheduleOverview';

export default function Home() {
  const { isLoading, isAuthenticated, userName, login } = useAuth();

  if (isLoading) {
    return (
      <Center className="min-h-screen">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return (
      <Center className="min-h-screen p-6">
        <AuthForm onLogin={login} />
      </Center>
    );
  }

  return <ScheduleOverview userName={userName} />;
}
