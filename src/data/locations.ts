import { Location } from './types';

/** Подборка филиалов (демо-данные по мотивам сети BLADE). */
export const locations: Location[] = [
  {
    id: 'msk-tverskaya',
    city: 'Москва',
    title: 'BLADE Тверская',
    address: 'ул. Тверская, 18к1',
    metro: 'Пушкинская',
    hours: '10:00–22:00',
    phone: '+7 495 120-10-10',
    lat: 55.7649,
    lng: 37.6049,
  },
  {
    id: 'msk-arbat',
    city: 'Москва',
    title: 'BLADE Арбат',
    address: 'ул. Новый Арбат, 11',
    metro: 'Арбатская',
    hours: '10:00–22:00',
    phone: '+7 495 120-10-11',
    lat: 55.7522,
    lng: 37.5927,
  },
  {
    id: 'msk-citydel',
    city: 'Москва',
    title: 'BLADE Москва-Сити',
    address: 'Пресненская наб., 12',
    metro: 'Деловой центр',
    hours: '10:00–22:00',
    phone: '+7 495 120-10-12',
    lat: 55.7494,
    lng: 37.5378,
  },
  {
    id: 'spb-nevsky',
    city: 'Санкт-Петербург',
    title: 'BLADE Невский',
    address: 'Невский пр., 54',
    metro: 'Гостиный двор',
    hours: '10:00–22:00',
    phone: '+7 812 120-20-10',
    lat: 59.9343,
    lng: 30.3351,
  },
  {
    id: 'spb-petrogradka',
    city: 'Санкт-Петербург',
    title: 'BLADE Петроградская',
    address: 'Большой пр. П.С., 33',
    metro: 'Петроградская',
    hours: '10:00–22:00',
    phone: '+7 812 120-20-11',
    lat: 59.9626,
    lng: 30.3009,
  },
  {
    id: 'kzn-bauman',
    city: 'Казань',
    title: 'BLADE Баумана',
    address: 'ул. Баумана, 44',
    hours: '10:00–22:00',
    phone: '+7 843 120-30-10',
    lat: 55.7903,
    lng: 49.1186,
  },
  {
    id: 'ekb-lenina',
    city: 'Екатеринбург',
    title: 'BLADE Ленина',
    address: 'пр. Ленина, 50',
    hours: '10:00–22:00',
    phone: '+7 343 120-40-10',
    lat: 56.8389,
    lng: 60.6057,
  },
];

export function getLocationById(id: string): Location | undefined {
  return locations.find((l) => l.id === id);
}

export const cities = Array.from(new Set(locations.map((l) => l.city)));
