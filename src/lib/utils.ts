import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

export function formatDateKorean(date: string): string {
  return dayjs(date).format('M월 D일');
}

export function getDayOfWeek(date: string): string {
  return dayjs(date).format('dddd');
}

export function formatTime(time: string | null): string {
  if (!time) return '';
  return time.slice(0, 5);
}
