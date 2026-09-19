import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ExternalLink, UtensilsCrossed, Shield } from 'lucide-react';

interface FooterProps {
  settings?: Record<string, string>;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const phone = settings?.phone ? settings.phone.trim() : '';
  const email = settings?.email ? settings.email.trim() : '';
  const address = settings?.address || 'Beside Zila Panchayat Amrit Sarovar, Sitapur–Lakhimpur Road, Kheri, Lakhimpur Kheri, Uttar Pradesh 262701, India';
  const hours = settings?.opening_hours || '9:00 AM – 11:00 PM daily';
  const mapsLink = settings?.google_maps_direct || 'https://www.google.com/maps/place/The+Maansarovar+Restaurant+%26+food+court/@27.8805663,80.7335013,15z';

  return (
    <footer className="bg-charcoal-950 text-cream-200 pt-14 pb-8 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              {settings?.logo_image_url ? (
                <img src={settings.logo_image_url} alt="Brand Logo" className="w-9 h-9 rounded object-cover border border-saffron-500/40" />
              ) : (
                <div className="w-9 h-9 rounded bg-forest-800 text-saffron-400 flex items-center justify-center border border-forest-700/60">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
              )}
              <div>
                <h3 className="font-serif text-xl font-medium text-cream-50 leading-snug">
                  The Maansarovar
                </h3>
                <p className="text-[10px] uppercase tracking-[0.18em] text-saffron-400 font-medium">
                  Restaurant & Food Court
                </p>
              </div>
            </div>
            <p className="text-xs text-cream-400/90 leading-relaxed font-sans">
              Located beside Zila Panchayat Amrit Sarovar on Sitapur–Lakhimpur Road, Lakhimpur Kheri. Open 9:00 AM – 11:00 PM daily.
            </p>
            <div className="pt-1">
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-medium text-saffron-400 hover:text-saffron-300 transition-colors"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif text-base font-medium text-cream-50 mb-3 border-b border-charcoal-800 pb-2">
              Explore
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link to="/" className="text-cream-300/90 hover:text-saffron-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/menu" className="text-cream-300/90 hover:text-saffron-400 transition-colors">Menu</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-cream-300/90 hover:text-saffron-400 transition-colors">Photo Gallery</Link>
              </li>
              <li>
                <Link to="/about" className="text-cream-300/90 hover:text-saffron-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-cream-300/90 hover:text-saffron-400 transition-colors">Contact & Book</Link>
              </li>
            </ul>
          </div>

          {/* Timings */}
          <div>
            <h4 className="font-serif text-base font-medium text-cream-50 mb-3 border-b border-charcoal-800 pb-2">
              Operating Hours
            </h4>
            <div className="space-y-2.5 text-xs font-sans">
              <div className="flex items-start gap-2.5">
                <Clock className="w-3.5 h-3.5 text-saffron-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-cream-100">Daily Timing</p>
                  <p className="text-cream-400/90">{hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-base font-medium text-cream-50 mb-3 border-b border-charcoal-800 pb-2">
              Location
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-cream-300/90">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-saffron-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              {phone !== '' && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-saffron-400 shrink-0" />
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-saffron-400 transition-colors">
                    {phone}
                  </a>
                </li>
              )}
              {email !== '' && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-saffron-400 shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-saffron-400 transition-colors">
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-charcoal-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-cream-400/80 font-sans">
          <p>© {new Date().getFullYear()} The Maansarovar Restaurant & Food Court. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/admin/login" className="flex items-center gap-1.5 text-cream-400/80 hover:text-saffron-400 transition-colors">
              <Shield className="w-3 h-3" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

