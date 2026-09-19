import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface GoogleMapProps {
  mapUrl?: string;
  directUrl?: string;
  address?: string;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  mapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3521.8485293215887!2d80.75036707616147!3d27.88056637608298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399f33a6d34555b7%3A0x99939f92dff58296!2sThe%20Maansarovar%20Restaurant%20%26%20food%20court!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  directUrl = 'https://www.google.com/maps/place/The+Maansarovar+Restaurant+%26+food+court/@27.8805663,80.7335013,15z/data=!4m10!1m2!2m1!1sRestaurants!3m6!1s0x399f33a6d34555b7:0x99939f92dff58296!8m2!3d27.8805663!4d80.7525557!15sCgtSZXN0YXVyYW50c1oNIgtyZXN0YXVyYW50c5IBCnJlc3RhdXJhbnTgAQA!16s%2Fg%2F11vm5__jmb',
  address = 'Beside Zila Panchayat Amrit Sarovar, Sitapur–Lakhimpur Road, Kheri, Lakhimpur Kheri, Uttar Pradesh 262701',
}) => {
  return (
    <div className="bg-cream-50 rounded-2xl overflow-hidden border border-cream-300 shadow-md">
      <div className="p-6 bg-forest-800 text-cream-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-saffron-400 shrink-0 mt-1" />
          <div>
            <h4 className="font-serif text-xl font-bold">Our Location</h4>
            <p className="text-xs text-cream-200 font-sans mt-0.5">{address}</p>
          </div>
        </div>

        <a
          href={directUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron-500 text-charcoal-950 text-xs font-semibold uppercase tracking-wider hover:bg-saffron-400 transition-all shrink-0"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Open in Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="relative w-full h-80 sm:h-96 bg-cream-200">
        <iframe
          title="The Maansarovar Restaurant Google Maps Location"
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full filter grayscale-[15%] contrast-[105%]"
        />
      </div>
    </div>
  );
};
