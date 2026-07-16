import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../src/components/Avatar';
import { Button } from '../../src/components/Button';
import { Wordmark } from '../../src/components/Wordmark';
import { barbers } from '../../src/data/barbers';
import { categoryLabels, services } from '../../src/data/services';
import { useBooking } from '../../src/store/BookingContext';
import { colors, radius, spacing, typography } from '../../src/theme';
import { formatPrice } from '../../src/utils/datetime';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { selectedCity, resetDraft } = useBooking();
  const popular = services.filter((s) => s.popular);
  const topBarbers = barbers.filter((b) => b.id !== 'b-any').slice(0, 4);

  const startBooking = () => {
    resetDraft();
    router.push('/booking/service');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: spacing.xxxl }}
      showsVerticalScrollIndicator={false}
    >
      {/* HERO */}
      <View style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}>
        <LinearGradient
          colors={['#1A1A1A', '#0B0B0B']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroTop}>
          <Wordmark size={24} />
          <Pressable
            style={styles.cityPill}
            onPress={() => router.push('/(tabs)/locations')}
          >
            <Ionicons name="location-outline" size={14} color={colors.text} />
            <Text style={styles.cityText}>{selectedCity ?? 'Москва'}</Text>
            <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
          </Pressable>
        </View>

        <Text style={styles.heroLabel}>BARBERSHOP · С 2014</Text>
        <Text style={styles.heroTitle}>
          МУЖСКАЯ{'\n'}ТЕРРИТОРИЯ
        </Text>
        <Text style={styles.heroSubtitle}>
          Стрижка, борода и бритьё опасной бритвой. Запишись за минуту.
        </Text>

        <Button label="Записаться" onPress={startBooking} style={{ marginTop: spacing.xl }} />
      </View>

      {/* ПОПУЛЯРНОЕ */}
      <Section
        title="Популярное"
        actionLabel="Все услуги"
        onAction={() => router.push('/(tabs)/services')}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
        >
          {popular.map((s) => (
            <Pressable
              key={s.id}
              style={styles.popularCard}
              onPress={startBooking}
            >
              <View style={styles.popularIcon}>
                <Ionicons name="cut-outline" size={22} color={colors.text} />
              </View>
              <Text style={styles.popularCat}>
                {categoryLabels[s.category]}
              </Text>
              <Text style={styles.popularTitle} numberOfLines={2}>
                {s.title}
              </Text>
              <Text style={styles.popularPrice}>от {formatPrice(s.priceFrom)}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </Section>

      {/* МАСТЕРА */}
      <Section
        title="Наши мастера"
        actionLabel="Записаться"
        onAction={startBooking}
      >
        <View style={{ gap: spacing.md }}>
          {topBarbers.map((b) => (
            <Pressable key={b.id} style={styles.barberRow} onPress={startBooking}>
              <Avatar initials={b.initials} />
              <View style={{ flex: 1 }}>
                <Text style={styles.barberName}>{b.name}</Text>
                <Text style={styles.barberGrade}>{b.grade}</Text>
              </View>
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={12} color={colors.gold} />
                <Text style={styles.ratingText}>{b.rating.toFixed(1)}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </Section>

      {/* БАННЕР */}
      <View style={styles.banner}>
        <Text style={styles.bannerLabel}>ПРОГРАММА ЛОЯЛЬНОСТИ</Text>
        <Text style={styles.bannerTitle}>Каждая 6-я стрижка — в подарок</Text>
        <Text style={styles.bannerText}>
          Записывайся через приложение и копи визиты автоматически.
        </Text>
      </View>
    </ScrollView>
  );
}

function Section({
  title,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <Text style={typography.h2}>{title}</Text>
        {actionLabel ? (
          <Pressable onPress={onAction} hitSlop={8}>
            <Text style={styles.sectionAction}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    overflow: 'hidden',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxxl,
  },
  cityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cityText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  heroLabel: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: spacing.md,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: 1,
    lineHeight: 46,
  },
  heroSubtitle: {
    ...typography.bodyMuted,
    marginTop: spacing.md,
    maxWidth: '90%',
    lineHeight: 20,
  },
  section: {
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  sectionAction: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  hList: {
    gap: spacing.md,
    paddingRight: spacing.xl,
  },
  popularCard: {
    width: 160,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  popularIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  popularCat: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  popularTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    minHeight: 40,
  },
  popularPrice: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  barberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  barberName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  barberGrade: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
  },
  ratingText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  banner: {
    margin: spacing.xl,
    marginTop: spacing.xxl,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  bannerLabel: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  bannerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  bannerText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
