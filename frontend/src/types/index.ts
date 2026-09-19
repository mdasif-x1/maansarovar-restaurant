export interface MenuCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: MenuCategory;
  isVegetarian: boolean;
  isChefSpecial: boolean;
  isAvailable: boolean;
  imageUrl?: string;
  imageAltText?: string;
  imageSourceType?: 'OWNER_PHOTO' | 'AI_ILLUSTRATIVE' | 'EXTERNAL_APPROVED' | string;
  displayOrder: number;
}

export interface FeaturedDish {
  id: number;
  menuItem: MenuItem;
  subtitle?: string;
  displayOrder: number;
}

export interface GalleryImage {
  id: number;
  title: string;
  category: 'Food' | 'Ambience' | 'Family Dining' | 'Events' | string;
  imageUrl: string;
  caption?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Reservation {
  id: number;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: number;
  occasion?: string;
  specialRequest?: string;
  status: 'NEW' | 'CONTACTED' | 'CONFIRMED' | 'CLOSED' | string;
  createdAt: string;
}

export interface ReservationRequest {
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: number;
  occasion?: string;
  specialRequest?: string;
}

export interface Testimonial {
  id: number;
  authorName: string;
  location: string;
  rating: number;
  content: string;
  isApproved: boolean;
}

export interface AuthResponse {
  token?: string;
  tokenType?: string;
  username: string;
  email: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
