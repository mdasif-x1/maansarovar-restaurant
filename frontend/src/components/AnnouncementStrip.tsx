import React from 'react';
import { Clock, MapPin } from 'lucide-react';

interface AnnouncementStripProps {
  text?: string;
  enabled?: boolean;
}

export const AnnouncementStrip: React.FC<AnnouncementStripProps> = ({
  text = 'Open daily · 9:00 AM – 11:00 PM · Beside Zila Panchayat Amrit Sarovar',
  enabled = true,
}) => {
  if (!enabled || !text.trim()) return null;

  return (
    <div className="bg-forest-800 text-cream-100 text-xs sm:text-sm py-2 px-4 font-sans tracking-wide">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-saffron-400 shrink-0" />
          <span>{text}</span>
        </div>
        <div className="flex items-center gap-2 text-cream-300">
          <MapPin className="w-3.5 h-3.5 text-saffron-400 shrink-0" />
          <span>Beside Zila Panchayat Amrit Sarovar, Sitapur–Lakhimpur Road, Kheri</span>
        </div>
      </div>
    </div>
  );
};
