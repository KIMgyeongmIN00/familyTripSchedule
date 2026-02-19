"use client";

import { useSchedules } from "@/contexts/ScheduleContext";
import { useWeather } from "@/hooks/useWeather";
import { TRIP_DATES } from "@/lib/constants";
import {
  ActionIcon,
  Group,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import Image from "next/image";
import { DayCard } from "./DayCard";
import { OverviewSkeleton } from "./ScheduleSkeleton";

interface ScheduleOverviewProps {
  userName: string;
}

export function ScheduleOverview({ userName }: ScheduleOverviewProps) {
  const { loading, getSchedulesByDate } = useSchedules();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  const { weather } = useWeather();

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen">
      <header
        className="sticky top-0 border-b p-4 z-10"
        style={{ backgroundColor: "var(--background)" }}
      >
        <Group justify="space-between">
          <div>
            <Title order={3}>가족 여행 일정</Title>
            <Text size="sm" c="dimmed">
              안녕하세요, {userName}님
            </Text>
          </div>
          <Group gap="sm">
            {weather && (
              <Group gap={4}>
                <Image
                  src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                  alt={weather.description}
                  width={28}
                  height={28}
                  unoptimized
                />
                <Text size="sm" fw={500}>
                  {weather.temp}°
                </Text>
              </Group>
            )}
            <ActionIcon
              variant="subtle"
              onClick={toggleColorScheme}
              title={
                computedColorScheme === "dark" ? "라이트 모드" : "다크 모드"
              }
            >
              {computedColorScheme === "dark" ? (
                <IconSun size={20} />
              ) : (
                <IconMoon size={20} />
              )}
            </ActionIcon>
          </Group>
        </Group>
      </header>

      <main className="p-4">
        {loading ? (
          <OverviewSkeleton />
        ) : (
          <Stack gap="md">
            {TRIP_DATES.map((date, index) => (
              <DayCard
                key={date}
                date={date}
                dayNumber={index + 1}
                schedules={getSchedulesByDate(date)}
              />
            ))}
          </Stack>
        )}
      </main>
    </div>
  );
}
