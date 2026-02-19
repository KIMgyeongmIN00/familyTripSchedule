'use client';

import { useState, useEffect } from 'react';

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        setLoading(false);
        return;
      }

      try {
        // 제주도 기준 날씨
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Jeju&appid=${apiKey}&units=metric&lang=kr`
        );
        const data = await res.json();

        if (data.main && data.weather) {
          setWeather({
            temp: Math.round(data.main.temp),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
          });
        }
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  return { weather, loading };
}
