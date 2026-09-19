import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { SEO } from '../components/SEO';
import { Reservation, MenuItem, MenuCategory, GalleryImage } from '../types';
import { getReservationsAdmin, updateReservationStatusAdmin, deleteReservationAdmin } from '../services/reservationService';
import {
  getMenuItems, getCategories, getAllCategoriesAdmin,
  createMenuItemAdmin, updateMenuItemAdmin, deleteMenuItemAdmin,
  createCategoryAdmin, updateCategoryAdmin, deleteCategoryAdmin
} from '../services/menuService';
import { getGallery, createGalleryImageAdmin, deleteGalleryImageAdmin } from '../services/galleryService';
import { getSettings, updateSettingsAdmin } from '../services/settingsService';

import {
  Shield, Utensils, Image as ImageIcon, Settings, CalendarCheck, LogOut,
  Plus, Trash2, Edit2, CheckCircle, Clock, AlertCircle, RefreshCw, X, FolderPlus, Tag, FileText
} from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { checkImageReferencesAdmin, deleteImageAdmin } from '../services/uploadService';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { refreshSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'reservations' | 'menu' | 'gallery' | 'settings' | 'uploads'>('reservations');

  // Data states
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationStatusFilter, setReservationStatusFilter] = useState<string>('ALL');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Menu Category Modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<MenuCategory>>({
    name: '',
    slug: '',
    description: '',
    displayOrder: 1,
    isActive: true,
  });

  // Menu Item Modal state
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<Partial<MenuItem> & { categoryId?: number }>({
    name: '',
    description: '',
    price: 100,
    categoryId: 1,
    isVegetarian: true,
    isChefSpecial: false,
    isAvailable: true,
    imageUrl: '/images/illustrative-food/illustrative-food-01.jpg',
  });

  // Gallery Modal state
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [newGalleryImage, setNewGalleryImage] = useState<Partial<GalleryImage>>({
    title: '',
    category: 'Food',
    imageUrl: '/images/illustrative-food/illustrative-food-01.jpg',
    caption: '',
  });

  useEffect(() => {
    loadData();
  }, [activeTab, reservationStatusFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'reservations') {
        const res = await getReservationsAdmin(reservationStatusFilter);
        setReservations(res.content || []);
      } else if (activeTab === 'menu') {
        const [items, cats] = await Promise.all([getMenuItems(), getAllCategoriesAdmin()]);
        setMenuItems(items);
        setCategories(cats);
      } else if (activeTab === 'gallery') {
        const imgs = await getGallery('All');
        setGallery(imgs);
      } else if (activeTab === 'settings') {
        const s = await getSettings();
        setSettings(s);
      }
    } catch (err: any) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reservation actions
  const handleUpdateReservationStatus = async (id: number, status: string) => {
    try {
      await updateReservationStatusAdmin(id, status);
      setMessage({ type: 'success', text: `Reservation status updated to ${status}` });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update reservation status' });
    }
  };

  const handleDeleteReservation = async (id: number) => {
    if (!window.confirm('Delete this reservation entry?')) return;
    try {
      await deleteReservationAdmin(id);
      setMessage({ type: 'success', text: 'Reservation deleted' });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete' });
    }
  };

  // Category actions
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = editingCategory.slug || (editingCategory.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (editingCategory.id) {
        await updateCategoryAdmin(editingCategory.id, {
          name: editingCategory.name,
          slug: slug,
          description: editingCategory.description,
          displayOrder: editingCategory.displayOrder || 1,
          isActive: editingCategory.isActive !== false,
        });
        setMessage({ type: 'success', text: 'Menu category updated successfully' });
      } else {
        await createCategoryAdmin({
          name: editingCategory.name,
          slug: slug,
          description: editingCategory.description,
          displayOrder: editingCategory.displayOrder || 1,
          isActive: true,
        });
        setMessage({ type: 'success', text: 'New menu category created' });
      }
      setShowCategoryModal(false);
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error saving menu category' });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Delete this menu category? Dishes in this category may be affected.')) return;
    try {
      await deleteCategoryAdmin(id);
      setMessage({ type: 'success', text: 'Category deleted' });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete category' });
    }
  };

  // Menu item actions
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMenuItem.id) {
        await updateMenuItemAdmin(editingMenuItem.id, {
          name: editingMenuItem.name,
          description: editingMenuItem.description,
          price: editingMenuItem.price,
          categoryId: editingMenuItem.categoryId || categories[0]?.id || 1,
          isVegetarian: editingMenuItem.isVegetarian,
          isChefSpecial: editingMenuItem.isChefSpecial,
          isAvailable: editingMenuItem.isAvailable,
          imageUrl: editingMenuItem.imageUrl,
          imageAltText: editingMenuItem.imageAltText,
          imageSourceType: editingMenuItem.imageSourceType,
        });
        setMessage({ type: 'success', text: 'Menu item updated successfully' });
      } else {
        await createMenuItemAdmin({
          name: editingMenuItem.name,
          description: editingMenuItem.description,
          price: editingMenuItem.price,
          categoryId: editingMenuItem.categoryId || categories[0]?.id || 1,
          isVegetarian: editingMenuItem.isVegetarian,
          isChefSpecial: editingMenuItem.isChefSpecial,
          isAvailable: editingMenuItem.isAvailable,
          imageUrl: editingMenuItem.imageUrl,
          imageAltText: editingMenuItem.imageAltText,
          imageSourceType: editingMenuItem.imageSourceType,
        });
        setMessage({ type: 'success', text: 'New menu item created' });
      }
      setShowMenuModal(false);
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error saving menu item' });
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await deleteMenuItemAdmin(id);
      setMessage({ type: 'success', text: 'Menu item deleted' });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete item' });
    }
  };

  // Gallery actions
  const handleSaveGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGalleryImageAdmin(newGalleryImage);
      setMessage({ type: 'success', text: 'Gallery image metadata added' });
      setShowGalleryModal(false);
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to add image' });
    }
  };

  const handleDeleteGalleryImage = async (id: number) => {
    if (!window.confirm('Delete this gallery image?')) return;
    try {
      await deleteGalleryImageAdmin(id);
      setMessage({ type: 'success', text: 'Gallery image deleted' });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete gallery image' });
    }
  };

  // Settings actions
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettingsAdmin(settings);
      await refreshSettings();
      setMessage({ type: 'success', text: 'Restaurant business content saved successfully and published live!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save settings' });
    }
  };

  return (
    <>
      <SEO title="Admin Control Dashboard | The Maansarovar Restaurant" />

      <div className="min-h-screen bg-cream-100 flex flex-col font-sans">
        
        {/* Admin Navigation Bar */}
        <header className="bg-charcoal-900 text-cream-50 px-6 py-3.5 border-b border-charcoal-800 flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-forest-800 text-saffron-400 flex items-center justify-center border border-forest-700/60 shadow-subtle">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-medium leading-none">Admin Content Management</h1>
              <p className="text-[10px] text-saffron-400 font-sans mt-0.5 tracking-wider uppercase font-medium">Logged in as {user?.username || 'Admin'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-charcoal-800 text-cream-200 text-xs font-medium uppercase tracking-wider hover:bg-red-900 hover:text-cream-50 transition-colors border border-charcoal-700/50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </header>

        {/* Dashboard Main Layout */}
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-1.5">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors ${
                activeTab === 'reservations'
                  ? 'bg-forest-800 text-cream-50 shadow-subtle'
                  : 'bg-cream-50 text-charcoal-800 hover:bg-cream-200/70 border border-cream-300/70'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5 text-saffron-400" />
              <span>Reservations</span>
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors ${
                activeTab === 'menu'
                  ? 'bg-forest-800 text-cream-50 shadow-subtle'
                  : 'bg-cream-50 text-charcoal-800 hover:bg-cream-200/70 border border-cream-300/70'
              }`}
            >
              <Utensils className="w-3.5 h-3.5 text-saffron-400" />
              <span>Menu & Categories</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors ${
                activeTab === 'gallery'
                  ? 'bg-forest-800 text-cream-50 shadow-subtle'
                  : 'bg-cream-50 text-charcoal-800 hover:bg-cream-200/70 border border-cream-300/70'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-saffron-400" />
              <span>Gallery Metadata</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors ${
                activeTab === 'settings'
                  ? 'bg-forest-800 text-cream-50 shadow-subtle'
                  : 'bg-cream-50 text-charcoal-800 hover:bg-cream-200/70 border border-cream-300/70'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-saffron-400" />
              <span>Branding & Hours</span>
            </button>

            <button
              onClick={() => setActiveTab('uploads')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors ${
                activeTab === 'uploads'
                  ? 'bg-forest-800 text-cream-50 shadow-subtle'
                  : 'bg-cream-50 text-charcoal-800 hover:bg-cream-200/70 border border-cream-300/70'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-saffron-400" />
              <span>Media Assets</span>
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="lg:col-span-9 bg-cream-50 rounded border border-cream-300/80 p-6 shadow-subtle min-h-[600px]">
            
            {message && (
              <div
                className={`mb-5 p-3.5 rounded text-xs font-sans flex items-center justify-between ${
                  message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200/80' : 'bg-red-50 text-red-800 border border-red-200/80'
                }`}
              >
                <span>{message.text}</span>
                <button onClick={() => setMessage(null)}><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* TAB 1: RESERVATIONS MANAGER */}
            {activeTab === 'reservations' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-charcoal-900">Table Reservations</h2>
                    <p className="text-xs text-charcoal-800/60 font-sans">Manage customer table booking requests.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-charcoal-800">Filter:</span>
                    <select
                      value={reservationStatusFilter}
                      onChange={(e) => setReservationStatusFilter(e.target.value)}
                      className="px-3 py-1.5 bg-cream-100 border border-cream-300 rounded-lg text-xs font-semibold"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                </div>

                {reservations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans border-collapse">
                      <thead>
                        <tr className="border-b border-cream-300 text-charcoal-800/70 uppercase text-[10px] tracking-wider">
                          <th className="py-3 px-2">Guest</th>
                          <th className="py-3 px-2">Phone</th>
                          <th className="py-3 px-2">Date & Time</th>
                          <th className="py-3 px-2">Guests</th>
                          <th className="py-3 px-2">Status</th>
                          <th className="py-3 px-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cream-200">
                        {reservations.map((r) => (
                          <tr key={r.id} className="hover:bg-cream-100/60">
                            <td className="py-3 px-2 font-semibold text-charcoal-900">{r.guestName}</td>
                            <td className="py-3 px-2 font-mono text-forest-800">{r.guestPhone}</td>
                            <td className="py-3 px-2 text-charcoal-800">{r.reservationDate} at {r.reservationTime}</td>
                            <td className="py-3 px-2 text-charcoal-800 font-semibold">{r.numberOfGuests} Guests</td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                r.status === 'NEW' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                r.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 border border-green-300' :
                                r.status === 'CONTACTED' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-right space-x-1">
                              <select
                                value={r.status}
                                onChange={(e) => handleUpdateReservationStatus(r.id, e.target.value)}
                                className="px-2 py-1 bg-cream-100 border border-cream-300 rounded text-[10px]"
                              >
                                <option value="NEW">NEW</option>
                                <option value="CONTACTED">CONTACTED</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="CLOSED">CLOSED</option>
                              </select>
                              <button
                                onClick={() => handleDeleteReservation(r.id)}
                                className="p-1 rounded text-red-600 hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-cream-100/50 rounded-xl border border-cream-200">
                    <CalendarCheck className="w-8 h-8 text-charcoal-800/30 mx-auto mb-2" />
                    <p className="text-xs text-charcoal-800/60 font-sans">No reservations found matching current filter.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: MENU & CATEGORIES MANAGER */}
            {activeTab === 'menu' && (
              <div className="space-y-8">
                
                {/* Categories Management Section */}
                <div className="bg-cream-100 p-5 rounded-2xl border border-cream-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-saffron-600" />
                        <span>Menu Categories</span>
                      </h3>
                      <p className="text-xs text-charcoal-800/60">Organize menu items into sections (e.g., Starters, Mains, Beverages).</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingCategory({ name: '', slug: '', description: '', displayOrder: categories.length + 1, isActive: true });
                        setShowCategoryModal(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-forest-800 text-cream-50 text-xs uppercase tracking-wider font-semibold flex items-center gap-1 hover:bg-forest-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Category</span>
                    </button>
                  </div>

                  {categories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categories.map((cat) => (
                        <div key={cat.id} className="p-3 bg-cream-50 rounded-xl border border-cream-200 flex items-center justify-between gap-2">
                          <div>
                            <h4 className="font-serif font-bold text-xs text-charcoal-900">{cat.name}</h4>
                            <p className="text-[10px] text-charcoal-800/60 line-clamp-1">{cat.description || cat.slug}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setEditingCategory(cat);
                                setShowCategoryModal(true);
                              }}
                              className="p-1 rounded bg-cream-200 text-charcoal-800 hover:bg-saffron-500"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1 rounded bg-cream-200 text-red-600 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-charcoal-800/50 italic">No menu categories created yet.</p>
                  )}
                </div>

                {/* Menu Items CRUD Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-charcoal-900">Dishes & Menu Items</h3>
                      <p className="text-xs text-charcoal-800/60">Add, update, or remove dishes published on the website menu.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingMenuItem({
                          name: '', description: '', price: 150, categoryId: categories[0]?.id || 1,
                          isVegetarian: true, isChefSpecial: false, isAvailable: true,
                          imageUrl: '/images/illustrative-food/illustrative-food-01.jpg',
                          imageSourceType: 'OWNER_PHOTO'
                        });
                        setShowMenuModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-forest-800 text-cream-50 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 hover:bg-forest-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Dish</span>
                    </button>
                  </div>

                  {menuItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {menuItems.map((item) => (
                        <div key={item.id} className="p-4 bg-cream-100 rounded-xl border border-cream-300 flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${item.isVegetarian ? 'bg-green-600' : 'bg-red-600'}`} />
                              <h4 className="font-serif font-bold text-base text-charcoal-900">{item.name}</h4>
                              <span className="text-xs font-bold text-forest-800 font-mono">₹{item.price}</span>
                            </div>
                            <p className="text-xs text-charcoal-800/70 mt-1 line-clamp-1">{item.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] uppercase tracking-wider text-saffron-600 font-bold block">
                                {item.category?.name || 'Category'}
                              </span>
                              {item.imageSourceType && (
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                  item.imageSourceType === 'OWNER_PHOTO' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {item.imageSourceType}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingMenuItem({
                                  id: item.id,
                                  name: item.name,
                                  description: item.description,
                                  price: item.price,
                                  categoryId: item.category?.id || categories[0]?.id || 1,
                                  isVegetarian: item.isVegetarian,
                                  isChefSpecial: item.isChefSpecial,
                                  isAvailable: item.isAvailable,
                                  imageUrl: item.imageUrl,
                                  imageAltText: item.imageAltText,
                                  imageSourceType: item.imageSourceType,
                                });
                                setShowMenuModal(true);
                              }}
                              className="p-1.5 rounded bg-cream-200 text-charcoal-800 hover:bg-saffron-500 hover:text-charcoal-950"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item.id)}
                              className="p-1.5 rounded bg-cream-200 text-red-600 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-cream-100/50 rounded-xl border border-cream-200 p-8">
                      <Utensils className="w-10 h-10 text-charcoal-800/30 mx-auto mb-3" />
                      <h3 className="font-serif text-lg font-bold text-charcoal-900">No menu items added yet</h3>
                      <p className="text-xs text-charcoal-800/60 mt-1">Click "Add New Dish" to add official dishes when available from the restaurant owner.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 3: GALLERY MANAGER */}
            {activeTab === 'gallery' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-charcoal-900">Gallery Metadata</h2>
                    <p className="text-xs text-charcoal-800/60 font-sans">Manage photo entries and categories.</p>
                  </div>
                  <button
                    onClick={() => setShowGalleryModal(true)}
                    className="px-4 py-2 rounded-xl bg-forest-800 text-cream-50 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 hover:bg-forest-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Photo Entry</span>
                  </button>
                </div>

                {gallery.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {gallery.map((img) => (
                      <div key={img.id} className="relative group bg-cream-100 rounded-xl overflow-hidden border border-cream-300 p-2">
                        <img src={img.imageUrl} alt={img.title} className="w-full h-28 object-cover rounded-lg" />
                        <div className="mt-2 text-xs">
                          <span className="text-[10px] text-saffron-600 font-bold uppercase">{img.category}</span>
                          <h5 className="font-serif font-bold text-charcoal-900 truncate">{img.title}</h5>
                        </div>
                        <button
                          onClick={() => handleDeleteGalleryImage(img.id)}
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-cream-100/50 rounded-xl border border-cream-200 p-8">
                    <ImageIcon className="w-10 h-10 text-charcoal-800/30 mx-auto mb-3" />
                    <h3 className="font-serif text-lg font-bold text-charcoal-900">No gallery photos added yet</h3>
                    <p className="text-xs text-charcoal-800/60 mt-1">Official photos will display here once added by the administrator.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: RESTAURANT BUSINESS SETTINGS */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-6 font-sans text-xs">
                
                <div className="flex items-center justify-between pb-2 border-b border-cream-300">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-charcoal-900">Website Content & Business Settings</h2>
                    <p className="text-xs text-charcoal-800/60">Update any normal business text live on the website without code changes.</p>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-forest-800 text-cream-50 font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-forest-700 shadow-md"
                  >
                    Save & Publish Live
                  </button>
                </div>

                {/* Card 1: Business Identity & Branding */}
                <div className="bg-cream-100 p-5 rounded-2xl border border-cream-300 space-y-4">
                  <h3 className="font-serif text-base font-bold text-charcoal-900 uppercase tracking-wider text-forest-800">
                    1. Identity & Branding
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">Business Name (`restaurant_name`)</label>
                      <input
                        type="text"
                        value={settings.restaurant_name || ''}
                        onChange={(e) => setSettings({ ...settings, restaurant_name: e.target.value })}
                        className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">Business Subtitle / Category (`business_category`)</label>
                      <input
                        type="text"
                        value={settings.business_category || ''}
                        onChange={(e) => setSettings({ ...settings, business_category: e.target.value })}
                        className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                        placeholder="Restaurant & Food Court"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">Location Badge (`location_badge`)</label>
                      <input
                        type="text"
                        value={settings.location_badge || ''}
                        onChange={(e) => setSettings({ ...settings, location_badge: e.target.value })}
                        className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                        placeholder="Lakhimpur Kheri • Beside Amrit Sarovar"
                      />
                    </div>

                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">Hero Title Line 1 (`hero_headline_line1`)</label>
                      <input
                        type="text"
                        value={settings.hero_headline_line1 || ''}
                        onChange={(e) => setSettings({ ...settings, hero_headline_line1: e.target.value })}
                        className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                        placeholder="The Maansarovar"
                      />
                    </div>

                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">Hero Title Line 2 (`hero_headline_line2`)</label>
                      <input
                        type="text"
                        value={settings.hero_headline_line2 || ''}
                        onChange={(e) => setSettings({ ...settings, hero_headline_line2: e.target.value })}
                        className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                        placeholder="Restaurant & Food Court"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold uppercase tracking-wider block mb-1">Hero Tagline (`tagline`)</label>
                    <input
                      type="text"
                      value={settings.tagline || ''}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                      placeholder="e.g. Pure Vegetarian Delights & Cozy Dining"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-cream-200">
                    <ImageUploader
                      value={settings.logo_image_url || ''}
                      onChange={(url) => setSettings({ ...settings, logo_image_url: url })}
                      label="Custom Logo Image (`logo_image_url`)"
                      helperText="Upload official restaurant logo (JPG, PNG, WebP <= 5MB)"
                    />

                    <ImageUploader
                      value={settings.hero_image_url || ''}
                      onChange={(url) => setSettings({ ...settings, hero_image_url: url })}
                      label="Hero Background Banner (`hero_image_url`)"
                      helperText="Upload custom hero banner image (JPG, PNG, WebP <= 5MB)"
                    />
                  </div>
                </div>

                {/* Card 2: About & Story */}
                <div className="bg-cream-100 p-5 rounded-2xl border border-cream-300 space-y-4">
                  <h3 className="font-serif text-base font-bold text-charcoal-900 uppercase tracking-wider text-forest-800">
                    2. About Page Story & Overview
                  </h3>

                  <div>
                    <label className="font-bold uppercase tracking-wider block mb-1">About Section Heading (`about_heading`)</label>
                    <input
                      type="text"
                      value={settings.about_heading || ''}
                      onChange={(e) => setSettings({ ...settings, about_heading: e.target.value })}
                      className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                      placeholder="About Our Establishment"
                    />
                  </div>

                  <div>
                    <label className="font-bold uppercase tracking-wider block mb-1">About Story / Overview Text (`about_story`)</label>
                    <textarea
                      rows={3}
                      value={settings.about_story || ''}
                      onChange={(e) => setSettings({ ...settings, about_story: e.target.value })}
                      className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                      placeholder="Detailed background text displayed on Home and About pages..."
                    />
                  </div>
                </div>

                {/* Card 3: Contact Details & Timings */}
                <div className="bg-cream-100 p-5 rounded-2xl border border-cream-300 space-y-4">
                  <h3 className="font-serif text-base font-bold text-charcoal-900 uppercase tracking-wider text-forest-800">
                    3. Contact Details & Operating Hours
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">Opening Hours (`opening_hours`)</label>
                      <input
                        type="text"
                        value={settings.opening_hours || ''}
                        onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
                        className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                        placeholder="9:00 AM – 11:00 PM"
                      />
                    </div>

                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">Phone Number (`phone`)</label>
                      <input
                        type="text"
                        value={settings.phone || ''}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                        placeholder="Leave blank to hide Call buttons"
                      />
                    </div>

                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">WhatsApp Number (`whatsapp`)</label>
                      <input
                        type="text"
                        value={settings.whatsapp || ''}
                        onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                        className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                        placeholder="Leave blank to hide WhatsApp button"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold uppercase tracking-wider block mb-1">Public Email Address (`email`)</label>
                    <input
                      type="text"
                      value={settings.email || ''}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                      placeholder="Leave blank to hide email link"
                    />
                  </div>

                  <div>
                    <label className="font-bold uppercase tracking-wider block mb-1">Address Text (`address`)</label>
                    <textarea
                      rows={2}
                      value={settings.address || ''}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Card 4: Location Maps Integration */}
                <div className="bg-cream-100 p-5 rounded-2xl border border-cream-300 space-y-4">
                  <h3 className="font-serif text-base font-bold text-charcoal-900 uppercase tracking-wider text-forest-800">
                    4. Google Maps Integration
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">Google Maps Direct Listing URL (`google_maps_direct`)</label>
                      <input
                        type="text"
                        value={settings.google_maps_direct || ''}
                        onChange={(e) => setSettings({ ...settings, google_maps_direct: e.target.value })}
                        className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">Google Maps Embed URL (`map_url`)</label>
                      <input
                        type="text"
                        value={settings.map_url || ''}
                        onChange={(e) => setSettings({ ...settings, map_url: e.target.value })}
                        className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Card 5: Notices & Banners */}
                <div className="bg-cream-100 p-5 rounded-2xl border border-cream-300 space-y-4">
                  <h3 className="font-serif text-base font-bold text-charcoal-900 uppercase tracking-wider text-forest-800">
                    5. Notices & Announcement Banner
                  </h3>

                  <div>
                    <label className="font-bold uppercase tracking-wider block mb-1">Menu Page Notice Text (`menu_notice`)</label>
                    <input
                      type="text"
                      value={settings.menu_notice || ''}
                      onChange={(e) => setSettings({ ...settings, menu_notice: e.target.value })}
                      className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                      placeholder="Our menu will be available soon."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="sm:col-span-2">
                      <label className="font-bold uppercase tracking-wider block mb-1">Top Announcement Banner Text (`announcement_text`)</label>
                      <input
                        type="text"
                        value={settings.announcement_text || ''}
                        onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
                        className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                        placeholder="Open daily · 9:00 AM – 11:00 PM · Beside Zila Panchayat Amrit Sarovar"
                      />
                    </div>

                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">Show Banner (`announcement_enabled`)</label>
                      <select
                        value={settings.announcement_enabled || 'true'}
                        onChange={(e) => setSettings({ ...settings, announcement_enabled: e.target.value })}
                        className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm font-semibold"
                      >
                        <option value="true">Show Top Banner</option>
                        <option value="false">Hide Top Banner</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Card 6: Social Media Links */}
                <div className="bg-cream-100 p-5 rounded-2xl border border-cream-300 space-y-4">
                  <h3 className="font-serif text-base font-bold text-charcoal-900 uppercase tracking-wider text-forest-800">
                    6. Social Media Channels
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">Facebook URL</label>
                      <input
                        type="text"
                        value={settings.social_facebook || ''}
                        onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
                        className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                        placeholder="Optional"
                      />
                    </div>

                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">Instagram URL</label>
                      <input
                        type="text"
                        value={settings.social_instagram || ''}
                        onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                        className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                        placeholder="Optional"
                      />
                    </div>

                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">TripAdvisor URL</label>
                      <input
                        type="text"
                        value={settings.social_tripadvisor || ''}
                        onChange={(e) => setSettings({ ...settings, social_tripadvisor: e.target.value })}
                        className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-forest-800 text-cream-50 font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-forest-700 shadow-md transition-all"
                  >
                    Save All Settings & Publish Live
                  </button>
                </div>
              </form>
            )}

            {/* TAB 5: UPLOADED IMAGES MANAGER */}
            {activeTab === 'uploads' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-300">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-charcoal-900">Uploaded Image Storage</h2>
                    <p className="text-xs text-charcoal-800/60">Upload new images directly to persistent local storage and manage uploaded files.</p>
                  </div>
                </div>

                <div className="bg-cream-100 p-5 rounded-2xl border border-cream-300">
                  <ImageUploader
                    onChange={(url) => {
                      setMessage({ type: 'success', text: `Image uploaded successfully: ${url}` });
                      loadData();
                    }}
                    label="Direct Image Uploader"
                    helperText="Upload official food photos, logo, or banner assets (JPG, PNG, WebP <= 5 MB)"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-charcoal-900">Recently Uploaded Files in Use</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Combine images used across settings, gallery, menu */}
                    {Array.from(new Set([
                      settings.logo_image_url,
                      settings.hero_image_url,
                      ...gallery.map(g => g.imageUrl),
                      ...menuItems.map(m => m.imageUrl)
                    ].filter((url): url is string => !!url && url.startsWith('/uploads/')))).map((url) => {
                      const filename = url.replace('/uploads/', '');
                      return (
                        <div key={url} className="p-3 bg-cream-100 rounded-xl border border-cream-300 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={url} alt={filename} className="w-12 h-12 object-cover rounded-lg shrink-0 bg-charcoal-950" />
                            <div className="min-w-0">
                              <p className="font-mono text-xs text-charcoal-900 truncate font-semibold">{filename}</p>
                              <p className="text-[10px] text-green-700 font-bold uppercase mt-0.5">In Active Use</p>
                            </div>
                          </div>

                          <button
                            onClick={async () => {
                              try {
                                const refs = await checkImageReferencesAdmin(filename);
                                if (refs.length > 0) {
                                  alert(`Cannot delete '${filename}'. It is currently referenced in:\n\n• ` + refs.join('\n• '));
                                  return;
                                }
                                if (window.confirm(`Are you sure you want to delete '${filename}'?`)) {
                                  await deleteImageAdmin(filename);
                                  setMessage({ type: 'success', text: `Deleted ${filename}` });
                                  loadData();
                                }
                              } catch (err: any) {
                                setMessage({ type: 'error', text: err.message || 'Failed to check or delete file' });
                              }
                            }}
                            className="p-2 rounded bg-cream-200 text-red-600 hover:bg-red-600 hover:text-white shrink-0"
                            title="Safe Delete Check"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Menu Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-cream-50 rounded-2xl p-6 max-w-md w-full border border-cream-300 shadow-2xl">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h3 className="font-serif text-xl font-bold">{editingCategory.id ? 'Edit Category' : 'Add New Category'}</h3>
                <button onClick={() => setShowCategoryModal(false)}><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-3 font-sans text-xs">
                <div>
                  <label className="font-bold uppercase block mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full p-2 bg-cream-100 border rounded"
                    placeholder="e.g. Starters & Tandoor"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase block mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={editingCategory.slug || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                    className="w-full p-2 bg-cream-100 border rounded"
                    placeholder="Auto-generated if left blank"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    className="w-full p-2 bg-cream-100 border rounded"
                    placeholder="Short description for menu header"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold uppercase block mb-1">Display Order</label>
                    <input
                      type="number"
                      value={editingCategory.displayOrder || 1}
                      onChange={(e) => setEditingCategory({ ...editingCategory, displayOrder: parseInt(e.target.value) || 1 })}
                      className="w-full p-2 bg-cream-100 border rounded"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="inline-flex items-center gap-2 cursor-pointer font-bold uppercase">
                      <input
                        type="checkbox"
                        checked={editingCategory.isActive !== false}
                        onChange={(e) => setEditingCategory({ ...editingCategory, isActive: e.target.checked })}
                      />
                      <span>Active</span>
                    </label>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowCategoryModal(false)} className="px-4 py-2 rounded bg-cream-200 font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-forest-800 text-white font-bold">Save Category</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Menu Item Modal */}
        {showMenuModal && (
          <div className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-cream-50 rounded-2xl p-6 max-w-lg w-full border border-cream-300 shadow-2xl">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h3 className="font-serif text-xl font-bold">{editingMenuItem.id ? 'Edit Dish' : 'Add New Dish'}</h3>
                <button onClick={() => setShowMenuModal(false)}><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSaveMenuItem} className="space-y-3 font-sans text-xs">
                <div>
                  <label className="font-bold uppercase block mb-1">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={editingMenuItem.name}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                    className="w-full p-2 bg-cream-100 border rounded"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingMenuItem.description}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })}
                    className="w-full p-2 bg-cream-100 border rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold uppercase block mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={editingMenuItem.price}
                      onChange={(e) => setEditingMenuItem({ ...editingMenuItem, price: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 bg-cream-100 border rounded"
                    />
                  </div>

                  <div>
                    <label className="font-bold uppercase block mb-1">Category *</label>
                    <select
                      value={editingMenuItem.categoryId}
                      onChange={(e) => setEditingMenuItem({ ...editingMenuItem, categoryId: parseInt(e.target.value) })}
                      className="w-full p-2 bg-cream-100 border rounded"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={editingMenuItem.isVegetarian}
                      onChange={(e) => setEditingMenuItem({ ...editingMenuItem, isVegetarian: e.target.checked })}
                    />
                    <span>Vegetarian</span>
                  </label>

                  <label className="inline-flex items-center gap-1.5 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={editingMenuItem.isChefSpecial}
                      onChange={(e) => setEditingMenuItem({ ...editingMenuItem, isChefSpecial: e.target.checked })}
                    />
                    <span>Chef Special</span>
                  </label>
                </div>

                <ImageUploader
                  value={editingMenuItem.imageUrl || ''}
                  onChange={(url) => setEditingMenuItem({ ...editingMenuItem, imageUrl: url, imageSourceType: url.startsWith('/uploads/') ? 'OWNER_PHOTO' : editingMenuItem.imageSourceType })}
                  label="Dish Photo"
                  helperText="Upload official dish photograph (JPG, PNG, WebP <= 5MB)"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold uppercase block mb-1">Image Alt Text</label>
                    <input
                      type="text"
                      value={editingMenuItem.imageAltText || ''}
                      onChange={(e) => setEditingMenuItem({ ...editingMenuItem, imageAltText: e.target.value })}
                      className="w-full p-2 bg-cream-100 border rounded"
                      placeholder="Descriptive image alt text"
                    />
                  </div>

                  <div>
                    <label className="font-bold uppercase block mb-1">Image Source Type</label>
                    <select
                      value={editingMenuItem.imageSourceType || 'OWNER_PHOTO'}
                      onChange={(e) => setEditingMenuItem({ ...editingMenuItem, imageSourceType: e.target.value })}
                      className="w-full p-2 bg-cream-100 border rounded"
                    >
                      <option value="OWNER_PHOTO">OWNER_PHOTO (Official)</option>
                      <option value="AI_ILLUSTRATIVE">AI_ILLUSTRATIVE (Temporary)</option>
                      <option value="EXTERNAL_APPROVED">EXTERNAL_APPROVED (Licensed)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowMenuModal(false)} className="px-4 py-2 rounded bg-cream-200 font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-forest-800 text-white font-bold">Save Item</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Gallery Modal */}
        {showGalleryModal && (
          <div className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-cream-50 rounded-2xl p-6 max-w-md w-full border border-cream-300 shadow-2xl">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h3 className="font-serif text-xl font-bold">Add Gallery Image</h3>
                <button onClick={() => setShowGalleryModal(false)}><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSaveGalleryImage} className="space-y-3 font-sans text-xs">
                <div>
                  <label className="font-bold uppercase block mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={newGalleryImage.title}
                    onChange={(e) => setNewGalleryImage({ ...newGalleryImage, title: e.target.value })}
                    className="w-full p-2 bg-cream-100 border rounded"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase block mb-1">Category *</label>
                  <select
                    value={newGalleryImage.category}
                    onChange={(e) => setNewGalleryImage({ ...newGalleryImage, category: e.target.value })}
                    className="w-full p-2 bg-cream-100 border rounded"
                  >
                    <option value="Food">Food</option>
                    <option value="Ambience">Ambience</option>
                    <option value="Family Dining">Family Dining</option>
                    <option value="Events">Events</option>
                  </select>
                </div>

                <ImageUploader
                  value={newGalleryImage.imageUrl || ''}
                  onChange={(url) => setNewGalleryImage({ ...newGalleryImage, imageUrl: url })}
                  label="Gallery Photo"
                  helperText="Upload official restaurant / food photograph (JPG, PNG, WebP <= 5MB)"
                />

                <div>
                  <label className="font-bold uppercase block mb-1">Caption</label>
                  <input
                    type="text"
                    value={newGalleryImage.caption}
                    onChange={(e) => setNewGalleryImage({ ...newGalleryImage, caption: e.target.value })}
                    className="w-full p-2 bg-cream-100 border rounded"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowGalleryModal(false)} className="px-4 py-2 rounded bg-cream-200 font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-forest-800 text-white font-bold">Add Photo</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
};
