/**
 * ADMIN SUBSERVICES PAGE
 * =======================
 */

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  AdminSubservice,
  AdminService,
  VisibilityStatus,
  getAdminSubservices,
  getAdminServices,
  createSubservice,
  updateSubservice,
  deleteSubservice,
  reorderSubservices,
} from '../adminStore';
import {
  BilingualInput,
  VisibilitySelect,
  ImageUpload,
  Modal,
  ConfirmDialog,
} from '../components';

// Sortable row for drag-and-drop
const SortableSubserviceItem: React.FC<{
  item: AdminSubservice;
  serviceName: string;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ item, serviceName, onEdit, onDelete }) => {
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
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{item.title_en}</h3>
        <p className="text-sm text-gray-500">{serviceName} → /{item.slug}</p>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        item.visibility_status === 'visible' ? 'bg-green-100 text-green-700' :
        item.visibility_status === 'coming_soon' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
      }`}>
        {item.visibility_status === 'visible' ? 'Visible' : item.visibility_status === 'coming_soon' ? 'Coming Soon' : 'Hidden'}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onEdit} className="p-2 text-gray-500 hover:text-[#005f5f] hover:bg-[#005f5f]/10 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
        <button onClick={onDelete} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

export const AdminSubservices: React.FC = () => {
  const [subservices, setSubservices] = useState<AdminSubservice[]>([]);
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const [editingItem, setEditingItem] = useState<AdminSubservice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterService, setFilterService] = useState<string>('all');

  const [formData, setFormData] = useState<{
    service_id: string;
    slug: string;
    title_en: string;
    title_he: string;
    description_en: string;
    description_he: string;
    image_url: string;
    hero_image_url: string;
    visibility_status: VisibilityStatus;
  }>({
    service_id: '',
    slug: '',
    title_en: '',
    title_he: '',
    description_en: '',
    description_he: '',
    image_url: '',
    hero_image_url: '',
    visibility_status: 'visible',
  });

  const loadData = async () => {
    try {
      const [subsData, svcData] = await Promise.all([
        getAdminSubservices(),
        getAdminServices(),
      ]);
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
      service_id: services[0]?.id || '',
      slug: '',
      title_en: '',
      title_he: '',
      description_en: '',
      description_he: '',
      image_url: '',
      hero_image_url: '',
      visibility_status: 'visible',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: AdminSubservice) => {
    setEditingItem(item);
    setFormData({
      service_id: item.service_id,
      slug: item.slug,
      title_en: item.title_en,
      title_he: item.title_he || '',
      description_en: item.description_en || '',
      description_he: item.description_he || '',
      image_url: item.image_url || '',
      hero_image_url: item.hero_image_url || '',
      visibility_status: item.visibility_status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title_en || !formData.slug || !formData.service_id) {
      alert('Title (EN), Slug, and Parent Service are required');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await updateSubservice(editingItem.id, formData);
      } else {
        const serviceSubservices = subservices.filter(s => s.service_id === formData.service_id);
        await createSubservice({
          ...formData,
          sort_order: serviceSubservices.length,
        });
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save subservice');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubservice(id);
      await loadData();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete. It may have categories.');
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const getServiceName = (serviceId: string) => {
    return services.find(s => s.id === serviceId)?.title_en || 'Unknown';
  };

  const filteredSubservices = filterService === 'all' 
    ? subservices 
    : subservices.filter(s => s.service_id === filterService);

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
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--fg-1)', letterSpacing: '-0.01em', margin: 0 }}>Subservices</h2>
          <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 3 }}>Manage subservice pages</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={openNewModal}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6, border: 'none', background: 'var(--brand)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus className="w-4 h-4" />
            Add Subservice
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-600">Filter by service:</label>
        <select
          value={filterService}
          onChange={(e) => setFilterService(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
        >
          <option value="all">All Services</option>
          {services.map(service => (
            <option key={service.id} value={service.id}>{service.title_en}</option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredSubservices.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No subservices found</p>
            <button onClick={openNewModal} className="text-[#005f5f] hover:underline">
              Create your first subservice
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={async (event: DragEndEvent) => {
              const { active, over } = event;
              if (over && active.id !== over.id) {
                const oldIndex = subservices.findIndex(s => s.id === active.id);
                const newIndex = subservices.findIndex(s => s.id === over.id);
                const reordered = arrayMove(subservices, oldIndex, newIndex);
                setSubservices(reordered);
                await reorderSubservices(reordered.map(s => s.id));
              }
            }}
          >
            <SortableContext items={filteredSubservices.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="divide-y divide-gray-100">
                {filteredSubservices.map((item) => (
                  <SortableSubserviceItem
                    key={item.id}
                    item={item}
                    serviceName={getServiceName(item.service_id)}
                    onEdit={() => openEditModal(item)}
                    onDelete={() => setDeleteConfirm(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Subservice' : 'New Subservice'}
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
          {/* Parent Service */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Service <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.service_id}
              onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
            >
              <option value="">Select a service...</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>{service.title_en}</option>
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
                placeholder="subservice-slug"
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
            placeholder="Subservice title"
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
            placeholder="Brief description"
          />

          <div className="grid grid-cols-2 gap-6">
            <ImageUpload
              label="Card Image"
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              folder="subservices"
            />
            <ImageUpload
              label="Hero Image"
              value={formData.hero_image_url}
              onChange={(url) => setFormData({ ...formData, hero_image_url: url })}
              folder="subservices"
            />
          </div>

          <VisibilitySelect
            value={formData.visibility_status}
            onChange={(v) => setFormData({ ...formData, visibility_status: v as any })}
          />

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
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Subservice"
        message="This will also delete all categories and products under it. This action cannot be undone."
        confirmText="Delete"
        danger
      />
    </div>
  );
};
