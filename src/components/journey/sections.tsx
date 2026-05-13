/**
 * JOURNEY SECTIONS — Reusable cross-page sections
 * Used by ServicePage, SubservicePage, HomePage.
 */
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Stripes } from './stripes';
import { getOrderTypeConfig, getHeroColors, BRAND_NEUTRAL } from '../../lib/OrderTypes';
import type { ServiceOrderType, ServiceBrand } from '../../lib/OrderTypes';

// ─── WHO WE WORK WITH ────────────────────────────────────────────────────────

const WHO_DATA: Record<string, Array<{ n: string; eye: string; title: string; body: string; brand?: string }>> = {
  'browse-and-order': [
    { n: '01', eye: 'Cabinet manufacturers', title: 'Series & project-based factories', body: 'Repeatable manufacturing, dimensional consistency, predictable SKU throughput.' },
    { n: '02', eye: 'Kitchen studios', title: 'Studio retailers shipping series', body: 'Standard modules, fast lead time, white-label ready.' },
    { n: '03', eye: 'Fit-out contractors', title: 'Site-ready cabinetry', body: 'Pre-assembled units, on-site delivery scheduling, system-compatible.' },
  ],
  'send-file-and-process': [
    { n: '01', eye: 'Carpentry & joinery', title: 'Pro workshops scaling output', body: 'Send DXF or panel list; we cut, edge, and ship back ready-to-assemble.' },
    { n: '02', eye: 'Architecture studios', title: 'Custom panel processing', body: 'Spec-driven CNC machining for non-standard geometry.' },
    { n: '03', eye: 'Skylum facade pros', title: 'Facade & ACP processing', body: 'ACP, HPL, and aluminum composite cutting under Skylum brand.', brand: 'skylum' },
  ],
  'describe-and-request': [
    { n: '01', eye: 'Private clients', title: 'End-to-end custom kitchens', body: 'From a sketch on paper to installed kitchen — engineering, materials, fitting.' },
    { n: '02', eye: 'Interior designers', title: 'Designer-led custom interiors', body: 'We translate your design into manufacturing-ready specs.' },
    { n: '03', eye: 'Architects on residential', title: 'Bespoke residential projects', body: 'Cabinetry, fronts, custom storage — engineered to your design.' },
  ],
};

interface WhoWeWorkWithProps {
  orderType?: ServiceOrderType | string | null;
  brand?: ServiceBrand | string | null;
}

export const WhoWeWorkWith: React.FC<WhoWeWorkWithProps> = ({ orderType, brand }) => {
  const t = getOrderTypeConfig(orderType);
  const data = WHO_DATA[orderType as string] || WHO_DATA['browse-and-order'];
  const lang_title = orderType === 'browse-and-order'
    ? 'produce cabinets at scale'
    : orderType === 'send-file-and-process'
    ? 'process panels for clients'
    : 'build one-of-a-kind interiors';
  void brand;

  return (
    <section style={{ background: t.surface, padding: '96px 32px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: t.tagFg }}>
            Who this is for
          </span>
          <h2 style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-.02em', margin: '14px 0 0', lineHeight: 1.1, fontFamily: "'Inter Display', Inter, sans-serif" }}>
            If you {lang_title},<br />we speak the same language.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {data.map((c) => (
            <article key={c.n} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 260 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#a3a3a3' }}>{c.n} / 03</span>
                <span style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: 700, color: t.accentDark }}>{c.eye}</span>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-.01em', margin: 0, color: '#0a0a0a', fontFamily: "'Inter Display', Inter, sans-serif" }}>{c.title}</h3>
              <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.6, fontWeight: 300, margin: 0, flex: 1 }}>{c.body}</p>
              <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: t.tagFg, fontSize: 11, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', textDecoration: 'none' }}>
                How we work <ArrowRight size={13} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────

const HOW_STEPS: Record<string, Array<{ t: string; b: string }>> = {
  'browse-and-order': [
    { t: 'Browse the catalog', b: '30+ ready cabinet modules. Filter by size, function, doors.' },
    { t: 'Configure & add to list', b: 'Pick variant, material, edge band. Build your set.' },
    { t: 'Get a costed quote', b: 'Within 1 business day. Materials, lead time, breakdown.' },
    { t: 'Production & delivery', b: 'Tracked job. Delivered to site or workshop.' },
  ],
  'send-file-and-process': [
    { t: 'Send your file', b: 'DXF, DWG, panel XLS, or sketch — drag and drop.' },
    { t: 'Spec confirmation', b: 'We confirm material, edge, quantity. Costed plan back to you.' },
    { t: 'CNC processing', b: 'Cut, edge-banded, drilled. Quality-checked before shipping.' },
    { t: 'Pickup or delivery', b: 'Ready in 72h average. Pickup Netanya or shipped to you.' },
  ],
  'describe-and-request': [
    { t: 'Describe your vision', b: "Photos, sketch, words. We don't need CAD to start." },
    { t: 'Engineering brief', b: 'We translate your idea into a manufacturing spec.' },
    { t: 'Materials & quote', b: 'Pick finishes, get a costed proposal you can compare.' },
    { t: 'Build & install', b: 'Production at our facility, install at yours.' },
  ],
};

interface HowItWorksProps {
  orderType?: ServiceOrderType | string | null;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ orderType }) => {
  const t = getHeroColors(orderType);
  const steps = HOW_STEPS[orderType as string] || HOW_STEPS['browse-and-order'];
  const fromDesc = orderType === 'browse-and-order' ? 'first click' : orderType === 'send-file-and-process' ? 'DXF' : 'first idea';
  const toDesc = orderType === 'browse-and-order' ? 'a costed plan in 24 hours' : orderType === 'describe-and-request' ? 'an installed result' : 'a costed plan';

  return (
    <section style={{ background: `linear-gradient(135deg, ${t.heroFrom}, ${t.heroTo})`, color: '#fff', padding: '120px 32px', position: 'relative', overflow: 'hidden' }}>
      <Stripes opacity={0.18} />
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: t.accent }}>How it works</span>
          <h2 style={{ fontSize: 48, fontWeight: 600, letterSpacing: '-.02em', margin: '14px 0 0', lineHeight: 1.1, maxWidth: 880, fontFamily: "'Inter Display', Inter, sans-serif" }}>
            From your {fromDesc} to {toDesc}.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ padding: 28, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, color: t.accent }}>{`0${i + 1}`}</span>
              <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-.01em', margin: 0, color: '#fff', fontFamily: "'Inter Display', Inter, sans-serif" }}>{s.t}</h3>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.7)', lineHeight: 1.55, fontWeight: 300, margin: 0 }}>{s.b}</p>
              {i < 3 && (
                <span style={{ position: 'absolute', right: -16, top: 38, color: 'rgba(255,255,255,.25)', zIndex: 3 }}>
                  <ArrowRight size={16} />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── CTA BANNER ───────────────────────────────────────────────────────────────

interface CTABannerProps {
  orderType?: ServiceOrderType | string | null;
  brand?: ServiceBrand | string | null;
  title?: string;
  sub?: string;
  primary?: string;
  onPrimary?: () => void;
}

export const CTABanner: React.FC<CTABannerProps> = ({
  orderType,
  brand,
  title = 'Send us your DXF or describe the job — we reply within one business day.',
  sub = 'EN / HE bilingual support. Free quote, no commitment.',
  primary = 'Request a quote',
  onPrimary,
}) => {
  const t = getHeroColors(orderType, brand);
  return (
    <section style={{ background: `linear-gradient(135deg, ${t.heroFrom}, ${t.heroTo})`, color: '#fff', padding: '80px 32px', position: 'relative', overflow: 'hidden' }}>
      <Stripes opacity={0.2} />
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <div>
          <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: t.accent }}>Ready to start</span>
          <h2 style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-.02em', margin: '14px 0 16px', lineHeight: 1.1, fontFamily: "'Inter Display', Inter, sans-serif" }}>{title}</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.78)', fontWeight: 300, lineHeight: 1.6, margin: 0, maxWidth: 540 }}>{sub}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <button
            onClick={onPrimary}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '13px 22px', borderRadius: 999, fontSize: 13, fontWeight: 700, letterSpacing: '.05em', cursor: 'pointer', background: '#fff', color: '#0a0a0a', border: 0 }}
          >
            {primary} <ArrowRight size={15} />
          </button>
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
    </section>
  );
};

// ─── SECTION EYEBROW ─────────────────────────────────────────────────────────

interface SectionEyebrowProps {
  num: string;
  label: string;
  color?: string;
}

export const SectionEyebrow: React.FC<SectionEyebrowProps> = ({ num, label, color = BRAND_NEUTRAL }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 32 }}>
    <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color }}>
      {num} · {label}
    </span>
    <span style={{ flex: 1, height: 1, background: '#e5e5e5' }} />
  </div>
);

// ─── WHY CHOOSE US ────────────────────────────────────────────────────────────

interface WhyChooseUsProps {
  orderType?: ServiceOrderType | string | null;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ orderType }) => {
  const t = getOrderTypeConfig(orderType);
  const items = [
    { k: '12 yrs', v: 'in CNC production', sub: 'Netanya · since 2014' },
    { k: '2,400 m²', v: 'facility footprint', sub: 'Single-site delivery' },
    { k: '180+', v: 'kitchens / yr', sub: 'Mixed series & custom' },
    { k: '72 h', v: 'avg. lead time', sub: 'From file to ready panel' },
  ];
  return (
    <section style={{ background: '#fff', padding: '96px 32px', borderTop: '1px solid #f0f0f0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: BRAND_NEUTRAL }}>Why HWOOD</span>
          <h2 style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-.02em', margin: '14px 0 0', lineHeight: 1.1, fontFamily: "'Inter Display', Inter, sans-serif" }}>
            Industrial discipline. Studio attention.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
          {items.map((it, i) => (
            <div key={i} style={{ borderTop: `2px solid ${t.accent}`, paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-.02em', color: '#0a0a0a', fontFamily: "'Inter Display', Inter, sans-serif" }}>{it.k}</span>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: t.tagFg }}>{it.v}</span>
              <span style={{ fontSize: 13, color: '#737373', fontWeight: 300 }}>{it.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
