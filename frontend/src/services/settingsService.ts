import { fetchApi } from './api';

export interface RestaurantSettingsMap {
  restaurant_name: string;
  business_category: string;
  location_badge: string;
  tagline: string;
  hero_headline_line1: string;
  hero_headline_line2: string;
  about_heading: string;
  about_story: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  opening_hours: string;
  map_url: string;
  google_maps_direct: string;
  menu_notice: string;
  announcement_text: string;
  announcement_enabled: string;
  social_facebook: string;
  social_instagram: string;
  social_tripadvisor: string;
  [key: string]: string;
}

export const DEFAULT_SETTINGS: RestaurantSettingsMap = {
  restaurant_name: 'The Maansarovar Restaurant & Food Court',
  business_category: 'Restaurant & Food Court',
  location_badge: 'Lakhimpur Kheri • Beside Amrit Sarovar',
  tagline: '',
  hero_headline_line1: 'The Maansarovar',
  hero_headline_line2: 'Restaurant & Food Court',
  about_heading: 'About Our Establishment',
  about_story: 'The Maansarovar Restaurant & Food Court is a dining establishment and food court located right beside Zila Panchayat Amrit Sarovar on Sitapur–Lakhimpur Road, Lakhimpur Kheri, Uttar Pradesh.',
  address: 'Beside Zila Panchayat Amrit Sarovar, Sitapur–Lakhimpur Road, Kheri, Lakhimpur Kheri, Uttar Pradesh 262701, India',
  phone: '',
  whatsapp: '',
  email: '',
  opening_hours: '9:00 AM – 11:00 PM',
  map_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3521.8485293215887!2d80.75036707616147!3d27.88056637608298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399f33a6d34555b7%3A0x99939f92dff58296!2sThe%20Maansarovar%20Restaurant%20%26%20food%20court!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  google_maps_direct: 'https://www.google.com/maps/place/The+Maansarovar+Restaurant+%26+food+court/@27.8805663,80.7335013,15z/data=!4m10!1m2!2m1!1sRestaurants!3m6!1s0x399f33a6d34555b7:0x99939f92dff58296!8m2!3d27.8805663!4d80.7525557!15sCgtSZXN0YXVyYW50c1oNIgtyZXN0YXVyYW50c5IBCnJlc3RhdXJhbnTgAQA!16s%2Fg%2F11vm5__jmb',
  menu_notice: 'Our menu will be available soon.',
  announcement_text: 'Open daily · 9:00 AM – 11:00 PM · Beside Zila Panchayat Amrit Sarovar',
  announcement_enabled: 'true',
  social_facebook: '',
  social_instagram: '',
  social_tripadvisor: '',
};

export async function getSettings(): Promise<RestaurantSettingsMap> {
  try {
    const data = await fetchApi<RestaurantSettingsMap>('/api/v1/public/settings');
    return { ...DEFAULT_SETTINGS, ...data };
  } catch (err) {
    console.warn('Backend unavailable, using default settings fallback:', err);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettingsAdmin(settings: Record<string, string>): Promise<RestaurantSettingsMap> {
  return await fetchApi<RestaurantSettingsMap>('/api/v1/admin/settings', {
    method: 'PUT',
    body: JSON.stringify({ settings }),
  });
}
