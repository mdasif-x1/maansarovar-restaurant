import React, { useState } from 'react';
import { ReservationRequest } from '../types';
import { submitReservation } from '../services/reservationService';
import { Calendar, Clock, Users, User, Phone, Mail, Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ReservationFormProps {
  onSuccess?: () => void;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<ReservationRequest>({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: '19:30',
    numberOfGuests: 2,
    occasion: 'Regular Dining',
    specialRequest: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfGuests' ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Basic frontend validation
    if (!formData.guestName.trim()) {
      setErrorMessage('Please enter your full name.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.guestPhone.trim() || formData.guestPhone.length < 8) {
      setErrorMessage('Please enter a valid phone number.');
      setIsSubmitting(false);
      return;
    }

    try {
      await submitReservation(formData);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit reservation request. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-cream-50 rounded border border-forest-800/20 p-8 shadow-subtle text-center max-w-lg mx-auto">
        <div className="w-14 h-14 rounded bg-forest-800 text-saffron-400 mx-auto flex items-center justify-center mb-4 border border-forest-700/60 shadow-subtle">
          <CheckCircle className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-2xl font-medium text-charcoal-900 mb-2">
          Table Reservation Received
        </h3>
        <p className="text-xs sm:text-sm text-charcoal-800/85 mb-5 leading-relaxed font-sans">
          Thank you, <strong className="text-forest-800">{formData.guestName}</strong>. Your reservation request for <strong className="text-forest-800">{formData.numberOfGuests} guests</strong> on <strong className="text-forest-800">{formData.reservationDate} at {formData.reservationTime}</strong> has been logged.
        </p>
        <p className="text-xs text-charcoal-800/70 bg-cream-200/50 p-3.5 rounded border border-cream-300/60 mb-6 font-sans">
          Our manager will call you at <span className="font-semibold text-charcoal-900">{formData.guestPhone}</span> shortly to confirm table availability.
        </p>
        <button
          onClick={() => {
            setIsSuccess(false);
            setFormData({
              guestName: '',
              guestPhone: '',
              guestEmail: '',
              reservationDate: new Date().toISOString().split('T')[0],
              reservationTime: '19:30',
              numberOfGuests: 2,
              occasion: 'Regular Dining',
              specialRequest: '',
            });
          }}
          className="px-6 py-2.5 rounded bg-forest-800 text-cream-50 font-medium text-xs uppercase tracking-widest hover:bg-forest-700 transition-colors shadow-subtle"
        >
          Book Another Table
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-cream-50 rounded border border-cream-300/80 p-6 sm:p-8 shadow-subtle">
      <div className="flex items-center gap-1.5 text-saffron-600 font-sans text-[10px] uppercase font-medium tracking-widest mb-1.5">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Unhurried Family Dining</span>
      </div>

      <h3 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal-900 mb-6">
        Reserve Your Table
      </h3>

      {errorMessage && (
        <div className="mb-5 p-3.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 font-sans">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 mb-4">
        {/* Full Name */}
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-widest text-charcoal-800 mb-1.5 font-sans">
            Full Name *
          </label>
          <div className="relative">
            <User className="w-3.5 h-3.5 text-charcoal-800/40 absolute left-3 top-3" />
            <input
              type="text"
              name="guestName"
              required
              value={formData.guestName}
              onChange={handleChange}
              placeholder="e.g. Rajesh Kumar"
              className="w-full pl-8 pr-3.5 py-2.5 bg-cream-100/90 border border-cream-300/80 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800 transition-colors font-sans"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-widest text-charcoal-800 mb-1.5 font-sans">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 text-charcoal-800/40 absolute left-3 top-3" />
            <input
              type="tel"
              name="guestPhone"
              required
              value={formData.guestPhone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full pl-8 pr-3.5 py-2.5 bg-cream-100/90 border border-cream-300/80 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800 transition-colors font-sans"
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-widest text-charcoal-800 mb-1.5 font-sans">
            Date *
          </label>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-charcoal-800/40 absolute left-3 top-3" />
            <input
              type="date"
              name="reservationDate"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.reservationDate}
              onChange={handleChange}
              className="w-full pl-8 pr-3.5 py-2.5 bg-cream-100/90 border border-cream-300/80 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800 transition-colors font-sans"
            />
          </div>
        </div>

        {/* Preferred Time */}
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-widest text-charcoal-800 mb-1.5 font-sans">
            Preferred Time *
          </label>
          <div className="relative">
            <Clock className="w-3.5 h-3.5 text-charcoal-800/40 absolute left-3 top-3" />
            <select
              name="reservationTime"
              value={formData.reservationTime}
              onChange={handleChange}
              className="w-full pl-8 pr-3.5 py-2.5 bg-cream-100/90 border border-cream-300/80 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800 transition-colors font-sans"
            >
              <option value="11:30">11:30 AM (Lunch)</option>
              <option value="12:30">12:30 PM (Lunch)</option>
              <option value="13:30">01:30 PM (Lunch)</option>
              <option value="14:30">02:30 PM (Afternoon)</option>
              <option value="18:30">06:30 PM (Early Dinner)</option>
              <option value="19:30">07:30 PM (Dinner)</option>
              <option value="20:30">08:30 PM (Dinner)</option>
              <option value="21:30">09:30 PM (Late Dinner)</option>
            </select>
          </div>
        </div>

        {/* Guests Count */}
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-widest text-charcoal-800 mb-1.5 font-sans">
            Number of Guests *
          </label>
          <div className="relative">
            <Users className="w-3.5 h-3.5 text-charcoal-800/40 absolute left-3 top-3" />
            <select
              name="numberOfGuests"
              value={formData.numberOfGuests}
              onChange={handleChange}
              className="w-full pl-8 pr-3.5 py-2.5 bg-cream-100/90 border border-cream-300/80 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800 transition-colors font-sans"
            >
              <option value="1">1 Person</option>
              <option value="2">2 Guests</option>
              <option value="4">4 Guests (Family)</option>
              <option value="6">6 Guests (Large Table)</option>
              <option value="8">8 Guests (Party)</option>
              <option value="12">12+ Guests (Celebration)</option>
            </select>
          </div>
        </div>

        {/* Occasion */}
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-widest text-charcoal-800 mb-1.5 font-sans">
            Occasion
          </label>
          <select
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-cream-100/90 border border-cream-300/80 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800 transition-colors font-sans"
          >
            <option value="Regular Dining">Family Dinner / Casual</option>
            <option value="Birthday Party">Birthday Party</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Business Meeting">Business Lunch / Meeting</option>
            <option value="Reunion">Family Reunion</option>
          </select>
        </div>
      </div>

      {/* Special Request / Message */}
      <div className="mb-5">
        <label className="block text-[10px] font-medium uppercase tracking-widest text-charcoal-800 mb-1.5 font-sans">
          Special Requests / Preferences (Optional)
        </label>
        <textarea
          name="specialRequest"
          rows={3}
          value={formData.specialRequest}
          onChange={handleChange}
          placeholder="High chair for toddler, lake-view window table, less spicy food, etc."
          className="w-full px-3.5 py-2.5 bg-cream-100/90 border border-cream-300/80 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800 transition-colors font-sans"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded bg-forest-800 text-cream-50 font-sans font-medium text-xs uppercase tracking-widest hover:bg-forest-700 transition-colors shadow-subtle flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Submitting Request...</span>
          </>
        ) : (
          <span>Confirm Reservation Request</span>
        )}
      </button>

      <p className="mt-3 text-[10px] text-center text-charcoal-800/60 font-sans">
        * No upfront payment required. We hold tables for up to 15 minutes after reserved time.
      </p>
    </form>
  );
};

