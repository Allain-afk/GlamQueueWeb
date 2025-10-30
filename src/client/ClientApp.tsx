import { useState, useEffect } from 'react';
import { ClientProvider } from './context/ClientContext';
import { ClientHome } from './screens/ClientHome';
import { ServicesExplore } from './screens/ServicesExplore';
import { BookingScreen } from './screens/BookingScreen';
import { MySchedule } from './screens/MySchedule';
import { Profile } from './screens/Profile';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { useAuth } from '../auth/AuthContext';
import { getPendingBooking, clearPendingBooking } from '../utils/bookingStorage';
import { mapBookingDataToIds, parseTimeToDateTime } from '../utils/bookingMapper';
import { createBooking } from './api/bookings';
import type { Service } from './types';

type ClientView = 'home' | 'explore' | 'booking' | 'schedule' | 'profile';

interface ClientAppProps {
  onBackToLanding: () => void;
  onLogout: () => void;
  onRequireLogin: () => void;
}

export function ClientApp({ onLogout, onRequireLogin }: ClientAppProps) {
  const { session } = useAuth();
  const [currentView, setCurrentView] = useState<ClientView>('home');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!session) {
      onRequireLogin();
    }
  }, [session, onRequireLogin]);

  // Process pending booking after authentication
  useEffect(() => {
    const processPendingBooking = async () => {
      if (!session) return;
      
      const pendingBooking = getPendingBooking();
      if (!pendingBooking) return;
      
      try {
        // Map salon and service names to IDs
        const ids = await mapBookingDataToIds(pendingBooking.salon, pendingBooking.service);
        if (!ids) {
          console.error('Could not map salon/service names to IDs');
          clearPendingBooking();
          return;
        }
        
        // Parse date and time to ISO datetime
        const dateTime = parseTimeToDateTime(pendingBooking.date, pendingBooking.time);
        
        // Create the booking
        const notes = pendingBooking.isAdvanceBooking 
          ? `Advance booking from landing page. Name: ${pendingBooking.name}, Phone: ${pendingBooking.phone}`
          : `Booking from landing page. Name: ${pendingBooking.name}, Phone: ${pendingBooking.phone}`;
        
        const booking = await createBooking({
          service_id: ids.serviceId,
          shop_id: ids.shopId,
          date_time: dateTime,
          notes: notes,
        });
        
        console.log('Pending booking created successfully:', booking);
        
        // Show success modal and clear pending booking
        setBookingId(booking.id);
        setShowSuccessModal(true);
        clearPendingBooking();
      } catch (error) {
        console.error('Error processing pending booking:', error);
        clearPendingBooking();
      }
    };
    
    processPendingBooking();
  }, [session]);

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setCurrentView('booking');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedService(null);
  };

  const handleBookingComplete = (id: string) => {
    setBookingId(id);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setBookingId(null);
    setCurrentView('schedule');
  };

  const renderView = () => {
    switch (currentView) {
      case 'explore':
        return (
          <ServicesExplore
            onSelectService={handleSelectService}
            onBack={handleBackToHome}
          />
        );
      case 'booking':
        return selectedService ? (
          <BookingScreen
            service={selectedService}
            onBack={() => setCurrentView('explore')}
            onBookingComplete={handleBookingComplete}
          />
        ) : (
          <ClientHome
            onSelectService={handleSelectService}
            onViewAllServices={() => setCurrentView('explore')}
            onViewSchedule={() => setCurrentView('schedule')}
            onViewProfile={() => setCurrentView('profile')}
            onLogout={onLogout}
          />
        );
      case 'schedule':
        return <MySchedule onBack={handleBackToHome} />;
      case 'profile':
        return <Profile onBack={handleBackToHome} onLogout={onLogout} />;
      default:
        return (
          <ClientHome
            onSelectService={handleSelectService}
            onViewAllServices={() => setCurrentView('explore')}
            onViewSchedule={() => setCurrentView('schedule')}
            onViewProfile={() => setCurrentView('profile')}
            onLogout={onLogout}
          />
        );
    }
  };

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  return (
    <ClientProvider>
      <div className="min-h-screen">
        {renderView()}
        {showSuccessModal && (
          <BookingSuccessModal
            bookingId={bookingId}
            onClose={handleCloseSuccessModal}
            onViewSchedule={() => {
              setShowSuccessModal(false);
              setCurrentView('schedule');
            }}
          />
        )}
      </div>
    </ClientProvider>
  );
}

