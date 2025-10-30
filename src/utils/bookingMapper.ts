// Utility to map salon and service names to IDs for booking creation
import { getServices, getShops } from '../client/api/services';

// Mapping salon names to shop IDs
const salonNameToId: Record<string, string> = {
  'Glam Studio Manila': '1',
  'Beauty Lounge BGC': '2',
  'Nail Spa Quezon City': '3',
};

// Mapping service names to service IDs
const serviceNameToId: Record<string, string> = {
  'Premium Haircut': '1',
  'Hair Coloring': '2',
  'Keratin Treatment': '3',
  'Hair Styling': '4',
  'Manicure & Pedicure': '5',
  'Facial Treatment': '6',
};

export async function mapBookingDataToIds(
  salonName: string,
  serviceName: string
): Promise<{ shopId: string; serviceId: string } | null> {
  try {
    // First try static mappings
    const shopId = salonNameToId[salonName];
    const serviceId = serviceNameToId[serviceName];
    
    if (shopId && serviceId) {
      return { shopId, serviceId };
    }
    
    // Fallback: try to find by name from API
    const [services, shops] = await Promise.all([getServices(), getShops()]);
    
    const shop = shops.find(s => s.name === salonName);
    const service = services.find(s => s.name === serviceName);
    
    if (shop && service) {
      return { shopId: shop.id, serviceId: service.id };
    }
    
    return null;
  } catch (error) {
    console.error('Error mapping booking data:', error);
    return null;
  }
}

export function parseTimeToDateTime(dateStr: string, timeStr: string): string {
  // Convert "9:00 AM" format to ISO datetime
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':');
  let hour24 = parseInt(hours, 10);
  
  if (period === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  
  // Format: YYYY-MM-DDTHH:mm:ss
  const dateTime = `${dateStr}T${hour24.toString().padStart(2, '0')}:${minutes}:00`;
  return dateTime;
}

