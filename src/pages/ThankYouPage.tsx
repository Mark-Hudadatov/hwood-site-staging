/**
 * THANK YOU PAGE — 3 variants by order type
 * ==========================================
 * Route: /thank-you/:orderType
 * Design ref: redesign/journey/page-thankyou.jsx
 *
 * Variants:
 *   browse-and-order      → "Your quote is on its way."
 *   send-file-and-process → "We're opening your files now."
 *   describe-and-request  → "Your brief landed with our designer."
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check, FileText, Grid3X3, PenLine, ArrowRight } from 'lucide-react';
import { ROUTES } from '../router';
import { Stripes } from '../components/journey/stripes';
import { getHeroColors, getOrderTypeConfig, BRAND_NEUTRAL, ServiceOrderType } from '../lib/OrderTypes';

// ── Ref number generator ──────────────────────────────────────────────────────────────
const genRef = (type: ServiceOrderType): string => {
  const prefix = type === 'browse-and-order' ? 'QUO' : type === 'send-file-and-process' ? 'PRJ' : 'CST';
  const year = new Date().getFullYear();
  const mo = String(new Date().getMonth() + 1).padStart(2, '0');
  const n = Math.floor(1000 + Math.random() * 8999);
  return `${prefix}-${year}-${mo}-${n}`;
};

// ── Order summary (populated from sessionStorage in production) ───────────────────
type SummaryItem = [string, string, string];
interface Summary { title: string; items: SummaryItem[]; foot: string; }

const getSummary = (type: ServiceOrderType): Summary => {
  if (type === 'browse-and-order') return {
    title: 'Modules in your quote',
    items: [['B-60-D1', 'Base 600mm · 1 door', '× 4'], ['B-80-D2-S1', 'Base 800mm · 2 doors', '× 2'], ['W-60-D1', 'Wall 600mm · 1 door', '× 6']],
    foot: 'White matte MDF · ABS 1mm',
  };
  if (type === 'send-file-and-process') return {
    title: 'Files we received',
    items: [['DXF', 'Your uploaded file', '✓'], ['Brief', 'Project description', '✓']],
    foot: 'MDF 18mm · within 1 wk',
  };
  return {
    title: 'Your brief',
    items: [['TYPE', 'Custom kitchen', ''], ['AREA', '—', ''], ['STYLE', 'As described', '']],
    foot: 'References attached',
  };
};

// ── THANK YOU PAGE ─────────────────────────────────────────────────────────────
export const ThankYouPage: React.FC = () => {
  const { orderType: rawType } = useParams<{ orderType: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const typeMap: Record<string, ServiceOrderType> = {
    'browse-and-order':     'browse-and-order',
    'send-file-and-process': 'send-file-and-process',
    'describe-and-request': 'describe-and-request',
    'catalog':  'browse-and-order',
    'project':  'send-file-and-process',
    'custom':   'describe-and-request',
  };
  const orderType: ServiceOrderType = typeMap[rawType || ''] || 'browse-and-order';

  const hero = getHeroColors(orderType);
  const t = getOrderTypeConfig(orderType);
  const summary = getSummary(orderType);
  const [refNumber] = useState(() => genRef(orderType));

  const headline = orderType === 'browse-and-order'
    ? 'Your quote is on its way.'
    : orderType === 'send-file-and-process'
    ? "We're opening your files now."
    : 'Your brief landed with our designer.';

  const sub = orderType === 'browse-and-order'
    ? "We'll email you a costed list of the modules you picked, with lead time and stock confirmation. Usually within 1 business day."
    : orderType === 'send-file-and-process'
    ? "An engineer is checking your DXF and material spec. We'll come back with a quote and lead time within 1 business day."
    : "A senior designer is reading your brief. We'll set up a free 30-minute call to talk through it within 2 business days.";

  const copyRef = () => {
    navigator.clipboard.writeText(refNumber).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const nextSteps = orderType === 'browse-and-order' ? [
    { l: 'We received your request', d: 'Just now', done: true },
    { l: 'We draft your quote', d: 'within ~2 hours', done: false, active: true },
    { l: 'You get the quote', d: 'within 1 business day', done: false },
  ] : orderType === 'send-file-and-process' ? [
    { l: 'We received your request', d: 'Just now', done: true },
    { l: 'Engineer reviews files', d: 'within ~2 hours', done: false, active: true },
    { l: 'You get the quote', d: 'within 1 business day', done: false },
  ] : [
    { l: 'We received your request', d: 'Just now', done: true },
    { l: 'Designer reads brief', d: 'within ~2 hours', done: false, active: true },
    { l: '30-min call scheduled', d: 'within 2 business days', done: false },
  ];

  return (
    <div style={{ background: '#fff' }}>
      {/* ── HERO CONFIRMATION ── */}
      <section style={{ background: `linear-gradient(135deg, ${hero.heroFrom}, ${hero.heroTo})`, padding: '88px 32px 120px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <Stripes opacity={0.16} />
        <div style={{ maxWidth: 980, margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{ width: 88, height: 88, borderRadius: 99, background: t.accent, color: '#0a0a0a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: `0 0 0 12px ${t.accent}30, 0 0 0 28px ${t.accent}15`, animation: 'check-pop .5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
            <Check size={40} strokeWidth={2.5} />
          </div>

          <div style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: t.accent, marginBottom: 16 }}>
            Received · {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
          <h1 style={{ fontSize: 64, fontWeight: 600, letterSpacing: '-.025em', lineHeight: 1.05, margin: '0 0 18px', fontFamily: "'Inter Display', Inter, sans-serif" }}>
            {headline}
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,.78)', fontWeight: 300, lineHeight: 1.55, margin: '0 auto 28px', maxWidth: 620 }}>
            {sub}
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '10px 18px', borderRadius: 99, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', backdropFilter: 'blur(10px)' }}>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: 'rgba(255,255,255,.6)', letterSpacing: '.15em', textTransform: 'uppercase' }}>Reference</span>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '.05em' }}>{refNumber}</span>
            <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,.2)' }} />
            <button onClick={copyRef} style={{ background: 'transparent', border: 0, color: copied ? '#fff' : t.accent, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '.05em' }}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section style={{ background: '#fafaf8', padding: '0 32px 96px', marginTop: -64, position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24 }}>

          {/* WhatsApp CTA card */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 36, position: 'relative', overflow: 'hidden', boxShadow: '0 16px 48px -20px rgba(0,0,0,.18)' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: 99, background: `radial-gradient(circle, ${t.accent}25, transparent 60%)` }} aria-hidden="true" />
            <div style={{ position: 'relative' }}>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: t.tagFg }}>1-tap account</span>
              <h2 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-.018em', color: '#0a0a0a', margin: '10px 0 14px', lineHeight: 1.15, fontFamily: "'Inter Display', Inter, sans-serif" }}>
                Track this {orderType === 'browse-and-order' ? 'quote' : orderType === 'send-file-and-process' ? 'order' : 'project'} on WhatsApp.
              </h2>
              <p style={{ fontSize: 14, color: '#525252', margin: '0 0 24px', fontWeight: 300, lineHeight: 1.55 }}>
                Skip passwords. We'll create your account in one tap on the number you gave us. Updates land in WhatsApp, where you already are.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {[
                  [Grid3X3, 'Track status live', orderType === 'browse-and-order' ? 'Quote drafted → sent → produced' : orderType === 'send-file-and-process' ? 'Files reviewed → quoted → cutting → ready' : 'Concept → quoted → in production'],
                  [FileText, 'Save your configurations', 'Re-order or refine in 2 taps next time.'],
                  [PenLine, 'Direct line to the team', 'Reply to any update — goes straight to a real engineer.'],
                ].map(([Icon, l, d], i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span style={{ width: 32, height: 32, borderRadius: 8, background: t.tagBg, color: t.tagFg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} />
                    </span>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0a0a0a', marginBottom: 2 }}>{l as string}</div>
                      <span style={{ fontSize: 12.5, color: '#737373', fontWeight: 300, lineHeight: 1.5 }}>{d as string}</span>
                    </div>
                  </div>
                ))}
              </div>

              <a href="https://wa.me/972501234567" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%', padding: '16px 22px', borderRadius: 99, background: '#25D366', color: '#fff', border: 0, fontSize: 14, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', boxShadow: '0 8px 24px -10px rgba(37,211,102,.6)' }}>
                Continue with WhatsApp
              </a>
              <button onClick={() => navigate('/')} style={{ width: '100%', padding: '13px 22px', borderRadius: 99, background: 'transparent', color: '#525252', border: 0, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', marginTop: 10 }}>
                Just email me, no account →
              </button>
              <span style={{ display: 'block', marginTop: 16, fontFamily: 'ui-monospace, monospace', fontSize: 10.5, color: '#a3a3a3', textAlign: 'center' }}>
                We'll send one verification message · no marketing spam, ever.
              </span>
            </div>
          </div>

          {/* Summary + timeline */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#262626' }}>{summary.title}</span>
                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#a3a3a3' }}>{summary.items.length} {orderType === 'browse-and-order' ? 'lines' : orderType === 'send-file-and-process' ? 'files' : 'fields'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {summary.items.map(([k, v, q], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < summary.items.length - 1 ? '1px solid #f5f5f5' : 0 }}>
                    <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: t.tagFg, fontWeight: 700, width: 72, flexShrink: 0 }}>{k}</span>
                    <span style={{ flex: 1, fontSize: 13, color: '#262626' }}>{v}</span>
                    {q && <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: '#737373' }}>{q}</span>}
                  </div>
                ))}
              </div>
              <div style={{ paddingTop: 8, borderTop: '1px solid #f0f0f0', fontSize: 12, color: '#737373', fontStyle: 'italic' }}>{summary.foot}</div>
            </div>

            <div style={{ background: `linear-gradient(135deg, ${hero.heroFrom}08, transparent)`, border: `1px solid ${t.accent}30`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: t.tagFg }}>What happens next</span>
              {nextSteps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, position: 'relative' }}>
                  {i < nextSteps.length - 1 && <span style={{ position: 'absolute', left: 11, top: 24, bottom: -10, width: 2, background: s.done ? t.accent : '#e5e5e5' }} />}
                  <span style={{ width: 24, height: 24, borderRadius: 99, flexShrink: 0, background: s.done ? t.accent : s.active ? '#fff' : '#f0f0f0', border: s.active ? `2px solid ${t.accent}` : '0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                    {s.done ? <Check size={13} color="#0a0a0a" /> : s.active ? <span style={{ width: 8, height: 8, borderRadius: 99, background: t.accent }} /> : null}
                  </span>
                  <div style={{ paddingTop: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0a0a0a' }}>{s.l}</div>
                    <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#737373' }}>{s.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div style={{ maxWidth: 1100, margin: '32px auto 0', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {[
            { l: orderType === 'browse-and-order' ? 'Browse more modules' : 'See more services', a: 'Continue exploring', href: '/' },
            { l: 'Read our case studies', a: 'Recent projects', href: '/portfolio' },
            { l: 'Talk to us now', a: '+972 9 890-0000', href: 'tel:+97298900000' },
          ].map((c) => (
            <Link key={c.href} to={c.href} style={{ padding: '20px 24px', borderRadius: 14, background: '#fff', border: '1px solid #efefef', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6, textDecoration: 'none' }}>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#737373' }}>{c.l}</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                {c.a} <ArrowRight size={14} color={t.tagFg} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
