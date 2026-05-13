/**
 * ADMIN HERO SLIDES PAGE
 * =======================
 * Max 3 slides with video URL and image upload
 */

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, GripVertical, Play, Image as ImageIcon } from 'lucide-react';
import {
  AdminHeroSlide,
  getAdminHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} from '../adminStore';
import {
  BilingualInput,
  ImageUpload,
  Modal,
  ConfirmDialog,
} from '../components';

export const AdminHeroSlides: React.FC = () => {
  const [slides, setSlides] = useState<AdminHeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<AdminHeroSlide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title_en: '',
    title_he: '',
    subtitle_en: '',
    subtitle_he: '',
    image_url: '',
    video_url: '',
    cta_text_en: '',
    cta_text_he: '',
    cta_link: '',
    is_visible: true,
  });

  const loadData = async () => {
    try {
      const data = await getAdminHeroSlides();
      setSlides(data);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewModal = () => {
    if (slides.length >= 3) {
      alert('Maximum 3 hero slides allowed');
      return;
    }
    setEditingItem(null);
    setFormData({
      title_en: '',
      title_he: '',
      subtitle_en: '',
      subtitle_he: '',
      image_url: '',
      video_url: '',
      cta_text_en: '',
      cta_text_he: '',
      cta_link: '',
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: AdminHeroSlide) => {
    setEditingItem(item);
    setFormData({
      title_en: item.title_en,
      title_he: item.title_he || '',
      subtitle_en: item.subtitle_en || '',
      subtitle_he: item.subtitle_he || '',
      image_url: item.image_url || '',
      video_url: item.video_url || '',
      cta_text_en: item.cta_text_en || '',
      cta_text_he: item.cta_text_he || '',
      cta_link: item.cta_link || '',
      is_visible: item.is_visible,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title_en) {
      alert('Title (EN) is required');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await updateHeroSlide(editingItem.id, formData);
      } else {
        await createHeroSlide({
          ...formData,
          sort_order: slides.length,
        });
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save slide');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHeroSlide(id);
      await loadData();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete slide');
    }
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
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--fg-1)', letterSpacing: '-0.01em', margin: 0 }}>Hero Slides</h2>
          <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 3 }}>Homepage hero carousel (max 3 slides)</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={openNewModal}
            disabled={slides.length >= 3}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6, border: 'none', background: 'var(--brand)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: slides.length >= 3 ? 'not-allowed' : 'pointer', opacity: slides.length >= 3 ? 0.5 : 1 }}
          >
            <Plus className="w-4 h-4" />
            Add Slide ({slides.length}/3)
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
        <strong>Layout:</strong> Left side = Video (10s loop, muted autoplay), Right side = Image. 
        If no video URL is provided, the image will be used on both sides.
      </div>

      {/* List */}
      <div className="space-y-4">
        {slides.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-500 mb-4">No hero slides yet</p>
            <button onClick={openNewModal} className="text-[#005f5f] hover:underline">
              Create your first slide
            </button>
          </div>
        ) : (
          slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                !slide.is_visible ? 'opacity-60' : ''
              }`}
            >
              <div className="flex">
                {/* Preview */}
                <div className="w-80 h-48 flex flex-shrink-0">
                  {/* Video side */}
                  <div className="w-1/2 bg-gray-900 flex items-center justify-center">
                    {slide.video_url ? (
                      <Play className="w-8 h-8 text-white/50" />
                    ) : slide.image_url ? (
                      <img src={slide.image_url} alt="" className="w-full h-full object-cover opacity-60" />
                    ) : (
                      <div className="text-white/30 text-xs">No video</div>
                    )}
                  </div>
                  {/* Image side */}
                  <div className="w-1/2 bg-gray-200">
                    {slide.image_url ? (
                      <img src={slide.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-gray-500">Slide {index + 1}</span>
                        <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                          slide.is_visible 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {slide.is_visible ? 'Visible' : 'Hidden'}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {slide.title_en}
                      </h3>
                      <p className="text-gray-500 text-sm mb-3">
                        {slide.subtitle_en}
                      </p>
                      {slide.cta_text_en && (
                        <span className="inline-block px-3 py-1 bg-[#005f5f] text-white text-sm rounded">
                          {slide.cta_text_en} → {slide.cta_link}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="cursor-grab text-gray-400 mr-2">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <button
                        onClick={() => openEditModal(slide)}
                        className="p-2 text-gray-500 hover:text-[#005f5f] hover:bg-[#005f5f]/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(slide.id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Slide' : 'New Slide'}
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
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
            type="textarea"
          />

          <div className="grid grid-cols-2 gap-6">
            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL (Left Side)
              </label>
              <input
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://example.com/video.mp4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Direct MP4 link. 10s loop, muted autoplay.
              </p>
            </div>

            {/* Image Upload */}
            <ImageUpload
              label="Image (Right Side)"
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              folder="hero"
              helpText="1920×1080 recommended"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <BilingualInput
              label="CTA Button Text"
              nameEn="cta_text_en"
              nameHe="cta_text_he"
              valueEn={formData.cta_text_en}
              valueHe={formData.cta_text_he}
              onChangeEn={(v) => setFormData({ ...formData, cta_text_en: v })}
              onChangeHe={(v) => setFormData({ ...formData, cta_text_he: v })}
              placeholder="Explore More"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Link
              </label>
              <input
                type="text"
                value={formData.cta_link}
                onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                placeholder="/services/modular-cabinet-systems"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Internal link only (starts with /)</p>
            </div>
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="slide_visible"
              checked={formData.is_visible}
              onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
              className="w-4 h-4 text-[#005f5f] rounded"
            />
            <label htmlFor="slide_visible" className="text-sm text-gray-700">
              Visible on homepage
            </label>
          </div>

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
              {saving ? 'Saving...' : 'Save Slide'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Slide"
        message="Are you sure? This action cannot be undone."
        confirmText="Delete"
        danger
      />
    </div>
  );
};
