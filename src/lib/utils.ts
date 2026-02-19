import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ko');

export function formatDateKorean(date: string): string {
  return dayjs.tz(date, 'Asia/Seoul').format('M월 D일');
}

export function getDayOfWeek(date: string): string {
  return dayjs.tz(date, 'Asia/Seoul').format('dddd');
}

export function formatTime(time: string | null): string {
  if (!time) return '';
  return time.slice(0, 5);
}
