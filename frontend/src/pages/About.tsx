import React from 'react';
import { SEO } from '../components/SEO';
import { MapPin, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export const About: React.FC = () => {
  const { settings } = useSettings();

  const brandName = settings.restaurant_name || 'The Maansarovar Restaurant & Food Court';
  const headingText = settings.about_heading || 'About Our Establishment';
  const storyText = settings.about_story || 'The Maansarovar Restaurant & Food Court is a dining establishment and food court located right beside Zila Panchayat Amrit Sarovar on Sitapur–Lakhimpur Road, Lakhimpur Kheri, Uttar Pradesh.';
  const addressText = settings.address || 'Beside Zila Panchayat Amrit Sarovar, Sitapur–Lakhimpur Road, Kheri, Lakhimpur Kheri, Uttar Pradesh 262701, India';
  const hoursText = settings.opening_hours || '9:00 AM – 11:00 PM Daily';

  return (
    <>
      <SEO
        title={`About Us | ${brandName}`}
        description={`${brandName} is located beside Zila Panchayat Amrit Sarovar, Sitapur–Lakhimpur Road, Lakhimpur Kheri.`}
      />

      {/* Header Banner */}
      <section className="bg-charcoal-900 text-cream-50 pt-14 pb-12 text-center border-b border-charcoal-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] uppercase tracking-[0.2em] text-saffron-400 font-sans font-medium">
            {brandName}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight mt-1.5 text-cream-50">
            {headingText}
          </h1>
        </div>
      </section>

      {/* Verified Information */}
      <section className="py-16 bg-cream-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="bg-cream-50 p-7 sm:p-9 rounded border border-cream-300/80 shadow-subtle space-y-6">
            <div className="flex items-center gap-2 text-saffron-600 font-sans text-[10px] uppercase font-medium tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Location & Establishment</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-forest-800">
              {brandName}
            </h2>

            <p className="text-sm sm:text-base text-charcoal-800/85 font-sans leading-relaxed">
              {storyText}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-cream-200/80">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded bg-forest-800 text-saffron-400 shrink-0 border border-forest-700/60 shadow-subtle">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-charcoal-900">Location</h4>
                  <p className="text-xs text-charcoal-800/80 font-sans mt-0.5 leading-normal">
                    {addressText}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded bg-forest-800 text-saffron-400 shrink-0 border border-forest-700/60 shadow-subtle">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-charcoal-900">Operating Hours</h4>
                  <p className="text-xs text-charcoal-800/80 font-sans mt-0.5 leading-normal">
                    {hoursText}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 text-center border-t border-cream-200/80">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-forest-800 text-cream-50 font-sans font-medium text-xs uppercase tracking-widest hover:bg-forest-700 transition-colors shadow-subtle"
              >
                Send Enquiry / Reservation
              </Link>
            </div>

          </div>

        </div>
      </section>
    </>
  );
};

