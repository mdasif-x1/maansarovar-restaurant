import { GalleryImage } from '../types';
import { fetchApi } from './api';

export const SAMPLE_GALLERY: GalleryImage[] = [
  { id: 1, title: 'Serene Lakeside Evening', category: 'Ambience', imageUrl: '/images/lakeside-ambience.jpg', caption: 'Beautiful dusk view near Amrit Sarovar lake backdrop.', displayOrder: 1, isActive: true },
  { id: 2, title: 'Warm Interior Dining Hall', category: 'Ambience', imageUrl: '/images/dining-area.jpg', caption: 'Spacious, air-conditioned seating designed for family comfort.', displayOrder: 2, isActive: true },
  { id: 3, title: 'Paneer Tikka Sizzler', category: 'Food', imageUrl: '/images/food-01.jpg', caption: 'Freshly charred paneer tikka served piping hot.', displayOrder: 3, isActive: true },
  { id: 4, title: 'Signature Dal Maansarovar', category: 'Food', imageUrl: '/images/food-04.jpg', caption: 'Rich black dal simmered to perfection with farm butter.', displayOrder: 4, isActive: true },
  { id: 5, title: 'Food Court Courtyard', category: 'Family Dining', imageUrl: '/images/hero-restaurant.jpg', caption: 'Vibrant food court section offering multiple culinary delights.', displayOrder: 5, isActive: true },
  { id: 6, title: 'Crispy Snacks & Drinks', category: 'Food', imageUrl: '/images/food-03.jpg', caption: 'Handcrafted starters perfect for evening gatherings.', displayOrder: 6, isActive: true },
  { id: 7, title: 'Private Celebration Area', category: 'Events', imageUrl: '/images/gallery-01.jpg', caption: 'Welcoming space for birthday parties and family reunions.', displayOrder: 7, isActive: true },
  { id: 8, title: 'Outdoor Evening Lights', category: 'Ambience', imageUrl: '/images/gallery-02.jpg', caption: 'Warm evening illumination creating a cozy dining environment.', displayOrder: 8, isActive: true },
];

export async function getGallery(category?: string): Promise<GalleryImage[]> {
  try {
    const url = category && category !== 'All' ? `/api/v1/public/gallery?category=${encodeURIComponent(category)}` : '/api/v1/public/gallery';
    return await fetchApi<GalleryImage[]>(url);
  } catch (err) {
    if (category && category !== 'All') {
      return SAMPLE_GALLERY.filter(img => img.category.toLowerCase() === category.toLowerCase());
    }
    return SAMPLE_GALLERY;
  }
}

export async function createGalleryImageAdmin(img: Partial<GalleryImage>): Promise<GalleryImage> {
  return await fetchApi<GalleryImage>('/api/v1/admin/gallery', {
    method: 'POST',
    body: JSON.stringify(img),
  });
}

export async function deleteGalleryImageAdmin(id: number): Promise<void> {
  await fetchApi<void>(`/api/v1/admin/gallery/${id}`, {
    method: 'DELETE',
  });
}
