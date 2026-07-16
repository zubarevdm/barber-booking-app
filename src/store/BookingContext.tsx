import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appointment } from '../data/types';

const STORAGE_KEY = 'BLADE.appointments.v1';
const SELECTED_CITY_KEY = 'BLADE.city.v1';

/** Черновик записи, который собирается по ходу флоу бронирования. */
export interface BookingDraft {
  serviceId?: string;
  barberId?: string;
  locationId?: string;
  dayKey?: string;
  startISO?: string;
  price?: number;
  durationMin?: number;
}

interface BookingState {
  appointments: Appointment[];
  draft: BookingDraft;
  selectedCity: string | null;
  hydrated: boolean;
  setDraft: (patch: Partial<BookingDraft>) => void;
  resetDraft: () => void;
  confirmBooking: (appointment: Appointment) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  setSelectedCity: (city: string) => void;
}

const BookingCtx = createContext<BookingState | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [draft, setDraftState] = useState<BookingDraft>({});
  const [selectedCity, setSelectedCityState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Загрузка из хранилища при старте.
  useEffect(() => {
    (async () => {
      try {
        const [rawAppts, rawCity] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(SELECTED_CITY_KEY),
        ]);
        if (rawAppts) setAppointments(JSON.parse(rawAppts));
        if (rawCity) setSelectedCityState(rawCity);
      } catch (e) {
        console.warn('Не удалось загрузить записи', e);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const persist = async (next: Appointment[]) => {
    setAppointments(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Не удалось сохранить записи', e);
    }
  };

  const value = useMemo<BookingState>(
    () => ({
      appointments,
      draft,
      selectedCity,
      hydrated,
      setDraft: (patch) => setDraftState((prev) => ({ ...prev, ...patch })),
      resetDraft: () => setDraftState({}),
      confirmBooking: async (appointment) => {
        await persist([appointment, ...appointments]);
        setDraftState({});
      },
      cancelAppointment: async (id) => {
        await persist(
          appointments.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
        );
      },
      setSelectedCity: (city) => {
        setSelectedCityState(city);
        AsyncStorage.setItem(SELECTED_CITY_KEY, city).catch(() => {});
      },
    }),
    [appointments, draft, selectedCity, hydrated]
  );

  return <BookingCtx.Provider value={value}>{children}</BookingCtx.Provider>;
}

export function useBooking(): BookingState {
  const ctx = useContext(BookingCtx);
  if (!ctx) throw new Error('useBooking должен использоваться внутри BookingProvider');
  return ctx;
}
