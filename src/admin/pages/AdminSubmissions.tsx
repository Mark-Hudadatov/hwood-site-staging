/**
 * ADMIN SUBMISSIONS PAGE
 * =======================
 * View contact and quote form submissions
 */

import React, { useEffect, useState } from 'react';
import { Mail, MessageSquare, Check, Clock, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import {
  ContactSubmission,
  QuoteSubmission as QuoteSubmissionBase,
  getContactSubmissions,
  getQuoteSubmissions,
  markContactRead,
  markQuoteRead,
} from '../adminStore';

type QuoteSubmission = QuoteSubmissionBase & {
  order_type?: string;
  service_slug?: string;
  client_role?: string;
  material?: string;
  volume?: string;
  deadline?: string;
  file_url?: string;
};

type TabType = 'contact' | 'quote';

export const AdminSubmissions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('contact');
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [quotes, setQuotes] = useState<QuoteSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [contactData, quoteData] = await Promise.all([
        getContactSubmissions(),
        getQuoteSubmissions(),
      ]);
      setContacts(contactData);
      setQuotes(quoteData);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkRead = async (type: TabType, id: string) => {
    try {
      if (type === 'contact') {
        await markContactRead(id);
        setContacts(items => 
          items.map(item => item.id === id ? { ...item, is_read: true } : item)
        );
      } else {
        await markQuoteRead(id);
        setQuotes(items => 
          items.map(item => item.id === id ? { ...item, is_read: true } : item)
        );
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const unreadContacts = contacts.filter(c => !c.is_read).length;
  const unreadQuotes = quotes.filter(q => !q.is_read).length;

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
      <div>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--fg-1)', letterSpacing: '-0.01em', margin: 0 }}>Submissions</h2>
        <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 3 }}>Contact messages and quote requests from website visitors</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2" style={{ borderBottom: '1px solid var(--border-1)' }}>
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'contact'
              ? 'border-[#005f5f] text-[#005f5f]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Mail className="w-5 h-5" />
          Contact Messages
          {unreadContacts > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              {unreadContacts}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('quote')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'quote'
              ? 'border-[#005f5f] text-[#005f5f]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          Quote Requests
          {unreadQuotes > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              {unreadQuotes}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {activeTab === 'contact' ? (
          contacts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No contact messages yet
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {contacts.map((item) => (
                <div
                  key={item.id}
                  className={`${!item.is_read ? 'bg-blue-50/50' : ''}`}
                >
                  <div 
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleExpand(item.id)}
                  >
                    {/* Status */}
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      item.is_read ? 'bg-gray-300' : 'bg-blue-500'
                    }`} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500 text-sm">{item.email}</span>
                      </div>
                      <p className="text-gray-600 text-sm truncate">
                        {item.subject || item.message}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>

                    {/* Expand */}
                    {expandedId === item.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  {/* Expanded Content */}
                  {expandedId === item.id && (
                    <div className="px-4 pb-4 ml-7 border-l-2 border-gray-200">
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        {item.subject && (
                          <div>
                            <span className="text-xs text-gray-500 uppercase">Subject</span>
                            <p className="text-gray-900">{item.subject}</p>
                          </div>
                        )}
                        {item.phone && (
                          <div>
                            <span className="text-xs text-gray-500 uppercase">Phone</span>
                            <p className="text-gray-900">{item.phone}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-xs text-gray-500 uppercase">Message</span>
                          <p className="text-gray-900 whitespace-pre-wrap">{item.message}</p>
                        </div>
                        
                        {!item.is_read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkRead('contact', item.id);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#005f5f] hover:bg-[#005f5f]/10 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          quotes.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No quote requests yet
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {quotes.map((item) => (
                <div
                  key={item.id}
                  className={`${!item.is_read ? 'bg-blue-50/50' : ''}`}
                >
                  <div 
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleExpand(item.id)}
                  >
                    {/* Status */}
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      item.is_read ? 'bg-gray-300' : 'bg-orange-500'
                    }`} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        {item.company && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 text-sm">{item.company}</span>
                          </>
                        )}
                        {(item as any).order_type && (
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 3,
                            background: (item as any).order_type === 'browse-and-order' ? '#e5f5f5'
                                      : (item as any).order_type === 'send-file-and-process' ? '#e8efff'
                                      : '#fef3e6',
                            color: (item as any).order_type === 'browse-and-order' ? '#0a4d4d'
                                 : (item as any).order_type === 'send-file-and-process' ? '#1d4ed8'
                                 : '#b45309',
                            textTransform: 'uppercase', letterSpacing: '0.04em',
                          }}>
                            {(item as any).order_type === 'browse-and-order' ? 'Catalog'
                           : (item as any).order_type === 'send-file-and-process' ? 'File'
                           : 'Custom'}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mt-0.5">
                        {item.budget_range ? `Budget: ${item.budget_range}` : item.email}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>

                    {/* Expand */}
                    {expandedId === item.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  {/* Expanded Content */}
                  {expandedId === item.id && (
                    <div className="px-4 pb-4 ml-7 border-l-2 border-gray-200">
                      <div style={{ background: '#fafaf8', border: '1px solid #e5e5e5', borderRadius: 8, padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                        {/* Order type */}
                        {(item as any).order_type && (
                          <div>
                            <span style={{ fontSize: 10, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: 4 }}>Order type</span>
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                              background: (item as any).order_type === 'browse-and-order' ? '#e5f5f5'
                                        : (item as any).order_type === 'send-file-and-process' ? '#e8efff'
                                        : (item as any).order_type === 'describe-and-request' ? '#fef3e6'
                                        : '#f5f5f5',
                              color: (item as any).order_type === 'browse-and-order' ? '#0a4d4d'
                                   : (item as any).order_type === 'send-file-and-process' ? '#1d4ed8'
                                   : (item as any).order_type === 'describe-and-request' ? '#b45309'
                                   : '#525252',
                            }}>
                              {(item as any).order_type.replace(/-/g, ' ')}
                            </span>
                          </div>
                        )}

                        {/* Service slug */}
                        {(item as any).service_slug && (
                          <div>
                            <span style={{ fontSize: 10, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: 4 }}>Service</span>
                            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: '#0a0a0a' }}>{(item as any).service_slug}</span>
                          </div>
                        )}

                        {/* Phone */}
                        <div>
                          <span style={{ fontSize: 10, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: 4 }}>Phone</span>
                          <span style={{ fontSize: 13, color: '#0a0a0a' }}>{item.phone || '—'}</span>
                        </div>

                        {/* Client role */}
                        {(item as any).client_role && (
                          <div>
                            <span style={{ fontSize: 10, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: 4 }}>Role</span>
                            <span style={{ fontSize: 13, color: '#0a0a0a' }}>{(item as any).client_role}</span>
                          </div>
                        )}

                        {/* Material */}
                        {(item as any).material && (
                          <div>
                            <span style={{ fontSize: 10, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: 4 }}>Material</span>
                            <span style={{ fontSize: 13, color: '#0a0a0a' }}>{(item as any).material}</span>
                          </div>
                        )}

                        {/* Volume */}
                        {(item as any).volume && (
                          <div>
                            <span style={{ fontSize: 10, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: 4 }}>Volume</span>
                            <span style={{ fontSize: 13, color: '#0a0a0a' }}>{(item as any).volume}</span>
                          </div>
                        )}

                        {/* Deadline */}
                        {(item as any).deadline && (
                          <div>
                            <span style={{ fontSize: 10, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: 4 }}>Deadline</span>
                            <span style={{ fontSize: 13, color: '#0a0a0a' }}>{(item as any).deadline}</span>
                          </div>
                        )}

                        {/* Budget range */}
                        {item.budget_range && (
                          <div>
                            <span style={{ fontSize: 10, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: 4 }}>Budget range</span>
                            <span style={{ fontSize: 13, color: '#0a0a0a' }}>{item.budget_range}</span>
                          </div>
                        )}

                        {/* Timeline */}
                        {item.timeline && (
                          <div>
                            <span style={{ fontSize: 10, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: 4 }}>Timeline</span>
                            <span style={{ fontSize: 13, color: '#0a0a0a' }}>{item.timeline}</span>
                          </div>
                        )}

                        {/* Products of interest */}
                        {item.product_interest && item.product_interest.length > 0 && (
                          <div style={{ gridColumn: '1 / -1' }}>
                            <span style={{ fontSize: 10, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: 6 }}>Products of interest</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {item.product_interest.map((prod, i) => (
                                <span key={i} style={{ fontSize: 11, padding: '2px 8px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 4 }}>{prod}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* File URL */}
                        {(item as any).file_url && (
                          <div style={{ gridColumn: '1 / -1' }}>
                            <span style={{ fontSize: 10, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: 4 }}>Attached file</span>
                            <a href={(item as any).file_url} target="_blank" rel="noopener noreferrer"
                               style={{ fontSize: 12, color: '#005f5f', fontFamily: 'ui-monospace, monospace', wordBreak: 'break-all' }}>
                              View file ↗
                            </a>
                          </div>
                        )}

                        {/* Message */}
                        {item.message && (
                          <div style={{ gridColumn: '1 / -1' }}>
                            <span style={{ fontSize: 10, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: 4 }}>Message</span>
                            <p style={{ fontSize: 13, color: '#0a0a0a', whiteSpace: 'pre-wrap', margin: 0 }}>{item.message}</p>
                          </div>
                        )}

                        {/* Mark as read */}
                        {!item.is_read && (
                          <div style={{ gridColumn: '1 / -1' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkRead('quote', item.id);
                              }}
                              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#005f5f] hover:bg-[#005f5f]/10 rounded-lg transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              Mark as Read
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};
