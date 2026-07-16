import { Stack } from 'expo-router';
import React from 'react';
import { colors } from '../../src/theme';

export default function BookingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="service" />
      <Stack.Screen name="barber" />
      <Stack.Screen name="time" />
      <Stack.Screen name="confirm" />
      <Stack.Screen
        name="success"
        options={{ animation: 'fade', gestureEnabled: false }}
      />
    </Stack>
  );
}
