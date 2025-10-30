export interface Salon {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  image: string;
  services: string[];
  nextAvailable: string;
}

export interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
  category: string;
  description: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  staffName?: string;
}

export interface Appointment {
  id: string;
  salonName: string;
  service: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  staff: string;
  price: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  totalVisits: number;
  totalSpent: string;
  preferences: string;
}

export interface DashboardStats {
  appointmentsToday: number;
  totalRevenue: string;
  noShowRate: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  image: string;
  salonName: string;
}

export const mockSalons: Salon[] = [
  {
    id: '1',
    name: 'M Beauty Salon',
    rating: 4.8,
    reviewCount: 234,
    distance: '0.8 mi',
    image: 'salon beauty',
    services: ['Hair', 'Nails', 'Barber'],
    nextAvailable: 'Today at 2:00 PM',
  },
  {
    id: '2',
    name: 'Serenity Spa & Wellness',
    rating: 4.9,
    reviewCount: 189,
    distance: '1.2 mi',
    image: 'spa wellness',
    services: ['Massage', 'Facial', 'Body Treatment'],
    nextAvailable: 'Today at 4:30 PM',
  },
  {
    id: '3',
    name: 'The Glam Studio',
    rating: 4.7,
    reviewCount: 156,
    distance: '1.5 mi',
    image: 'beauty studio',
    services: ['Hair', 'Makeup', 'Styling'],
    nextAvailable: 'Tomorrow at 10:00 AM',
  },
  {
    id: '4',
    name: 'Luxe Nails & Spa',
    rating: 4.6,
    reviewCount: 203,
    distance: '2.0 mi',
    image: 'nail spa',
    services: ['Nails', 'Pedicure', 'Waxing'],
    nextAvailable: 'Today at 6:00 PM',
  },
];

export const serviceCategories = [
  { id: 'hair', name: 'Hair', icon: '💇‍♀️' },
  { id: 'nails', name: 'Nails', icon: '💅' },
  { id: 'massage', name: 'Massage', icon: '💆‍♀️' },
  { id: 'barber', name: 'Barber', icon: '✂️' },
  { id: 'facial', name: 'Facial', icon: '✨' },
  { id: 'makeup', name: 'Makeup', icon: '💄' },
];

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Haircut & Style',
    duration: '60 min',
    price: '₱650',
    category: 'hair',
    description: 'Professional cut and styling',
  },
  {
    id: '2',
    name: 'Balayage',
    duration: '180 min',
    price: '₱1,950',
    category: 'hair',
    description: 'Natural-looking highlights',
  },
  {
    id: '3',
    name: 'Classic Manicure',
    duration: '45 min',
    price: '₱350',
    category: 'nails',
    description: 'Polish and hand massage',
  },
  {
    id: '4',
    name: 'Gel Manicure',
    duration: '60 min',
    price: '₱550',
    category: 'nails',
    description: 'Long-lasting gel polish',
  },
  {
    id: '5',
    name: 'Swedish Massage',
    duration: '60 min',
    price: '₱850',
    category: 'massage',
    description: 'Relaxing full body massage',
  },
  {
    id: '6',
    name: 'Deep Tissue Massage',
    duration: '90 min',
    price: '₱1,250',
    category: 'massage',
    description: 'Therapeutic muscle relief',
  },
  {
    id: '7',
    name: 'Hydrating Facial',
    duration: '75 min',
    price: '₱950',
    category: 'facial',
    description: 'Moisturizing and rejuvenating',
  },
  {
    id: '8',
    name: 'Bridal Makeup',
    duration: '90 min',
    price: '₱1,500',
    category: 'makeup',
    description: 'Complete bridal look',
  },
  {
    id: '9',
    name: 'Classic Haircut',
    duration: '30 min',
    price: '₱280',
    category: 'barber',
    description: 'Traditional barber cut',
  },
  {
    id: '10',
    name: 'Hot Towel Shave',
    duration: '45 min',
    price: '₱350',
    category: 'barber',
    description: 'Luxurious straight razor shave',
  },
  {
    id: '11',
    name: 'Beard Trim & Style',
    duration: '25 min',
    price: '₱220',
    category: 'barber',
    description: 'Shape and style your beard',
  },
];

export const mockTimeSlots: TimeSlot[] = [
  { time: '9:00 AM', available: false },
  { time: '9:30 AM', available: true, staffName: 'Sarah' },
  { time: '10:00 AM', available: true, staffName: 'Emma' },
  { time: '10:30 AM', available: true, staffName: 'Sarah' },
  { time: '11:00 AM', available: false },
  { time: '11:30 AM', available: true, staffName: 'Emma' },
  { time: '12:00 PM', available: true, staffName: 'Sarah' },
  { time: '12:30 PM', available: false },
  { time: '1:00 PM', available: true, staffName: 'Emma' },
  { time: '1:30 PM', available: true, staffName: 'Sarah' },
  { time: '2:00 PM', available: true, staffName: 'Emma' },
  { time: '2:30 PM', available: true, staffName: 'Sarah' },
  { time: '3:00 PM', available: false },
  { time: '3:30 PM', available: true, staffName: 'Emma' },
  { time: '4:00 PM', available: true, staffName: 'Sarah' },
  { time: '4:30 PM', available: true, staffName: 'Emma' },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    salonName: 'M Beauty Salon',
    service: 'Haircut & Style',
    date: '2025-10-15',
    time: '2:00 PM',
    status: 'upcoming',
    staff: 'Sarah Johnson',
    price: '₱650',
  },
  {
    id: '2',
    salonName: 'Serenity Spa & Wellness',
    service: 'Swedish Massage',
    date: '2025-10-18',
    time: '4:30 PM',
    status: 'upcoming',
    staff: 'Emma Davis',
    price: '₱850',
  },
  {
    id: '3',
    salonName: 'The Glam Studio',
    service: 'Balayage',
    date: '2025-10-08',
    time: '10:00 AM',
    status: 'completed',
    staff: 'Lisa Chen',
    price: '₱1,950',
  },
  {
    id: '4',
    salonName: 'Luxe Nails & Spa',
    service: 'Gel Manicure',
    date: '2025-09-30',
    time: '3:00 PM',
    status: 'completed',
    staff: 'Maria Garcia',
    price: '₱550',
  },
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Wella Johnson',
    email: 'wella.j@email.com',
    phone: '(555) 123-4567',
    lastVisit: '2025-10-10',
    totalVisits: 12,
    totalSpent: '₱12,400',
    preferences: 'Prefers Sarah, loves balayage',
  },
  {
    id: '2',
    name: 'Roan Martinez',
    email: 'roan.m@email.com',
    phone: '(555) 234-5678',
    lastVisit: '2025-10-08',
    totalVisits: 8,
    totalSpent: '₱6,800',
    preferences: 'Allergic to certain dyes',
  },
  {
    id: '3',
    name: 'Sophie Chen',
    email: 'sophie.c@email.com',
    phone: '(555) 345-6789',
    lastVisit: '2025-10-12',
    totalVisits: 15,
    totalSpent: '₱18,900',
    preferences: 'Weekly manicures, gel preferred',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    phone: '(555) 456-7890',
    lastVisit: '2025-10-11',
    totalVisits: 6,
    totalSpent: '₱5,200',
    preferences: 'Massage therapy focus',
  },
  {
    id: '5',
    name: 'Jessica Brown',
    email: 'jessica.b@email.com',
    phone: '(555) 567-8901',
    lastVisit: '2025-10-09',
    totalVisits: 20,
    totalSpent: '₱24,500',
    preferences: 'VIP client, monthly facials',
  },
];

export const mockDashboardStats: DashboardStats = {
  appointmentsToday: 12,
  totalRevenue: '₱32,450',
  noShowRate: '2.5%',
};

export const monthlyBookingsData = [
  { month: 'Apr', bookings: 145 },
  { month: 'May', bookings: 168 },
  { month: 'Jun', bookings: 182 },
  { month: 'Jul', bookings: 195 },
  { month: 'Aug', bookings: 210 },
  { month: 'Sep', bookings: 198 },
  { month: 'Oct', bookings: 225 },
];

export const topServicesData = [
  { service: 'Haircut & Style', count: 145 },
  { service: 'Gel Manicure', count: 132 },
  { service: 'Swedish Massage', count: 98 },
  { service: 'Balayage', count: 76 },
  { service: 'Hydrating Facial', count: 68 },
];

export const specialOffers: SpecialOffer[] = [
  {
    id: '1',
    title: '20% Off First Visit',
    description: 'New clients get 20% off any service',
    discount: '20%',
    validUntil: '2025-10-31',
    image: 'salon discount offer',
    salonName: 'M Beauty Salon',
  },
  {
    id: '2',
    title: 'Spa Day Special',
    description: 'Book 2 services, get 1 free massage',
    discount: 'Buy 2 Get 1',
    validUntil: '2025-10-25',
    image: 'spa special promotion',
    salonName: 'Serenity Spa & Wellness',
  },
  {
    id: '3',
    title: 'Weekend Blowout',
    description: 'Saturday & Sunday styling at half price',
    discount: '50%',
    validUntil: '2025-10-20',
    image: 'beauty salon interior',
    salonName: 'The Glam Studio',
  },
];

export const currentUser = {
  name: 'Wella',
  location: 'San Francisco, CA',
  avatar: 'W',
};
