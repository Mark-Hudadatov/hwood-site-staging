/**
 * ADMIN PARTNERS PAGE
 * ====================
 * Manage partner/client logos for the homepage marquee
 */

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, GripVertical, ExternalLink } from 'lucide-react';
import { supabase } from '../../services/supabase';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  sort_order: number;
  is_visible: boolean;
}

export const AdminPartners: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    is_visible: true,
  });

  const loadPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Failed to load partners:', error);
      setMessage({ type: 'error', text: 'Failed to load partners. Make sure to run the SQL migration.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const openNewModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      logo_url: '',
      website_url: '',
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (partner: Partner) => {
    setEditingItem(partner);
    setFormData({
      name: partner.name,
      logo_url: partner.logo_url,
      website_url: partner.website_url || '',
      is_visible: partner.is_visible,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.logo_url) {
      setMessage({ type: 'error', text: 'Name and Logo URL are required' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('partners')
          .update({
            name: formData.name,
            logo_url: formData.logo_url,
            website_url: formData.website_url || null,
            is_visible: formData.is_visible,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        const maxOrder = partners.length > 0 ? Math.max(...partners.map(p => p.sort_order)) : 0;
        const { error } = await supabase
          .from('partners')
          .insert({
            name: formData.name,
            logo_url: formData.logo_url,
            website_url: formData.website_url || null,
            is_visible: formData.is_visible,
            sort_order: maxOrder + 1,
          });

        if (error) throw error;
      }

      await loadPartners();
      setIsModalOpen(false);
      setMessage({ type: 'success', text: 'Partner saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
      setMessage({ type: 'error', text: 'Failed to save partner' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('partners').delete().eq('id', id);
      if (error) throw error;
      await loadPartners();
      setDeleteConfirm(null);
      setMessage({ type: 'success', text: 'Partner deleted' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to delete:', error);
      setMessage({ type: 'error', text: 'Failed to delete partner' });
    }
  };

  const movePartner = async (id: string, direction: 'up' | 'down') => {
    const index = partners.findIndex(p => p.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= partners.length) return;

    const newPartners = [...partners];
    [newPartners[index], newPartners[newIndex]] = [newPartners[newIndex], newPartners[index]];
    
    // Update sort_order for all
    try {
      for (let i = 0; i < newPartners.length; i++) {
        await supabase
          .from('partners')
          .update({ sort_order: i })
          .eq('id', newPartners[i].id);
      }
      await loadPartners();
    } catch (error) {
      console.error('Failed to reorder:', error);
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
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--fg-1)', letterSpacing: '-0.01em', margin: 0 }}>Partners & Clients</h2>
          <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 3 }}>Logos displayed in the scrolling banner on homepage</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={openNewModal}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6, border: 'none', background: 'var(--brand)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus className="w-4 h-4" />
            Add Partner
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Partners List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {partners.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No partners added yet</p>
            <button onClick={openNewModal} className="text-[#005f5f] hover:underline">
              Add your first partner
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {partners.map((partner, index) => (
              <div
                key={partner.id}
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  !partner.is_visible ? 'opacity-50' : ''
                }`}
              >
                {/* Reorder Handle */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => movePartner(partner.id, 'up')}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => movePartner(partner.id, 'down')}
                    disabled={index === partners.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>

                {/* Logo Preview */}
                <div className="w-24 h-12 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
                  <img 
                    src={partner.logo_url} 
                    alt={partner.name} 
                    className="max-h-10 max-w-20 object-contain"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">{partner.name}</h3>
                  {partner.website_url && (
                    <a 
                      href={partner.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-[#005f5f] hover:underline flex items-center gap-1"
                    >
                      {partner.website_url} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Status */}
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  partner.is_visible 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {partner.is_visible ? 'Visible' : 'Hidden'}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(partner)}
                    className="p-2 text-gray-500 hover:text-[#005f5f] hover:bg-[#005f5f]/10 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(partner.id)}
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

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Edit Partner' : 'Add Partner'}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Company name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
                />
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Use a transparent PNG for best results</p>
                
                {/* Preview */}
                {formData.logo_url && (
                  <div className="mt-3 p-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img 
                      src={formData.logo_url} 
                      alt="Preview" 
                      className="max-h-16 object-contain"
                      onError={(e) => (e.currentTarget.src = '')}
                    />
                  </div>
                )}
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="text"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Optional - link when logo is clicked</p>
              </div>

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

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#005f5f] text-white rounded-lg hover:bg-[#004d4d] transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Partner'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold mb-2">Delete Partner</h3>
            <p className="text-gray-600 mb-6">Are you sure? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
