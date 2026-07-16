import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { StepHeader } from '../../src/components/StepHeader';
import { categoryLabels, services } from '../../src/data/services';
import { useBooking } from '../../src/store/BookingContext';
import { colors, radius, spacing } from '../../src/theme';
import { formatPrice } from '../../src/utils/datetime';

export default function ChooseServiceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { draft, setDraft } = useBooking();

  return (
    <View style={styles.screen}>
      <View style={{ paddingTop: insets.top }}>
        <StepHeader
          title="Выберите услугу"
          step={1}
          totalSteps={4}
          onBack={() => router.back()}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {services.map((s) => {
          const selected = draft.serviceId === s.id;
          return (
            <Pressable
              key={s.id}
              style={[styles.row, selected && styles.rowSelected]}
              onPress={() => setDraft({ serviceId: s.id })}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.cat}>{categoryLabels[s.category]}</Text>
                <Text style={styles.title}>{s.title}</Text>
                <Text style={styles.meta}>
                  {s.durationMin} мин · от {formatPrice(s.priceFrom)}
                </Text>
              </View>
              <View style={[styles.radio, selected && styles.radioOn]}>
                {selected ? (
                  <Ionicons name="checkmark" size={16} color={colors.textInverse} />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          label="Далее"
          disabled={!draft.serviceId}
          onPress={() => router.push('/booking/barber')}
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
  cat: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
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
