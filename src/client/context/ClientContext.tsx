import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Service, Shop, Booking } from '../types';
import { getServices, getShops } from '../api/services';
import { getMyBookings, getUpcomingBookings } from '../api/bookings';
import { useAuth } from '../../auth/AuthContext';

interface ClientContextType {
  services: Service[];
  shops: Shop[];
  bookings: Booking[];
  upcomingBookings: Booking[];
  loading: boolean;
  error: string | null;
  refreshServices: () => Promise<void>;
  refreshBookings: () => Promise<void>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const refreshServices = async () => {
    try {
      setError(null);
      const [servicesData, shopsData] = await Promise.all([
        getServices(),
        getShops(),
      ]);
      setServices(servicesData);
      setShops(shopsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services');
      console.error('Error loading services:', err);
    }
  };

  const refreshBookings = async () => {
    if (!session) return;

    try {
      setError(null);
      const [allBookings, upcoming] = await Promise.all([
        getMyBookings(),
        getUpcomingBookings(),
      ]);
      setBookings(allBookings);
      setUpcomingBookings(upcoming);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
      console.error('Error loading bookings:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await refreshServices();
      if (session) {
        await refreshBookings();
      }
      setLoading(false);
    };

    loadData();
  }, [session]);

  return (
    <ClientContext.Provider
      value={{
        services,
        shops,
        bookings,
        upcomingBookings,
        loading,
        error,
        refreshServices,
        refreshBookings,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within ClientProvider');
  }
  return context;
}

