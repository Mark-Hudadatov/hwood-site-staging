/**
 * ADMIN STORIES PAGE
 * ===================
 * Full articles with rich text editor
 */

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, Settings } from 'lucide-react';
import {
  AdminStory,
  StoryType,
  getAdminStories,
  getStoryTypes,
  createStory,
  updateStory,
  deleteStory,
  updateStoryType,
} from '../adminStore';
import {
  BilingualInput,
  ImageUpload,
  RichTextEditor,
  Modal,
  ConfirmDialog,
} from '../components';

export const AdminStories: React.FC = () => {
  const [stories, setStories] = useState<AdminStory[]>([]);
  const [storyTypes, setStoryTypes] = useState<StoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<AdminStory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTypesModalOpen, setIsTypesModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    slug: '',
    title_en: '',
    title_he: '',
    date: new Date().toISOString().split('T')[0],
    type: 'EVENTS',
    type_id: '',
    image_url: '',
    excerpt_en: '',
    excerpt_he: '',
    content_en: '',
    content_he: '',
    is_visible: true,
  });

  const loadData = async () => {
    try {
      const [storiesData, typesData] = await Promise.all([
        getAdminStories(),
        getStoryTypes(),
      ]);
      setStories(storiesData);
      setStoryTypes(typesData);
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
      slug: '',
      title_en: '',
      title_he: '',
      date: new Date().toISOString().split('T')[0],
      type: 'EVENTS',
      type_id: storyTypes[0]?.id || '',
      image_url: '',
      excerpt_en: '',
      excerpt_he: '',
      content_en: '',
      content_he: '',
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: AdminStory) => {
    setEditingItem(item);
    setFormData({
      slug: item.slug,
      title_en: item.title_en,
      title_he: item.title_he || '',
      date: item.date,
      type: item.type,
      type_id: item.type_id || '',
      image_url: item.image_url || '',
      excerpt_en: item.excerpt_en || '',
      excerpt_he: item.excerpt_he || '',
      content_en: item.content_en || '',
      content_he: item.content_he || '',
      is_visible: item.is_visible,
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
      if (editingItem) {
        await updateStory(editingItem.id, formData);
      } else {
        await createStory(formData);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save story');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStory(id);
      await loadData();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete story');
    }
  };

  const handleUpdateType = async (id: string, name: string) => {
    try {
      await updateStoryType(id, name);
      await loadData();
    } catch (error) {
      console.error('Failed to update type:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const getTypeName = (typeId: string) => {
    return storyTypes.find(t => t.id === typeId)?.name || 'Unknown';
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
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--fg-1)', letterSpacing: '-0.01em', margin: 0 }}>Stories</h2>
          <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 3 }}>News, events, and customer stories</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => setIsTypesModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6, border: '1px solid var(--border-1)', background: '#fff', color: 'var(--fg-1)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
          >
            <Settings className="w-4 h-4" />
            Manage Types
          </button>
          <button
            onClick={openNewModal}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6, border: 'none', background: 'var(--brand)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus className="w-4 h-4" />
            Add Story
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {stories.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No stories yet</p>
            <button onClick={openNewModal} className="text-[#005f5f] hover:underline">
              Create your first story
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {stories.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  !item.is_visible ? 'opacity-60' : ''
                }`}
              >
                <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title_en} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{item.title_en}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString()} • /stories/{item.slug}
                  </p>
                </div>

                <div className="px-3 py-1 rounded-full text-xs font-medium bg-[#005f5f]/10 text-[#005f5f]">
                  {item.type_id ? getTypeName(item.type_id) : item.type}
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.is_visible 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {item.is_visible ? 'Visible' : 'Hidden'}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-gray-500 hover:text-[#005f5f] hover:bg-[#005f5f]/10 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(item.id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Story' : 'New Story'}
        size="xl"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
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
                    placeholder="story-slug"
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
                <p className="text-xs text-gray-500 mt-1">URL: /stories/{formData.slug || 'slug'}</p>
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

              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type_id}
                    onChange={(e) => {
                      const type = storyTypes.find(t => t.id === e.target.value);
                      setFormData({ 
                        ...formData, 
                        type_id: e.target.value,
                        type: type?.name || 'EVENTS'
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
                  >
                    {storyTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <BilingualInput
                label="Excerpt"
                nameEn="excerpt_en"
                nameHe="excerpt_he"
                valueEn={formData.excerpt_en}
                valueHe={formData.excerpt_he}
                onChangeEn={(v) => setFormData({ ...formData, excerpt_en: v })}
                onChangeHe={(v) => setFormData({ ...formData, excerpt_he: v })}
                type="textarea"
                placeholder="Brief summary shown on cards"
                helpText="Max 200 characters"
              />

              {/* Visibility */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_visible"
                  checked={formData.is_visible}
                  onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                  className="w-4 h-4 text-[#005f5f] rounded"
                />
                <label htmlFor="is_visible" className="text-sm text-gray-700">
                  Visible on website
                </label>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <ImageUpload
                label="Cover Image"
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="stories"
                helpText="Recommended: 800×600px"
              />
            </div>
          </div>

          {/* Full Content Editor */}
          <RichTextEditor
            label="Article Content"
            valueEn={formData.content_en}
            valueHe={formData.content_he}
            onChangeEn={(v) => setFormData({ ...formData, content_en: v })}
            onChangeHe={(v) => setFormData({ ...formData, content_he: v })}
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
              {saving ? 'Saving...' : 'Save Story'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Types Management Modal */}
      <Modal
        isOpen={isTypesModalOpen}
        onClose={() => setIsTypesModalOpen(false)}
        title="Manage Story Types"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Rename the story type labels. These appear as badges on story cards.
          </p>
          {storyTypes.map((type) => (
            <div key={type.id} className="flex items-center gap-3">
              <input
                type="text"
                defaultValue={type.name}
                onBlur={(e) => {
                  if (e.target.value !== type.name) {
                    handleUpdateType(type.id, e.target.value);
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
              />
            </div>
          ))}
          <p className="text-xs text-gray-400">
            Changes save automatically when you leave the field.
          </p>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Story"
        message="Are you sure? This action cannot be undone."
        confirmText="Delete"
        danger
      />
    </div>
  );
};
