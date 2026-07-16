import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

/** Логотип-словомарка BLADE с фирменной разрядкой. */
export function Wordmark({ size = 26 }: { size?: number }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.text, { fontSize: size }]}>BLADE</Text>
      <View style={[styles.dot, { width: size * 0.18, height: size * 0.18 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: colors.text,
    fontWeight: '800',
    letterSpacing: 4,
  },
  dot: {
    backgroundColor: colors.gold,
    borderRadius: 2,
    marginLeft: 4,
    alignSelf: 'flex-end',
    marginBottom: 6,
  },
});
