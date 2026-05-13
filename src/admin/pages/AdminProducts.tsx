/**
 * ADMIN PRODUCTS PAGE
 * ====================
 * Full CRUD with gallery, specs, features, video URL
 */

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, Copy, Search, X, Image as ImageIcon, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  AdminProduct,
  AdminCategory,
  AdminSubservice,
  AdminService,
  VisibilityStatus,
  getAdminProducts,
  getAdminCategories,
  getAdminSubservices,
  getAdminServices,
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
  reorderProducts,
} from '../adminStore';
import {
  BilingualInput,
  VisibilitySelect,
  ImageUpload,
  FeaturesEditor,
  SpecificationsEditor,
  Modal,
  ConfirmDialog,
} from '../components';

// Sortable row for drag-and-drop
const SortableProductItem: React.FC<{
  item: AdminProduct;
  breadcrumb: string;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}> = ({ item, breadcrumb, onEdit, onDelete, onDuplicate }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style}
      className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${item.visibility_status !== 'visible' ? 'opacity-60' : ''}`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title_en} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-6 h-6" /></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{item.title_en}</h3>
        <p className="text-sm text-gray-500 truncate">{breadcrumb}</p>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        item.visibility_status === 'visible' ? 'bg-green-100 text-green-700' :
        item.visibility_status === 'not_in_stock' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
      }`}>
        {item.visibility_status === 'visible' ? 'Visible' : item.visibility_status === 'not_in_stock' ? 'Out of Stock' : 'Hidden'}
      </div>
      <div className="flex items-center gap-1">
        <button onClick={onDuplicate} className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Duplicate">
          <Copy className="w-4 h-4" />
        </button>
        <button onClick={onEdit} className="p-2 text-gray-500 hover:text-[#005f5f] hover:bg-[#005f5f]/10 rounded-lg transition-colors">
          <Edit className="w-4 h-4" />
        </button>
        <button onClick={onDelete} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [subservices, setSubservices] = useState<AdminSubservice[]>([]);
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<AdminProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState<{
    category_id: string;
    slug: string;
    title_en: string;
    title_he: string;
    subtitle_en: string;
    subtitle_he: string;
    description_en: string;
    description_he: string;
    image_url: string;
    gallery_images: string[];
    video_url: string;
    features_en: string[];
    features_he: string[];
    specifications: { label: string; value: string; unit?: string }[];
    has_3d_view: boolean;
    model_url: string;
    visibility_status: VisibilityStatus;
    is_featured: boolean;
  }>({
    category_id: '',
    slug: '',
    title_en: '',
    title_he: '',
    subtitle_en: '',
    subtitle_he: '',
    description_en: '',
    description_he: '',
    image_url: '',
    gallery_images: [],
    video_url: '',
    features_en: [],
    features_he: [],
    specifications: [],
    has_3d_view: false,
    model_url: '',
    visibility_status: 'visible',
    is_featured: false,
  });

  const loadData = async () => {
    try {
      const [prodData, catData, subsData, svcData] = await Promise.all([
        getAdminProducts(),
        getAdminCategories(),
        getAdminSubservices(),
        getAdminServices(),
      ]);
      setProducts(prodData);
      setCategories(catData);
      setSubservices(subsData);
      setServices(svcData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewModal = () => {
    setEditingItem(null);
    setFormData({
      category_id: categories[0]?.id || '',
      slug: '',
      title_en: '',
      title_he: '',
      subtitle_en: '',
      subtitle_he: '',
      description_en: '',
      description_he: '',
      image_url: '',
      gallery_images: [],
      video_url: '',
      features_en: [],
      features_he: [],
      specifications: [],
      has_3d_view: false,
    model_url: '',
      visibility_status: 'visible',
      is_featured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: AdminProduct) => {
    setEditingItem(item);
    setFormData({
      category_id: item.category_id,
      slug: item.slug,
      title_en: item.title_en,
      title_he: item.title_he || '',
      subtitle_en: item.subtitle_en || '',
      subtitle_he: item.subtitle_he || '',
      description_en: item.description_en || '',
      description_he: item.description_he || '',
      image_url: item.image_url || '',
      gallery_images: item.gallery_images || [],
      video_url: item.video_url || '',
      features_en: item.features_en || [],
      features_he: item.features_he || [],
      specifications: item.specifications || [],
      has_3d_view: item.has_3d_view || false,
      model_url: item.model_url || '',
      visibility_status: item.visibility_status,
      is_featured: item.is_featured || false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title_en || !formData.slug || !formData.category_id) {
      alert('Title (EN), Slug, and Category are required');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await updateProduct(editingItem.id, formData);
      } else {
        const catProducts = products.filter(p => p.category_id === formData.category_id);
        await createProduct({
          ...formData,
          sort_order: catProducts.length,
        });
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      await loadData();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete product');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateProduct(id);
      await loadData();
    } catch (error) {
      console.error('Failed to duplicate:', error);
      alert('Failed to duplicate product');
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.title_en || 'Unknown';
  };

  const getBreadcrumb = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return '';
    const sub = subservices.find(s => s.id === cat.subservice_id);
    if (!sub) return cat.title_en;
    const svc = services.find(s => s.id === sub.service_id);
    return `${svc?.title_en || ''} → ${sub.title_en} → ${cat.title_en}`;
  };

  // Filter and search
  let filteredProducts = filterCategory === 'all' 
    ? products 
    : products.filter(p => p.category_id === filterCategory);
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.title_en.toLowerCase().includes(query) ||
      p.slug.toLowerCase().includes(query)
    );
  }

  // Group categories for dropdown
  const categoriesBySubservice = subservices.map(sub => {
    const svc = services.find(s => s.id === sub.service_id);
    return {
      subservice: sub,
      service: svc,
      categories: categories.filter(cat => cat.subservice_id === sub.id)
    };
  }).filter(group => group.categories.length > 0);

  // Gallery management
  const addGalleryImage = (url: string) => {
    if (formData.gallery_images.length >= 5) {
      alert('Maximum 5 gallery images');
      return;
    }
    setFormData({ ...formData, gallery_images: [...formData.gallery_images, url] });
  };

  const removeGalleryImage = (index: number) => {
    setFormData({
      ...formData,
      gallery_images: formData.gallery_images.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
        <div style={{ width: 24, height: 24, border: '2px solid var(--border-1)', borderTopColor: 'var(--brand)', borderRadius: 999, animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--fg-1)', letterSpacing: '-0.01em', margin: 0 }}>Products</h2>
          <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 3 }}>Manage product catalog</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={openNewModal}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6, border: 'none', background: 'var(--brand)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
        >
          <option value="all">All Categories</option>
          {categoriesBySubservice.map(group => (
            <optgroup key={group.subservice.id} label={`${group.service?.title_en} → ${group.subservice.title_en}`}>
              {group.categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.title_en}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No products found</p>
            <button onClick={openNewModal} className="text-[#005f5f] hover:underline">
              Create your first product
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={async (event: DragEndEvent) => {
              const { active, over } = event;
              if (over && active.id !== over.id) {
                const oldIndex = products.findIndex(p => p.id === active.id);
                const newIndex = products.findIndex(p => p.id === over.id);
                const reordered = arrayMove(products, oldIndex, newIndex);
                setProducts(reordered);
                await reorderProducts(reordered.map(p => p.id));
              }
            }}
          >
            <SortableContext items={filteredProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
              <div className="divide-y divide-gray-100">
                {filteredProducts.map((item) => (
                  <SortableProductItem
                    key={item.id}
                    item={item}
                    breadcrumb={getBreadcrumb(item.category_id)}
                    onEdit={() => openEditModal(item)}
                    onDelete={() => setDeleteConfirm(item.id)}
                    onDuplicate={() => handleDuplicate(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Product' : 'New Product'}
        size="xl"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
                >
                  <option value="">Select a category...</option>
                  {categoriesBySubservice.map(group => (
                    <optgroup key={group.subservice.id} label={`${group.service?.title_en} → ${group.subservice.title_en}`}>
                      {group.categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.title_en}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="product-slug"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, slug: generateSlug(formData.title_en) })}
                    className="px-4 py-2 text-sm text-[#005f5f] border border-[#005f5f] rounded-lg hover:bg-[#005f5f]/10"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <BilingualInput
                label="Title"
                nameEn="title_en"
                nameHe="title_he"
                valueEn={formData.title_en}
                valueHe={formData.title_he}
                onChangeEn={(v) => setFormData({ ...formData, title_en: v })}
                onChangeHe={(v) => setFormData({ ...formData, title_he: v })}
                required
              />

              <BilingualInput
                label="Subtitle"
                nameEn="subtitle_en"
                nameHe="subtitle_he"
                valueEn={formData.subtitle_en}
                valueHe={formData.subtitle_he}
                onChangeEn={(v) => setFormData({ ...formData, subtitle_en: v })}
                onChangeHe={(v) => setFormData({ ...formData, subtitle_he: v })}
                placeholder="Short tagline"
              />

              <BilingualInput
                label="Description"
                nameEn="description_en"
                nameHe="description_he"
                valueEn={formData.description_en}
                valueHe={formData.description_he}
                onChangeEn={(v) => setFormData({ ...formData, description_en: v })}
                onChangeHe={(v) => setFormData({ ...formData, description_he: v })}
                type="textarea"
              />

              <VisibilitySelect
                value={formData.visibility_status}
                onChange={(v) => setFormData({ ...formData, visibility_status: v as any })}
                type="product"
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Main Image */}
              <ImageUpload
                label="Main Image"
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="products"
              />

              {/* Gallery */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gallery Images ({formData.gallery_images.length}/5)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {formData.gallery_images.map((url, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                {formData.gallery_images.length < 5 && (
                  <ImageUpload
                    label=""
                    value=""
                    onChange={addGalleryImage}
                    folder="products/gallery"
                    helpText="Add gallery image"
                  />
                )}
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL
                </label>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://youtube.com/... or https://vimeo.com/..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">YouTube, Vimeo, or direct MP4 URL</p>
              </div>

              {/* 3D Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3D Model URL (.glb)
                </label>
                <input
                  type="url"
                  value={formData.model_url}
                  onChange={(e) => setFormData({ ...formData, model_url: e.target.value, has_3d_view: !!e.target.value })}
                  placeholder="https://your-supabase.co/storage/v1/object/public/images/models/model.glb"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">GLB file URL from Supabase Storage. 3D badge auto-enables when URL is set.</p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="has3d"
                  checked={formData.has_3d_view}
                  onChange={(e) => setFormData({ ...formData, has_3d_view: e.target.checked })}
                  className="w-4 h-4 text-[#005f5f] rounded"
                />
                <label htmlFor="has3d" className="text-sm text-gray-700">
                  Show 3D Viewer on product page
                </label>
              </div>
            </div>
          </div>

          {/* Features */}
          <FeaturesEditor
            label="Features"
            featuresEn={formData.features_en}
            featuresHe={formData.features_he}
            onChangeFeaturesEn={(f) => setFormData({ ...formData, features_en: f })}
            onChangeFeaturesHe={(f) => setFormData({ ...formData, features_he: f })}
          />

          {/* Specifications */}
          <SpecificationsEditor
            specifications={formData.specifications}
            onChange={(s) => setFormData({ ...formData, specifications: s })}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-[#005f5f] text-white rounded-lg hover:bg-[#004d4d] transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Product"
        message="Are you sure? This action cannot be undone."
        confirmText="Delete"
        danger
      />
    </div>
  );
};
