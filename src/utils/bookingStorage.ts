// Utility to store pending booking data temporarily
// This data is used after user signs up/logs in to complete the booking

export interface PendingBookingData {
  name: string;
  phone: string;
  email: string;
  salon: string;
  service: string;
  date: string; // Selected date
  time: string; // Selected time
  isAdvanceBooking?: boolean; // Flag for advance booking
}

const STORAGE_KEY = 'glamqueue_pending_booking';

export function savePendingBooking(data: PendingBookingData): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save pending booking:', error);
  }
}

export function getPendingBooking(): PendingBookingData | null {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get pending booking:', error);
    return null;
  }
}

export function clearPendingBooking(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear pending booking:', error);
  }
}

