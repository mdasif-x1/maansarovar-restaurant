import React, { useState, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { getSettings } from '../services/settingsService';
import { Utensils, Clock } from 'lucide-react';

export const Menu: React.FC = () => {
  const [notice, setNotice] = useState('Our menu will be available soon.');

  useEffect(() => {
    getSettings().then((sData) => {
      if (sData.menu_notice) {
        setNotice(sData.menu_notice);
      }
    });
  }, []);

  return (
    <>
      <SEO
        title="Menu | The Maansarovar Restaurant & Food Court"
        description="The Maansarovar Restaurant & Food Court menu details will be available soon. Operating daily from 9:00 AM to 11:00 PM in Lakhimpur Kheri."
        canonicalPath="/menu"
      />

      {/* Header Banner */}
      <section className="bg-charcoal-900 text-cream-50 pt-14 pb-12 relative overflow-hidden border-b border-charcoal-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-saffron-400 font-sans font-medium">
            The Maansarovar Restaurant & Food Court
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight mt-1.5 text-cream-50">
            Menu Preview
          </h1>
        </div>
      </section>

      {/* Coming Soon Notice Container */}
      <section className="py-20 bg-cream-100 min-h-[55vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-cream-50 rounded border border-cream-300/80 p-8 shadow-subtle relative overflow-hidden">
            
            <div className="w-12 h-12 rounded bg-forest-800 text-saffron-400 mx-auto flex items-center justify-center mb-5 border border-forest-700/60 shadow-subtle">
              <Utensils className="w-6 h-6" />
            </div>

            <h2 className="font-serif text-2xl font-medium text-charcoal-900 mb-2.5">
              Menu Coming Soon
            </h2>

            <p className="text-sm text-charcoal-800/80 font-sans leading-relaxed mb-6">
              {notice}
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-cream-200/70 text-forest-800 text-xs font-medium font-sans border border-cream-300/60">
              <Clock className="w-3.5 h-3.5 text-saffron-600" />
              <span>Visiting Hours: 9:00 AM – 11:00 PM Daily</span>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

