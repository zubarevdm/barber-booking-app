export type ServiceCategory = 'haircut' | 'beard' | 'shave' | 'care' | 'kids';

export interface Service {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  /** Минимальная цена услуги, ₽ (зависит от уровня барбера). */
  priceFrom: number;
  /** Длительность услуги в минутах. */
  durationMin: number;
  popular?: boolean;
}

export interface Barber {
  id: string;
  name: string;
  /** Грейд барбера влияет на итоговую цену. */
  grade: 'Барбер' | 'Топ-барбер' | 'Арт-директор';
  /** Множитель к минимальной цене услуги. */
  priceMultiplier: number;
  rating: number;
  reviews: number;
  /** Инициалы для аватара-заглушки. */
  initials: string;
  specialties: string[];
}

export interface Location {
  id: string;
  city: string;
  title: string;
  address: string;
  metro?: string;
  hours: string;
  phone: string;
  lat: number;
  lng: number;
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceTitle: string;
  barberId: string;
  barberName: string;
  locationId: string;
  locationTitle: string;
  /** ISO-дата начала записи. */
  startISO: string;
  price: number;
  durationMin: number;
  status: 'upcoming' | 'done' | 'cancelled';
}
