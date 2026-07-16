import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chip } from '../../src/components/Chip';
import { categoryLabels, services } from '../../src/data/services';
import { ServiceCategory } from '../../src/data/types';
import { useBooking } from '../../src/store/BookingContext';
import { colors, radius, spacing, typography } from '../../src/theme';
import { formatPrice } from '../../src/utils/datetime';

type Filter = 'all' | ServiceCategory;

export default function ServicesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setDraft, resetDraft } = useBooking();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? services : services.filter((s) => s.category === filter)),
    [filter]
  );

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'Все' },
    ...(Object.keys(categoryLabels) as ServiceCategory[]).map((c) => ({
      key: c,
      label: categoryLabels[c],
    })),
  ];

  const book = (serviceId: string) => {
    resetDraft();
    setDraft({ serviceId });
    router.push('/booking/barber');
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={typography.label}>УСЛУГИ И ЦЕНЫ</Text>
        <Text style={[typography.h1, { marginTop: 4 }]}>Прайс</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        style={styles.filtersWrap}
      >
        {filters.map((f) => (
          <Chip
            key={f.key}
            label={f.label}
            active={filter === f.key}
            onPress={() => setFilter(f.key)}
          />
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((s) => (
          <Pressable
            key={s.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => book(s.id)}
          >
            <View style={styles.cardTop}>
              <View style={{ flex: 1, paddingRight: spacing.md }}>
                <View style={styles.titleRow}>
                  <Text style={styles.cardTitle}>{s.title}</Text>
                  {s.popular ? (
                    <View style={styles.hotBadge}>
                      <Text style={styles.hotText}>ХИТ</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.cardDesc}>{s.description}</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.metaText}>{s.durationMin} мин</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaText}>{categoryLabels[s.category]}</Text>
                </View>
              </View>
              <View style={styles.priceCol}>
                <Text style={styles.priceFromLabel}>от</Text>
                <Text style={styles.price}>{formatPrice(s.priceFrom)}</Text>
              </View>
            </View>
            <View style={styles.bookRow}>
              <Text style={styles.bookText}>Записаться</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.text} />
            </View>
          </Pressable>
        ))}
        <Text style={styles.footnote}>
          Итоговая стоимость зависит от грейда мастера и длины волос.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  filtersWrap: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filters: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    alignItems: 'center',
  },
  list: {
    padding: spacing.xl,
    gap: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  cardPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  hotBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: colors.gold,
  },
  hotText: {
    color: colors.textInverse,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.md,
  },
  metaText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  metaDot: {
    color: colors.textMuted,
    marginHorizontal: 2,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceFromLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  price: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bookText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footnote: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
