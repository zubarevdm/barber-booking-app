import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../src/components/Avatar';
import { Button } from '../../src/components/Button';
import { Appointment } from '../../src/data/types';
import { useBooking } from '../../src/store/BookingContext';
import { colors, radius, spacing, typography } from '../../src/theme';
import { formatDateTime, formatPrice } from '../../src/utils/datetime';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { appointments, cancelAppointment, resetDraft } = useBooking();

  const now = Date.now();
  const upcoming = appointments.filter(
    (a) => a.status === 'upcoming' && new Date(a.startISO).getTime() >= now
  );
  const history = appointments.filter(
    (a) => a.status !== 'upcoming' || new Date(a.startISO).getTime() < now
  );

  const visitsDone = history.filter((a) => a.status !== 'cancelled').length;

  const confirmCancel = (a: Appointment) => {
    Alert.alert('Отменить запись?', `${a.serviceTitle} · ${formatDateTime(a.startISO)}`, [
      { text: 'Назад', style: 'cancel' },
      {
        text: 'Отменить запись',
        style: 'destructive',
        onPress: () => cancelAppointment(a.id),
      },
    ]);
  };

  const book = () => {
    resetDraft();
    router.push('/booking/service');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: spacing.xxxl }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.profileRow}>
          <Avatar initials="ВЫ" size={60} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Гость BLADE</Text>
            <Text style={styles.phone}>+7 ··· ··· ·· ··</Text>
          </View>
          <Pressable hitSlop={10} style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={20} color={colors.text} />
          </Pressable>
        </View>

        {/* Лояльность */}
        <View style={styles.loyalty}>
          <View style={styles.loyaltyRow}>
            <Text style={styles.loyaltyLabel}>ДО ПОДАРОЧНОЙ СТРИЖКИ</Text>
            <Text style={styles.loyaltyCount}>{visitsDone % 6} / 6</Text>
          </View>
          <View style={styles.progressTrack}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressSeg,
                  i < visitsDone % 6 && styles.progressSegActive,
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Предстоящие */}
      <View style={styles.section}>
        <Text style={typography.h2}>Предстоящие записи</Text>
        {upcoming.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={28} color={colors.textMuted} />
            <Text style={styles.emptyText}>У вас пока нет записей</Text>
            <Button label="Записаться" onPress={book} style={{ marginTop: spacing.md }} />
          </View>
        ) : (
          <View style={{ gap: spacing.md, marginTop: spacing.md }}>
            {upcoming.map((a) => (
              <AppointmentCard key={a.id} appt={a} onCancel={() => confirmCancel(a)} />
            ))}
          </View>
        )}
      </View>

      {/* История */}
      {history.length > 0 ? (
        <View style={styles.section}>
          <Text style={typography.h2}>История</Text>
          <View style={{ gap: spacing.md, marginTop: spacing.md }}>
            {history.map((a) => (
              <AppointmentCard key={a.id} appt={a} past />
            ))}
          </View>
        </View>
      ) : null}

      {/* Меню */}
      <View style={styles.section}>
        {[
          { icon: 'heart-outline', label: 'Любимые мастера' },
          { icon: 'card-outline', label: 'Способы оплаты' },
          { icon: 'notifications-outline', label: 'Уведомления' },
          { icon: 'help-circle-outline', label: 'Поддержка' },
        ].map((item) => (
          <Pressable key={item.label} style={styles.menuRow}>
            <Ionicons name={item.icon as any} size={20} color={colors.textSecondary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function AppointmentCard({
  appt,
  onCancel,
  past,
}: {
  appt: Appointment;
  onCancel?: () => void;
  past?: boolean;
}) {
  const cancelled = appt.status === 'cancelled';
  return (
    <View style={[styles.apptCard, past && styles.apptCardPast]}>
      <View style={styles.apptHead}>
        <Text style={styles.apptService}>{appt.serviceTitle}</Text>
        <Text style={styles.apptPrice}>{formatPrice(appt.price)}</Text>
      </View>
      <View style={styles.apptMetaRow}>
        <Ionicons name="person-outline" size={14} color={colors.textMuted} />
        <Text style={styles.apptMeta}>{appt.barberName}</Text>
      </View>
      <View style={styles.apptMetaRow}>
        <Ionicons name="location-outline" size={14} color={colors.textMuted} />
        <Text style={styles.apptMeta}>{appt.locationTitle}</Text>
      </View>
      <View style={styles.apptMetaRow}>
        <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
        <Text style={styles.apptMeta}>{formatDateTime(appt.startISO)}</Text>
      </View>

      {cancelled ? (
        <Text style={styles.cancelledTag}>Отменена</Text>
      ) : onCancel ? (
        <Pressable style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>Отменить запись</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  phone: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loyalty: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loyaltyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  loyaltyLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  loyaltyCount: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  progressTrack: {
    flexDirection: 'row',
    gap: 6,
  },
  progressSeg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  progressSegActive: {
    backgroundColor: colors.gold,
  },
  section: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginTop: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.sm,
  },
  apptCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  apptCardPast: {
    opacity: 0.6,
  },
  apptHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  apptService: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  apptPrice: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  apptMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  apptMeta: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  cancelBtn: {
    marginTop: spacing.lg,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  cancelText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cancelledTag: {
    marginTop: spacing.md,
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLabel: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
