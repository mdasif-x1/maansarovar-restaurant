import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, UtensilsCrossed } from 'lucide-react';

interface NavbarProps {
  phone?: string;
  settings?: Record<string, string>;
}

export const Navbar: React.FC<NavbarProps> = ({ phone = '', settings }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const activePhone = (phone || settings?.phone || '').trim();
  const restName = settings?.restaurant_name || 'The Maansarovar Restaurant & Food Court';
  const restCategory = settings?.business_category || 'Restaurant & Food Court';

  const isHomePage = location.pathname === '/';
  const isDarkHeader = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact & Book', path: '/contact' },
  ];

  const headerClasses = isDarkHeader
    ? 'bg-charcoal-950/70 backdrop-blur-md text-cream-50 border-b border-white/10'
    : 'bg-cream-50/95 backdrop-blur-md text-charcoal-900 border-b border-cream-300/60 shadow-subtle';

  const brandTitleClass = isDarkHeader ? 'text-cream-50' : 'text-charcoal-900';
  const brandSubClass = isDarkHeader ? 'text-saffron-400/90' : 'text-forest-800/90 font-medium';
  const toggleBtnClass = isDarkHeader ? 'text-cream-50 hover:text-saffron-400' : 'text-charcoal-900 hover:text-forest-800';

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-200 ${headerClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3.5 group">
          {settings?.logo_image_url ? (
            <img src={settings.logo_image_url} alt={restName} className="w-9 h-9 rounded object-cover border border-saffron-500/40" />
          ) : (
            <div className="w-9 h-9 rounded bg-forest-800 text-saffron-400 flex items-center justify-center border border-forest-700/50 group-hover:bg-saffron-500 group-hover:text-charcoal-950 transition-colors">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          )}
          <div className="flex flex-col">
            <span className={`font-serif text-lg sm:text-xl font-semibold tracking-normal leading-tight transition-colors ${brandTitleClass}`}>
              {restName}
            </span>
            <span className={`text-[10px] tracking-[0.18em] uppercase font-sans mt-0.5 transition-colors ${brandSubClass}`}>
              {restCategory}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 font-sans text-[11px] uppercase tracking-[0.14em] font-medium">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            
            let linkColorClass = '';
            if (isActive) {
              linkColorClass = isDarkHeader ? 'text-saffron-400 font-semibold' : 'text-saffron-600 font-semibold';
            } else {
              linkColorClass = isDarkHeader
                ? 'text-cream-100/90 hover:text-saffron-300'
                : 'text-charcoal-800 hover:text-forest-800';
            }

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors relative py-1.5 ${linkColorClass}`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-saffron-500/90"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {activePhone !== '' && (
            <a
              href={`tel:${activePhone.replace(/\s+/g, '')}`}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-[11px] font-medium uppercase tracking-wider transition-colors border ${
                isDarkHeader 
                  ? 'border-cream-50/20 text-cream-50 hover:bg-cream-50/10' 
                  : 'border-forest-800/30 text-forest-800 hover:bg-forest-800 hover:text-cream-50'
              }`}
            >
              <Phone className="w-3 h-3 text-saffron-500" />
              <span>Call Us</span>
            </a>
          )}

          <Link
            to="/contact"
            className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded text-[11px] font-medium uppercase tracking-widest bg-forest-800 text-cream-50 hover:bg-forest-700 transition-colors border border-forest-700/50 shadow-subtle"
          >
            Reserve Table
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded focus:outline-none transition-colors ${toggleBtnClass}`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream-50 border-b border-cream-300/80 px-5 pt-3 pb-6 space-y-2.5 shadow-card text-charcoal-900">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 px-3 rounded text-xs uppercase tracking-wider font-medium transition-colors ${
                  isActive
                    ? 'bg-forest-800 text-cream-50'
                    : 'text-charcoal-900 hover:bg-cream-200/60'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-cream-300/60 flex flex-col gap-2">
            {activePhone !== '' && (
              <a
                href={`tel:${activePhone.replace(/\s+/g, '')}`}
                className="w-full text-center py-2.5 rounded text-xs font-medium uppercase tracking-wider bg-cream-200 text-charcoal-900 flex items-center justify-center gap-2 border border-cream-300/60"
              >
                <Phone className="w-3.5 h-3.5 text-saffron-600" />
                <span>Call Restaurant ({activePhone})</span>
              </a>
            )}
            <Link
              to="/contact"
              className="w-full text-center py-2.5 rounded text-xs font-medium uppercase tracking-widest bg-forest-800 text-cream-50"
            >
              Reserve a Table
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

