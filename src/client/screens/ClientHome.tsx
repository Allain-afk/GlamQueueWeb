import { useState } from 'react';
import { Search, MapPin, Bell, Calendar, Sparkles, Scissors, Palette, User, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import { useClient } from '../context/ClientContext';
import type { Service } from '../types';

interface ClientHomeProps {
  onSelectService: (service: Service) => void;
  onViewAllServices: () => void;
  onViewSchedule: () => void;
  onViewProfile: () => void;
  onLogout: () => void;
}

export function ClientHome({ onSelectService, onViewAllServices, onViewSchedule, onViewProfile, onLogout }: ClientHomeProps) {
  const { session } = useAuth();
  const { services, upcomingBookings, loading } = useClient();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'haircut', name: 'Haircut', icon: Scissors, color: '#e91e8c' },
    { id: 'styling', name: 'Styling', icon: Sparkles, color: '#f06292' },
    { id: 'coloring', name: 'Coloring', icon: Palette, color: '#ff6b9d' },
  ];

  const featuredServices = services.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hi, {session?.user?.email?.split('@')[0] || 'Guest'}!
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-pink-500" />
                <span className="text-sm text-gray-600">Manila, Philippines</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-pink-50 rounded-full transition-colors relative">
                <Bell className="w-6 h-6 text-gray-700" />
                {upcomingBookings.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
                )}
              </button>
              <button
                onClick={onViewProfile}
                className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold hover:from-pink-600 hover:to-pink-700 transition-all cursor-pointer"
              >
                {session?.user?.email?.[0].toUpperCase() || 'G'}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for services, salons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* CTA Buttons Section */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Order Services CTA */}
            <button
              onClick={onViewAllServices}
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-3 group"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Order Services</h3>
              <p className="text-pink-100 text-sm text-center">Browse and book salon services</p>
            </button>

            {/* Profile Management CTA */}
            <button
              onClick={onViewProfile}
              className="bg-white border-2 border-pink-200 hover:border-pink-400 text-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-3 group"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center group-hover:from-pink-600 group-hover:to-pink-700 transition-colors">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">My Profile</h3>
              <p className="text-gray-600 text-sm text-center">Manage your account settings</p>
            </button>

            {/* Logout CTA */}
            <button
              onClick={onLogout}
              className="bg-white border-2 border-red-200 hover:border-red-400 text-red-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-3 group"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold">Logout</h3>
              <p className="text-red-500 text-sm text-center">Sign out of your account</p>
            </button>
          </div>
        </section>

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
              <button
                onClick={onViewSchedule}
                className="text-pink-600 hover:text-pink-700 font-medium text-sm"
              >
                View All
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-4">
              {upcomingBookings.slice(0, 2).map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl mb-3 last:mb-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{booking.service?.name}</h3>
                    <p className="text-sm text-gray-600">{booking.shop?.name}</p>
                    <p className="text-sm text-pink-600 font-medium mt-1">
                      {new Date(booking.date_time).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 hover:shadow-md hover:border-pink-300 transition-all text-center group"
                >
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                    style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)` }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </button>
              );
            })}
          </div>
        </section>

        {/* Promo Banner */}
        <section>
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Special Offer!</h2>
              <p className="text-pink-100 mb-4">Get 20% off on your first booking</p>
              <button className="bg-white text-pink-600 px-6 py-2 rounded-lg font-semibold hover:bg-pink-50 transition-colors">
                Book Now
              </button>
            </div>
            <div className="absolute right-0 top-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute right-10 bottom-0 w-32 h-32 bg-white opacity-10 rounded-full -mb-16"></div>
          </div>
        </section>

        {/* Featured Services */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Popular Services</h2>
            <button
              onClick={onViewAllServices}
              className="text-pink-600 hover:text-pink-700 font-medium text-sm"
            >
              See All
            </button>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden hover:shadow-md hover:border-pink-300 transition-all cursor-pointer group"
                  onClick={() => onSelectService(service)}
                >
                  <div className="h-48 bg-gradient-to-br from-pink-400 to-purple-500 relative overflow-hidden">
                    {service.image_url ? (
                      <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Scissors className="w-20 h-20 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full">
                      <span className="text-pink-600 font-bold">₱{service.price}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{service.duration} min</span>
                      <span className="text-pink-600 font-medium">{service.shop_name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

