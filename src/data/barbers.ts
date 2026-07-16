import { Barber } from './types';

export const barbers: Barber[] = [
  {
    id: 'b-artem',
    name: 'Артём Волков',
    grade: 'Арт-директор',
    priceMultiplier: 1.8,
    rating: 4.9,
    reviews: 412,
    initials: 'АВ',
    specialties: ['Ножницы', 'Сложные формы', 'Борода'],
  },
  {
    id: 'b-denis',
    name: 'Денис Громов',
    grade: 'Топ-барбер',
    priceMultiplier: 1.4,
    rating: 4.8,
    reviews: 287,
    initials: 'ДГ',
    specialties: ['Фейды', 'Опасная бритва'],
  },
  {
    id: 'b-marat',
    name: 'Марат Хан',
    grade: 'Топ-барбер',
    priceMultiplier: 1.4,
    rating: 4.9,
    reviews: 198,
    initials: 'МХ',
    specialties: ['Классика', 'Борода', 'Уход'],
  },
  {
    id: 'b-ilya',
    name: 'Илья Соколов',
    grade: 'Барбер',
    priceMultiplier: 1.0,
    rating: 4.7,
    reviews: 124,
    initials: 'ИС',
    specialties: ['Машинка', 'Детские стрижки'],
  },
  {
    id: 'b-any',
    name: 'Любой свободный мастер',
    grade: 'Барбер',
    priceMultiplier: 1.0,
    rating: 4.8,
    reviews: 0,
    initials: '—',
    specialties: ['Ближайшее свободное время'],
  },
];

export function getBarberById(id: string): Barber | undefined {
  return barbers.find((b) => b.id === id);
}

/** Итоговая цена услуги у конкретного барбера, округлённая до 10 ₽. */
export function priceFor(priceFrom: number, multiplier: number): number {
  return Math.round((priceFrom * multiplier) / 10) * 10;
}
