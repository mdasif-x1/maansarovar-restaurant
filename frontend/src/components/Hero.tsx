import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Utensils, MapPin } from 'lucide-react';

interface HeroProps {
  tagline?: string;
  mapsUrl?: string;
  settings?: Record<string, string>;
}

export const Hero: React.FC<HeroProps> = ({
  tagline = '',
  mapsUrl = '',
  settings,
}) => {
  const activeTagline = tagline || settings?.tagline || '';
  const activeMapsUrl = mapsUrl || settings?.google_maps_direct || 'https://www.google.com/maps/place/The+Maansarovar+Restaurant+%26+food+court/@27.8805663,80.7335013,15z';
  const badgeText = settings?.location_badge || 'Lakhimpur Kheri • Beside Amrit Sarovar';
  const headline1 = settings?.hero_headline_line1 || 'The Maansarovar';
  const headline2 = settings?.hero_headline_line2 || 'Restaurant & Food Court';
  const categoryText = settings?.business_category || 'Restaurant / Food Court';
  const hoursText = settings?.opening_hours || '9:00 AM – 11:00 PM Daily';

  const heroImage = settings?.hero_image_url || '/images/illustrative-food/illustrative-food-01.jpg';

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-charcoal-950">
      {/* Background Image with restrained dark overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Restaurant dining environment"
          className="w-full h-full object-cover object-center opacity-25"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/75 to-charcoal-950/50" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-cream-50 pt-16 pb-14">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-saffron-500/30 bg-forest-900/60 text-saffron-400 text-[10px] font-medium uppercase tracking-[0.18em] mb-6">
          <MapPin className="w-3 h-3" />
          <span>{badgeText}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-cream-50 max-w-3xl mx-auto leading-[1.15] mb-5">
          {headline1}
          <span className="block text-xl sm:text-3xl lg:text-4xl font-light text-saffron-400 italic mt-1.5">
            {headline2}
          </span>
        </h1>

        {activeTagline.trim() !== '' && (
          <p className="font-serif italic text-lg sm:text-xl text-cream-200/90 max-w-xl mx-auto mb-8 font-normal leading-relaxed">
            “{activeTagline}”
          </p>
        )}

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-6">
          <Link
            to="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded bg-saffron-500 text-charcoal-950 font-sans font-medium text-xs uppercase tracking-widest hover:bg-saffron-400 transition-colors shadow-subtle"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Explore Menu</span>
          </Link>

          <a
            href={activeMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded bg-forest-800/80 text-cream-50 font-sans font-medium text-xs uppercase tracking-widest border border-cream-50/15 hover:bg-forest-800 transition-colors shadow-subtle"
          >
            <Compass className="w-3.5 h-3.5 text-saffron-400" />
            <span>Get Directions</span>
          </a>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center sm:text-left border-t border-cream-50/10 pt-6 max-w-xl mx-auto">
          <div>
            <p className="text-[10px] uppercase text-saffron-400 font-sans font-medium tracking-widest">Category</p>
            <p className="text-sm font-serif text-cream-200 mt-0.5">{categoryText}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-saffron-400 font-sans font-medium tracking-widest">Operating Hours</p>
            <p className="text-sm font-serif text-cream-200 mt-0.5">{hoursText}</p>
          </div>
        </div>

      </div>
    </section>
  );
};

