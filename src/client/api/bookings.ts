import { supabase } from '../../lib/supabase';
import type { Booking, BookingStatus } from '../types';

export async function createBooking(booking: {
  service_id: string;
  shop_id: string;
  date_time: string;
  notes?: string;
}): Promise<Booking> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Return mock booking for now
  const mockBooking: Booking = {
    id: 'mock-' + Date.now(),
    user_id: user.id,
    service_id: booking.service_id,
    shop_id: booking.shop_id,
    date_time: booking.date_time,
    status: 'pending',
    notes: booking.notes,
    created_at: new Date().toISOString(),
  };
  
  return Promise.resolve(mockBooking);
  
  // Uncomment when database is ready:
  /*
  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        user_id: user.id,
        service_id: booking.service_id,
        shop_id: booking.shop_id,
        date_time: booking.date_time,
        status: 'pending' as BookingStatus,
        notes: booking.notes,
      },
    ])
    .select('*')
    .single();

  if (error) throw error;
  return data as Booking;
  */
}

export async function getMyBookings(): Promise<Booking[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return []; // Return empty array if not authenticated

  // Return empty array for now (mock data mode)
  return Promise.resolve([]);
  
  // Uncomment when database is ready:
  /*
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      service:services(*),
      shop:shops(*)
    `)
    .eq('user_id', user.id)
    .order('date_time', { ascending: false });

  if (error) throw error;
  return data as Booking[];
  */
}

export async function getUpcomingBookings(): Promise<Booking[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return []; // Return empty array if not authenticated

  // Return empty array for now (mock data mode)
  return Promise.resolve([]);
  
  // Uncomment when database is ready:
  /*
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      service:services(*),
      shop:shops(*)
    `)
    .eq('user_id', user.id)
    .gte('date_time', now)
    .in('status', ['pending', 'confirmed'])
    .order('date_time', { ascending: true });

  if (error) throw error;
  return data as Booking[];
  */
}

export async function cancelBooking(bookingId: string): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);

  if (error) throw error;
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) throw error;
}

