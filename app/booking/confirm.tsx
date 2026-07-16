import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { StepHeader } from '../../src/components/StepHeader';
import { getBarberById, priceFor } from '../../src/data/barbers';
import { getLocationById } from '../../src/data/locations';
import { getServiceById } from '../../src/data/services';
import { Appointment } from '../../src/data/types';
import { useBooking } from '../../src/store/BookingContext';
import { colors, radius, spacing } from '../../src/theme';
import { formatDateTime, formatPrice } from '../../src/utils/datetime';

export default function ConfirmScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { draft, confirmBooking } = useBooking();
  const [loading, setLoading] = useState(false);

  const service = draft.serviceId ? getServiceById(draft.serviceId) : undefined;
  const barber = draft.barberId ? getBarberById(draft.barberId) : undefined;
  const location = draft.locationId ? getLocationById(draft.locationId) : undefined;

  const price =
    service && barber ? priceFor(service.priceFrom, barber.priceMultiplier) : 0;

  const ready = service && barber && location && draft.startISO;

  const onConfirm = async () => {
    if (!ready || !service || !barber || !location || !draft.startISO) return;
    setLoading(true);
    const appointment: Appointment = {
      // Детерминированный id из полей записи (Date.now недоступен в окружении).
      id: `${draft.serviceId}-${draft.barberId}-${draft.startISO}`,
      serviceId: service.id,
      serviceTitle: service.title,
      barberId: barber.id,
      barberName: barber.name,
      locationId: location.id,
      locationTitle: location.title,
      startISO: draft.startISO,
      price,
      durationMin: service.durationMin,
      status: 'upcoming',
    };
    await confirmBooking(appointment);
    setLoading(false);
    router.replace('/booking/success');
  };

  return (
    <View style={styles.screen}>
      <View style={{ paddingTop: insets.top }}>
        <StepHeader title="Подтверждение" step={4} totalSteps={4} />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Row icon="cut-outline" label="Услуга" value={service?.title ?? '—'} />
          <Divider />
          <Row icon="person-outline" label="Мастер" value={barber?.name ?? '—'} />
          {barber && barber.id !== 'b-any' ? (
            <Text style={styles.sub}>{barber.grade}</Text>
          ) : null}
          <Divider />
          <Row
            icon="location-outline"
            label="Филиал"
            value={location?.title ?? '—'}
          />
          {location ? <Text style={styles.sub}>{location.address}</Text> : null}
          <Divider />
          <Row
            icon="calendar-outline"
            label="Дата и время"
            value={draft.startISO ? formatDateTime(draft.startISO) : '—'}
          />
          <Divider />
          <Row
            icon="time-outline"
            label="Длительность"
            value={service ? `${service.durationMin} мин` : '—'}
          />
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>ИТОГО</Text>
          <Text style={styles.totalValue}>{formatPrice(price)}</Text>
        </View>

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textMuted} />
          <Text style={styles.noteText}>
            Оплата на месте. Отменить запись можно бесплатно не позднее чем за 2 часа.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          label="Подтвердить запись"
          loading={loading}
          disabled={!ready}
          onPress={onConfirm}
        />
      </View>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={colors.textSecondary} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  body: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    width: 90,
  },
  rowValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  sub: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  totalCard: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  totalLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  totalValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  note: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  noteText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
