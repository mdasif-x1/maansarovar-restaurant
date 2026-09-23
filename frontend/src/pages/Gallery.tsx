import React from 'react';
import { SEO } from '../components/SEO';
import { Camera, Sparkles, Info } from 'lucide-react';

export const Gallery: React.FC = () => {
  const illustrativeImages = [
    { id: 1, src: '/images/illustrative-food/illustrative-food-01.jpg', alt: 'Illustrative Indian food photography - starter arrangement' },
    { id: 2, src: '/images/illustrative-food/illustrative-food-02.jpg', alt: 'Illustrative Indian food photography - gravy dish with naan' },
    { id: 3, src: '/images/illustrative-food/illustrative-food-03.jpg', alt: 'Illustrative food photography - vegetable noodles' },
    { id: 4, src: '/images/illustrative-food/illustrative-food-04.jpg', alt: 'Illustrative Indian food photography - traditional sweet desserts' },
    { id: 5, src: '/images/illustrative-food/illustrative-food-05.jpg', alt: 'Illustrative beverage photography - refreshing mint mocktail' },
    { id: 6, src: '/images/illustrative-food/illustrative-food-06.jpg', alt: 'Illustrative Indian food photography - shared family table spread' },
  ];

  return (
    <>
      <SEO
        title="Gallery | The Maansarovar Restaurant & Food Court"
        description="Official photos of The Maansarovar Restaurant & Food Court premises and food court in Lakhimpur Kheri."
        canonicalPath="/gallery"
      />

      {/* Header Banner */}
      <section className="bg-charcoal-900 text-cream-50 pt-14 pb-12 text-center border-b border-charcoal-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] uppercase tracking-[0.2em] text-saffron-400 font-sans font-medium">
            The Maansarovar Restaurant & Food Court
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight mt-1.5 text-cream-50">
            Photo Gallery
          </h1>
        </div>
      </section>

      {/* Official Photos Status */}
      <section className="py-14 bg-cream-100 border-b border-cream-300/80">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-cream-50 rounded border border-cream-300/80 p-7 shadow-subtle">
            <div className="w-12 h-12 rounded bg-forest-800 text-saffron-400 mx-auto flex items-center justify-center mb-3.5 border border-forest-700/60 shadow-subtle">
              <Camera className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl font-medium text-charcoal-900 mb-1.5">
              Official Restaurant Photos Coming Soon
            </h2>
            <p className="text-xs text-charcoal-800/80 font-sans leading-relaxed">
              We are currently preparing high-quality official photographs of our premises and food court.
            </p>
          </div>
        </div>
      </section>

      {/* Food Inspiration Editorial Grid */}
      <section className="py-14 bg-cream-200/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-saffron-600 font-sans font-medium inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Visual Exploration
              </span>
              <h3 className="font-serif text-2xl font-medium text-charcoal-900 mt-1">
                Food Inspiration
              </h3>
            </div>

            {/* Disclosure Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-cream-100 border border-cream-300/70 text-charcoal-800/70 text-xs font-sans">
              <Info className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
              <span>Illustrative food imagery — official menu photos coming soon.</span>
            </div>
          </div>

          {/* Grid of 6 Illustrative Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {illustrativeImages.map((img) => (
              <div
                key={img.id}
                className="group relative rounded overflow-hidden bg-charcoal-900 border border-cream-300/80 shadow-subtle aspect-[4/3]"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

