// import { supabase } from '../../lib/supabase'; // Uncomment when database is ready
import type { Service, Shop } from '../types';

// Mock data for development (remove when database is ready)
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Premium Haircut',
    description: 'Professional haircut with styling consultation',
    price: 500,
    duration: 60,
    category: 'haircut',
    shop_id: '1',
    shop_name: 'Glam Studio Manila',
    shop_address: 'Makati City, Metro Manila',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Hair Coloring',
    description: 'Full color treatment with premium products',
    price: 2500,
    duration: 180,
    category: 'coloring',
    shop_id: '1',
    shop_name: 'Glam Studio Manila',
    shop_address: 'Makati City, Metro Manila',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Keratin Treatment',
    description: 'Smoothing keratin treatment for frizz-free hair',
    price: 3500,
    duration: 150,
    category: 'treatment',
    shop_id: '2',
    shop_name: 'Beauty Lounge BGC',
    shop_address: 'Bonifacio Global City, Taguig',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Hair Styling',
    description: 'Event styling for weddings, parties, and special occasions',
    price: 800,
    duration: 90,
    category: 'styling',
    shop_id: '2',
    shop_name: 'Beauty Lounge BGC',
    shop_address: 'Bonifacio Global City, Taguig',
    rating: 4.8,
  },
  {
    id: '5',
    name: 'Manicure & Pedicure',
    description: 'Complete nail care service with gel polish',
    price: 600,
    duration: 75,
    category: 'manicure',
    shop_id: '3',
    shop_name: 'Nail Spa Quezon City',
    shop_address: 'Quezon City, Metro Manila',
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Facial Treatment',
    description: 'Deep cleansing facial with skin analysis',
    price: 1200,
    duration: 90,
    category: 'treatment',
    shop_id: '3',
    shop_name: 'Nail Spa Quezon City',
    shop_address: 'Quezon City, Metro Manila',
    rating: 4.5,
  },
];

const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Glam Studio Manila',
    address: 'Makati City, Metro Manila',
    rating: 4.8,
    review_count: 156,
    description: 'Premium beauty salon with expert stylists',
    is_open: true,
    phone_number: '+63 2 1234 5678',
  },
  {
    id: '2',
    name: 'Beauty Lounge BGC',
    address: 'Bonifacio Global City, Taguig',
    rating: 4.7,
    review_count: 98,
    description: 'Modern salon specializing in hair treatments',
    is_open: true,
    phone_number: '+63 2 8765 4321',
  },
  {
    id: '3',
    name: 'Nail Spa Quezon City',
    address: 'Quezon City, Metro Manila',
    rating: 4.6,
    review_count: 72,
    description: 'Relaxing nail spa with complete beauty services',
    is_open: true,
    phone_number: '+63 2 9876 5432',
  },
];

export async function getServices(): Promise<Service[]> {
  // Return mock data for now
  return Promise.resolve(mockServices);
  
  // Uncomment when database is ready:
  /*
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Service[];
  */
}

export async function getServicesByCategory(category: string): Promise<Service[]> {
  // Return mock data filtered by category
  return Promise.resolve(mockServices.filter(s => s.category === category));
  
  // Uncomment when database is ready:
  /*
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Service[];
  */
}

export async function getServiceById(id: string): Promise<Service | null> {
  // Return mock data
  return Promise.resolve(mockServices.find(s => s.id === id) || null);
  
  // Uncomment when database is ready:
  /*
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Service;
  */
}

export async function getShops(): Promise<Shop[]> {
  // Return mock data
  return Promise.resolve(mockShops);
  
  // Uncomment when database is ready:
  /*
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .order('rating', { ascending: false });

  if (error) throw error;
  return data as Shop[];
  */
}

export async function getShopById(id: string): Promise<Shop | null> {
  // Return mock data
  return Promise.resolve(mockShops.find(s => s.id === id) || null);
  
  // Uncomment when database is ready:
  /*
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Shop;
  */
}

export async function searchServices(query: string): Promise<Service[]> {
  // Return filtered mock data
  const lowerQuery = query.toLowerCase();
  return Promise.resolve(
    mockServices.filter(
      s => s.name.toLowerCase().includes(lowerQuery) ||
           s.description.toLowerCase().includes(lowerQuery) ||
           s.shop_name.toLowerCase().includes(lowerQuery)
    )
  );
  
  // Uncomment when database is ready:
  /*
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Service[];
  */
}

