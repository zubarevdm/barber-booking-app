/** Утилиты дат/слотов записи. Salon работает 10:00–22:00. */

const OPEN_HOUR = 10;
const CLOSE_HOUR = 22;
const SLOT_STEP_MIN = 30;

export interface DayOption {
  date: Date;
  /** Ключ YYYY-MM-DD для сравнения. */
  key: string;
  weekday: string;
  dayNum: string;
  month: string;
  isToday: boolean;
}

const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTHS = [
  'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
  'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
];

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

/** Ближайшие N дней начиная с сегодня. */
export function nextDays(count = 14): DayOption[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = dateKey(today);

  return Array.from({ length: count }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      date,
      key: dateKey(date),
      weekday: WEEKDAYS[date.getDay()],
      dayNum: String(date.getDate()),
      month: MONTHS[date.getMonth()],
      isToday: dateKey(date) === todayKey,
    };
  });
}

/**
 * Слоты на выбранный день. Часть слотов псевдослучайно «занята»
 * (детерминированно от даты + барбера), чтобы запись выглядела живой.
 */
export function slotsForDay(day: Date, barberId: string): { time: string; taken: boolean }[] {
  const now = new Date();
  const isToday = dateKey(day) === dateKey(now);
  const seed = hashString(dateKey(day) + barberId);

  const slots: { time: string; taken: boolean }[] = [];
  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_STEP_MIN) {
      // Прошедшее время сегодня не показываем.
      if (isToday && (h < now.getHours() || (h === now.getHours() && m <= now.getMinutes()))) {
        continue;
      }
      const idx = h * 2 + m / SLOT_STEP_MIN;
      const taken = (seed >> idx % 31) % 3 === 0;
      slots.push({
        time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
        taken,
      });
    }
  }
  return slots;
}

export function buildStartISO(day: Date, time: string): string {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(day);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes()
  ).padStart(2, '0')}`;
}

export function formatPrice(value: number): string {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
