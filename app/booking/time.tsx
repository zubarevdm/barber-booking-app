import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { StepHeader } from '../../src/components/StepHeader';
import { cities, locations } from '../../src/data/locations';
import { useBooking } from '../../src/store/BookingContext';
import { colors, radius, spacing } from '../../src/theme';
import { DayOption, buildStartISO, nextDays, slotsForDay } from '../../src/utils/datetime';

export default function ChooseTimeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { draft, setDraft, selectedCity } = useBooking();

  const city = selectedCity ?? cities[0];
  const cityLocations = useMemo(
    () => locations.filter((l) => l.city === city),
    [city]
  );

  const [locationId, setLocationId] = useState<string>(
    draft.locationId ?? cityLocations[0]?.id
  );
  const days = useMemo(() => nextDays(14), []);
  const [day, setDay] = useState<DayOption>(days[0]);

  const slots = useMemo(
    () => slotsForDay(day.date, draft.barberId ?? 'any'),
    [day, draft.barberId]
  );

  const selectTime = (time: string) => {
    setDraft({
      locationId,
      dayKey: day.key,
      startISO: buildStartISO(day.date, time),
    });
  };

  const selectedTime = draft.startISO
    ? new Date(draft.startISO).toTimeString().slice(0, 5)
    : undefined;
  const sameDaySelected = draft.dayKey === day.key;

  return (
    <View style={styles.screen}>
      <View style={{ paddingTop: insets.top }}>
        <StepHeader title="Дата и время" step={3} totalSteps={4} />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Филиал */}
        <Text style={styles.blockLabel}>ФИЛИАЛ · {city.toUpperCase()}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.locRow}
        >
          {cityLocations.map((l) => {
            const active = locationId === l.id;
            return (
              <Pressable
                key={l.id}
                style={[styles.locCard, active && styles.locCardActive]}
                onPress={() => setLocationId(l.id)}
              >
                <Text style={[styles.locTitle, active && styles.locTitleActive]}>
                  {l.title}
                </Text>
                <Text style={styles.locAddr}>{l.address}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Дни */}
        <Text style={styles.blockLabel}>ДЕНЬ</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayRow}
        >
          {days.map((d) => {
            const active = day.key === d.key;
            return (
              <Pressable
                key={d.key}
                style={[styles.dayCard, active && styles.dayCardActive]}
                onPress={() => setDay(d)}
              >
                <Text style={[styles.dayWeekday, active && styles.dayActiveText]}>
                  {d.isToday ? 'Сег' : d.weekday}
                </Text>
                <Text style={[styles.dayNum, active && styles.dayActiveText]}>
                  {d.dayNum}
                </Text>
                <Text style={[styles.dayMonth, active && styles.dayActiveText]}>
                  {d.month}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Слоты */}
        <Text style={styles.blockLabel}>СВОБОДНОЕ ВРЕМЯ</Text>
        {slots.length === 0 ? (
          <Text style={styles.noSlots}>На этот день нет свободных слотов</Text>
        ) : (
          <View style={styles.slotGrid}>
            {slots.map((s) => {
              const active = sameDaySelected && selectedTime === s.time;
              return (
                <Pressable
                  key={s.time}
                  disabled={s.taken}
                  style={[
                    styles.slot,
                    s.taken && styles.slotTaken,
                    active && styles.slotActive,
                  ]}
                  onPress={() => selectTime(s.time)}
                >
                  <Text
                    style={[
                      styles.slotText,
                      s.taken && styles.slotTextTaken,
                      active && styles.slotTextActive,
                    ]}
                  >
                    {s.time}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          label="Далее"
          disabled={!draft.startISO || !sameDaySelected}
          onPress={() => {
            setDraft({ locationId });
            router.push('/booking/confirm');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  body: {
    paddingBottom: spacing.xxxl,
  },
  blockLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  locRow: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  locCard: {
    width: 200,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locCardActive: {
    borderColor: colors.text,
    backgroundColor: colors.surfaceElevated,
  },
  locTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  locTitleActive: {
    color: colors.text,
  },
  locAddr: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  dayRow: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  dayCard: {
    width: 58,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  dayCardActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  dayWeekday: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  dayNum: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 2,
  },
  dayMonth: {
    color: colors.textMuted,
    fontSize: 11,
  },
  dayActiveText: {
    color: colors.textInverse,
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  slot: {
    width: '22.4%',
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  slotTaken: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
    opacity: 0.35,
  },
  slotActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  slotText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  slotTextTaken: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  slotTextActive: {
    color: colors.textInverse,
  },
  noSlots: {
    color: colors.textSecondary,
    fontSize: 14,
    paddingHorizontal: spacing.xl,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
