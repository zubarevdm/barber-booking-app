import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface StepHeaderProps {
  title: string;
  /** Текущий и общий номер шага, напр. «1 / 4». */
  step?: number;
  totalSteps?: number;
  onBack?: () => void;
}

export function StepHeader({ title, step, totalSteps, onBack }: StepHeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pressable
          hitSlop={12}
          onPress={onBack ?? (() => router.back())}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        {step && totalSteps ? (
          <Text style={styles.step}>
            ШАГ {step} / {totalSteps}
          </Text>
        ) : (
          <View />
        )}
        <View style={styles.spacer} />
      </View>
      <Text style={[typography.h1, styles.title]}>{title}</Text>
      {step && totalSteps ? (
        <View style={styles.track}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              style={[styles.segment, i < step && styles.segmentActive]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  spacer: { width: 40 },
  step: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  title: {
    marginBottom: spacing.lg,
  },
  track: {
    flexDirection: 'row',
    gap: 6,
  },
  segment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  segmentActive: {
    backgroundColor: colors.text,
  },
});
