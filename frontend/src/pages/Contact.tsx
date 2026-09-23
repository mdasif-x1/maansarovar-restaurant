import React from 'react';
import { ReservationForm } from '../components/ReservationForm';
import { GoogleMap } from '../components/GoogleMap';
import { SEO } from '../components/SEO';
import { useSettings } from '../context/SettingsContext';
import { MapPin, Phone, Mail, Clock, MessageSquare, Compass, ExternalLink } from 'lucide-react';

export const Contact: React.FC = () => {
  const { settings } = useSettings();

  const brandName = settings.restaurant_name || 'The Maansarovar Restaurant & Food Court';
  const phone = settings.phone ? settings.phone.trim() : '';
  const whatsapp = settings.whatsapp ? settings.whatsapp.trim() : '';
  const email = settings.email ? settings.email.trim() : '';
  const address = settings.address || 'Beside Zila Panchayat Amrit Sarovar, Sitapur–Lakhimpur Road, Kheri, Lakhimpur Kheri, Uttar Pradesh 262701, India';
  const hours = settings.opening_hours || '9:00 AM – 11:00 PM daily';
  const mapsLink = settings.google_maps_direct || 'https://www.google.com/maps/place/The+Maansarovar+Restaurant+%26+food+court/@27.8805663,80.7335013,15z';

  const hasQuickActions = Boolean(phone || whatsapp || mapsLink);

  return (
    <>
      <SEO
        title="Contact & Table Booking | The Maansarovar Restaurant & Food Court"
        description="Submit a table booking enquiry or get directions to The Maansarovar Restaurant & Food Court beside Amrit Sarovar, Lakhimpur Kheri."
        canonicalPath="/contact"
      />

      {/* Header Banner */}
      <section className="bg-charcoal-900 text-cream-50 pt-14 pb-12 text-center border-b border-charcoal-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] uppercase tracking-[0.2em] text-saffron-400 font-sans font-medium">
            The Maansarovar Restaurant & Food Court
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight mt-1.5 text-cream-50">
            Contact & Reservations
          </h1>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-14 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Reservation Form */}
            <div className="lg:col-span-7">
              <ReservationForm />
            </div>

            {/* Right Quick Info */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Quick Action Buttons (Only render if at least one link is available) */}
              {hasQuickActions && (
                <div className="bg-cream-50 p-6 rounded border border-cream-300/80 shadow-subtle space-y-3.5">
                  <h3 className="font-serif text-xl font-medium text-charcoal-900">
                    Direct Contact
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {phone && (
                      <a
                        href={`tel:${phone.replace(/\s+/g, '')}`}
                        className="py-2.5 px-3.5 rounded bg-forest-800 text-cream-50 text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-forest-700 transition-colors shadow-subtle"
                      >
                        <Phone className="w-3.5 h-3.5 text-saffron-400" />
                        <span>Call {phone}</span>
                      </a>
                    )}

                    {whatsapp && (
                      <a
                        href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Maansarovar%20Restaurant,%20I%20would%20like%20to%20inquire%20about%20a%20table%20reservation.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3.5 rounded bg-green-800 text-cream-50 text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-subtle"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-green-300" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>

                  {mapsLink && (
                    <a
                      href={mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3.5 rounded bg-saffron-500 text-charcoal-950 text-xs font-medium uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-saffron-400 transition-colors shadow-subtle"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Directions on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Business Location & Hours */}
              <div className="bg-cream-50 p-6 rounded border border-cream-300/80 shadow-subtle space-y-4">
                <h4 className="font-serif text-lg font-medium text-charcoal-900 border-b border-cream-200/80 pb-2.5">
                  Location & Hours
                </h4>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-saffron-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-xs text-charcoal-900 uppercase tracking-wider font-sans">Address</h5>
                    <p className="text-xs text-charcoal-800/80 font-sans mt-0.5 leading-relaxed">{address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-saffron-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-xs text-charcoal-900 uppercase tracking-wider font-sans">Timings</h5>
                    <p className="text-xs text-charcoal-800/80 font-sans mt-0.5">{hours}</p>
                  </div>
                </div>

                {email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-saffron-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-xs text-charcoal-900 uppercase tracking-wider font-sans">Email Inquiry</h5>
                      <a href={`mailto:${email}`} className="text-xs text-forest-800 hover:underline font-sans mt-0.5 block">{email}</a>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Interactive Google Map Embedded */}
          <div className="mt-12">
            <GoogleMap
              mapUrl={settings.map_url}
              directUrl={settings.google_maps_direct}
              address={settings.address}
            />
          </div>

        </div>
      </section>
    </>
  );
};

