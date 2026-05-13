/**
 * ADMIN SERVICES PAGE
 * ====================
 */

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, X, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  AdminService,
  VisibilityStatus,
  getAdminServices,
  createService,
  updateService,
  deleteService,
  reorderServices,
} from '../adminStore';
import {
  BilingualInput,
  VisibilitySelect,
  ImageUpload,
  Modal,
  ConfirmDialog,
} from '../components';

// Sortable row component for drag-and-drop
const SortableServiceItem: React.FC<{
  service: AdminService;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ service, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: service.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
        service.visibility_status !== 'visible' ? 'opacity-60' : ''
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {service.image_url ? (
          <img src={service.image_url} alt={service.title_en} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No img</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{service.title_en}</h3>
        <p className="text-sm text-gray-500 truncate">/{service.slug}</p>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        service.visibility_status === 'visible' ? 'bg-green-100 text-green-700' :
        service.visibility_status === 'coming_soon' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
      }`}>
        {service.visibility_status === 'visible' ? 'Visible' :
         service.visibility_status === 'coming_soon' ? 'Coming Soon' : 'Hidden'}
      </div>
      {/* Brand badge */}
      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
        service.brand === 'skylum'
          ? 'bg-blue-100 text-blue-700'
          : 'bg-teal-100 text-teal-700'
      }`}>
        {service.brand || 'hwood'}
      </span>
      <div className="w-6 h-6 rounded-full border-2 border-white shadow" style={{ backgroundColor: service.accent_color || '#005f5f' }} />
      <div className="flex items-center gap-2">
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

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const [editingService, setEditingService] = useState<AdminService | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
const [formData, setFormData] = useState<{
    slug: string;
    title_en: string;
    title_he: string;
    subtitle_en: string;
    subtitle_he: string;
    description_en: string;
    description_he: string;
    cta_text_en: string;
    cta_text_he: string;
    image_url: string;
    hero_image_url: string;
    accent_color: string;
    visibility_status: VisibilityStatus;
    brand: 'hwood' | 'skylum';
    order_type: string;
  }>({
    slug: '',
    title_en: '',
    title_he: '',
    subtitle_en: '',
    subtitle_he: '',
    description_en: '',
    description_he: '',
    cta_text_en: 'Learn more',
    cta_text_he: 'לפרטים נוספים',
    image_url: '',
    hero_image_url: '',
    accent_color: '#005f5f',
    visibility_status: 'visible',
    brand: 'hwood',
    order_type: 'browse-and-order',
  });

  const loadServices = async () => {
    try {
      const data = await getAdminServices();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openNewModal = () => {
    setEditingService(null);
    setFormData({
      slug: '',
      title_en: '',
      title_he: '',
      subtitle_en: '',
      subtitle_he: '',
      description_en: '',
      description_he: '',
      cta_text_en: 'Learn more',
      cta_text_he: 'לפרטים נוספים',
      image_url: '',
      hero_image_url: '',
      accent_color: '#005f5f',
      visibility_status: 'visible',
      brand: 'hwood',
      order_type: 'browse-and-order',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: AdminService) => {
    setEditingService(service);
    setFormData({
      slug: service.slug,
      title_en: service.title_en,
      title_he: service.title_he || '',
      subtitle_en: service.subtitle_en || '',
      subtitle_he: service.subtitle_he || '',
      description_en: service.description_en || '',
      description_he: service.description_he || '',
      cta_text_en: service.cta_text_en || 'Learn more',
      cta_text_he: service.cta_text_he || 'לפרטים נוספים',
      image_url: service.image_url || '',
      hero_image_url: service.hero_image_url || '',
      accent_color: service.accent_color || '#005f5f',
      visibility_status: service.visibility_status,
      brand: service.brand || 'hwood',
      order_type: service.order_type || 'browse-and-order',
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title_en || !formData.slug) {
      alert('Title (EN) and Slug are required');
      return;
    }

    setSaving(true);
    try {
      if (editingService) {
        await updateService(editingService.id, formData);
      } else {
        await createService({
          ...formData,
          sort_order: services.length,
        });
      }
      await loadServices();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save service:', error);
      alert('Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      await loadServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
      alert('Failed to delete service. It may have subservices.');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
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
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--fg-1)', letterSpacing: '-0.01em', margin: 0 }}>Services</h2>
          <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 3 }}>Manage service pages and their visibility</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={openNewModal}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6, border: 'none', background: 'var(--brand)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {services.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No services yet</p>
            <button
              onClick={openNewModal}
              className="text-[#005f5f] hover:underline"
            >
              Create your first service
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={async (event: DragEndEvent) => {
              const { active, over } = event;
              if (over && active.id !== over.id) {
                const oldIndex = services.findIndex(s => s.id === active.id);
                const newIndex = services.findIndex(s => s.id === over.id);
                const reordered = arrayMove(services, oldIndex, newIndex);
                setServices(reordered);
                await reorderServices(reordered.map(s => s.id));
              }
            }}
          >
            <SortableContext items={services.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="divide-y divide-gray-100">
                {services.map((service) => (
                  <SortableServiceItem
                    key={service.id}
                    service={service}
                    onEdit={() => openEditModal(service)}
                    onDelete={() => setDeleteConfirm(service.id)}
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
        title={editingService ? 'Edit Service' : 'New Service'}
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
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
                placeholder="service-slug"
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
            <p className="text-xs text-gray-500 mt-1">URL: /services/{formData.slug || 'slug'}</p>
          </div>

          {/* Title */}
          <BilingualInput
            label="Title"
            nameEn="title_en"
            nameHe="title_he"
            valueEn={formData.title_en}
            valueHe={formData.title_he}
            onChangeEn={(v) => setFormData({ ...formData, title_en: v })}
            onChangeHe={(v) => setFormData({ ...formData, title_he: v })}
            required
            placeholder="Service title"
          />

          {/* Subtitle / Technical Label */}
          <BilingualInput
            label="Subtitle (Technical Label)"
            nameEn="subtitle_en"
            nameHe="subtitle_he"
            valueEn={formData.subtitle_en}
            valueHe={formData.subtitle_he}
            onChangeEn={(v) => setFormData({ ...formData, subtitle_en: v })}
            onChangeHe={(v) => setFormData({ ...formData, subtitle_he: v })}
            placeholder="e.g., Cabinet Systems, CNC Machining"
            helpText="Short technical descriptor shown above the title"
          />

          {/* Description */}
          <BilingualInput
            label="Description"
            nameEn="description_en"
            nameHe="description_he"
            valueEn={formData.description_en}
            valueHe={formData.description_he}
            onChangeEn={(v) => setFormData({ ...formData, description_en: v })}
            onChangeHe={(v) => setFormData({ ...formData, description_he: v })}
            type="textarea"
            placeholder="Brief description of the service"
          />

          {/* CTA Text */}
          <BilingualInput
            label="Button Text (CTA)"
            nameEn="cta_text_en"
            nameHe="cta_text_he"
            valueEn={formData.cta_text_en}
            valueHe={formData.cta_text_he}
            onChangeEn={(v) => setFormData({ ...formData, cta_text_en: v })}
            onChangeHe={(v) => setFormData({ ...formData, cta_text_he: v })}
            placeholder="e.g., Learn more, View catalog"
            helpText="Text shown on the service card button"
          />

          {/* Images */}
          <div className="grid grid-cols-2 gap-6">
            <ImageUpload
              label="Card Image"
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              folder="services"
              helpText="Shown on service cards (800×600 recommended)"
            />
            <ImageUpload
              label="Hero Image"
              value={formData.hero_image_url}
              onChange={(url) => setFormData({ ...formData, hero_image_url: url })}
              folder="services"
              helpText="Full-width banner (1920×600 recommended)"
            />
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accent Color
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={formData.accent_color}
                onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                className="w-12 h-12 rounded-lg cursor-pointer border-0"
              />
              <input
                type="text"
                value={formData.accent_color}
                onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="#005f5f"
              />
            </div>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <div className="flex gap-3">
              {(['hwood', 'skylum'] as const).map(b => (
                <button key={b} type="button"
                  onClick={() => setFormData({ ...formData, brand: b })}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    formData.brand === b
                      ? 'border-[#005f5f] bg-[#005f5f]/10 text-[#005f5f]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                  {b === 'skylum' ? 'Skylum' : 'HWOOD'}
                </button>
              ))}
            </div>
          </div>

          {/* Order Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
            <select
              value={formData.order_type}
              onChange={e => setFormData({ ...formData, order_type: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
            >
              <option value="browse-and-order">Browse &amp; Order</option>
              <option value="send-file-and-process">Send File &amp; Process</option>
              <option value="describe-and-request">Describe &amp; Request</option>
              <option value="informational">Informational</option>
            </select>
          </div>

          {/* Visibility */}
          <VisibilitySelect
            value={formData.visibility_status}
            onChange={(v) => setFormData({ ...formData, visibility_status: v as any })}
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
              {saving ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Service"
        message="Are you sure you want to delete this service? This will also delete all subservices, categories, and products under it. This action cannot be undone."
        confirmText="Delete"
        danger
      />
    </div>
  );
};
