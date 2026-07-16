import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chip } from '../../src/components/Chip';
import { cities, locations } from '../../src/data/locations';
import { useBooking } from '../../src/store/BookingContext';
import { colors, radius, spacing, typography } from '../../src/theme';

export default function LocationsScreen() {
  const insets = useSafeAreaInsets();
  const { selectedCity, setSelectedCity } = useBooking();
  const [city, setCity] = useState<string>(selectedCity ?? cities[0]);

  const list = useMemo(() => locations.filter((l) => l.city === city), [city]);

  const choose = (c: string) => {
    setCity(c);
    setSelectedCity(c);
  };

  const openMap = (lat: number, lng: number, title: string) => {
    const url = `https://yandex.ru/maps/?pt=${lng},${lat}&z=16&l=map&text=${encodeURIComponent(
      title
    )}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={typography.label}>НАЙТИ БАРБЕРШОП</Text>
        <Text style={[typography.h1, { marginTop: 4 }]}>Филиалы</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        style={styles.filtersWrap}
      >
        {cities.map((c) => (
          <Chip key={c} label={c} active={city === c} onPress={() => choose(c)} />
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {list.map((l) => (
          <View key={l.id} style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.title}>{l.title}</Text>
              <View style={styles.openBadge}>
                <View style={styles.dot} />
                <Text style={styles.openText}>Открыто</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                {l.address}
                {l.metro ? ` · м. ${l.metro}` : ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>Ежедневно {l.hours}</Text>
            </View>

            <View style={styles.actions}>
              <Pressable
                style={styles.actionBtn}
                onPress={() => Linking.openURL(`tel:${l.phone.replace(/\s/g, '')}`)}
              >
                <Ionicons name="call-outline" size={16} color={colors.text} />
                <Text style={styles.actionText}>Позвонить</Text>
              </Pressable>
              <Pressable
                style={styles.actionBtn}
                onPress={() => openMap(l.lat, l.lng, l.title)}
              >
                <Ionicons name="navigate-outline" size={16} color={colors.text} />
                <Text style={styles.actionText}>На карте</Text>
              </Pressable>
            </View>
          </View>
        ))}
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
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    flex: 1,
  },
  openBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  openText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 13,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
});
