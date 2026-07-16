import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../src/components/Avatar';
import { Button } from '../../src/components/Button';
import { StepHeader } from '../../src/components/StepHeader';
import { barbers, priceFor } from '../../src/data/barbers';
import { getServiceById } from '../../src/data/services';
import { useBooking } from '../../src/store/BookingContext';
import { colors, radius, spacing } from '../../src/theme';
import { formatPrice } from '../../src/utils/datetime';

export default function ChooseBarberScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { draft, setDraft } = useBooking();
  const service = draft.serviceId ? getServiceById(draft.serviceId) : undefined;

  return (
    <View style={styles.screen}>
      <View style={{ paddingTop: insets.top }}>
        <StepHeader title="Выберите мастера" step={2} totalSteps={4} />
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {barbers.map((b) => {
          const selected = draft.barberId === b.id;
          const price = service ? priceFor(service.priceFrom, b.priceMultiplier) : undefined;
          const isAny = b.id === 'b-any';
          return (
            <Pressable
              key={b.id}
              style={[styles.row, selected && styles.rowSelected]}
              onPress={() => setDraft({ barberId: b.id })}
            >
              {isAny ? (
                <View style={styles.anyAvatar}>
                  <Ionicons name="shuffle" size={22} color={colors.text} />
                </View>
              ) : (
                <Avatar initials={b.initials} />
              )}

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{b.name}</Text>
                {isAny ? (
                  <Text style={styles.grade}>Подберём ближайшее время</Text>
                ) : (
                  <>
                    <Text style={styles.grade}>{b.grade}</Text>
                    <View style={styles.specRow}>
                      <Ionicons name="star" size={12} color={colors.gold} />
                      <Text style={styles.rating}>
                        {b.rating.toFixed(1)} · {b.reviews} отзывов
                      </Text>
                    </View>
                  </>
                )}
              </View>

              <View style={styles.rightCol}>
                {price ? <Text style={styles.price}>{formatPrice(price)}</Text> : null}
                <View style={[styles.radio, selected && styles.radioOn]}>
                  {selected ? (
                    <Ionicons name="checkmark" size={14} color={colors.textInverse} />
                  ) : null}
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          label="Далее"
          disabled={!draft.barberId}
          onPress={() => router.push('/booking/time')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowSelected: {
    borderColor: colors.text,
    backgroundColor: colors.surfaceElevated,
  },
  anyAvatar: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  grade: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  rating: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  price: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
