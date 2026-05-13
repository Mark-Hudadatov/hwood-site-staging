/**
 * QUOTE PAGE — browse-and-order
 * ==============================
 * Route: /quote  or  /quote/:productSlug
 *
 * Used for: catalog orders (product → quote → thank-you)
 * For project/custom orders → LeadFormView inside SubservicePage
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check, ArrowLeft } from 'lucide-react';
import { Product, Service, CompanyInfo } from '../domain/types';
import { getProductBySlug, getServices, getCompanyInfo, submitQuoteRequest } from '../services/data/dataService';
import { ROUTES } from '../router';
import { Stripes } from '../components/journey/stripes';
import { getHeroColors, getOrderTypeConfig, BRAND_NEUTRAL } from '../lib/OrderTypes';

const HERO = getHeroColors('browse-and-order');
const T = getOrderTypeConfig('browse-and-order');

// ── Quote form ──────────────────────────────────────────────────────────────
export const QuotePage: React.FC = () => {
  const { productSlug } = useParams<{ productSlug?: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('he') ? 'he' : 'en';

  const [product, setProduct] = useState<Product | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    message: '',
    material: 'MDF 18mm',
    quantity: '',
    deadline: 'Within 1 wk',
  });

  useEffect(() => {
    Promise.all([getServices(), getCompanyInfo()]).then(([svcs, info]) => {
      setServices(svcs);
      setCompanyInfo(info);
    });
    if (productSlug) {
      getProductBySlug(productSlug).then(p => { if (p) setProduct(p); });
    }
  }, [productSlug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const setChip = (field: keyof typeof form, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitQuoteRequest({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        company: form.company || undefined,
        message: [form.message, form.material, form.quantity, form.deadline].filter(Boolean).join(' | ') || undefined,
        product_interest: productSlug ? [productSlug] : undefined,
      });
      navigate('/thank-you/browse-and-order');
    } catch {
      setSubmitting(false);
    }
  };

  const chip = (opts: string[], field: keyof typeof form) => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {opts.map(o => (
        <button key={o} type="button" onClick={() => setChip(field, o)}
          style={{ padding: '10px 14px', borderRadius: 99, fontFamily: 'inherit', border: form[field] === o ? `1.5px solid ${T.accent}` : '1px solid #e0e0e0', background: form[field] === o ? T.tagBg : '#fff', color: form[field] === o ? T.tagFg : '#262626', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
        >{o}</button>
      ))}
    </div>
  );

  return (
    <div style={{ background: '#fff' }}>
      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${HERO.heroFrom}, ${HERO.heroTo})`, padding: '72px 32px 96px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <Stripes opacity={0.18} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <Link to={product ? ROUTES.PRODUCT(product.slug) : '/'} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.7)', fontSize: 12, fontWeight: 600, textDecoration: 'none', marginBottom: 24, letterSpacing: '.05em' }}>
            <ArrowLeft size={14} /> {lang === 'he' ? 'חזרה' : 'Back'}
          </Link>
          <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: T.accent, display: 'block', marginBottom: 12 }}>
            {lang === 'he' ? 'הזמנה מקטלוג' : 'Catalog Order'}
          </span>
          <h1 style={{ fontSize: 64, fontWeight: 600, letterSpacing: '-.025em', lineHeight: 1.05, margin: '0 0 16px', fontFamily: "'Inter Display', Inter, sans-serif" }}>
            {lang === 'he' ? 'קבל הצעת מחיר' : 'Request a quote.'}
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,.78)', fontWeight: 300, lineHeight: 1.55, margin: 0, maxWidth: 520 }}>
            {lang === 'he'
              ? 'מלא את הטופס ואנו נחזור אליך תוך יום עסקים אחד עם הצעת מחיר מפורטת.'
              : "Fill in the form and we'll come back with a costed quote within one business day."}
          </p>
        </div>
      </section>

      {/* Form + sidebar */}
      <section style={{ background: '#fafaf8', padding: '0 32px 96px', marginTop: -40, position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 40, boxShadow: '0 12px 40px -16px rgba(0,0,0,.12)', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {product && (
              <div style={{ background: T.tagBg, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                {product.imageUrl && (
                  <img src={product.imageUrl} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                )}
                <div>
                  <span style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: 700, color: T.tagFg }}>Selected product</span>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', marginTop: 2 }}>{product.title}</div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#262626' }}>
                {lang === 'he' ? 'חומר' : 'Material'}
              </span>
              {chip(['MDF 18mm', 'MDF 16mm', 'Egger', 'Plywood', 'Other'], 'material')}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#262626' }}>
                {lang === 'he' ? 'כמות (בקירוב)' : 'Quantity (approximate)'}
              </span>
              <input
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder={lang === 'he' ? 'למשל: 24 מודולים' : 'e.g. 24 modules, or 8 sheets'}
                style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', color: '#0a0a0a', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#262626' }}>
                {lang === 'he' ? 'מועד אספקה' : 'Deadline'}
              </span>
              {chip(['ASAP', 'Within 1 wk', '2–3 wks', 'Flexible'], 'deadline')}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#262626' }}>
                {lang === 'he' ? 'הערות נוספות' : 'Additional notes'}
              </span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder={lang === 'he' ? 'גוונים, גימורים, דרישות מיוחדות…' : 'Finishes, edge band colour, delivery notes…'}
                rows={3}
                style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', color: '#0a0a0a', resize: 'vertical', outline: 'none' }}
              />
            </div>

            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#262626' }}>
                {lang === 'he' ? 'פרטי התקשרות' : 'Contact details'}
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input name="name" value={form.name} onChange={handleChange} placeholder={lang === 'he' ? 'שמך *' : 'Your name *'} required style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', color: '#0a0a0a', outline: 'none' }} />
                <input name="company" value={form.company} onChange={handleChange} placeholder={lang === 'he' ? 'חברה (אופציונלי)' : 'Company (optional)'} style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', color: '#0a0a0a', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+972 …" required style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', color: '#0a0a0a', outline: 'none' }} />
                <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="email@company.com" style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', color: '#0a0a0a', outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#a3a3a3' }}>
                {lang === 'he' ? 'בשליחה אתה מסכים לתנאי הפרטיות שלנו.' : 'By submitting, you agree to our privacy terms.'}
              </span>
              <button type="submit" disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 24px', borderRadius: 999, background: BRAND_NEUTRAL, color: '#fff', fontSize: 13, fontWeight: 700, cursor: submitting ? 'wait' : 'pointer', border: 0, fontFamily: 'inherit' }}>
                {submitting ? (lang === 'he' ? 'שולח…' : 'Sending…') : (lang === 'he' ? 'שלח הצעת מחיר' : 'Send quote request')} <ArrowRight size={14} />
              </button>
            </div>
          </form>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 40 }}>
            <div style={{ background: `linear-gradient(135deg, ${HERO.heroFrom}10, transparent)`, border: `1px solid ${T.accent}40`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: T.tagFg }}>What happens next</span>
              {[
                ['01', 'We review your request', 'Our production team checks availability and pricing.'],
                ['02', 'Quote in your inbox', 'Itemised list, lead time, and stock confirmation. Within 1 business day.'],
                ['03', 'You approve, we produce', 'Payment and production kick off immediately on approval.'],
              ].map(([n, l, d]) => (
                <div key={n} style={{ display: 'flex', gap: 14 }}>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, fontWeight: 700, color: T.tagFg, paddingTop: 2 }}>{n}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', marginBottom: 2 }}>{l}</div>
                    <span style={{ fontSize: 12.5, color: '#525252', lineHeight: 1.5, fontWeight: 300 }}>{d}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#0a0a0a', borderRadius: 16, padding: 24, color: '#fff', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden' }}>
              <Stripes opacity={0.18} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: T.accent }}>Prefer to talk first?</span>
                <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-.015em', margin: '10px 0 14px', fontFamily: "'Inter Display', Inter, sans-serif" }}>
                  Call the order desk directly.
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a href="tel:+97298900000" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px 18px', borderRadius: 99, background: BRAND_NEUTRAL, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                    +972 9 890-0000
                  </a>
                  <a href="https://wa.me/972501234567" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px 18px', borderRadius: 99, background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                    WhatsApp · +972 50 890-0000
                  </a>
                </div>
                <span style={{ display: 'block', marginTop: 14, fontFamily: 'ui-monospace, monospace', fontSize: 11, color: 'rgba(255,255,255,.5)' }}>
                  Sun–Thu · 9:00 – 18:00 IST
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['Free', 'quote · no commitment'], ['72 h', 'avg. production time']].map(([k, v]) => (
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
