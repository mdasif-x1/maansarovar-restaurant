import { MenuCategory, MenuItem, FeaturedDish } from '../types';
import { fetchApi } from './api';

export const SAMPLE_CATEGORIES: MenuCategory[] = [
  { id: 1, name: 'Starters & Tandoor', slug: 'starters', description: 'Crispy appetizers, kebabs, and charred tandoori delicacies.', displayOrder: 1, isActive: true },
  { id: 2, name: 'North Indian Mains', slug: 'main-course', description: 'Rich gravy curries, paneer specials, and slow-cooked dals.', displayOrder: 2, isActive: true },
  { id: 3, name: 'Breads & Rice', slug: 'breads-rice', description: 'Fresh tandoori rotis, naan, and dum biryani.', displayOrder: 3, isActive: true },
  { id: 4, name: 'Chinese & Food Court', slug: 'chinese', description: 'Indo-Chinese street favorites, noodles, and sizzlers.', displayOrder: 4, isActive: true },
  { id: 5, name: 'Snacks & Quick Bites', slug: 'snacks', description: 'Chaat, rolls, and family evening high-tea platters.', displayOrder: 5, isActive: true },
  { id: 6, name: 'Beverages & Mocktails', slug: 'beverages', description: 'Kulhad chai, cold coffee, and fruity sunset coolers.', displayOrder: 6, isActive: true },
  { id: 7, name: 'Desserts & Sweets', slug: 'desserts', description: 'Traditional Indian mithai and warm gulab jamun.', displayOrder: 7, isActive: true },
];

export const SAMPLE_MENU_ITEMS: MenuItem[] = [
  { id: 1, name: 'Paneer Tikka Angara', description: 'Succulent cottage cheese cubes marinated in smoked hung curd, spiced with red chili & charred in tandoor.', price: 280, category: SAMPLE_CATEGORIES[0], isVegetarian: true, isChefSpecial: true, isAvailable: true, imageUrl: '/images/food-01.jpg', displayOrder: 1 },
  { id: 2, name: 'Crispy Vegetable Salt & Pepper', description: 'Crispy seasonal farm vegetables tossed with crushed black pepper, garlic, and scallions.', price: 220, category: SAMPLE_CATEGORIES[0], isVegetarian: true, isChefSpecial: false, isAvailable: true, imageUrl: '/images/food-02.jpg', displayOrder: 2 },
  { id: 3, name: 'Dahi Ke Sholay', description: 'Golden crispy bread pockets stuffed with spiced hung curd, bell peppers, and fresh coriander.', price: 240, category: SAMPLE_CATEGORIES[0], isVegetarian: true, isChefSpecial: true, isAvailable: true, imageUrl: '/images/food-03.jpg', displayOrder: 3 },
  { id: 4, name: 'Dal Maansarovar Special', description: 'Slow-cooked black lentils overnight on charcoal hearth, enriched with fresh cream & white butter.', price: 290, category: SAMPLE_CATEGORIES[1], isVegetarian: true, isChefSpecial: true, isAvailable: true, imageUrl: '/images/food-04.jpg', displayOrder: 1 },
  { id: 5, name: 'Paneer Butter Masala', description: 'Fresh cottage cheese simmered in a velvety tomato, cashew, and rich butter gravy.', price: 320, category: SAMPLE_CATEGORIES[1], isVegetarian: true, isChefSpecial: false, isAvailable: true, imageUrl: '/images/food-05.jpg', displayOrder: 2 },
  { id: 6, name: 'Subz Handi Biryani', description: 'Long-grain basmati rice layered with garden vegetables, saffron milk, and aromatic whole spices.', price: 260, category: SAMPLE_CATEGORIES[2], isVegetarian: true, isChefSpecial: false, isAvailable: true, imageUrl: '/images/food-06.jpg', displayOrder: 1 },
  { id: 7, name: 'Butter Garlic Naan', description: 'Leavened flatbread topped with minced garlic and brushed generously with farm butter.', price: 65, category: SAMPLE_CATEGORIES[2], isVegetarian: true, isChefSpecial: false, isAvailable: true, imageUrl: '/images/food-01.jpg', displayOrder: 2 },
  { id: 8, name: 'Chilli Paneer Dry', description: 'Cottage cheese cubes tossed in spicy soy-garlic sauce with crisp capsicum and onions.', price: 250, category: SAMPLE_CATEGORIES[3], isVegetarian: true, isChefSpecial: false, isAvailable: true, imageUrl: '/images/food-02.jpg', displayOrder: 1 },
  { id: 9, name: 'Hakka Veg Noodles', description: 'Wok-tossed thin noodles with crunchy julienned vegetables and light soy seasoning.', price: 210, category: SAMPLE_CATEGORIES[3], isVegetarian: true, isChefSpecial: false, isAvailable: true, imageUrl: '/images/food-03.jpg', displayOrder: 2 },
  { id: 10, name: 'Kheri Sunset Cooler', description: 'Signature mocktail crafted with fresh watermelon, mint, lemon juice, and spiced soda.', price: 140, category: SAMPLE_CATEGORIES[5], isVegetarian: true, isChefSpecial: true, isAvailable: true, imageUrl: '/images/food-04.jpg', displayOrder: 1 },
  { id: 11, name: 'Kulhad Masala Chai', description: 'Traditional Indian tea brewed with ginger, cardamom, and buffalo milk in clay cups.', price: 50, category: SAMPLE_CATEGORIES[5], isVegetarian: true, isChefSpecial: false, isAvailable: true, imageUrl: '/images/food-05.jpg', displayOrder: 2 },
  { id: 12, name: 'Shahi Saffron Gulab Jamun', description: 'Warm cottage cheese dumplings infused with cardamoms, soaked in saffron syrup.', price: 120, category: SAMPLE_CATEGORIES[6], isVegetarian: true, isChefSpecial: true, isAvailable: true, imageUrl: '/images/food-06.jpg', displayOrder: 1 },
];

export async function getCategories(): Promise<MenuCategory[]> {
  try {
    return await fetchApi<MenuCategory[]>('/api/v1/public/categories');
  } catch (err) {
    return SAMPLE_CATEGORIES;
  }
}

export async function getMenuItems(categoryId?: number): Promise<MenuItem[]> {
  try {
    const url = categoryId ? `/api/v1/public/menu?categoryId=${categoryId}` : '/api/v1/public/menu';
    return await fetchApi<MenuItem[]>(url);
  } catch (err) {
    if (categoryId) {
      return SAMPLE_MENU_ITEMS.filter(item => item.category.id === categoryId);
    }
    return SAMPLE_MENU_ITEMS;
  }
}

export async function getFeaturedDishes(): Promise<FeaturedDish[]> {
  try {
    return await fetchApi<FeaturedDish[]>('/api/v1/public/featured-dishes');
  } catch (err) {
    return [
      { id: 1, menuItem: SAMPLE_MENU_ITEMS[3], subtitle: 'Our signature slow-cooked charcoal hearth black dal.', displayOrder: 1 },
      { id: 2, menuItem: SAMPLE_MENU_ITEMS[0], subtitle: 'Smoked tandoori cottage cheese cubes with authentic spices.', displayOrder: 2 },
      { id: 3, menuItem: SAMPLE_MENU_ITEMS[2], subtitle: 'Creamy hung curd crisp pockets — a crowd favorite starter.', displayOrder: 3 },
      { id: 4, menuItem: SAMPLE_MENU_ITEMS[9], subtitle: 'Handcrafted refreshing mocktail served chilled.', displayOrder: 4 }
    ];
  }
}

// Admin APIs
export async function getAllCategoriesAdmin(): Promise<MenuCategory[]> {
  try {
    return await fetchApi<MenuCategory[]>('/api/v1/admin/menu/categories');
  } catch (err) {
    return getCategories();
  }
}

export async function createCategoryAdmin(category: Partial<MenuCategory>): Promise<MenuCategory> {
  return await fetchApi<MenuCategory>('/api/v1/admin/menu/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  });
}

export async function updateCategoryAdmin(id: number, category: Partial<MenuCategory>): Promise<MenuCategory> {
  return await fetchApi<MenuCategory>(`/api/v1/admin/menu/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  });
}

export async function deleteCategoryAdmin(id: number): Promise<void> {
  await fetchApi<void>(`/api/v1/admin/menu/categories/${id}`, {
    method: 'DELETE',
  });
}

export async function createMenuItemAdmin(item: Partial<MenuItem> & { categoryId: number }): Promise<MenuItem> {
  return await fetchApi<MenuItem>('/api/v1/admin/menu/items', {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export async function updateMenuItemAdmin(id: number, item: Partial<MenuItem> & { categoryId: number }): Promise<MenuItem> {
  return await fetchApi<MenuItem>(`/api/v1/admin/menu/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  });
}

export async function deleteMenuItemAdmin(id: number): Promise<void> {
  await fetchApi<void>(`/api/v1/admin/menu/items/${id}`, {
    method: 'DELETE',
  });
}
