import React from 'react';
import { Hero } from '../components/Hero';
import { ReservationForm } from '../components/ReservationForm';
import { GoogleMap } from '../components/GoogleMap';
import { SEO } from '../components/SEO';
import { useSettings } from '../context/SettingsContext';
import { MapPin, Clock, ShieldCheck } from 'lucide-react';

export const Home: React.FC = () => {
  const { settings } = useSettings();

  const titleText = settings.restaurant_name || 'The Maansarovar Restaurant & Food Court';
  const storyText = settings.about_story || 'Located beside Zila Panchayat Amrit Sarovar on Sitapur–Lakhimpur Road, Lakhimpur Kheri. Serving delicious food court options and dining.';

  return (
    <>
      <SEO
        title={`${titleText} | Lakhimpur Kheri`}
        description={`${titleText} located beside Zila Panchayat Amrit Sarovar, Sitapur–Lakhimpur Road, Lakhimpur Kheri. Open ${settings.opening_hours || '9:00 AM – 11:00 PM daily'}.`}
      />

      {/* Hero */}
      <Hero settings={settings} tagline={settings.tagline} mapsUrl={settings.google_maps_direct} />

      {/* Verified Location & Hours Banner */}
      <section className="py-14 bg-cream-100 border-b border-cream-300/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3.5">
            
            <div className="inline-flex items-center gap-1.5 text-saffron-600 font-sans text-[10px] uppercase font-medium tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Information</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-charcoal-900 leading-tight">
              {titleText}
            </h2>

            <p className="text-sm sm:text-base text-charcoal-800/80 font-sans leading-relaxed">
              {storyText}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="bg-cream-50 p-5 rounded border border-cream-300/80 shadow-subtle text-left flex items-start gap-3.5">
                <div className="p-2.5 rounded bg-forest-800 text-saffron-400 shrink-0 border border-forest-700/60 shadow-subtle">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-charcoal-900">Address</h4>
                  <p className="text-xs text-charcoal-800/80 font-sans mt-0.5 leading-normal">
                    {settings.address || "Beside Zila Panchayat Amrit Sarovar, Sitapur–Lakhimpur Road, Kheri, Lakhimpur Kheri, Uttar Pradesh 262701, India"}
                  </p>
                </div>
              </div>

              <div className="bg-cream-50 p-5 rounded border border-cream-300/80 shadow-subtle text-left flex items-start gap-3.5">
                <div className="p-2.5 rounded bg-forest-800 text-saffron-400 shrink-0 border border-forest-700/60 shadow-subtle">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-charcoal-900">Opening Hours</h4>
                  <p className="text-xs text-charcoal-800/80 font-sans mt-0.5 leading-normal">
                    {settings.opening_hours || "9:00 AM – 11:00 PM daily"}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Reservation & Location Map */}
      <section className="py-16 bg-cream-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Reservation Form */}
            <div className="lg:col-span-7">
              <ReservationForm />
            </div>

            {/* Right Map */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-5">
              <GoogleMap
                mapUrl={settings.map_url}
                directUrl={settings.google_maps_direct}
                address={settings.address}
              />
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

