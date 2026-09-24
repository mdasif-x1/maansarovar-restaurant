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
  Plus, Trash2, Edit2, CheckCircle, Clock, AlertCircle, RefreshCw, X, FolderPlus, Tag, FileText, Check, Loader2, Phone, MapPin, Globe, Share2, Megaphone, FileImage, SlidersHorizontal, Users, Calendar
} from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { checkImageReferencesAdmin, deleteImageAdmin } from '../services/uploadService';
import { InlineConfirm } from '../components/InlineConfirm';
import { Toast } from '../components/Toast';

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
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Settings Save State: 'idle' | 'saving' | 'saved' | 'error'
  const [settingsSaveState, setSettingsSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Delete Confirmation State
  const [activeDeleteConfirm, setActiveDeleteConfirm] = useState<{
    type: 'reservation' | 'category' | 'menu' | 'gallery' | 'upload';
    id: number | string;
    title: string;
  } | null>(null);

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
  const [editingMenuItem, setEditingMenuItem] = useState<Partial<MenuItem> & { categoryId?: number; rawPrice?: string }>({
    name: '',
    description: '',
    price: 100,
    rawPrice: '100',
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

  // Scroll to top when activeTab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

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
      setToast({ type: 'error', message: err.message || 'Failed to load administrative data' });
    } finally {
      setIsLoading(false);
    }
  };

  // Reservation actions
  const handleUpdateReservationStatus = async (id: number, status: string) => {
    try {
      await updateReservationStatusAdmin(id, status);
      setToast({ type: 'success', message: `Reservation status updated to ${status}` });
      loadData();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to update reservation status' });
    }
  };

  const confirmDeleteReservation = async (id: number) => {
    try {
      await deleteReservationAdmin(id);
      setToast({ type: 'success', message: 'Reservation entry deleted successfully' });
      setActiveDeleteConfirm(null);
      loadData();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to delete reservation' });
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
        setToast({ type: 'success', message: 'Menu category updated successfully' });
      } else {
        await createCategoryAdmin({
          name: editingCategory.name,
          slug: slug,
          description: editingCategory.description,
          displayOrder: editingCategory.displayOrder || 1,
          isActive: true,
        });
        setToast({ type: 'success', message: 'New menu category created' });
      }
      setShowCategoryModal(false);
      loadData();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Error saving menu category' });
    }
  };

  const confirmDeleteCategory = async (id: number) => {
    try {
      await deleteCategoryAdmin(id);
      setToast({ type: 'success', message: 'Category deleted successfully' });
      setActiveDeleteConfirm(null);
      loadData();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to delete category' });
    }
  };

  // Menu item actions
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrice = parseFloat(editingMenuItem.rawPrice || '0');
    if (isNaN(finalPrice) || finalPrice <= 0) {
      setToast({ type: 'error', message: 'Please enter a valid dish price (greater than ₹0).' });
      return;
    }

    try {
      const payload = {
        name: editingMenuItem.name,
        description: editingMenuItem.description,
        price: finalPrice,
        categoryId: editingMenuItem.categoryId || categories[0]?.id || 1,
        isVegetarian: editingMenuItem.isVegetarian,
        isChefSpecial: editingMenuItem.isChefSpecial,
        isAvailable: editingMenuItem.isAvailable,
        imageUrl: editingMenuItem.imageUrl,
        imageAltText: editingMenuItem.imageAltText,
        imageSourceType: editingMenuItem.imageSourceType,
      };

      if (editingMenuItem.id) {
        await updateMenuItemAdmin(editingMenuItem.id, payload);
        setToast({ type: 'success', message: 'Menu item updated successfully' });
      } else {
        await createMenuItemAdmin(payload);
        setToast({ type: 'success', message: 'New menu item created' });
      }
      setShowMenuModal(false);
      loadData();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Error saving menu item' });
    }
  };

  const confirmDeleteMenuItem = async (id: number) => {
    try {
      await deleteMenuItemAdmin(id);
      setToast({ type: 'success', message: 'Menu item deleted successfully' });
      setActiveDeleteConfirm(null);
      loadData();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to delete item' });
    }
  };

  // Gallery actions
  const handleSaveGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGalleryImageAdmin(newGalleryImage);
      setToast({ type: 'success', message: 'Gallery photo entry added' });
      setShowGalleryModal(false);
      loadData();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to add gallery photo' });
    }
  };

  const confirmDeleteGalleryImage = async (id: number) => {
    try {
      await deleteGalleryImageAdmin(id);
      setToast({ type: 'success', message: 'Gallery image deleted successfully' });
      setActiveDeleteConfirm(null);
      loadData();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to delete gallery image' });
    }
  };

  // Upload actions
  const confirmDeleteUploadFile = async (filename: string) => {
    try {
      const refs = await checkImageReferencesAdmin(filename);
      if (refs.length > 0) {
        setToast({
          type: 'error',
          message: `Cannot delete '${filename}'. It is in active use in:\n• ${refs.join('\n• ')}`,
        });
        setActiveDeleteConfirm(null);
        return;
      }
      await deleteImageAdmin(filename);
      setToast({ type: 'success', message: `Deleted ${filename} successfully` });
      setActiveDeleteConfirm(null);
      loadData();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to check or delete file' });
    }
  };

  // Settings actions with local micro-interaction state
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (settingsSaveState === 'saving') return;

    setSettingsSaveState('saving');
    try {
      await updateSettingsAdmin(settings);
      await refreshSettings();
      setSettingsSaveState('saved');
      setToast({ type: 'success', message: 'Restaurant settings saved & published live!' });
      setTimeout(() => {
        setSettingsSaveState('idle');
      }, 3000);
    } catch (err: any) {
      setSettingsSaveState('error');
      setToast({ type: 'error', message: err.message || 'Failed to save settings. Please try again.' });
      setTimeout(() => {
        setSettingsSaveState('idle');
      }, 4000);
    }
  };

  return (
    <>
      <SEO title="Admin Dashboard | Hospitality Management" noindex={true} />

      {/* Reusable Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="min-h-screen bg-cream-100/90 flex flex-col font-sans text-charcoal-900">
        
        {/* Admin Navigation Bar */}
        <header className="bg-charcoal-950 text-cream-50 px-4 sm:px-6 lg:px-8 py-3.5 border-b border-charcoal-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-forest-900 text-saffron-400 flex items-center justify-center border border-forest-800 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-serif text-base sm:text-lg font-medium tracking-tight leading-tight text-cream-50">
                Admin Management
              </h1>
              <p className="text-[10px] text-saffron-400/90 font-sans tracking-wider uppercase font-medium">
                Authenticated as {user?.username || 'Admin'}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-charcoal-900 text-cream-200 text-[11px] font-medium uppercase tracking-wider hover:bg-red-950 hover:text-red-200 transition-colors border border-charcoal-800 focus:outline-none"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </header>

        {/* Dashboard Main Layout */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3">
            <div className="flex lg:flex-col overflow-x-auto gap-1.5 pb-2 lg:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('reservations')}
                className={`flex-1 lg:flex-none flex items-center gap-2.5 px-3.5 py-2.5 rounded-md text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === 'reservations'
                    ? 'bg-forest-900 text-cream-50 font-semibold shadow-xs border border-forest-800'
                    : 'bg-cream-50 text-charcoal-800 hover:bg-cream-200/60 border border-cream-300/70'
                }`}
              >
                <CalendarCheck className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'reservations' ? 'text-saffron-400' : 'text-charcoal-800/50'}`} />
                <span>Reservations</span>
              </button>

              <button
                onClick={() => setActiveTab('menu')}
                className={`flex-1 lg:flex-none flex items-center gap-2.5 px-3.5 py-2.5 rounded-md text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === 'menu'
                    ? 'bg-forest-900 text-cream-50 font-semibold shadow-xs border border-forest-800'
                    : 'bg-cream-50 text-charcoal-800 hover:bg-cream-200/60 border border-cream-300/70'
                }`}
              >
                <Utensils className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'menu' ? 'text-saffron-400' : 'text-charcoal-800/50'}`} />
                <span>Menu & Categories</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex-1 lg:flex-none flex items-center gap-2.5 px-3.5 py-2.5 rounded-md text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === 'gallery'
                    ? 'bg-forest-900 text-cream-50 font-semibold shadow-xs border border-forest-800'
                    : 'bg-cream-50 text-charcoal-800 hover:bg-cream-200/60 border border-cream-300/70'
                }`}
              >
                <ImageIcon className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'gallery' ? 'text-saffron-400' : 'text-charcoal-800/50'}`} />
                <span>Gallery Metadata</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 lg:flex-none flex items-center gap-2.5 px-3.5 py-2.5 rounded-md text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-forest-900 text-cream-50 font-semibold shadow-xs border border-forest-800'
                    : 'bg-cream-50 text-charcoal-800 hover:bg-cream-200/60 border border-cream-300/70'
                }`}
              >
                <Settings className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'settings' ? 'text-saffron-400' : 'text-charcoal-800/50'}`} />
                <span>Branding & Hours</span>
              </button>

              <button
                onClick={() => setActiveTab('uploads')}
                className={`flex-1 lg:flex-none flex items-center gap-2.5 px-3.5 py-2.5 rounded-md text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === 'uploads'
                    ? 'bg-forest-900 text-cream-50 font-semibold shadow-xs border border-forest-800'
                    : 'bg-cream-50 text-charcoal-800 hover:bg-cream-200/60 border border-cream-300/70'
                }`}
              >
                <FileText className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'uploads' ? 'text-saffron-400' : 'text-charcoal-800/50'}`} />
                <span>Media Assets</span>
              </button>
            </div>
          </div>

          {/* Tab Content Panel */}
          <div className="lg:col-span-9 bg-cream-50 rounded-lg border border-cream-300/80 p-4 sm:p-6 shadow-subtle min-h-[550px] relative">
            
            {isLoading && (
              <div className="absolute top-4 right-5 flex items-center gap-1.5 text-[11px] text-charcoal-800/60 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-forest-800" />
                <span>Updating data...</span>
              </div>
            )}

            {/* TAB 1: RESERVATIONS MANAGER */}
            {activeTab === 'reservations' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-cream-200 pb-4">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-medium text-charcoal-900">Reservations</h2>
                    <p className="text-xs text-charcoal-800/60 font-sans mt-0.5">Guest table booking requests and operational status.</p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-charcoal-800/50" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-charcoal-800">Filter:</span>
                    <select
                      value={reservationStatusFilter}
                      onChange={(e) => setReservationStatusFilter(e.target.value)}
                      className="px-2.5 py-1.5 bg-cream-100 border border-cream-300 rounded text-xs font-medium text-charcoal-900 focus:outline-none focus:border-forest-800"
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
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans border-collapse">
                        <thead>
                          <tr className="border-b border-cream-300 text-charcoal-800/70 uppercase text-[10px] tracking-wider font-semibold bg-cream-100/50">
                            <th className="py-2.5 px-3">Guest</th>
                            <th className="py-2.5 px-3">Contact Phone</th>
                            <th className="py-2.5 px-3">Date & Time</th>
                            <th className="py-2.5 px-3">Party Size</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-cream-200">
                          {reservations.map((r) => (
                            <tr key={r.id} className="hover:bg-cream-100/60 transition-colors">
                              <td className="py-3 px-3 font-medium text-charcoal-900">{r.guestName}</td>
                              <td className="py-3 px-3 font-mono text-xs text-charcoal-800">{r.guestPhone}</td>
                              <td className="py-3 px-3 text-charcoal-800">{r.reservationDate} <span className="text-charcoal-800/60">at</span> {r.reservationTime}</td>
                              <td className="py-3 px-3 text-charcoal-800 font-medium">{r.numberOfGuests} Guest{r.numberOfGuests > 1 ? 's' : ''}</td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                  r.status === 'NEW' ? 'bg-amber-100/90 text-amber-900 border border-amber-300/80' :
                                  r.status === 'CONFIRMED' ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300/80' :
                                  r.status === 'CONTACTED' ? 'bg-sky-100/90 text-sky-900 border border-sky-300/80' :
                                  'bg-stone-200/80 text-stone-800 border border-stone-300'
                                }`}>
                                  {r.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right space-x-1.5 relative">
                                <select
                                  value={r.status}
                                  onChange={(e) => handleUpdateReservationStatus(r.id, e.target.value)}
                                  className="px-2 py-1 bg-cream-100 border border-cream-300 rounded text-[11px] text-charcoal-900 font-medium focus:outline-none focus:border-forest-800"
                                >
                                  <option value="NEW">NEW</option>
                                  <option value="CONTACTED">CONTACTED</option>
                                  <option value="CONFIRMED">CONFIRMED</option>
                                  <option value="CLOSED">CLOSED</option>
                                </select>
                                
                                <div className="inline-block relative align-middle">
                                  <button
                                    onClick={() => setActiveDeleteConfirm({
                                      type: 'reservation',
                                      id: r.id,
                                      title: `Delete reservation for ${r.guestName}?`
                                    })}
                                    className="p-1.5 rounded text-stone-500 hover:text-red-700 hover:bg-red-50 transition-colors inline-flex items-center justify-center"
                                    title="Delete entry"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  
                                  {activeDeleteConfirm?.type === 'reservation' && activeDeleteConfirm.id === r.id && (
                                    <InlineConfirm
                                      isOpen={true}
                                      title={activeDeleteConfirm.title}
                                      message="This entry will be permanently removed."
                                      confirmLabel="Delete"
                                      align="right"
                                      onConfirm={() => confirmDeleteReservation(r.id)}
                                      onCancel={() => setActiveDeleteConfirm(null)}
                                    />
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card Stack View */}
                    <div className="md:hidden space-y-3">
                      {reservations.map((r) => (
                        <div key={r.id} className="p-3.5 bg-cream-100/70 rounded-md border border-cream-300/80 space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-medium text-xs text-charcoal-900">{r.guestName}</h4>
                              <p className="font-mono text-[11px] text-charcoal-800/80">{r.guestPhone}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider shrink-0 ${
                              r.status === 'NEW' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                              r.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                              r.status === 'CONTACTED' ? 'bg-sky-100 text-sky-900 border border-sky-300' :
                              'bg-stone-200 text-stone-800 border border-stone-300'
                            }`}>
                              {r.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-charcoal-800/80 font-sans border-t border-cream-200 pt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-charcoal-800/50" />
                              {r.reservationDate} {r.reservationTime}
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <Users className="w-3 h-3 text-charcoal-800/50" />
                              {r.numberOfGuests} Guests
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 border-t border-cream-200 pt-2">
                            <select
                              value={r.status}
                              onChange={(e) => handleUpdateReservationStatus(r.id, e.target.value)}
                              className="px-2 py-1 bg-cream-50 border border-cream-300 rounded text-[11px] text-charcoal-900 font-medium"
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="CLOSED">CLOSED</option>
                            </select>

                            <div className="relative">
                              <button
                                onClick={() => setActiveDeleteConfirm({
                                  type: 'reservation',
                                  id: r.id,
                                  title: `Delete reservation for ${r.guestName}?`
                                })}
                                className="px-2 py-1 rounded bg-cream-200 text-red-700 text-[11px] font-medium flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>

                              {activeDeleteConfirm?.type === 'reservation' && activeDeleteConfirm.id === r.id && (
                                <InlineConfirm
                                  isOpen={true}
                                  title={activeDeleteConfirm.title}
                                  message="This entry will be permanently removed."
                                  confirmLabel="Delete"
                                  align="right"
                                  onConfirm={() => confirmDeleteReservation(r.id)}
                                  onCancel={() => setActiveDeleteConfirm(null)}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16 bg-cream-100/40 rounded-md border border-cream-200">
                    <CalendarCheck className="w-7 h-7 text-charcoal-800/30 mx-auto mb-2" />
                    <p className="text-xs text-charcoal-800/60 font-sans">No reservations found for current filter.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: MENU & CATEGORIES MANAGER */}
            {activeTab === 'menu' && (
              <div className="space-y-7">
                
                {/* Categories Management Section */}
                <div className="bg-cream-100/60 p-4 sm:p-5 rounded-md border border-cream-300/80 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-medium text-charcoal-900 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-forest-800" />
                        <span>Menu Categories</span>
                      </h3>
                      <p className="text-xs text-charcoal-800/60 mt-0.5">Organize menu items into sections.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingCategory({ name: '', slug: '', description: '', displayOrder: categories.length + 1, isActive: true });
                        setShowCategoryModal(true);
                      }}
                      className="px-3 py-1.5 rounded-md bg-forest-800 text-cream-50 text-xs uppercase tracking-wider font-medium flex items-center gap-1 hover:bg-forest-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Category</span>
                    </button>
                  </div>

                  {categories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {categories.map((cat) => (
                        <div key={cat.id} className="p-3 bg-cream-50 rounded-md border border-cream-200 flex items-center justify-between gap-2 relative">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-medium text-charcoal-800/50">#{cat.displayOrder}</span>
                              <h4 className="font-serif font-medium text-xs text-charcoal-900 truncate">{cat.name}</h4>
                            </div>
                            {cat.description && (
                              <p className="text-[10px] text-charcoal-800/60 truncate mt-0.5">{cat.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setEditingCategory(cat);
                                setShowCategoryModal(true);
                              }}
                              className="p-1 rounded text-charcoal-800/70 hover:text-charcoal-900 hover:bg-cream-200 transition-colors"
                              title="Edit Category"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>

                            <div className="relative">
                              <button
                                onClick={() => setActiveDeleteConfirm({
                                  type: 'category',
                                  id: cat.id,
                                  title: `Delete category "${cat.name}"?`
                                })}
                                className="p-1 rounded text-stone-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                                title="Delete Category"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>

                              {activeDeleteConfirm?.type === 'category' && activeDeleteConfirm.id === cat.id && (
                                <InlineConfirm
                                  isOpen={true}
                                  title={activeDeleteConfirm.title}
                                  message="Dishes in this category may be affected."
                                  confirmLabel="Delete"
                                  align="right"
                                  onConfirm={() => confirmDeleteCategory(cat.id)}
                                  onCancel={() => setActiveDeleteConfirm(null)}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-charcoal-800/50 italic">No menu categories configured.</p>
                  )}
                </div>

                {/* Menu Items CRUD Section */}
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-cream-200 pb-3">
                    <div>
                      <h3 className="font-serif text-xl font-medium text-charcoal-900">Dishes & Menu Items</h3>
                      <p className="text-xs text-charcoal-800/60 mt-0.5">Manage public menu dishes and pricing.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingMenuItem({
                          name: '', description: '', price: 150, rawPrice: '150', categoryId: categories[0]?.id || 1,
                          isVegetarian: true, isChefSpecial: false, isAvailable: true,
                          imageUrl: '/images/illustrative-food/illustrative-food-01.jpg',
                          imageSourceType: 'OWNER_PHOTO'
                        });
                        setShowMenuModal(true);
                      }}
                      className="px-3.5 py-1.5 rounded-md bg-forest-800 text-cream-50 text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 hover:bg-forest-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Dish</span>
                    </button>
                  </div>

                  {menuItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {menuItems.map((item) => (
                        <div key={item.id} className="p-3.5 bg-cream-100/60 rounded-md border border-cream-300/80 flex items-start justify-between gap-3 relative">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${item.isVegetarian ? 'bg-emerald-600' : 'bg-red-600'}`} title={item.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'} />
                              <h4 className="font-serif font-medium text-sm text-charcoal-900 truncate">{item.name}</h4>
                              <span className="text-xs font-mono text-forest-900 font-medium shrink-0">₹{item.price}</span>
                            </div>
                            {item.description && (
                              <p className="text-xs text-charcoal-800/70 mt-1 line-clamp-1">{item.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] uppercase tracking-wider text-saffron-700 font-medium block">
                                {item.category?.name || 'Category'}
                              </span>
                              {item.imageSourceType && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cream-200 text-charcoal-800 font-mono">
                                  {item.imageSourceType}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setEditingMenuItem({
                                  id: item.id,
                                  name: item.name,
                                  description: item.description,
                                  price: item.price,
                                  rawPrice: String(item.price),
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
                              className="p-1.5 rounded text-charcoal-800/70 hover:text-charcoal-900 hover:bg-cream-200 transition-colors"
                              title="Edit Dish"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="relative">
                              <button
                                onClick={() => setActiveDeleteConfirm({
                                  type: 'menu',
                                  id: item.id,
                                  title: `Delete dish "${item.name}"?`
                                })}
                                className="p-1.5 rounded text-stone-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                                title="Delete Dish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              {activeDeleteConfirm?.type === 'menu' && activeDeleteConfirm.id === item.id && (
                                <InlineConfirm
                                  isOpen={true}
                                  title={activeDeleteConfirm.title}
                                  message="This item will be removed from menu."
                                  confirmLabel="Delete"
                                  align="right"
                                  onConfirm={() => confirmDeleteMenuItem(item.id)}
                                  onCancel={() => setActiveDeleteConfirm(null)}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-cream-100/40 rounded-md border border-cream-200 p-6">
                      <Utensils className="w-8 h-8 text-charcoal-800/30 mx-auto mb-2" />
                      <h3 className="font-serif text-base font-medium text-charcoal-900">No dishes in menu</h3>
                      <p className="text-xs text-charcoal-800/60 mt-0.5">Click "Add Dish" to publish menu items.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 3: GALLERY MANAGER */}
            {activeTab === 'gallery' && (
              <div>
                <div className="flex items-center justify-between mb-5 border-b border-cream-200 pb-3">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-medium text-charcoal-900">Gallery Metadata</h2>
                    <p className="text-xs text-charcoal-800/60 font-sans mt-0.5">Manage website photography entries and titles.</p>
                  </div>
                  <button
                    onClick={() => setShowGalleryModal(true)}
                    className="px-3.5 py-1.5 rounded-md bg-forest-800 text-cream-50 text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 hover:bg-forest-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                  </button>
                </div>

                {gallery.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {gallery.map((img) => (
                      <div key={img.id} className="relative group bg-cream-100/60 rounded-md overflow-hidden border border-cream-300/80 p-2">
                        <img src={img.imageUrl} alt={img.title} className="w-full h-28 object-cover rounded" />
                        <div className="mt-2 text-xs">
                          <span className="text-[10px] text-saffron-700 font-medium uppercase tracking-wider">{img.category}</span>
                          <h5 className="font-serif font-medium text-charcoal-900 truncate">{img.title}</h5>
                        </div>
                        
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={() => setActiveDeleteConfirm({
                              type: 'gallery',
                              id: img.id,
                              title: `Delete gallery entry "${img.title}"?`
                            })}
                            className="p-1 rounded bg-red-800 text-white shadow-xs hover:bg-red-900 transition-colors"
                            title="Delete Photo Entry"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>

                          {activeDeleteConfirm?.type === 'gallery' && activeDeleteConfirm.id === img.id && (
                            <InlineConfirm
                              isOpen={true}
                              title={activeDeleteConfirm.title}
                              message="This photo will be removed from gallery."
                              confirmLabel="Delete"
                              align="right"
                              onConfirm={() => confirmDeleteGalleryImage(img.id)}
                              onCancel={() => setActiveDeleteConfirm(null)}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-cream-100/40 rounded-md border border-cream-200 p-6">
                    <ImageIcon className="w-8 h-8 text-charcoal-800/30 mx-auto mb-2" />
                    <h3 className="font-serif text-base font-medium text-charcoal-900">No gallery photos added</h3>
                    <p className="text-xs text-charcoal-800/60 mt-0.5">Click "Add Photo" to populate photo gallery.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: RESTAURANT BUSINESS SETTINGS */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-6 font-sans text-xs">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-cream-200 gap-3">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-medium text-charcoal-900">Branding & Hours</h2>
                    <p className="text-xs text-charcoal-800/60 mt-0.5">Configure live website brand content, opening hours, and contact details.</p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={settingsSaveState === 'saving'}
                    className={`px-5 py-2 rounded-md font-medium uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 min-w-[200px] focus:outline-none ${
                      settingsSaveState === 'saving'
                        ? 'bg-forest-950 text-cream-200 cursor-wait'
                        : settingsSaveState === 'saved'
                        ? 'bg-emerald-800 text-white'
                        : settingsSaveState === 'error'
                        ? 'bg-red-800 text-white'
                        : 'bg-forest-800 text-cream-50 hover:bg-forest-700'
                    }`}
                  >
                    {settingsSaveState === 'saving' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-saffron-400" />
                        <span>Saving…</span>
                      </>
                    ) : settingsSaveState === 'saved' ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300 animate-bounce" />
                        <span>Saved & Published</span>
                      </>
                    ) : settingsSaveState === 'error' ? (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-white" />
                        <span>Error Saving</span>
                      </>
                    ) : (
                      <span>Save & Publish Changes</span>
                    )}
                  </button>
                </div>

                {/* SECTION 1: IDENTITY */}
                <div className="space-y-3.5 pt-1">
                  <div className="flex items-center gap-2 border-b border-cream-200/80 pb-2">
                    <Shield className="w-3.5 h-3.5 text-forest-800 shrink-0" />
                    <h3 className="font-serif text-sm font-medium text-charcoal-900">Brand Identity</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Business Name</label>
                      <input
                        type="text"
                        value={settings.restaurant_name || ''}
                        onChange={(e) => setSettings({ ...settings, restaurant_name: e.target.value })}
                        className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800"
                      />
                    </div>

                    <div>
                      <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Category Subtitle</label>
                      <input
                        type="text"
                        value={settings.business_category || ''}
                        onChange={(e) => setSettings({ ...settings, business_category: e.target.value })}
                        className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800"
                        placeholder="Restaurant & Food Court"
                      />
                    </div>

                    <div>
                      <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Location Badge</label>
                      <input
                        type="text"
                        value={settings.location_badge || ''}
                        onChange={(e) => setSettings({ ...settings, location_badge: e.target.value })}
                        className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800"
                        placeholder="Lakhimpur Kheri • Beside Amrit Sarovar"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: HERO CONTENT */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center gap-2 border-b border-cream-200/80 pb-2">
                    <FileImage className="w-3.5 h-3.5 text-forest-800 shrink-0" />
                    <h3 className="font-serif text-sm font-medium text-charcoal-900">Hero Headlines</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Headline Line 1</label>
                      <input
                        type="text"
                        value={settings.hero_headline_line1 || ''}
                        onChange={(e) => setSettings({ ...settings, hero_headline_line1: e.target.value })}
                        className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800"
                      />
                    </div>

                    <div>
                      <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Headline Line 2</label>
                      <input
                        type="text"
                        value={settings.hero_headline_line2 || ''}
                        onChange={(e) => setSettings({ ...settings, hero_headline_line2: e.target.value })}
                        className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline || ''}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800"
                    />
                  </div>
                </div>

                {/* SECTION 3: BRAND ASSETS */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center gap-2 border-b border-cream-200/80 pb-2">
                    <ImageIcon className="w-3.5 h-3.5 text-forest-800 shrink-0" />
                    <h3 className="font-serif text-sm font-medium text-charcoal-900">Brand Media Assets</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <ImageUploader
                      value={settings.logo_image_url || ''}
                      onChange={(url) => setSettings({ ...settings, logo_image_url: url })}
                      label="Logo Asset"
                      helperText="Official restaurant logo"
                    />

                    <ImageUploader
                      value={settings.hero_image_url || ''}
                      onChange={(url) => setSettings({ ...settings, hero_image_url: url })}
                      label="Hero Background Asset"
                      helperText="Header banner photo"
                    />
                  </div>
                </div>

                {/* SECTION 4: CONTACT & HOURS */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center gap-2 border-b border-cream-200/80 pb-2">
                    <Clock className="w-3.5 h-3.5 text-forest-800 shrink-0" />
                    <h3 className="font-serif text-sm font-medium text-charcoal-900">Contact & Operating Hours</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Phone</label>
                      <input
                        type="text"
                        value={settings.phone || ''}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 font-mono focus:outline-none focus:border-forest-800"
                      />
                    </div>

                    <div>
                      <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">WhatsApp</label>
                      <input
                        type="text"
                        value={settings.whatsapp || ''}
                        onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                        className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 font-mono focus:outline-none focus:border-forest-800"
                      />
                    </div>

                    <div>
                      <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Email</label>
                      <input
                        type="text"
                        value={settings.email || ''}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Physical Address</label>
                      <textarea
                        rows={2}
                        value={settings.address || ''}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800"
                      />
                    </div>

                    <div>
                      <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Opening Hours</label>
                      <input
                        type="text"
                        value={settings.opening_hours || ''}
                        onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
                        className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800"
                        placeholder="9:00 AM – 11:00 PM daily"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 5: ABOUT STORY */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center gap-2 border-b border-cream-200/80 pb-2">
                    <FileText className="w-3.5 h-3.5 text-forest-800 shrink-0" />
                    <h3 className="font-serif text-sm font-medium text-charcoal-900">About Content</h3>
                  </div>

                  <div>
                    <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Section Heading</label>
                    <input
                      type="text"
                      value={settings.about_heading || ''}
                      onChange={(e) => setSettings({ ...settings, about_heading: e.target.value })}
                      className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800"
                    />
                  </div>

                  <div>
                    <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Overview Text</label>
                    <textarea
                      rows={3}
                      value={settings.about_story || ''}
                      onChange={(e) => setSettings({ ...settings, about_story: e.target.value })}
                      className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800"
                    />
                  </div>
                </div>

                {/* SECTION 6: MAPS & NOTICES */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center gap-2 border-b border-cream-200/80 pb-2">
                    <MapPin className="w-3.5 h-3.5 text-forest-800 shrink-0" />
                    <h3 className="font-serif text-sm font-medium text-charcoal-900">Maps & Announcements</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Google Maps Link</label>
                      <input
                        type="text"
                        value={settings.google_maps_direct || ''}
                        onChange={(e) => setSettings({ ...settings, google_maps_direct: e.target.value })}
                        className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800"
                      />
                    </div>

                    <div>
                      <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Maps Embed URL</label>
                      <input
                        type="text"
                        value={settings.map_url || ''}
                        onChange={(e) => setSettings({ ...settings, map_url: e.target.value })}
                        className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-center">
                    <div className="sm:col-span-2">
                      <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Top Announcement Banner Text</label>
                      <input
                        type="text"
                        value={settings.announcement_text || ''}
                        onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
                        className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800"
                      />
                    </div>

                    <div>
                      <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Banner Visibility</label>
                      <select
                        value={settings.announcement_enabled || 'true'}
                        onChange={(e) => setSettings({ ...settings, announcement_enabled: e.target.value })}
                        className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs font-medium text-charcoal-900 focus:outline-none focus:border-forest-800"
                      >
                        <option value="true">Visible</option>
                        <option value="false">Hidden</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 7: SOCIAL CHANNELS */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center gap-2 border-b border-cream-200/80 pb-2">
                    <Share2 className="w-3.5 h-3.5 text-forest-800 shrink-0" />
                    <h3 className="font-serif text-sm font-medium text-charcoal-900">Social Media Links</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Facebook</label>
                      <input
                        type="text"
                        value={settings.social_facebook || ''}
                        onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
                        className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800"
                        placeholder="Optional"
                      />
                    </div>

                    <div>
                      <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Instagram</label>
                      <input
                        type="text"
                        value={settings.social_instagram || ''}
                        onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                        className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800"
                        placeholder="Optional"
                      />
                    </div>

                    <div>
                      <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">TripAdvisor</label>
                      <input
                        type="text"
                        value={settings.social_tripadvisor || ''}
                        onChange={(e) => setSettings({ ...settings, social_tripadvisor: e.target.value })}
                        className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 focus:outline-none focus:border-forest-800"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={settingsSaveState === 'saving'}
                    className={`px-6 py-2.5 rounded-md font-medium uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 ${
                      settingsSaveState === 'saving'
                        ? 'bg-forest-950 text-cream-200 cursor-wait'
                        : settingsSaveState === 'saved'
                        ? 'bg-emerald-800 text-white'
                        : 'bg-forest-800 text-cream-50 hover:bg-forest-700'
                    }`}
                  >
                    {settingsSaveState === 'saving' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-saffron-400" />
                        <span>Saving...</span>
                      </>
                    ) : settingsSaveState === 'saved' ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300 animate-bounce" />
                        <span>Saved & Published</span>
                      </>
                    ) : (
                      <span>Save & Publish Changes</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 5: UPLOADED IMAGES MANAGER */}
            {activeTab === 'uploads' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cream-200">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-medium text-charcoal-900">Media Assets</h2>
                    <p className="text-xs text-charcoal-800/60 font-sans mt-0.5">Upload and manage image assets in persistent storage.</p>
                  </div>
                </div>

                <div className="bg-cream-100/60 p-4 rounded-md border border-cream-300/80">
                  <ImageUploader
                    onChange={(url) => {
                      setToast({ type: 'success', message: `Uploaded: ${url}` });
                      loadData();
                    }}
                    label="Direct Image Upload"
                    helperText="Upload JPG, PNG, or WebP assets (<= 5 MB)"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-base font-medium text-charcoal-900">Uploaded Files in Active Use</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Array.from(new Set([
                      settings.logo_image_url,
                      settings.hero_image_url,
                      ...gallery.map(g => g.imageUrl),
                      ...menuItems.map(m => m.imageUrl)
                    ].filter((url): url is string => !!url && url.startsWith('/uploads/')))).map((url) => {
                      const filename = url.replace('/uploads/', '');
                      return (
                        <div key={url} className="p-2.5 bg-cream-100/60 rounded-md border border-cream-300/80 flex items-center justify-between gap-2.5 relative">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img src={url} alt={filename} className="w-10 h-10 object-cover rounded bg-charcoal-950 shrink-0" />
                            <div className="min-w-0">
                              <p className="font-mono text-xs text-charcoal-900 truncate font-medium">{filename}</p>
                              <p className="text-[9px] text-emerald-800 font-semibold uppercase mt-0.5">Active Use</p>
                            </div>
                          </div>

                          <div className="relative shrink-0">
                            <button
                              onClick={() => setActiveDeleteConfirm({
                                type: 'upload',
                                id: filename,
                                title: `Delete image "${filename}"?`
                              })}
                              className="p-1.5 rounded text-stone-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                              title="Delete Uploaded File"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {activeDeleteConfirm?.type === 'upload' && activeDeleteConfirm.id === filename && (
                              <InlineConfirm
                                isOpen={true}
                                title={activeDeleteConfirm.title}
                                message="Checks will verify this asset is not active before removal."
                                confirmLabel="Delete"
                                align="right"
                                onConfirm={() => confirmDeleteUploadFile(filename)}
                                onCancel={() => setActiveDeleteConfirm(null)}
                              />
                            )}
                          </div>
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
          <div className="fixed inset-0 z-50 bg-charcoal-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-cream-50 rounded-lg p-5 max-w-md w-full border border-cream-300 shadow-xl">
              <div className="flex items-center justify-between mb-3 border-b border-cream-200 pb-2">
                <h3 className="font-serif text-lg font-medium text-charcoal-900">{editingCategory.id ? 'Edit Category' : 'Add Category'}</h3>
                <button onClick={() => setShowCategoryModal(false)} className="text-charcoal-800/60 hover:text-charcoal-900 p-1"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-3 font-sans text-xs">
                <div>
                  <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900"
                    placeholder="e.g. Starters & Tandoor"
                  />
                </div>

                <div>
                  <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">URL Slug</label>
                  <input
                    type="text"
                    value={editingCategory.slug || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                    className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900"
                    placeholder="Auto-generated if left blank"
                  />
                </div>

                <div>
                  <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Description</label>
                  <textarea
                    rows={2}
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900"
                    placeholder="Short summary for menu header"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Display Order</label>
                    <input
                      type="number"
                      value={editingCategory.displayOrder || 1}
                      onChange={(e) => setEditingCategory({ ...editingCategory, displayOrder: parseInt(e.target.value) || 1 })}
                      className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900"
                    />
                  </div>

                  <div className="flex items-center pt-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer font-medium uppercase text-[10px] tracking-wider text-charcoal-800">
                      <input
                        type="checkbox"
                        checked={editingCategory.isActive !== false}
                        onChange={(e) => setEditingCategory({ ...editingCategory, isActive: e.target.checked })}
                      />
                      <span>Active</span>
                    </label>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-cream-200">
                  <button type="button" onClick={() => setShowCategoryModal(false)} className="px-3 py-1.5 rounded bg-cream-200 text-charcoal-800 font-medium">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded bg-forest-800 text-cream-50 font-medium hover:bg-forest-700">Save Category</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Menu Item Modal */}
        {showMenuModal && (
          <div className="fixed inset-0 z-50 bg-charcoal-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-cream-50 rounded-lg p-5 max-w-lg w-full border border-cream-300 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-3 border-b border-cream-200 pb-2">
                <h3 className="font-serif text-lg font-medium text-charcoal-900">{editingMenuItem.id ? 'Edit Dish' : 'Add Dish'}</h3>
                <button onClick={() => setShowMenuModal(false)} className="text-charcoal-800/60 hover:text-charcoal-900 p-1"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSaveMenuItem} className="space-y-3 font-sans text-xs">
                <div>
                  <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={editingMenuItem.name}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                    className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900"
                  />
                </div>

                <div>
                  <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Description</label>
                  <textarea
                    rows={2}
                    value={editingMenuItem.description}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })}
                    className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Price (₹) *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={editingMenuItem.rawPrice ?? String(editingMenuItem.price ?? '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingMenuItem({
                          ...editingMenuItem,
                          rawPrice: val,
                          price: val === '' ? 0 : parseFloat(val) || 0
                        });
                      }}
                      onBlur={() => {
                        if (!editingMenuItem.rawPrice || parseFloat(editingMenuItem.rawPrice) <= 0) {
                          setEditingMenuItem({ ...editingMenuItem, rawPrice: String(editingMenuItem.price || 100) });
                        }
                      }}
                      className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 font-mono"
                      placeholder="e.g. 150"
                    />
                  </div>

                  <div>
                    <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Category *</label>
                    <select
                      value={editingMenuItem.categoryId}
                      onChange={(e) => setEditingMenuItem({ ...editingMenuItem, categoryId: parseInt(e.target.value) })}
                      className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-1">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-xs text-charcoal-800">
                    <input
                      type="checkbox"
                      checked={editingMenuItem.isVegetarian}
                      onChange={(e) => setEditingMenuItem({ ...editingMenuItem, isVegetarian: e.target.checked })}
                    />
                    <span>Vegetarian</span>
                  </label>

                  <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-xs text-charcoal-800">
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
                  helperText="Upload dish photograph"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Image Alt Text</label>
                    <input
                      type="text"
                      value={editingMenuItem.imageAltText || ''}
                      onChange={(e) => setEditingMenuItem({ ...editingMenuItem, imageAltText: e.target.value })}
                      className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900"
                      placeholder="Descriptive image alt text"
                    />
                  </div>

                  <div>
                    <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Image Source Type</label>
                    <select
                      value={editingMenuItem.imageSourceType || 'OWNER_PHOTO'}
                      onChange={(e) => setEditingMenuItem({ ...editingMenuItem, imageSourceType: e.target.value })}
                      className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 font-medium"
                    >
                      <option value="OWNER_PHOTO">OWNER_PHOTO (Official)</option>
                      <option value="AI_ILLUSTRATIVE">AI_ILLUSTRATIVE (Temporary)</option>
                      <option value="EXTERNAL_APPROVED">EXTERNAL_APPROVED (Licensed)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-cream-200">
                  <button type="button" onClick={() => setShowMenuModal(false)} className="px-3 py-1.5 rounded bg-cream-200 text-charcoal-800 font-medium">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded bg-forest-800 text-cream-50 font-medium hover:bg-forest-700">Save Dish</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Gallery Modal */}
        {showGalleryModal && (
          <div className="fixed inset-0 z-50 bg-charcoal-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-cream-50 rounded-lg p-5 max-w-md w-full border border-cream-300 shadow-xl">
              <div className="flex items-center justify-between mb-3 border-b border-cream-200 pb-2">
                <h3 className="font-serif text-lg font-medium text-charcoal-900">Add Gallery Image</h3>
                <button onClick={() => setShowGalleryModal(false)} className="text-charcoal-800/60 hover:text-charcoal-900 p-1"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSaveGalleryImage} className="space-y-3 font-sans text-xs">
                <div>
                  <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Title *</label>
                  <input
                    type="text"
                    required
                    value={newGalleryImage.title}
                    onChange={(e) => setNewGalleryImage({ ...newGalleryImage, title: e.target.value })}
                    className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900"
                  />
                </div>

                <div>
                  <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Category *</label>
                  <select
                    value={newGalleryImage.category}
                    onChange={(e) => setNewGalleryImage({ ...newGalleryImage, category: e.target.value })}
                    className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900 font-medium"
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
                  helperText="Upload official photograph"
                />

                <div>
                  <label className="font-medium uppercase text-[10px] tracking-wider block mb-1 text-charcoal-800">Caption</label>
                  <input
                    type="text"
                    value={newGalleryImage.caption}
                    onChange={(e) => setNewGalleryImage({ ...newGalleryImage, caption: e.target.value })}
                    className="w-full p-2 bg-cream-100/80 border border-cream-300 rounded text-xs text-charcoal-900"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-cream-200">
                  <button type="button" onClick={() => setShowGalleryModal(false)} className="px-3 py-1.5 rounded bg-cream-200 text-charcoal-800 font-medium">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded bg-forest-800 text-cream-50 font-medium hover:bg-forest-700">Add Photo</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

