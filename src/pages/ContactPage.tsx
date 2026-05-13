/**
 * CONTACT PAGE — Split layout
 * ============================
 * Left: contact form (submitContactForm)
 * Right: address, phone, WhatsApp, hours, map placeholder
 * Contact data loaded from CompanyInfo (Supabase)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, ArrowRight } from 'lucide-react';
import { CompanyInfo } from '../domain/types';
import { getCompanyInfo, submitContactForm } from '../services/data/dataService';
import { useTranslation } from 'react-i18next';
import { Stripes } from '../components/journey/stripes';
import { BRAND_NEUTRAL, SKYLUM_BLUE } from '../lib/OrderTypes';

export const ContactPage: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('he') ? 'he' : 'en';
  const navigate = useNavigate();

  const [info, setInfo] = useState<CompanyInfo | null>(null);
  const [rawInfo, setRawInfo] = useState<Record<string, string> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    getCompanyInfo().then(d => {
      if (d) {
        setInfo(d);
        setRawInfo(d as unknown as Record<string, string>);
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContactForm(form as any);
      setDone(true);
    } catch {
      setSubmitting(false);
    }
  };

  const whatsapp = rawInfo?.['whatsapp'] || '+972 50 890-0000';
  const openingHours = rawInfo?.['openingHours'] || (lang === 'he' ? 'אא–הי · 9:00 – 18:00 IST' : 'Sun–Thu · 9:00 – 18:00 IST');

  const contactItems = [
    {
      icon: Phone,
      label: lang === 'he' ? 'טלפון' : 'Phone',
      value: info?.phone || '+972 9 890-0000',
      href: `tel:${(info?.phone || '+97298900000').replace(/\s/g, '')}`,
    },
    {
      icon: Phone,
      label: 'WhatsApp',
      value: whatsapp,
      href: `https://wa.me/${whatsapp.replace(/[\s+]/g, '')}`,
      green: true,
    },
    {
      icon: Mail,
      label: lang === 'he' ? 'אימייל' : 'Email',
      value: info?.email || 'info@hwood.co.il',
      href: `mailto:${info?.email || 'info@hwood.co.il'}`,
    },
    {
      icon: MapPin,
      label: lang === 'he' ? 'כתובת' : 'Address',
      value: info?.address || (lang === 'he' ? 'נתניה, ישראל' : 'Netanya, Israel'),
      href: `https://maps.google.com/?q=Netanya+Israel`,
    },
    {
      icon: Clock,
      label: lang === 'he' ? 'שעות פעילות' : 'Opening hours',
      value: openingHours,
    },
  ];

  return (
    <div style={{ background: '#fff' }}>
      {/* ── HERO ── */}
      <section style={{ background: `linear-gradient(135deg, #002828, #0a1414)`, padding: '72px 32px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <Stripes opacity={0.4} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#00d4aa', display: 'block', marginBottom: 12 }}>
            {lang === 'he' ? 'צור קשר' : 'Get in touch'}
          </span>
          <h1 style={{ fontSize: 64, fontWeight: 600, letterSpacing: '-.025em', lineHeight: 1.05, margin: '0 0 16px', fontFamily: "'Inter Display', Inter, sans-serif" }}>
            {lang === 'he' ? 'דברו איתנו.' : 'Talk to us.'}
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,.75)', fontWeight: 300, lineHeight: 1.6, margin: 0, maxWidth: 480 }}>
            {lang === 'he'
              ? 'צוות הייצור שלנו ישמח לענות על כל שאלה — פרויקטים, מחירים, זמינות חומרים.'
              : 'Our production team is ready to answer any question — projects, pricing, material availability.'}
          </p>
        </div>
      </section>

      {/* ── MAIN SPLIT ── */}
      <section style={{ padding: '0 32px 96px', background: '#fafaf8', marginTop: -32, position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40 }}>

          {/* ── FORM ── */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 40, boxShadow: '0 12px 40px -16px rgba(0,0,0,.12)' }}>
            {done ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 20, textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: 99, background: '#f0fdfa', color: BRAND_NEUTRAL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={28} />
                </div>
                <h2 style={{ fontSize: 32, fontWeight: 600, fontFamily: "'Inter Display', Inter, sans-serif", margin: 0 }}>
                  {lang === 'he' ? 'ההודעה נשלחה!' : 'Message sent!'}
                </h2>
                <p style={{ fontSize: 15, color: '#737373', fontWeight: 300, lineHeight: 1.6, margin: 0, maxWidth: 360 }}>
                  {lang === 'he'
                    ? 'נחזור אליך תוך יום עסקים אחד. תוכל גם ליצור איתנו קשר ב-WhatsApp.'
                    : "We'll get back to you within one business day. You can also reach us on WhatsApp."}
                </p>
                <a href={`https://wa.me/${whatsapp.replace(/[\s+]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '13px 22px', borderRadius: 999, background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  Open WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: BRAND_NEUTRAL }}>
                    {lang === 'he' ? 'שלח לנו הודעה' : 'Send us a message'}
                  </span>
                  <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-.018em', color: '#0a0a0a', margin: '8px 0 4px', fontFamily: "'Inter Display', Inter, sans-serif" }}>
                    {lang === 'he' ? 'כתוב לנו' : 'Write to us'}
                  </h2>
                  <p style={{ fontSize: 13.5, color: '#737373', margin: 0, fontWeight: 300 }}>
                    {lang === 'he' ? 'ונחזור אליך תוך יום עסקים אחד.' : "We'll respond within one business day."}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <input name="name" value={form.name} onChange={handleChange} placeholder={lang === 'he' ? 'שמך *' : 'Your name *'} required
                    style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                  <input name="company" value={form.company} onChange={handleChange} placeholder={lang === 'he' ? 'חברה (אופציונלי)' : 'Company (optional)'}
                    style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+972 …" required
                    style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                  <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="email@company.com"
                    style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                </div>

                <select name="subject" value={form.subject} onChange={handleChange}
                  style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: form.subject ? '#0a0a0a' : '#a3a3a3', appearance: 'none' }}>
                  <option value="" disabled>{lang === 'he' ? 'נושא *' : 'Subject *'}</option>
                  <option value="quote">{lang === 'he' ? 'הצעת מחיר' : 'Quote request'}</option>
                  <option value="project">{lang === 'he' ? 'פרויקט מותאם' : 'Custom project'}</option>
                  <option value="partnership">{lang === 'he' ? 'שותפות עסקית' : 'Business partnership'}</option>
                  <option value="skylum">Skylum / facades</option>
                  <option value="other">{lang === 'he' ? 'אחר' : 'Other'}</option>
                </select>

                <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                  placeholder={lang === 'he' ? 'כיצד נוכל לעזור? *' : 'How can we help? *'}
                  style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none' }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#a3a3a3' }}>
                    {lang === 'he' ? 'בשליחה אתה מסכים לתנאי הפרטיות.' : 'By submitting, you agree to our privacy terms.'}
                  </span>
                  <button type="submit" disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 24px', borderRadius: 999, background: BRAND_NEUTRAL, color: '#fff', fontSize: 13, fontWeight: 700, cursor: submitting ? 'wait' : 'pointer', border: 0, fontFamily: 'inherit' }}>
                    {submitting ? (lang === 'he' ? 'שולח…' : 'Sending…') : (lang === 'he' ? 'שלח הודעה' : 'Send message')} <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ── CONTACT DETAILS ── */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 32 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#262626' }}>
                {lang === 'he' ? 'פרטי יצירת קשר' : 'Contact details'}
              </span>
              {contactItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <span style={{ width: 36, height: 36, borderRadius: 8, background: '#f5f5f5', color: '#525252', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon size={16} />
                  </span>
                  <div>
                    <span style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: 700, color: '#a3a3a3', display: 'block', marginBottom: 2 }}>{item.label}</span>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                        style={{ fontSize: 14, fontWeight: 600, color: (item as any).green ? '#16a34a' : '#0a0a0a', textDecoration: 'none' }}>
                        {item.value}
                      </a>
                    ) : (
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a' }}>{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#1a1a1a', borderRadius: 16, height: 220, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .08 }} preserveAspectRatio="none" viewBox="0 0 800 220">
                <defs><pattern id="gm" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0 L0 0 0 40" fill="none" stroke="#fff" strokeWidth=".8"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#gm)"/>
              </svg>
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.5)', zIndex: 2 }}>
                <MapPin size={24} style={{ margin: '0 auto 8px' }} />
                <span style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                  {lang === 'he' ? 'נתניה, ישראל' : 'Netanya, Israel'}
                </span>
              </div>
              <a href="https://maps.google.com/?q=Netanya+Israel" target="_blank" rel="noopener noreferrer"
                style={{ position: 'absolute', bottom: 14, right: 14, padding: '8px 14px', borderRadius: 99, background: 'rgba(255,255,255,.15)', color: '#fff', fontSize: 11, fontWeight: 700, textDecoration: 'none', backdropFilter: 'blur(8px)' }}>
                {lang === 'he' ? 'פתח במפות' : 'Open in Maps'} →
              </a>
            </div>

            <div style={{ background: '#f0fdf4', borderRadius: 16, padding: 24, border: '1px solid #bbf7d0' }}>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#16a34a', display: 'block', marginBottom: 8 }}>
                {lang === 'he' ? 'עדיף לדבר?' : 'Prefer to talk?'}
              </span>
              <p style={{ fontSize: 14, color: '#166534', fontWeight: 400, lineHeight: 1.55, margin: '0 0 16px' }}>
                {lang === 'he'
                  ? 'דברו ישירות עם צוות הייצור שלנו ב-WhatsApp — אנחנו מגיבים תוך דקות.'
                  : 'Talk directly to our production team on WhatsApp — we reply within minutes.'}
              </p>
              <a href={`https://wa.me/${whatsapp.replace(/[\s+]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '11px 20px', borderRadius: 99, background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                WhatsApp · {whatsapp}
              </a>
            </div>

            <div style={{ padding: 20, borderRadius: 12, border: '1px solid #e5e5e5', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ background: `linear-gradient(135deg, ${SKYLUM_BLUE}, #141A5C)`, color: '#fff', padding: '3px 8px', borderRadius: 4, fontSize: 9, fontWeight: 800, letterSpacing: '.18em', flexShrink: 0, marginTop: 2 }}>SKYLUM</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', marginBottom: 4 }}>
                  {lang === 'he' ? 'שאלות לגבי חזיתות ו-ACP?' : 'Questions about facades & ACP?'}
                </div>
                <p style={{ fontSize: 12.5, color: '#737373', fontWeight: 300, margin: 0, lineHeight: 1.5 }}>
                  {lang === 'he'
                    ? 'ציין "סקיילום" בנושא ונעביר לצוות המתאים.'
                    : 'Mention "Skylum" in the subject and we\'ll route you to the right team.'}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};
