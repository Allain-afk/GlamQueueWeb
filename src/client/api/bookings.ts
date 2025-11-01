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
    .select(`
      *,
      service:services(*),
      shop:shops(*)
    `)
    .single();

  if (error) {
    console.error('Booking creation error:', error);
    throw error;
  }
  return data as Booking;
}

export async function getMyBookings(): Promise<Booking[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return []; // Return empty array if not authenticated

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      service:services(*),
      shop:shops(*)
    `)
    .eq('user_id', user.id)
    .order('date_time', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    // Return empty array if table doesn't exist yet
    if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
      return [];
    }
    throw error;
  }
  return (data || []) as Booking[];
}

export async function getUpcomingBookings(): Promise<Booking[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return []; // Return empty array if not authenticated

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

  if (error) {
    console.error('Error fetching upcoming bookings:', error);
    // Return empty array if table doesn't exist yet
    if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
      return [];
    }
    throw error;
  }
  return (data || []) as Booking[];
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

