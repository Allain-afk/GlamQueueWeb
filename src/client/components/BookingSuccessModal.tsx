import { CheckCircle, Calendar, X } from 'lucide-react';

interface BookingSuccessModalProps {
  bookingId: string | null;
  onClose: () => void;
  onViewSchedule: () => void;
}

export function BookingSuccessModal({ bookingId, onClose, onViewSchedule }: BookingSuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment has been successfully booked. We've sent a confirmation to your email.
          </p>

          {bookingId && (
            <div className="bg-pink-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
              <p className="font-mono font-semibold text-pink-600">{bookingId.slice(0, 8).toUpperCase()}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={onViewSchedule}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              View My Schedule
            </button>
            <button
              onClick={onClose}
              className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Back to Home
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            You can manage your appointments in the Schedule tab
          </p>
        </div>
      </div>
    </div>
  );
}

