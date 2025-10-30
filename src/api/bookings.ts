import { supabase } from '../lib/supabase';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: number;
  client_id: string;
  service_id: number;
  salon_id: number;
  start_at: string;
  end_at?: string;
  status: BookingStatus;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // Joined data
  service?: {
    name: string;
    price: number;
    duration: number;
  };
  salon?: {
    name: string;
    address: string;
  };
  client?: {
    email: string;
  };
}

// Admin functions
export async function listBookingsSmart(): Promise<Booking[]> {
  try {
    // First, try to get basic bookings without joins to check if table exists
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      // If bookings table doesn't exist or is empty, return empty array instead of throwing
      if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
        console.warn('Bookings table not found or empty, returning empty array');
        return [];
      }
      throw error;
    }
    
    return (data || []) as Booking[];
  } catch (err) {
    console.error('Error in listBookingsSmart:', err);
    // Return empty array instead of crashing the dashboard
    return [];
  }
}

export async function adminUpdateBookingStatus(
  bookingId: number,
  status: BookingStatus
): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', bookingId);

  if (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}
