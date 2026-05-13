/**
 * ADMIN STORE - Supabase Operations
 * ==================================
 * All admin CRUD operations against Supabase
 */

import { supabase } from '../services/supabase';

// ============================================================================
// TYPES
// ============================================================================

export type VisibilityStatus = 'visible' | 'hidden' | 'coming_soon' | 'not_in_stock';

export interface AdminService {
  id: string;
  slug: string;
  title_en: string;
  title_he?: string;
  subtitle_en?: string;
  subtitle_he?: string;
  description_en?: string;
  description_he?: string;
  cta_text_en?: string;
  cta_text_he?: string;
  image_url?: string;
  hero_image_url?: string;
  accent_color?: string;
  visibility_status: VisibilityStatus;
  sort_order: number;
  brand?: 'hwood' | 'skylum';
  order_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminSubservice {
  id: string;
  service_id: string;
  slug: string;
  title_en: string;
  title_he?: string;
  description_en?: string;
  description_he?: string;
  image_url?: string;
  hero_image_url?: string;
  visibility_status: VisibilityStatus;
  sort_order: number;
}

export interface AdminCategory {
  id: string;
  subservice_id: string;
  slug: string;
  title_en: string;
  title_he?: string;
  description_en?: string;
  description_he?: string;
  visibility_status: VisibilityStatus;
  sort_order: number;
}

export interface AdminProduct {
  id: string;
  category_id: string;
  slug: string;
  title_en: string;
  title_he?: string;
  subtitle_en?: string;
  subtitle_he?: string;
  description_en?: string;
  description_he?: string;
  image_url?: string;
  gallery_images?: string[];
  video_url?: string;
  features_en?: string[];
  features_he?: string[];
  specifications?: { label: string; value: string; unit?: string }[];
  has_3d_view?: boolean;
  model_url?: string;
  visibility_status: VisibilityStatus;
  is_featured?: boolean;
  sort_order: number;
}

export interface AdminStory {
  id: string;
  slug: string;
  title_en: string;
  title_he?: string;
  date: string;
  type: string;
  type_id?: string;
  image_url?: string;
  excerpt_en?: string;
  excerpt_he?: string;
  content_en?: string;
  content_he?: string;
  is_visible: boolean;
}

export interface AdminHeroSlide {
  id: string;
  title_en: string;
  title_he?: string;
  subtitle_en?: string;
  subtitle_he?: string;
  image_url?: string;
  video_url?: string;
  cta_text_en?: string;
  cta_text_he?: string;
  cta_link?: string;
  is_visible: boolean;
  sort_order: number;
}

export interface AdminCompanyInfo {
  id: number;
  name_en: string;
  name_he?: string;
  tagline_en?: string;
  tagline_he?: string;
  description_en?: string;
  description_he?: string;
  phone?: string;
  email?: string;
  address_en?: string;
  address_he?: string;
}

export interface AdminSocialLink {
  id: string;
  platform: string;
  url?: string;
  is_visible: boolean;
  sort_order: number;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface QuoteSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  project_type?: string;
  budget_range?: string;
  timeline?: string;
  message?: string;
  product_interest?: string[];
  is_read: boolean;
  created_at: string;
}

export interface StoryType {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

// ============================================================================
// AUTH
// ============================================================================

export async function adminLogin(email: string, password: string): Promise<boolean> {
  // Simple auth check against admin_users table
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .eq('password_hash', password)
    .single();

  if (error || !data) {
    return false;
  }

  // Update last login
  await supabase
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', data.id);

  // Store session in localStorage
  localStorage.setItem('admin_session', JSON.stringify({
    email: data.email,
    name: data.name,
    loggedIn: true,
    timestamp: Date.now()
  }));

  return true;
}

export function isAdminLoggedIn(): boolean {
  const session = localStorage.getItem('admin_session');
  if (!session) return false;
  
  try {
    const parsed = JSON.parse(session);
    // Session valid for 7 days
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return parsed.loggedIn && (Date.now() - parsed.timestamp) < sevenDays;
  } catch {
    return false;
  }
}

export function adminLogout(): void {
  localStorage.removeItem('admin_session');
}

export function getAdminSession(): { email: string; name: string } | null {
  const session = localStorage.getItem('admin_session');
  if (!session) return null;
  try {
    const parsed = JSON.parse(session);
    return { email: parsed.email, name: parsed.name };
  } catch {
    return null;
  }
}

// ============================================================================
// SERVICES
// ============================================================================

export async function getAdminServices(): Promise<AdminService[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function createService(service: Partial<AdminService>): Promise<AdminService> {
  const { data, error } = await supabase
    .from('services')
    .insert([service])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateService(id: string, updates: Partial<AdminService>): Promise<AdminService> {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
}

export async function reorderServices(ids: string[]): Promise<void> {
  const updates = ids.map((id, index) => 
    supabase.from('services').update({ sort_order: index }).eq('id', id)
  );
  await Promise.all(updates);
}

// ============================================================================
// SUBSERVICES
// ============================================================================

export async function getAdminSubservices(): Promise<AdminSubservice[]> {
  const { data, error } = await supabase
    .from('subservices')
    .select('*')
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function createSubservice(subservice: Partial<AdminSubservice>): Promise<AdminSubservice> {
  const { data, error } = await supabase
    .from('subservices')
    .insert([subservice])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateSubservice(id: string, updates: Partial<AdminSubservice>): Promise<AdminSubservice> {
  const { data, error } = await supabase
    .from('subservices')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteSubservice(id: string): Promise<void> {
  const { error } = await supabase.from('subservices').delete().eq('id', id);
  if (error) throw error;
}

// ============================================================================
// CATEGORIES
// ============================================================================

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function createCategory(category: Partial<AdminCategory>): Promise<AdminCategory> {
  const { data, error } = await supabase
    .from('product_categories')
    .insert([category])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, updates: Partial<AdminCategory>): Promise<AdminCategory> {
  const { data, error } = await supabase
    .from('product_categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('product_categories').delete().eq('id', id);
  if (error) throw error;
}

export async function reorderSubservices(ids: string[]): Promise<void> {
  const updates = ids.map((id, index) => 
    supabase.from('subservices').update({ sort_order: index }).eq('id', id)
  );
  await Promise.all(updates);
}

export async function reorderCategories(ids: string[]): Promise<void> {
  const updates = ids.map((id, index) => 
    supabase.from('product_categories').update({ sort_order: index }).eq('id', id)
  );
  await Promise.all(updates);
}

export async function reorderProducts(ids: string[]): Promise<void> {
  const updates = ids.map((id, index) => 
    supabase.from('products').update({ sort_order: index }).eq('id', id)
  );
  await Promise.all(updates);
}

// ============================================================================
// PRODUCTS
// ============================================================================

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function createProduct(product: Partial<AdminProduct>): Promise<AdminProduct> {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, updates: Partial<AdminProduct>): Promise<AdminProduct> {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function duplicateProduct(id: string): Promise<AdminProduct> {
  const { data: original, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (fetchError || !original) throw fetchError;

  const newProduct = {
    ...original,
    id: undefined,
    slug: `${original.slug}-copy-${Date.now()}`,
    title_en: `${original.title_en} (Copy)`,
    title_he: original.title_he ? `${original.title_he} (העתק)` : undefined,
  };
  delete newProduct.id;
  delete newProduct.created_at;
  delete newProduct.updated_at;

  return createProduct(newProduct);
}

// ============================================================================
// STORIES
// ============================================================================

export async function getAdminStories(): Promise<AdminStory[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function createStory(story: Partial<AdminStory>): Promise<AdminStory> {
  const { data, error } = await supabase
    .from('stories')
    .insert([story])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateStory(id: string, updates: Partial<AdminStory>): Promise<AdminStory> {
  const { data, error } = await supabase
    .from('stories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteStory(id: string): Promise<void> {
  const { error } = await supabase.from('stories').delete().eq('id', id);
  if (error) throw error;
}

// Story Types
export async function getStoryTypes(): Promise<StoryType[]> {
  const { data, error } = await supabase
    .from('story_types')
    .select('*')
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function updateStoryType(id: string, name: string): Promise<void> {
  const { error } = await supabase
    .from('story_types')
    .update({ name })
    .eq('id', id);
  
  if (error) throw error;
}

// ============================================================================
// HERO SLIDES
// ============================================================================

export async function getAdminHeroSlides(): Promise<AdminHeroSlide[]> {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function createHeroSlide(slide: Partial<AdminHeroSlide>): Promise<AdminHeroSlide> {
  const { data, error } = await supabase
    .from('hero_slides')
    .insert([slide])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateHeroSlide(id: string, updates: Partial<AdminHeroSlide>): Promise<AdminHeroSlide> {
  const { data, error } = await supabase
    .from('hero_slides')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const { error } = await supabase.from('hero_slides').delete().eq('id', id);
  if (error) throw error;
}

// ============================================================================
// COMPANY INFO & SOCIAL
// ============================================================================

export async function getAdminCompanyInfo(): Promise<AdminCompanyInfo | null> {
  const { data, error } = await supabase
    .from('company_info')
    .select('*')
    .eq('id', 1)
    .single();
  
  if (error) return null;
  return data;
}

export async function updateCompanyInfo(updates: Partial<AdminCompanyInfo>): Promise<void> {
  const { error } = await supabase
    .from('company_info')
    .update(updates)
    .eq('id', 1);
  
  if (error) throw error;
}

export async function getSocialLinks(): Promise<AdminSocialLink[]> {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function updateSocialLink(id: string, updates: Partial<AdminSocialLink>): Promise<void> {
  const { error } = await supabase
    .from('social_links')
    .update(updates)
    .eq('id', id);
  
  if (error) throw error;
}

// ============================================================================
// SUBMISSIONS
// ============================================================================

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function markContactRead(id: string): Promise<void> {
  const { error } = await supabase
    .from('contact_submissions')
    .update({ is_read: true })
    .eq('id', id);
  
  if (error) throw error;
}

export async function getQuoteSubmissions(): Promise<QuoteSubmission[]> {
  const { data, error } = await supabase
    .from('quote_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function markQuoteRead(id: string): Promise<void> {
  const { error } = await supabase
    .from('quote_submissions')
    .update({ is_read: true })
    .eq('id', id);
  
  if (error) throw error;
}

// ============================================================================
// IMAGE UPLOAD
// ============================================================================

export async function uploadImage(file: File, folder: string = 'general'): Promise<string> {
  // Compress and resize image before upload
  const processedFile = await processImage(file);
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('images')
    .upload(fileName, processedFile, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  return publicUrl;
}

async function processImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // Max dimensions
      const maxWidth = 1920;
      const maxHeight = 1080;
      
      let { width, height } = img;
      
      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to process image'));
        },
        'image/jpeg',
        0.85 // 85% quality
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export async function deleteImage(url: string): Promise<void> {
  // Extract path from URL
  const path = url.split('/images/')[1];
  if (!path) return;

  const { error } = await supabase.storage.from('images').remove([path]);
  if (error) throw error;
}

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export async function getDashboardStats(): Promise<{
  services: number;
  subservices: number;
  categories: number;
  products: number;
  stories: number;
  unreadContacts: number;
  unreadQuotes: number;
}> {
  const [
    { count: services },
    { count: subservices },
    { count: categories },
    { count: products },
    { count: stories },
    { count: unreadContacts },
    { count: unreadQuotes },
  ] = await Promise.all([
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('subservices').select('*', { count: 'exact', head: true }),
    supabase.from('product_categories').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('stories').select('*', { count: 'exact', head: true }),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('quote_submissions').select('*', { count: 'exact', head: true }).eq('is_read', false),
  ]);

  return {
    services: services || 0,
    subservices: subservices || 0,
    categories: categories || 0,
    products: products || 0,
    stories: stories || 0,
    unreadContacts: unreadContacts || 0,
    unreadQuotes: unreadQuotes || 0,
  };
}
