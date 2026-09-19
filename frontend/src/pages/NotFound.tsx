import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Compass, UtensilsCrossed, Home as HomeIcon } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <>
      <SEO title="Page Not Found | The Maansarovar Restaurant" />

      <div className="min-h-[75vh] bg-cream-100 flex items-center justify-center py-20 px-4">
        <div className="max-w-lg w-full bg-cream-50 rounded-3xl p-10 border border-cream-300 shadow-xl text-center">
          
          <div className="w-16 h-16 rounded-full bg-forest-800 text-saffron-400 mx-auto flex items-center justify-center mb-6">
            <Compass className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase tracking-widest text-saffron-600 font-sans font-bold">
            Error 404
          </span>

          <h1 className="font-serif text-4xl font-bold text-charcoal-900 mt-2 mb-3">
            Lost Your Culinary Way?
          </h1>

          <p className="text-sm text-charcoal-800/80 font-sans mb-8 leading-relaxed max-w-md mx-auto">
            The page or recipe you were searching for seems to have wandered off. Let us guide you back to our main dining hall or menu.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-forest-800 text-cream-50 font-sans text-xs font-semibold uppercase tracking-wider hover:bg-forest-700 shadow-md transition-all"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              to="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-saffron-500 text-charcoal-950 font-sans text-xs font-bold uppercase tracking-wider hover:bg-saffron-400 shadow-md transition-all"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>View Menu</span>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};
