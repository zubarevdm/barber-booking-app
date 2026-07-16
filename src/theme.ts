/**
 * Визуальная система BLADE — брутальный монохром.
 * Чёрный фон, белые/серые акценты, плотная типографика с разрядкой.
 */

export const colors = {
  // Фоны
  background: '#0B0B0B',
  surface: '#141414',
  surfaceElevated: '#1A1A1A',
  surfacePressed: '#202020',

  // Границы / разделители
  border: '#262626',
  borderStrong: '#363636',

  // Текст
  text: '#FFFFFF',
  textSecondary: '#9A9A9A',
  textMuted: '#6B6B6B',
  textInverse: '#0B0B0B',

  // Акценты
  accent: '#FFFFFF', // основной CTA — белый по-брутальному
  accentMuted: '#E5E5E5',
  gold: '#C8A24B', // тонкий тёплый акцент для деталей

  // Статусы
  success: '#3FB984',
  danger: '#E5484D',
  warning: '#E2A03F',

  // Прочее
  overlay: 'rgba(0,0,0,0.7)',
  skeleton: '#1E1E1E',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

/**
 * Типографика. Заголовки — крупные, жирные, с разрядкой и UPPERCASE
 * для барбершоп-настроения.
 */
export const typography = {
  hero: {
    fontSize: 40,
    fontWeight: '800' as const,
    letterSpacing: 2,
    color: colors.text,
  },
  h1: {
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: 1,
    color: colors.text,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    color: colors.text,
  },
  h3: {
    fontSize: 16,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
    color: colors.text,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.text,
  },
  bodyMuted: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    color: colors.textSecondary,
  },
  price: {
    fontSize: 16,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    color: colors.text,
  },
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
} as const;
