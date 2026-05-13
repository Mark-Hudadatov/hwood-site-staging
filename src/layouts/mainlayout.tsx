/**
 * MAIN LAYOUT
 */

import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import { supabase } from '../services/supabase';
import { getCompanyInfo } from '../services/data/dataService';
import { getOrderTypeConfig, BRAND_NEUTRAL } from '../lib/OrderTypes';
import type { ServiceOrderType } from '../lib/OrderTypes';

// Premium Components
import { LoadingScreen, PageTransition } from '../components/premium';
import { CookieBanner } from '../components/CookieBanner';

// WhatsApp Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ScrollToTop Component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

// ── TopBar ───────────────────────────────────────────────────────────────────
const TopBar: React.FC<{ phone: string; email: string }> = ({ phone, email }) => {
  const { i18n } = useTranslation();
  const isHe = i18n.language?.startsWith('he');

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, background: '#002828', color: 'rgba(255,255,255,0.78)', fontSize: 11.5, overflow: 'hidden' }}>
      {/* Diagonal teal stripes */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <span style={{ position: 'absolute', top: '-50%', left: '-3rem', width: '8rem', height: '200%', transform: 'skewX(-20deg)', background: '#005f5f', opacity: 0.5 }} />
        <span style={{ position: 'absolute', top: '-50%', left: '4rem', width: '4rem', height: '200%', transform: 'skewX(-20deg)', background: '#004d4d', opacity: 0.45 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, padding: '7px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        {/* Left: status + contact */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: 99, background: '#00d4aa', boxShadow: '0 0 9px #00d4aa', flexShrink: 0 }} />
            <span style={{ fontWeight: 600, color: '#fff' }}>
              {isHe ? 'פעיל לייצור' : 'Production active'}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>
              {isHe ? 'נתניה · אא–הי 9:00–18:00' : 'Netanya · 9:00 — 18:00 IST'}
            </span>
          </span>
          {(phone || email) && (
            <span style={{ width: 1, height: 13, background: 'rgba(255,255,255,0.18)', flexShrink: 0 }} />
          )}
          {phone && (
            <a href={`tel:${phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontWeight: 500 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {phone}
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              {email}
            </a>
          )}
        </div>

        {/* Right: language toggle */}
        <button
          onClick={() => i18n.changeLanguage(isHe ? 'en' : 'he')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.22)', color: '#fff', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          {isHe ? 'English' : 'עברית'}
        </button>
      </div>
    </div>
  );
};

// ── Header ───────────────────────────────────────────────────────────────────
const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const isHe = i18n.language?.startsWith('he');
  const [contact, setContact] = useState({ phone: '', email: '' });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    getCompanyInfo().then(info => {
      if (info) setContact({ phone: info.phone || '', email: info.email || '' });
    });
  }, []);

  const navLinks = [
    { label: isHe ? 'אודות' : 'About',        sub: isHe ? 'הצוות והמפעל'      : 'Workshop & team',    path: '/about'     },
    { label: isHe ? 'פרויקטים' : 'Portfolio',  sub: isHe ? 'פרויקטים אחרונים'  : 'Recent projects',    path: '/portfolio' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.08)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <TopBar phone={contact.phone} email={contact.email} />

      <div style={{ display: 'flex', alignItems: 'stretch', minHeight: 72 }}>

        {/* Logo */}
        <a onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', padding: '10px 24px', borderRight: '1px solid #efefef', cursor: 'pointer', flexShrink: 0, textDecoration: 'none' }}>
          <img src="/logo.png" alt="HWOOD" style={{ height: 44, width: 'auto', maxWidth: 150 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </a>

        {/* Nav — desktop */}
        <nav className="hidden lg:flex" style={{ flex: 1, alignItems: 'stretch', padding: '0 8px', display: 'flex' }}>
          {navLinks.map(link => (
            <a
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '0 20px', cursor: 'pointer', textDecoration: 'none',
                borderBottom: isActive(link.path) ? '2px solid #005f5f' : '2px solid transparent',
                marginBottom: -1, transition: 'border-color 0.15s',
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: isActive(link.path) ? '#005f5f' : '#0a0a0a' }}>
                {link.label}
              </span>
              <span style={{ fontSize: 10, color: '#a3a3a3', marginTop: 2 }}>{link.sub}</span>
            </a>
          ))}
        </nav>

        {/* Spacer on mobile */}
        <div className="lg:hidden" style={{ flex: 1 }} />

        {/* Get a quote CTA */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', borderLeft: '1px solid #efefef', flexShrink: 0 }}>
          <button
            onClick={() => navigate('/quote')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#005f5f', color: '#fff', border: 0, padding: '10px 20px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 4px 14px -4px rgba(0,95,95,0.5)', whiteSpace: 'nowrap' }}
          >
            {isHe ? 'קבל הצעת מחיר' : 'Get a quote'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Skylum notched panel — desktop only */}
        <aside
          onClick={() => window.open('https://skylum.co.il', '_blank')}
          className="hidden md:flex"
          style={{ position: 'relative', minWidth: 210, flexShrink: 0, padding: '10px 20px 10px 36px', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 3, background: '#f0f0ee', clipPath: 'polygon(22px 0%, 100% 0%, 100% 100%, 0% 100%)', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#888', whiteSpace: 'nowrap' }}>
            {isHe ? 'חלק מ-Skylum Group' : 'Part of Skylum Group'}
          </span>
          <img src="/logo-skylum.png" alt="SKYLUM" style={{ height: 26, width: 'auto', maxWidth: 130 }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const el = document.createElement('span');
              el.textContent = 'SKYLUM';
              el.style.cssText = 'font-size:15px;font-weight:800;color:#14225C;letter-spacing:0.06em';
              (e.target as HTMLImageElement).parentNode?.appendChild(el);
            }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0091DB', whiteSpace: 'nowrap' }}>
            {isHe ? 'בקר ב-Skylum' : 'Visit Skylum'}
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </span>
        </aside>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', width: 48, borderLeft: '1px solid #efefef', flexShrink: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round">
            {mobileOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #f0f0f0', padding: '12px 0' }}>
          {[...navLinks, { label: isHe ? 'צור קשר' : 'Contact', sub: '', path: '/contact' }].map(link => (
            <a
              key={link.path}
              onClick={() => { navigate(link.path); setMobileOpen(false); }}
              style={{ display: 'block', padding: '10px 24px', fontSize: 14, fontWeight: 600, color: '#0a0a0a', cursor: 'pointer', textDecoration: 'none' }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ padding: '10px 24px' }}>
            <button
              onClick={() => { navigate('/quote'); setMobileOpen(false); }}
              style={{ background: '#005f5f', color: '#fff', border: 0, borderRadius: 999, padding: '10px 20px', fontSize: 12, fontWeight: 700, width: '100%', cursor: 'pointer' }}
            >
              {isHe ? 'קבל הצעת מחיר' : 'Get a quote'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

// ── Footer ───────────────────────────────────────────────────────────────────
const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isHe = i18n.language?.startsWith('he');
  const [company, setCompany] = useState<{ name: string; phone: string; email: string; address: string; description: string } | null>(null);
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);

  useEffect(() => {
    getCompanyInfo().then(info => {
      if (info) setCompany({ name: info.name || 'HWOOD', phone: info.phone || '', email: info.email || '', address: info.address || '', description: info.description || '' });
    });
    supabase.from('social_links').select('*').eq('is_visible', true).order('sort_order').then(({ data }) => {
      if (data) setSocialLinks(data.filter((l: any) => l.url).map((l: any) => ({ platform: l.platform, url: l.url })));
    });
  }, []);

  const SocialIcon: React.FC<{ platform: string }> = ({ platform }) => {
    switch (platform.toLowerCase()) {
      case 'facebook':  return <Facebook className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'linkedin':  return <Linkedin className="w-4 h-4" />;
      case 'youtube':   return <Youtube className="w-4 h-4" />;
      case 'whatsapp':  return <MessageCircle className="w-4 h-4" />;
      default:          return null;
    }
  };

  const footerCols = [
    {
      heading: isHe ? 'הזמנה' : 'Order',
      accent: undefined as string | undefined,
      links: [
        { label: isHe ? 'הזמנה מקטלוג'     : 'Catalog Order',   path: '/quote?type=browse',    external: undefined, accent: false },
        { label: isHe ? 'הזמנת פרויקט'     : 'Project Order',   path: '/quote?type=file',      external: undefined, accent: false },
        { label: isHe ? 'הזמנה מותאמת'     : 'Custom Order',    path: '/quote?type=describe',  external: undefined, accent: false },
        { label: isHe ? 'בקשת הצעת מחיר'  : 'Request a Quote', path: '/quote',                external: undefined, accent: false },
      ],
    },
    {
      heading: 'Skylum',
      accent: '#0091DB' as string | undefined,
      links: [
        { label: isHe ? 'אודות סקיילום'   : 'About Skylum',     path: undefined, external: 'https://skylum.co.il', accent: false },
        { label: isHe ? 'מערכות חזית'     : 'Facade Systems',   path: '/services/facade-systems-acp', external: undefined, accent: false },
        { label: isHe ? 'אספקת ACP ו-HPL' : 'ACP & HPL Supply', path: '/services/materials-panel-supply', external: undefined, accent: false },
        { label: isHe ? 'בקר Skylum ←'   : 'Visit Skylum →',   path: undefined, external: 'https://skylum.co.il', accent: true },
      ],
    },
    {
      heading: isHe ? 'החברה' : 'Company',
      accent: undefined as string | undefined,
      links: [
        { label: isHe ? 'אודות'      : 'About',     path: '/about',     external: undefined, accent: false },
        { label: isHe ? 'פרויקטים'  : 'Portfolio',  path: '/portfolio', external: undefined, accent: false },
        { label: isHe ? 'צור קשר'   : 'Contact',    path: '/contact',   external: undefined, accent: false },
      ],
    },
  ];

  const iconStyle: React.CSSProperties = { width: 36, height: 36, borderRadius: 99, border: '1px solid rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', cursor: 'pointer', flexShrink: 0 };

  return (
    <footer style={{ position: 'relative', background: '#002828', color: '#fff', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Diagonal teal stripes */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <span style={{ position: 'absolute', top: '-40%', left: '-4rem', width: '14rem', height: '200%', transform: 'skewX(-20deg)', background: '#005f5f', opacity: 0.5 }} />
        <span style={{ position: 'absolute', top: '-40%', left: '7rem', width: '8rem', height: '200%', transform: 'skewX(-20deg)', background: '#004d4d', opacity: 0.38 }} />
      </div>

      {/* GET IN TOUCH */}
      <div style={{ position: 'relative', zIndex: 2, padding: '52px 64px 32px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'end', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <span style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00d4aa', marginBottom: 12 }}>
            {isHe ? 'צור קשר' : 'Get in touch'}
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.6rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0, maxWidth: 680, color: '#fff' }}>
            {isHe
              ? 'שלח בריף, DXF, או שאלה. אנחנו עונים תוך יום עסקים.'
              : 'Send a brief, a DXF, or a question. We reply within one business day.'}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 12, flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/quote')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', color: '#002828', border: 0, padding: '13px 24px', borderRadius: 999, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {isHe ? 'התחל הזמנה' : 'Start an order'}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </button>
          {company?.email && (
            <a
              href={`mailto:${company.email}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.28)', padding: '12px 22px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              {isHe ? 'שלח אימייל' : 'Email order desk'}
            </a>
          )}
        </div>
      </div>

      {/* MAIN GRID */}
      <div style={{ position: 'relative', zIndex: 2, padding: '48px 64px 32px', display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 48 }}>
        {/* Brand column */}
        <div>
          <img src="/logo.png" alt="HWOOD" style={{ height: 42, width: 'auto', filter: 'brightness(0) invert(1)', marginBottom: 20 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          {company?.description && (
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.62)', fontWeight: 300, lineHeight: 1.65, marginBottom: 20, maxWidth: 320 }}>{company.description}</p>
          )}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 20 }}>
            {company?.address && (
              <li style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: 'rgba(255,255,255,0.72)', fontWeight: 300 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {company.address}
              </li>
            )}
            {company?.phone && (
              <li>
                <a href={`tel:${company.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'rgba(255,255,255,0.72)', fontWeight: 300, textDecoration: 'none' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {company.phone}
                </a>
              </li>
            )}
            {company?.email && (
              <li>
                <a href={`mailto:${company.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'rgba(255,255,255,0.72)', fontWeight: 300, textDecoration: 'none' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  {company.email}
                </a>
              </li>
            )}
            <li style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'rgba(255,255,255,0.72)', fontWeight: 300 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {isHe ? 'אי–הי · 9:00–18:00' : 'Sun – Thu · 9:00 – 18:00 IST'}
            </li>
          </ul>
          {socialLinks.length > 0 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {socialLinks.map(l => (
                <a key={l.platform} href={l.url} target="_blank" rel="noopener noreferrer" style={iconStyle}>
                  <SocialIcon platform={l.platform} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Nav columns */}
        {footerCols.map(col => (
          <div key={col.heading}>
            <span style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', marginBottom: 18, color: col.accent || 'rgba(255,255,255,0.4)' }}>
              {col.heading}
            </span>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.external
                    ? (
                      <a href={link.external} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: link.accent ? '#7FC9FF' : 'rgba(255,255,255,0.8)', fontWeight: 300, textDecoration: 'none', cursor: 'pointer' }}>
                        {link.label}
                      </a>
                    ) : (
                      <a onClick={() => link.path && navigate(link.path)} style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 300, cursor: 'pointer', textDecoration: 'none' }}>
                        {link.label}
                      </a>
                    )
                  }
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* SKYLUM LOCKUP + BACK TO TOP */}
      <div style={{ position: 'relative', zIndex: 2, padding: '28px 64px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 24 }}>
        {/* Left: Skylum parent */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', display: 'block', marginBottom: 4 }}>
              {isHe ? 'חלק מ' : 'Part of'}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>
              <strong style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>SKYLUM Ltd</strong>
              {' · '}{isHe ? 'בנייה ואיקלום' : 'Quality facade building'}
            </span>
          </div>
          <img src="/logo-skylum.png" alt="SKYLUM" style={{ height: 34, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.82 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>

        {/* Center: back to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, background: 'transparent', border: 0, cursor: 'pointer', padding: '4px 12px' }}
        >
          <span style={{ width: 50, height: 50, borderRadius: 99, background: '#fff', color: '#002828', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px -6px rgba(0,0,0,0.4), 0 0 0 5px rgba(255,255,255,0.06)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
          </span>
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
            {isHe ? 'חזרה למעלה' : 'Back to top'}
          </span>
        </button>

        {/* Right: HWOOD division */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src="/logo.png" alt="HWOOD" style={{ height: 34, width: 'auto', filter: 'brightness(0) invert(1)' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00d4aa', display: 'block', marginBottom: 4 }}>
              {isHe ? 'חטיבה' : 'Division'}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>
              <strong style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>HWOOD</strong>
              {' · '}{isHe ? 'עיבוד עץ ו-CNC, נתניה' : 'Woodwork & CNC, Netanya'}
            </span>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div style={{ position: 'relative', zIndex: 2, padding: '14px 64px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)', flexWrap: 'wrap', gap: 12 }}>
        <span>© 2026 HWOOD · Skylum Ltd · Netanya, Israel · {isHe ? 'כל הזכויות שמורות' : 'All rights reserved'}</span>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{isHe ? 'פרטיות' : 'Privacy'}</Link>
          <Link to="/terms"   style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{isHe ? 'תנאים' : 'Terms'}</Link>
          <Link to="/cookies" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Cookies</Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>EN / עברית</span>
        </div>
      </div>
    </footer>
  );
};

const FooterWrapper: React.FC = () => <Footer />;

// ── Breadcrumb ────────────────────────────────────────────────────────────────
interface BreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
  orderType?: ServiceOrderType | string | null;
}
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, orderType }) => {
  const t = getOrderTypeConfig(orderType);
  return (
    <nav aria-label="breadcrumb" style={{ padding: '14px 32px', background: '#fafaf8', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, letterSpacing: '.05em', color: '#737373', fontWeight: 500 }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: '#c4c4c4' }}>/</span>}
          {it.href ? (
            <Link to={it.href} style={{ color: '#737373', textDecoration: 'none' }}>{it.label}</Link>
          ) : (
            <span style={{ color: t?.tagFg || BRAND_NEUTRAL, fontWeight: 600 }}>{it.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// WhatsApp Button
const WhatsAppButton: React.FC = () => {
  const whatsappNumber = '972549222804';
  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#20BA5C] hover:scale-110 transition-all duration-300"
      aria-label="Contact us on WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </a>
  );
};

// Main Layout Export
export const MainLayout: React.FC = () => {
  return (
    <>
      <LoadingScreen minDuration={1200} />
      <div className="w-full min-h-screen font-sans flex flex-col" style={{ overflowX: 'clip' }}>
        <ScrollToTop />
        <Header />
        <main className="flex-1 flex flex-col">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <FooterWrapper />
        <WhatsAppButton />
        <CookieBanner />
      </div>
    </>
  );
};

export { Breadcrumb };
