import React, { useState, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { getSettings } from '../services/settingsService';
import { getCategories, getMenuItems } from '../services/menuService';
import { MenuCategory, MenuItem } from '../types';
import { Utensils, Clock, Info, Loader2, Award } from 'lucide-react';

export const Menu: React.FC = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | 'ALL'>('ALL');
  const [notice, setNotice] = useState('Our menu will be available soon.');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadMenuData() {
      try {
        const [cats, items, settings] = await Promise.all([
          getCategories(),
          getMenuItems(),
          getSettings(),
        ]);

        if (isMounted) {
          setCategories(cats || []);
          setMenuItems(items || []);
          if (settings?.menu_notice) {
            setNotice(settings.menu_notice);
          }
        }
      } catch (err) {
        console.error('Error fetching menu data:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMenuData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = selectedCategory === 'ALL'
    ? menuItems
    : menuItems.filter((item) => item.category?.id === selectedCategory);

  const hasMenuItems = menuItems.length > 0;

  return (
    <>
      <SEO
        title="Menu | The Maansarovar Restaurant & Food Court"
        description="Explore the menu at The Maansarovar Restaurant & Food Court in Lakhimpur Kheri. Operating daily from 9:00 AM to 11:00 PM."
        canonicalPath="/menu"
      />

      {/* Header Banner */}
      <section className="bg-charcoal-900 text-cream-50 pt-14 pb-12 relative overflow-hidden border-b border-charcoal-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-saffron-400 font-sans font-medium">
            The Maansarovar Restaurant & Food Court
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight mt-1.5 text-cream-50">
            Our Menu
          </h1>
        </div>
      </section>

      {/* Loading State */}
      {isLoading ? (
        <section className="py-20 bg-cream-100 min-h-[55vh] flex items-center justify-center">
          <div className="flex items-center gap-3 text-xs font-semibold text-charcoal-800 font-sans">
            <Loader2 className="w-5 h-5 animate-spin text-saffron-600" />
            <span>Loading menu...</span>
          </div>
        </section>
      ) : !hasMenuItems ? (
        /* Empty / Coming Soon Notice Container */
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
      ) : (
        /* Dynamic Menu Content */
        <section className="py-12 bg-cream-100 min-h-[60vh]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Category Navigation Tabs */}
            {categories.length > 0 && (
              <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-4 py-2 rounded text-xs font-medium uppercase tracking-wider transition-colors font-sans ${
                    selectedCategory === 'ALL'
                      ? 'bg-forest-800 text-cream-50 shadow-subtle'
                      : 'bg-cream-50 text-charcoal-800 hover:bg-cream-200/80 border border-cream-300/80'
                  }`}
                >
                  All Items ({menuItems.length})
                </button>
                {categories.map((cat) => {
                  const count = menuItems.filter((i) => i.category?.id === cat.id).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded text-xs font-medium uppercase tracking-wider transition-colors font-sans ${
                        selectedCategory === cat.id
                          ? 'bg-forest-800 text-cream-50 shadow-subtle'
                          : 'bg-cream-50 text-charcoal-800 hover:bg-cream-200/80 border border-cream-300/80'
                      }`}
                    >
                      {cat.name} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            {/* Menu Items Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-cream-50 rounded border border-cream-300/80 p-5 shadow-subtle flex flex-col sm:flex-row gap-4 justify-between"
                  >
                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            {/* Vegetarian Dot Indicator */}
                            <span
                              className={`w-3.5 h-3.5 rounded-full border border-cream-300 flex items-center justify-center shrink-0 ${
                                item.isVegetarian !== false ? 'border-green-600' : 'border-red-600'
                              }`}
                              title={item.isVegetarian !== false ? 'Pure Vegetarian' : 'Non-Vegetarian'}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.isVegetarian !== false ? 'bg-green-600' : 'bg-red-600'
                                }`}
                              />
                            </span>
                            <h3 className="font-serif text-lg font-medium text-charcoal-900 leading-snug">
                              {item.name}
                            </h3>
                          </div>

                          <span className="font-sans font-bold text-base text-forest-800 shrink-0">
                            ₹{item.price}
                          </span>
                        </div>

                        {item.description && (
                          <p className="text-xs text-charcoal-800/80 font-sans leading-relaxed mb-3">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap pt-2">
                        {item.category?.name && (
                          <span className="text-[10px] uppercase tracking-wider text-saffron-600 font-bold font-sans">
                            {item.category.name}
                          </span>
                        )}

                        {item.isChefSpecial && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-saffron-500/10 text-saffron-700 text-[10px] font-medium font-sans border border-saffron-500/30">
                            <Award className="w-3 h-3 text-saffron-600" />
                            <span>Chef's Special</span>
                          </span>
                        )}

                        {item.imageSourceType === 'AI_ILLUSTRATIVE' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cream-200 text-charcoal-800/70 text-[9px] font-sans border border-cream-300">
                            <Info className="w-2.5 h-2.5 text-saffron-600" />
                            <span>Illustrative Photo</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Optional Dish Image */}
                    {item.imageUrl && (
                      <div className="w-full sm:w-28 h-28 shrink-0 rounded overflow-hidden bg-charcoal-900 border border-cream-300/80">
                        <img
                          src={item.imageUrl}
                          alt={item.imageAltText || item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-cream-50 rounded border border-cream-300/80 p-6">
                <p className="text-xs text-charcoal-800/70 font-sans">
                  No items found in this category.
                </p>
              </div>
            )}

          </div>
        </section>
      )}
    </>
  );
};
