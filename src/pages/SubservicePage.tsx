/**
 * SUBSERVICE PAGE — Conditional by order type
 * =============================================
 * Route: /subservices/:subserviceSlug
 *
 * browse-and-order      → Category tabs + product grid + sticky CTA
 * send-file-and-process → Lead form (inline) — LeadFormView
 * describe-and-request  → Lead form (inline) — LeadFormView
 * informational         → Info-only content
 *
 * Design ref: redesign/journey/page-subservice.jsx + page-leadform.jsx
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight, ChevronLeft, ChevronRight, Upload, Check, Plus, FileText,
  Clock, X,
} from 'lucide-react';
import {
  Subservice, ProductCategory, Product, Service,
} from '../domain/types';
import { getSubservicePageData, submitQuoteRequest, uploadOrderFile } from '../services/data/dataService';
import { ROUTES } from '../router';
import { Stripes } from '../components/journey/stripes';
import { HowItWorks, CTABanner } from '../components/journey/sections';
import { OrderTypeTag } from '../components/ui/OrderTypeTag';
import { BrandBadge } from '../components/ui/BrandBadge';
import { getHeroColors, getOrderTypeConfig, BRAND_NEUTRAL } from '../lib/OrderTypes';
import { Breadcrumb } from '../layouts/mainlayout';

// ── Product card (browse-and-order) ───────────────────────────────────────────
const PRODUCT_FALLBACK = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" fill="none"><rect width="600" height="600" fill="#1a1a1a"/><g transform="translate(260,260)" stroke="#fff" stroke-width="2.5" fill="none" opacity="0.3"><rect x="0" y="5" width="80" height="12" rx="2"/><rect x="0" y="22" width="80" height="12" rx="2"/><rect x="0" y="39" width="80" height="12" rx="2"/></g></svg>`)}`;

interface ProductCardProps { product: Product; onClick: () => void; accent: string; tagBg: string; tagFg: string; }
const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, accent, tagBg, tagFg }) => {
  const [imgErr, setImgErr] = useState(false);
  const isComingSoon = product.visibilityStatus === 'coming_soon';
  return (
    <div onClick={!isComingSoon ? onClick : undefined} style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #e5e5e5', cursor: isComingSoon ? 'default' : 'pointer', transition: 'transform .3s, box-shadow .3s, border-color .3s' }}
      onMouseEnter={e => { if (!isComingSoon) { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-6px)'; el.style.boxShadow = '0 20px 40px -12px rgba(0,0,0,.2)'; el.style.borderColor = '#0a0a0a'; }}}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = ''; el.style.borderColor = '#e5e5e5'; }}
    >
      <div style={{ position: 'relative', aspectRatio: '1/1', background: '#f5f5f5', overflow: 'hidden' }}>
        <img src={imgErr || !product.imageUrl ? PRODUCT_FALLBACK : product.imageUrl} alt={product.title}
          onError={() => setImgErr(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: isComingSoon ? 'cover' : 'contain', padding: isComingSoon ? 0 : 16, filter: isComingSoon ? 'grayscale(1) brightness(.7)' : 'none', transition: 'transform .4s' }}
        />
        {isComingSoon && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, background: 'rgba(0,0,0,.5)' }}>
            <Clock size={20} color="rgba(255,255,255,.8)" />
            <span style={{ fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(255,255,255,.8)' }}>Coming Soon</span>
          </div>
        )}
      </div>
      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: accent, fontWeight: 700, marginBottom: 4, letterSpacing: '.05em' }}>{product.subtitle || product.categoryId}</div>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', margin: 0, lineHeight: 1.3 }}>{product.title}</h3>
        {!isComingSoon && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: tagFg, letterSpacing: '.1em', textTransform: 'uppercase' }}>Configure</span>
            <ArrowRight size={12} color={tagFg} />
          </div>
        )}
      </div>
    </div>
  );
};

// ── CATALOG VIEW (browse-and-order) ───────────────────────────────────────────
interface CatalogViewProps {
  subservice: Subservice;
  service: Service | null;
  categories: ProductCategory[];
  products: Product[];
}

const CatalogView: React.FC<CatalogViewProps> = ({ subservice, service, categories, products }) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const hero = getHeroColors(service?.orderType, service?.brand);
  const t = getOrderTypeConfig(service?.orderType);

  const [activeTab, setActiveTab] = useState(categories[0]?.id || '');
  const tabsRef = useRef<HTMLDivElement>(null);

  const filteredProducts = products.filter(p => p.categoryId === activeTab);
  const activeCategory = categories.find(c => c.id === activeTab);

  const scrollTabs = (dir: 'l' | 'r') => {
    if (!tabsRef.current) return;
    tabsRef.current.scrollBy({ left: dir === 'r' ? 180 : -180, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero + tabs */}
      <section style={{ background: `linear-gradient(135deg, ${hero.heroFrom}, ${hero.heroTo})`, paddingBottom: 0, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <Stripes opacity={0.16} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 32px 0', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center', paddingBottom: 56 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <OrderTypeTag orderType={service?.orderType} brand={service?.brand} variant="overlay" />
              </div>
              <h1 style={{ fontSize: 64, fontWeight: 600, letterSpacing: '-.025em', lineHeight: 1.05, margin: '0 0 16px', fontFamily: "'Inter Display', Inter, sans-serif" }}>
                {subservice.title}
              </h1>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,.78)', fontWeight: 300, lineHeight: 1.6, margin: '0 0 20px', maxWidth: 520 }}>
                {subservice.description}
              </p>
              <div style={{ display: 'flex', gap: 24, color: 'rgba(255,255,255,.7)', fontSize: 12, letterSpacing: '.05em' }}>
                <span>{products.length} SKUs</span>
                <span>·</span>
                <span>MDF / Egger · configurable</span>
              </div>
            </div>
            <div style={{ position: 'relative', height: 280, borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,.05)' }}>
              {subservice.heroImageUrl && <img src={subservice.heroImageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
              <span style={{ position: 'absolute', top: 14, left: 14, padding: '6px 12px', borderRadius: 99, background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(10px)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase' }}>
                3D · drag to rotate
              </span>
            </div>
          </div>

          {/* Category tabs */}
          {categories.length > 0 && (
            <div style={{ background: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: '8px 8px 0', display: 'flex', alignItems: 'stretch', gap: 4 }}>
              <button onClick={() => scrollTabs('l')} style={{ width: 36, height: 36, borderRadius: 99, background: '#f5f5f5', border: 0, color: '#525252', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, alignSelf: 'center', marginRight: 4 }}>
                <ChevronLeft size={14} />
              </button>
              <div ref={tabsRef} className="no-scrollbar" style={{ display: 'flex', gap: 4, overflowX: 'auto', flex: 1 }}>
                {categories.map((cat) => {
                  const isActive = cat.id === activeTab;
                  return (
                    <button key={cat.id} onClick={() => setActiveTab(cat.id)} style={{ flexShrink: 0, padding: '16px 20px', borderRadius: '12px 12px 0 0', border: 0, background: isActive ? '#fff' : 'transparent', color: isActive ? '#0a0a0a' : '#737373', fontFamily: 'inherit', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 2, borderBottom: `2px solid ${isActive ? t.accent : 'transparent'}` }}>
                      <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: isActive ? t.tagFg : '#a3a3a3' }}>{cat.slug.toUpperCase()}</span>
                      <span style={{ fontSize: 14, fontWeight: isActive ? 700 : 500 }}>{cat.title}</span>
                      <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: '#a3a3a3' }}>{products.filter(p => p.categoryId === cat.id).length} items</span>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => scrollTabs('r')} style={{ width: 36, height: 36, borderRadius: 99, background: '#f5f5f5', border: 0, color: '#525252', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, alignSelf: 'center', marginLeft: 4 }}>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Product grid */}
      <section style={{ padding: '48px 32px 96px', background: '#fafaf8' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {activeCategory && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 600, color: '#0a0a0a', fontFamily: "'Inter Display', Inter, sans-serif", margin: 0 }}>{activeCategory.title}</h2>
              {activeCategory.description && <p style={{ fontSize: 15, color: '#737373', margin: '8px 0 0', fontWeight: 300 }}>{activeCategory.description}</p>}
            </div>
          )}
          {filteredProducts.length === 0 ? (
            <div style={{ padding: '64px 0', textAlign: 'center', color: '#a3a3a3' }}>No products in this category.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  accent={t.accent}
                  tagBg={t.tagBg}
                  tagFg={t.tagFg}
                  onClick={() => navigate(ROUTES.PRODUCT(p.slug))}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sticky CTA bar */}
      <div style={{ position: 'sticky', bottom: 0, zIndex: 20, background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(12px)', borderTop: `1px solid ${t.accent}40`, padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, boxShadow: '0 -8px 30px -10px rgba(0,0,0,.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 8, height: 8, borderRadius: 99, background: t.accent }} />
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#737373' }}>Browsing:</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a' }}>{subservice.title}</span>
        </div>
        <Link
          to={ROUTES.QUOTE}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 999, background: BRAND_NEUTRAL, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
        >
          Get a quote <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

// ── LEAD FORM VIEW (project / custom order) ───────────────────────────────────
interface LeadFormViewProps {
  subservice: Subservice;
  service: Service | null;
}

const LeadFormView: React.FC<LeadFormViewProps> = ({ subservice, service }) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const hero = getHeroColors(service?.orderType, service?.brand);
  const t = getOrderTypeConfig(service?.orderType);
  const isProject = service?.orderType === 'send-file-and-process';

  const [files, setFiles] = useState<File[]>([]);
  const [form, setForm] = useState({ name: '', phone: '', company: '', message: '', material: 'MDF 18mm', deadline: 'Within 1 wk', objectType: 'Custom kitchen', timeline: '1–2 months' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  };
  const removeFile = (i: number) => setFiles(prev => prev.filter((_, j) => j !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitQuoteRequest({ ...form, serviceSlug: service?.slug, subserviceSlug: subservice.slug, orderType: service?.orderType } as any);
      navigate(`/thank-you/${service?.orderType?.replace(/-/g, '-') || 'project'}`);
    } catch {
      setSubmitting(false);
    }
  };

  const chipOpts = (opts: string[], value: string, field: keyof typeof form) => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {opts.map(o => (
        <button key={o} type="button" onClick={() => setForm(prev => ({ ...prev, [field]: o }))} style={{ padding: '10px 14px', borderRadius: 99, fontFamily: 'inherit', border: form[field] === o ? `1.5px solid ${t.accent}` : '1px solid #e0e0e0', background: form[field] === o ? t.tagBg : '#fff', color: form[field] === o ? t.tagFg : '#262626', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
          {o}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${hero.heroFrom}, ${hero.heroTo})`, padding: '72px 32px 96px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <Stripes opacity={0.16} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ marginBottom: 16 }}><OrderTypeTag orderType={service?.orderType} brand={service?.brand} variant="overlay" /></div>
            <h1 style={{ fontSize: 72, fontWeight: 600, letterSpacing: '-.025em', lineHeight: 1.05, margin: '0 0 18px', fontFamily: "'Inter Display', Inter, sans-serif" }}>
              {isProject ? 'Send us the file.' : 'Tell us the brief.'}
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.78)', fontWeight: 300, lineHeight: 1.55, margin: '0 0 28px', maxWidth: 520 }}>
              {isProject
                ? 'Drop your DXF, DWG, PDF, or sketch. We come back with a cost and lead time within 1 business day.'
                : 'From idea to installed kitchen. Share what you have — sketches, photos, or just a feeling.'}
            </p>
            <div style={{ display: 'flex', gap: 24, color: 'rgba(255,255,255,.7)', fontSize: 12.5 }}>
              {['Reply within 1 business day', 'Free quote · no commitment', 'EN / HE'].map((item, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: t.accent }}><Check size={14} /></span>{item}
                </span>
              ))}
            </div>
          </div>
          <div style={{ height: 280, borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,.05)' }}>
            {subservice.heroImageUrl && <img src={subservice.heroImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
        </div>
      </section>

      {/* Form + sidebar */}
      <section style={{ background: '#fafaf8', padding: '0 32px 96px', marginTop: -40, position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
          {/* Form card */}
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 40, boxShadow: '0 12px 40px -16px rgba(0,0,0,.12)', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: t.tagFg }}>Step 1 of 2</span>
              <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-.018em', color: '#0a0a0a', margin: '8px 0 4px', fontFamily: "'Inter Display', Inter, sans-serif" }}>
                {isProject ? 'Files & specifications' : 'Project brief'}
              </h2>
              <p style={{ fontSize: 13.5, color: '#737373', margin: 0, fontWeight: 300 }}>
                {isProject ? 'The more we know, the more accurate the quote.' : 'Don\'t worry about getting it perfect. We\'ll talk through the details.'}
              </p>
            </div>

            {/* File upload (project) */}
            {isProject ? (
              <>
                <div style={{ background: '#fff', borderRadius: 16, border: `2px dashed ${t.accent}`, padding: '44px 32px', textAlign: 'center', position: 'relative' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 99, background: t.tagBg, color: t.tagFg, marginBottom: 16 }}>
                    <Upload size={24} />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 600, color: '#0a0a0a', margin: '0 0 6px', fontFamily: "'Inter Display', Inter, sans-serif" }}>Drop your files here</h3>
                  <p style={{ fontSize: 13.5, color: '#525252', margin: '0 0 16px', fontWeight: 300 }}>DXF · DWG · PDF · STEP · up to 50 MB per file</p>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 99, background: BRAND_NEUTRAL, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    <input type="file" multiple accept=".dxf,.dwg,.pdf,.step,.stp,.xlsx,.xls" onChange={handleFile} style={{ display: 'none' }} />
                    Choose files
                  </label>
                </div>
                {files.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {files.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 10, padding: '12px 16px', border: '1px solid #efefef' }}>
                        <span style={{ width: 32, height: 32, borderRadius: 6, background: t.tagBg, color: t.tagFg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={15} /></span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10.5, color: '#a3a3a3' }}>{(f.size / 1024).toFixed(0)} KB</span>
                        </div>
                        <button type="button" onClick={() => removeFile(i)} style={{ background: 'transparent', border: 0, cursor: 'pointer', color: '#a3a3a3' }}><X size={15} /></button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#262626' }}>Material</span>
                    {chipOpts(['MDF 18mm', 'MDF 16mm', 'Egger', 'Plywood', 'Other'], form.material, 'material')}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#262626' }}>Deadline</span>
                    {chipOpts(['ASAP', 'Within 1 wk', '2–3 wks', 'Flexible'], form.deadline, 'deadline')}
                  </div>
                </div>
              </>
            ) : (
              /* Custom order brief */
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#262626' }}>What are we building?</span>
                  {chipOpts(['Custom kitchen', 'Cabinetry · wardrobe', 'Office fit-out', 'Retail interior', 'Other'], form.objectType, 'objectType')}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#262626' }}>Timeline</span>
                    {chipOpts(['ASAP', '1–2 mo', '3–6 mo', 'Just exploring'], form.timeline, 'timeline')}
                  </div>
                </div>
              </>
            )}

            {/* Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#262626' }}>Additional notes</span>
              <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder={isProject ? 'Special tolerances, finish notes, delivery constraints…' : 'Site address, who lives there, what\'s working and what isn\'t…'} rows={4}
                style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', color: '#0a0a0a', resize: 'vertical', outline: 'none' }}
              />
            </div>

            {/* Contact */}
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#262626' }}>Step 2 · how to reach you</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[{ f: 'name' as const, pl: 'Your name *' }, { f: 'company' as const, pl: 'Company (optional)' }].map(({ f, pl }) => (
                  <input key={f} value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} placeholder={pl} required={f === 'name'}
                    style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', color: '#0a0a0a', outline: 'none' }} />
                ))}
              </div>
              <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+972 …" required
                style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', color: '#0a0a0a', outline: 'none' }} />
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginTop: 6 }}>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#a3a3a3' }}>By submitting, you agree to our privacy terms.</span>
              <button type="submit" disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 24px', borderRadius: 999, background: BRAND_NEUTRAL, color: '#fff', fontSize: 13, fontWeight: 700, cursor: submitting ? 'wait' : 'pointer', border: 0, fontFamily: 'inherit' }}>
                {submitting ? 'Sending…' : isProject ? 'Send for review' : 'Send brief'} <ArrowRight size={14} />
              </button>
            </div>
          </form>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 40 }}>
            {/* What happens next */}
            <div style={{ background: `linear-gradient(135deg, ${hero.heroFrom}10, transparent)`, border: `1px solid ${t.accent}40`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: t.tagFg }}>What happens next</span>
              {(isProject ? [
                ['01', 'We open your files', 'Engineer checks DXF / sheet count / material in CAM.'],
                ['02', 'Quote in your inbox', 'Itemised price, lead time, options. Within 1 business day.'],
                ['03', 'You approve, we cut', 'Production starts. Track status in your account.'],
              ] : [
                ['01', 'Designer reads your brief', 'We map what you sent to a starting concept.'],
                ['02', 'Free 30-min call', 'We talk through scope, budget, timeline. No commitment.'],
                ['03', 'Concept + costed plan', 'You decide whether we build it. Free up to that point.'],
              ]).map(([n, l, sub]) => (
                <div key={n} style={{ display: 'flex', gap: 14 }}>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, fontWeight: 700, color: t.tagFg, paddingTop: 2 }}>{n}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', marginBottom: 2 }}>{l}</div>
                    <span style={{ fontSize: 12.5, color: '#525252', lineHeight: 1.5, fontWeight: 300 }}>{sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Talk first card */}
            <div style={{ background: '#0a0a0a', borderRadius: 16, padding: 24, color: '#fff', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden' }}>
              <Stripes opacity={0.18} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: t.accent }}>Prefer to talk first?</span>
                <h3 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.015em', margin: '10px 0 14px', lineHeight: 1.2, fontFamily: "'Inter Display', Inter, sans-serif" }}>
                  Book a 30-min call with an engineer.
                </h3>
                <a href="https://wa.me/972501234567" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px 18px', borderRadius: 99, background: '#25D366', color: '#fff', border: 0, fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'none' }}>
                  WhatsApp · +972 50 890-0000
                </a>
              </div>
            </div>

            {/* Trust mini */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['180+', 'kitchens / yr'], ['72 h', 'avg. lead time']].map(([k, v]) => (
                <div key={k} style={{ background: '#fff', borderRadius: 12, padding: '16px 18px', border: '1px solid #f0f0f0' }}>
                  <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-.02em', color: '#0a0a0a', display: 'block', fontFamily: "'Inter Display', Inter, sans-serif" }}>{k}</span>
                  <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#737373', display: 'block', marginTop: 4 }}>{v}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

// ── SUBSERVICE PAGE (main export) ─────────────────────────────────────────────
export const SubservicePage: React.FC = () => {
  const { subserviceSlug } = useParams<{ subserviceSlug: string }>();
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('he') ? 'he' : 'en';

  const [subservice, setSubservice] = useState<Subservice | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subserviceSlug) return;
    getSubservicePageData(subserviceSlug).then(data => {
      if (data) {
        setSubservice(data.subservice);
        setService(data.service || null);
        setCategories(data.categories || []);
        setProducts(data.products || []);
        if (data.service?.orderType) sessionStorage.setItem('hw_active_order_type', data.service.orderType);
      }
    }).finally(() => setLoading(false));
  }, [subserviceSlug]);

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: 99, border: `3px solid #e5e5e5`, borderTopColor: BRAND_NEUTRAL, animation: 'spin .7s linear infinite' }} />
    </div>
  );
  if (!subservice) return <div style={{ padding: '96px 32px', textAlign: 'center', color: '#737373' }}>Subservice not found.</div>;

  const orderType = service?.orderType;
  const t = getOrderTypeConfig(orderType);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '#' },
    ...(service ? [{ label: service.title, href: ROUTES.SERVICE(service.slug) }] : []),
    { label: subservice.title },
  ];

  return (
    <div style={{ background: '#fff' }}>
      <Breadcrumb items={breadcrumbItems} orderType={orderType} />

      {/* Conditional view based on order type */}
      {orderType === 'browse-and-order' ? (
        <CatalogView subservice={subservice} service={service} categories={categories} products={products} />
      ) : (
        <LeadFormView subservice={subservice} service={service} />
      )}

      {/* Journey section only for non-form views */}
      {orderType === 'browse-and-order' && (
        <HowItWorks orderType={orderType} />
      )}
    </div>
  );
};
