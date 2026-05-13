/**
 * SERVICE PAGE — Unified with order-type + brand variants
 * =========================================================
 * Route: /services/:serviceSlug
 * Design ref: redesign/journey/page-service.jsx
 *
 * Visual theme controlled by service.orderType + service.brand.
 * 7 blocks: Hero → Subservices grid → Who We Work With →
 *           How It Works → Portfolio slider → CTA Banner
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Service, Subservice } from '../domain/types';
import { getServiceBySlug, getSubservicesByServiceSlug } from '../services/data/dataService';
import { ROUTES } from '../router';
import { Stripes } from '../components/journey/stripes';
import { WhoWeWorkWith, HowItWorks, CTABanner } from '../components/journey/sections';
import { OrderTypeTag } from '../components/ui/OrderTypeTag';
import { BrandBadge } from '../components/ui/BrandBadge';
import { getHeroColors, getOrderTypeConfig, BRAND_NEUTRAL } from '../lib/OrderTypes';
import { Breadcrumb } from '../layouts/mainlayout';

// ── Subservice card ───────────────────────────────────────────────────────────
interface SubsCardProps {
  sub: Subservice;
  accent: string;
  tagBg: string;
  tagFg: string;
  initial: string;
  onClick: () => void;
  brand?: string;
}

const SubserviceCard: React.FC<SubsCardProps> = ({ sub, accent, tagBg, tagFg, initial, onClick, brand }) => {
  const [imgErr, setImgErr] = useState(false);
  const FALLBACK = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none"><rect width="600" height="400" fill="#1a1a1a"/><text x="300" y="220" text-anchor="middle" font-size="120" font-family="sans-serif" fill="rgba(255,255,255,0.15)" font-weight="700">${initial}</text></svg>`)}`;

  return (
    <article
      onClick={onClick}
      style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column', position: 'relative', cursor: 'pointer', transition: 'transform .3s, box-shadow .3s, border-color .3s' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-8px)'; el.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,.2)'; el.style.borderColor = '#0a0a0a'; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = ''; el.style.borderColor = '#e5e5e5'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 200, flexShrink: 0 }}>
        <img
          src={imgErr || !sub.imageUrl ? FALLBACK : sub.imageUrl}
          alt={sub.title}
          onError={() => setImgErr(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.4), transparent)' }} />
        {/* Initial badge */}
        <span style={{ position: 'absolute', top: 14, left: 14, width: 32, height: 32, borderRadius: 6, background: accent, color: '#0a0a0a', fontSize: 12, fontWeight: 800, letterSpacing: '.05em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {initial}
        </span>
        {brand === 'skylum' && (
          <span style={{ position: 'absolute', top: 14, right: 14 }}><BrandBadge brand="skylum" /></span>
        )}
        {(sub as any).visibilityStatus === 'coming_soon' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
            <Clock size={20} color="rgba(255,255,255,.8)" />
            <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(255,255,255,.8)' }}>Coming Soon</span>
          </div>
        )}
      </div>
      {/* Body */}
      <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0, color: '#0a0a0a', letterSpacing: '-.01em', fontFamily: "'Inter Display', Inter, sans-serif" }}>{sub.title}</h3>
        <p style={{ fontSize: 13, color: '#525252', lineHeight: 1.55, fontWeight: 300, margin: 0, flex: 1 }}>{sub.description}</p>
        <button style={{ background: tagBg, color: tagFg, border: 0, padding: '10px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: '.04em', cursor: 'pointer', marginTop: 6, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          See more <ArrowRight size={13} />
        </button>
      </div>
    </article>
  );
};

// ── Coming soon placeholder ───────────────────────────────────────────────────
const ComingSoonCard: React.FC<{ tagBg: string; tagFg: string }> = ({ tagBg, tagFg }) => (
  <article style={{ background: '#fafafa', borderRadius: 16, border: '1px dashed #d4d4d4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 280, padding: 32 }}>
    <Clock size={24} color="#a3a3a3" />
    <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#a3a3a3' }}>Coming Soon</span>
  </article>
);

// ── SERVICE PAGE ──────────────────────────────────────────────────────────────
export const ServicePage: React.FC = () => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('he') ? 'he' : 'en';

  const [service, setService] = useState<Service | null>(null);
  const [subservices, setSubservices] = useState<Subservice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceSlug) return;
    Promise.all([getServiceBySlug(serviceSlug), getSubservicesByServiceSlug(serviceSlug)])
      .then(([svc, subs]) => {
        setService(svc);
        setSubservices(subs || []);
        if (svc?.orderType) sessionStorage.setItem('hw_active_order_type', svc.orderType);
      })
      .finally(() => setLoading(false));
  }, [serviceSlug]);

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: 99, border: '3px solid #e5e5e5', borderTopColor: BRAND_NEUTRAL, animation: 'spin .7s linear infinite' }} />
    </div>
  );
  if (!service) return <div style={{ padding: '96px 32px', textAlign: 'center', color: '#737373' }}>Service not found.</div>;

  const hero = getHeroColors(service.orderType, service.brand);
  const t = getOrderTypeConfig(service.orderType);
  const isInformational = service.orderType === 'informational';

  const ctaLabel = service.orderType === 'browse-and-order'
    ? 'Browse catalog'
    : service.orderType === 'send-file-and-process'
    ? 'Send a file'
    : service.orderType === 'describe-and-request'
    ? 'Start a brief'
    : 'Learn more';

  const heroDesc = service.orderType === 'browse-and-order'
    ? 'Ready cabinet modules and components, manufactured to series-grade precision and delivered in days.'
    : service.orderType === 'send-file-and-process'
    ? 'CNC machining for professionals. Send your file — we cut, edge, drill, and return ready-to-assemble panels.'
    : service.orderType === 'describe-and-request'
    ? 'Engineering-led custom kitchens and interiors. From your sketch to an installed result.'
    : service.description;

  return (
    <div style={{ background: '#fff' }}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '#' },
          { label: service.title },
        ]}
        orderType={service.orderType}
      />

      {/* ── HERO ── */}
      <section style={{ background: `linear-gradient(135deg, ${hero.heroFrom}, ${hero.heroTo})`, padding: '80px 32px 120px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <Stripes opacity={0.18} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                <OrderTypeTag orderType={service.orderType} brand={service.brand} variant="overlay" />
                {service.brand === 'skylum' && <BrandBadge brand="skylum" size="md" />}
              </div>
              <h1 style={{ fontSize: 80, lineHeight: 0.98, letterSpacing: '-.028em', fontWeight: 600, margin: '0 0 28px', fontFamily: "'Inter Display', Inter, sans-serif" }}>
                {service.title}
              </h1>
              <p style={{ fontSize: 19, lineHeight: 1.55, color: 'rgba(255,255,255,.8)', fontWeight: 300, margin: '0 0 36px', maxWidth: 540 }}>
                {service.description || heroDesc}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {!isInformational && (
                  <Link
                    to={subservices[0] ? ROUTES.SUBSERVICE(subservices[0].slug) : ROUTES.QUOTE}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '13px 22px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer', background: '#fff', color: '#0a0a0a', border: 0, textDecoration: 'none' }}
                  >
                    {ctaLabel} <ArrowRight size={15} />
                  </Link>
                )}
                <a
                  href="https://wa.me/972501234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '13px 22px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,.4)', textDecoration: 'none' }}
                >
                  Talk on WhatsApp
                </a>
              </div>
            </div>

            {/* Hero image / placeholder */}
            <div style={{ position: 'relative', height: 460, borderRadius: 24, overflow: 'hidden', background: 'rgba(255,255,255,.05)' }}>
              {service.heroImageUrl ? (
                <img src={service.heroImageUrl} alt={service.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : service.imageUrl ? (
                <img src={service.imageUrl} alt={service.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                  <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: '#fff' }}>{service.title} · production overview</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SUBSERVICES GRID ── */}
      {subservices.length > 0 && (
        <section style={{ background: t.surface, padding: '96px 32px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, gap: 24 }}>
              <div>
                <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: t.tagFg }}>What we offer</span>
                <h2 style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-.02em', margin: '14px 0 0', lineHeight: 1.1, fontFamily: "'Inter Display', Inter, sans-serif" }}>
                  {service.orderType === 'browse-and-order' ? 'Production categories' : service.orderType === 'send-file-and-process' ? 'Machining services' : 'Custom directions'}
                </h2>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(subservices.length, 4)},1fr)`, gap: 20 }}>
              {subservices.map((sub, i) => (
                <SubserviceCard
                  key={sub.id}
                  sub={sub}
                  accent={t.accent}
                  tagBg={t.tagBg}
                  tagFg={t.tagFg}
                  initial={sub.title.charAt(0).toUpperCase()}
                  brand={service.brand}
                  onClick={() => navigate(ROUTES.SUBSERVICE(sub.slug))}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Journey sections */}
      {!isInformational && (
        <>
          <WhoWeWorkWith orderType={service.orderType} brand={service.brand} />
          <HowItWorks orderType={service.orderType} />
        </>
      )}

      {/* CTA */}
      <CTABanner
        orderType={service.orderType}
        brand={service.brand}
        title={service.orderType === 'browse-and-order'
          ? 'Ready to order? Browse the catalog or send us your module list.'
          : service.orderType === 'send-file-and-process'
          ? 'Drop your DXF — we quote within one business day.'
          : 'Tell us your brief — the first 30-minute call is free.'}
        sub="EN / HE bilingual support. Free quote, no commitment."
        onPrimary={() => {
          if (subservices[0]) navigate(ROUTES.SUBSERVICE(subservices[0].slug));
          else navigate(ROUTES.QUOTE);
        }}
      />
    </div>
  );
};
