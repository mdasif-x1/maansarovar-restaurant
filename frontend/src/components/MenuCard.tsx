import React from 'react';
import { MenuItem } from '../types';
import { Sparkles, Utensils } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const hasImage = Boolean(item.imageUrl && item.imageUrl.trim() !== '');

  return (
    <div className="group relative bg-cream-50 rounded border border-cream-300/70 shadow-subtle hover:border-cream-400 transition-colors flex flex-col justify-between overflow-hidden">
      
      {/* Image / Neutral Placeholder Display */}
      <div className="relative aspect-[16/10] bg-cream-100 overflow-hidden border-b border-cream-200/80">
        {hasImage ? (
          <img
            src={item.imageUrl}
            alt={item.imageAltText || item.name}
            className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-charcoal-800/40 p-4">
            <div className="p-2.5 rounded bg-cream-200/60 mb-1">
              <Utensils className="w-5 h-5 text-forest-800/60" />
            </div>
            <span className="text-[10px] font-sans font-medium tracking-widest uppercase text-charcoal-800/50">
              The Maansarovar
            </span>
          </div>
        )}

        {/* Chef Special Badge */}
        {item.isChefSpecial && (
          <div className="absolute top-2.5 right-2.5 bg-forest-800 text-cream-50 text-[9px] font-medium tracking-widest uppercase px-2 py-0.5 rounded shadow-subtle flex items-center gap-1 border border-forest-700">
            <Sparkles className="w-2.5 h-2.5 text-saffron-400" />
            <span>Chef’s Choice</span>
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-3 mb-1">
            <h3 className="font-serif text-lg font-semibold text-charcoal-900 group-hover:text-forest-800 transition-colors">
              {item.name}
            </h3>
            <span className="font-serif text-lg font-semibold text-forest-800 shrink-0">
              ₹{item.price.toFixed(0)}
            </span>
          </div>

          {item.description && (
            <p className="text-xs text-charcoal-800/75 leading-normal line-clamp-2 mt-1 font-sans">
              {item.description}
            </p>
          )}
        </div>

        {/* Category Footer Tag */}
        <div className="mt-3 pt-2.5 border-t border-cream-200/70 flex items-center justify-between text-[10px] font-sans text-charcoal-800/60 uppercase tracking-widest">
          <span>{item.category?.name || 'Specialty'}</span>
          {item.isAvailable ? (
            <span className="text-forest-700 font-medium">Available</span>
          ) : (
            <span className="text-terracotta-600 font-medium">Unavailable</span>
          )}
        </div>
      </div>

    </div>
  );
};

