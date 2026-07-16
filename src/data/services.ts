import { Service, ServiceCategory } from './types';

export const categoryLabels: Record<ServiceCategory, string> = {
  haircut: 'Стрижка',
  beard: 'Борода',
  shave: 'Бритьё',
  care: 'Уход',
  kids: 'Детям',
};

/** Прайс по мотивам example.com. Цены — «от», финал зависит от грейда барбера. */
export const services: Service[] = [
  {
    id: 'haircut-classic',
    title: 'Мужская стрижка',
    description: 'Стрижка машинкой и ножницами, мытьё, укладка.',
    category: 'haircut',
    priceFrom: 1690,
    durationMin: 60,
    popular: true,
  },
  {
    id: 'haircut-scissors',
    title: 'Стрижка ножницами',
    description: 'Полностью ножницевая работа для сложных форм.',
    category: 'haircut',
    priceFrom: 2290,
    durationMin: 75,
  },
  {
    id: 'head-shave',
    title: 'Бритьё головы опасной бритвой',
    description: 'Гладкое бритьё головы, горячее полотенце, уход.',
    category: 'shave',
    priceFrom: 1790,
    durationMin: 45,
  },
  {
    id: 'royal-shave',
    title: 'Королевское бритьё',
    description: 'Бритьё лица опасной бритвой по классическому ритуалу.',
    category: 'shave',
    priceFrom: 1790,
    durationMin: 45,
    popular: true,
  },
  {
    id: 'beard-modeling',
    title: 'Моделирование бороды',
    description: 'Стрижка и оформление бороды, контур опасной бритвой.',
    category: 'beard',
    priceFrom: 1590,
    durationMin: 40,
  },
  {
    id: 'haircut-beard',
    title: 'Стрижка + борода',
    description: 'Комплекс: стрижка и моделирование бороды.',
    category: 'beard',
    priceFrom: 3280,
    durationMin: 90,
    popular: true,
  },
  {
    id: 'skin-care',
    title: 'Комплекс по уходу за кожей',
    description: 'Чёрная маска, пилинг, увлажнение, массаж лица.',
    category: 'care',
    priceFrom: 1800,
    durationMin: 50,
  },
  {
    id: 'kids-haircut',
    title: 'Детская стрижка',
    description: 'Стрижка для гостей до 12 лет в комфортной атмосфере.',
    category: 'kids',
    priceFrom: 1490,
    durationMin: 45,
  },
];

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}
