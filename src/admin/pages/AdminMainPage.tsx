import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../../services/supabase';
import { ImageUpload } from '../components';

// ── Types ─────────────────────────────────────────────────────────────────────
interface HeroSettings {
  left_image_url: string; left_title_en: string; left_title_he: string;
  right_link: string; hero_height: string;
  left_video_url?: string; left_subtitle_en?: string; left_subtitle_he?: string;
}
interface HeroRailSettings {
  heading_en: string; heading_he: string;
  eyebrow_en: string; eyebrow_he: string;
  card1_title_en: string; card1_title_he: string;
  card1_badge_en: string; card1_badge_he: string;
  card1_desc_en: string; card1_desc_he: string;
  card1_lead_en: string; card1_lead_he: string;
  card1_link: string;
  card2_title_en: string; card2_title_he: string;
  card2_badge_en: string; card2_badge_he: string;
  card2_desc_en: string; card2_desc_he: string;
  card2_lead_en: string; card2_lead_he: string;
  card2_link: string;
  card3_title_en: string; card3_title_he: string;
  card3_badge_en: string; card3_badge_he: string;
  card3_desc_en: string; card3_desc_he: string;
  card3_lead_en: string; card3_lead_he: string;
  card3_link: string;
  footer_text_en: string; footer_text_he: string;
  footer_cta_en: string; footer_cta_he: string;
  whatsapp_number: string;
  badge1_en: string; badge1_he: string;
  badge2_en: string; badge2_he: string;
}
interface ServicesSectionSettings {
  title_en: string; title_he: string; subtitle_en: string; subtitle_he: string;
  show_descriptions: boolean;
}
interface StoriesSectionSettings {
  title_en: string; title_he: string; button_text_en: string; button_text_he: string;
  button_link: string;
}
interface AboutSectionSettings {
  title_en: string; title_he: string; description_en: string; description_he: string;
  button_text_en: string; button_text_he: string; button_link: string;
  background_color: string; text_color: string;
}
interface LayoutSettings {
  primary_color: string; secondary_color: string; background_dark: string;
}
interface WhoWeWorkWithBox {
  title_en: string; title_he: string; subtitle_en: string; subtitle_he: string;
  description_en: string; description_he: string; image_url: string; overlay_opacity: number;
}
interface WhoWeWorkWithSettings {
  section_title_en: string; section_title_he: string;
  section_description_en: string; section_description_he: string;
  boxes: [WhoWeWorkWithBox, WhoWeWorkWithBox, WhoWeWorkWithBox];
}

// ── Section nav ───────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'sec-hero',     label: 'Hero' },
  { id: 'sec-rail',     label: 'Right Rail' },
  { id: 'sec-services', label: 'Services' },
  { id: 'sec-partners', label: 'Partners' },
  { id: 'sec-stories',  label: 'Stories' },
  { id: 'sec-about',    label: 'About' },
  { id: 'sec-layout',   label: 'Layout' },
];

// ── Field atoms ───────────────────────────────────────────────────────────────
const FL: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 5, letterSpacing: '0.02em' }}>
    {children}
  </label>
);

const FI: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean }> = ({ value, onChange, placeholder, mono }) => (
  <input
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      width: '100%', padding: '7px 10px', border: '1px solid var(--border-1)', borderRadius: 6,
      fontSize: 13, fontFamily: mono ? 'ui-monospace, monospace' : 'inherit',
      background: '#fff', color: 'var(--fg-1)', boxSizing: 'border-box',
    }}
  />
);

const FRow: React.FC<{ cols?: number; children: React.ReactNode }> = ({ cols = 2, children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '0 12px' }}>
    {children}
  </div>
);

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <div style={{ marginBottom: 16 }}>
    <FL>{label}</FL>
    {children}
    {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
  </div>
);

const Divider: React.FC<{ label?: string }> = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
    {label && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', whiteSpace: 'nowrap' }}>{label}</span>}
    <div style={{ flex: 1, height: 1, background: 'var(--border-1)' }} />
  </div>
);

// ── SectionCard ───────────────────────────────────────────────────────────────
const SectionCard: React.FC<{
  id: string; title: string; savedId: string | null; saving: boolean;
  onSave: () => void; children: React.ReactNode;
}> = ({ id, title, savedId, saving, onSave, children }) => {
  const isSaved = savedId === id;
  return (
    <div id={id} style={{ border: '1px solid var(--border-1)', borderRadius: 10, background: '#fff', overflow: 'hidden', scrollMarginTop: 52 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-1)', background: 'var(--bg-2)' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{title}</span>
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            padding: '6px 14px', borderRadius: 6, border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
            background: isSaved ? '#dcfce7' : saving ? 'var(--bg-3)' : '#0a0a0a',
            color: isSaved ? '#15803d' : saving ? 'var(--fg-3)' : '#fff',
            fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5, transition: 'all .2s',
          }}
        >
          {isSaved ? '✓ Saved' : saving ? 'Saving…' : 'Save section'}
        </button>
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
};

// ── Color field ───────────────────────────────────────────────────────────────
const ColorField: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <Field label={label}>
    <div style={{ display: 'flex', gap: 8 }}>
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        style={{ width: 40, height: 34, borderRadius: 6, border: '1px solid var(--border-1)', cursor: 'pointer', padding: 2, flexShrink: 0 }} />
      <FI value={value} onChange={onChange} mono />
    </div>
  </Field>
);

// ── Default states ────────────────────────────────────────────────────────────
const DEFAULT_BOX: WhoWeWorkWithBox = {
  title_en: '', title_he: '', subtitle_en: '', subtitle_he: '',
  description_en: '', description_he: '', image_url: '', overlay_opacity: 70,
};

// ── Main component ────────────────────────────────────────────────────────────
export const AdminMainPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('sec-hero');

  const [hero, setHero] = useState<HeroSettings>({
    left_image_url: '', left_title_en: '', left_title_he: '',
    right_link: '/services', hero_height: '90vh',
    left_video_url: '', left_subtitle_en: '', left_subtitle_he: '',
  });

  const [heroRail, setHeroRail] = useState<HeroRailSettings>({
    heading_en: 'What kind of project\nare you working on?', heading_he: 'על איזה סוג פרויקט\nאתה עובד?',
    eyebrow_en: 'Start your order', eyebrow_he: 'התחל הזמנה',
    card1_title_en: 'Browse & Order', card1_title_he: 'עיון והזמנה',
    card1_badge_en: 'Catalog', card1_badge_he: 'קטלוג',
    card1_desc_en: '30+ ready cabinet modules — in stock, dispatched same week.', card1_desc_he: '30+ מודולי ארונות מוכנים — במלאי, משלוח באותו שבוע.',
    card1_lead_en: 'Lead time · from 5 days', card1_lead_he: 'זמן אספקה · מ-5 ימים',
    card1_link: '/quote?type=browse',
    card2_title_en: 'CNC Services', card2_title_he: 'שירותי CNC',
    card2_badge_en: 'Service', card2_badge_he: 'שירות',
    card2_desc_en: 'DXF, sketches or panel list — we run it through our line and ship the parts.', card2_desc_he: 'DXF, סקיצות או רשימת לוחות — אנחנו מעבדים ומשלחים.',
    card2_lead_en: 'Lead time · from 72h', card2_lead_he: 'זמן אספקה · מ-72 שעות',
    card2_link: '/quote?type=file',
    card3_title_en: 'Custom Order', card3_title_he: 'הזמנה מותאמת',
    card3_badge_en: 'Project', card3_badge_he: 'פרויקט',
    card3_desc_en: 'Brief, design, engineering and install — we handle the build end-to-end.', card3_desc_he: 'בריף, עיצוב, הנדסה והתקנה — אנחנו מטפלים בהכל.',
    card3_lead_en: 'Lead time · from 4 weeks', card3_lead_he: 'זמן אספקה · מ-4 שבועות',
    card3_link: '/quote?type=describe',
    footer_text_en: 'Not sure where to start?', footer_text_he: 'לא בטוח מאיפה להתחיל?',
    footer_cta_en: 'Get a callback', footer_cta_he: 'קבל שיחה חזרה',
    whatsapp_number: '972549222804',
    badge1_en: 'Reply within 1 business day', badge1_he: 'תגובה תוך יום עסקים',
    badge2_en: 'EN / HE', badge2_he: 'עב / אנ',
  });

  const [servicesSection, setServicesSection] = useState<ServicesSectionSettings>({
    title_en: 'Our Services', title_he: 'השירותים שלנו',
    subtitle_en: 'Precision services designed for the modern industrial workflow.', subtitle_he: '',
    show_descriptions: true,
  });

  const [partnersSection, setPartnersSection] = useState<WhoWeWorkWithSettings>({
    section_title_en: 'Who We Work With', section_title_he: 'עם מי אנחנו עובדים',
    section_description_en: 'If you produce cabinets for real clients, we speak the same language.', section_description_he: '',
    boxes: [
      { ...DEFAULT_BOX, title_en: 'Kitchen & Cabinet Manufacturers' },
      { ...DEFAULT_BOX, title_en: 'Professional Carpentry & Joinery' },
      { ...DEFAULT_BOX, title_en: 'Interior & Fit-Out Contractors' },
    ],
  });

  const [storiesSection, setStoriesSection] = useState<StoriesSectionSettings>({
    title_en: 'Recent Projects and News', title_he: '',
    button_text_en: 'See all', button_text_he: '', button_link: '/portfolio',
  });

  const [aboutSection, setAboutSection] = useState<AboutSectionSettings>({
    title_en: 'About HWOOD', title_he: '',
    description_en: 'Modern production powerhouse.', description_he: '',
    button_text_en: 'Discover', button_text_he: '',
    button_link: '/about', background_color: '#EAEAEA', text_color: '#005f5f',
  });

  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    primary_color: '#005f5f', secondary_color: '#004d4d', background_dark: '#002828',
  });

  // Load settings
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('homepage_settings').select('*');
        if (data) {
          data.forEach((row: { section: string; settings: any }) => {
            if (row.section === 'hero') setHero(h => ({ ...h, ...row.settings }));
            if (row.section === 'hero_rail') setHeroRail(h => ({ ...h, ...row.settings }));
            if (row.section === 'services_section') setServicesSection(s => ({ ...s, ...row.settings }));
            if (row.section === 'partners_section') setPartnersSection(s => ({ ...s, ...row.settings }));
            if (row.section === 'stories_section') setStoriesSection(s => ({ ...s, ...row.settings }));
            if (row.section === 'about_section') setAboutSection(s => ({ ...s, ...row.settings }));
            if (row.section === 'layout') setLayoutSettings(s => ({ ...s, ...row.settings }));
          });
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  // IntersectionObserver for sticky nav active state
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { threshold: 0.25, rootMargin: '-50px 0px 0px 0px' }
    );
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [loading]);

  const saveSection = async (sectionKey: string, cardId: string, settings: any) => {
    setSaving(true);
    try {
      await supabase.from('homepage_settings').upsert(
        { section: sectionKey, settings, updated_at: new Date().toISOString() },
        { onConflict: 'section' }
      );
      setSavedId(cardId);
      setTimeout(() => setSavedId(null), 2000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: 32, color: 'var(--fg-3)', fontSize: 13 }}>Loading…</div>;

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', background: 'var(--bg-2)' }}>

      {/* ── Left column (editor) ── */}
      <div style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Sticky section nav */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg-2)', borderBottom: '1px solid var(--border-1)',
        padding: '0 24px', display: 'flex', gap: 2, overflowX: 'auto', flexShrink: 0,
      }}>
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            style={{
              padding: '9px 12px', border: 'none',
              borderBottom: `2px solid ${activeSection === s.id ? 'var(--brand)' : 'transparent'}`,
              background: 'transparent', fontSize: 12,
              fontWeight: activeSection === s.id ? 600 : 400,
              color: activeSection === s.id ? 'var(--brand)' : 'var(--fg-2)',
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Scrollable content column */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── Hero ── */}
          <SectionCard id="sec-hero" title="Hero" savedId={savedId} saving={saving}
            onSave={() => saveSection('hero', 'sec-hero', hero)}>
            <Field label="Video URL" hint="Direct MP4 link — autoplay, loop, muted">
              <FI value={hero.left_video_url || ''} onChange={v => setHero({ ...hero, left_video_url: v })} placeholder="https://..." mono />
            </Field>
            <Field label="Fallback image">
              <ImageUpload label="" value={hero.left_image_url} onChange={url => setHero({ ...hero, left_image_url: url })} folder="hero" />
            </Field>
            <FRow>
              <Field label="Headline (EN)">
                <FI value={hero.left_title_en} onChange={v => setHero({ ...hero, left_title_en: v })} placeholder="CNC Production Systems" />
              </Field>
              <Field label="Headline (HE)">
                <FI value={hero.left_title_he} onChange={v => setHero({ ...hero, left_title_he: v })} />
              </Field>
            </FRow>
            <FRow>
              <Field label="Subtitle (EN)">
                <FI value={hero.left_subtitle_en || ''} onChange={v => setHero({ ...hero, left_subtitle_en: v })} />
              </Field>
              <Field label="Subtitle (HE)">
                <FI value={hero.left_subtitle_he || ''} onChange={v => setHero({ ...hero, left_subtitle_he: v })} />
              </Field>
            </FRow>
            <Field label="Mobile CTA link">
              <FI value={hero.right_link} onChange={v => setHero({ ...hero, right_link: v })} placeholder="/services" mono />
            </Field>
            <Field label="Hero height">
              <select value={hero.hero_height} onChange={e => setHero({ ...hero, hero_height: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-1)', borderRadius: 6, fontSize: 13, background: '#fff', color: 'var(--fg-1)' }}>
                <option value="70vh">70% viewport</option>
                <option value="80vh">80% viewport</option>
                <option value="90vh">90% viewport (default)</option>
                <option value="100vh">Full screen</option>
              </select>
            </Field>
          </SectionCard>

          {/* ── Right Rail ── */}
          <SectionCard id="sec-rail" title="Right Rail — Order Picker" savedId={savedId} saving={saving}
            onSave={() => saveSection('hero_rail', 'sec-rail', heroRail)}>
            <FRow>
              <Field label="Heading (EN)" hint="Use \n for line break">
                <FI value={heroRail.heading_en} onChange={v => setHeroRail({ ...heroRail, heading_en: v })} />
              </Field>
              <Field label="Heading (HE)">
                <FI value={heroRail.heading_he} onChange={v => setHeroRail({ ...heroRail, heading_he: v })} />
              </Field>
            </FRow>
            <FRow>
              <Field label="Eyebrow (EN)">
                <FI value={heroRail.eyebrow_en} onChange={v => setHeroRail({ ...heroRail, eyebrow_en: v })} />
              </Field>
              <Field label="Eyebrow (HE)">
                <FI value={heroRail.eyebrow_he} onChange={v => setHeroRail({ ...heroRail, eyebrow_he: v })} />
              </Field>
            </FRow>

            <Divider label="Card 1 — Browse & Order" />
            <FRow>
              <Field label="Title (EN)"><FI value={heroRail.card1_title_en} onChange={v => setHeroRail({ ...heroRail, card1_title_en: v })} /></Field>
              <Field label="Title (HE)"><FI value={heroRail.card1_title_he} onChange={v => setHeroRail({ ...heroRail, card1_title_he: v })} /></Field>
            </FRow>
            <FRow>
              <Field label="Badge (EN)"><FI value={heroRail.card1_badge_en} onChange={v => setHeroRail({ ...heroRail, card1_badge_en: v })} /></Field>
              <Field label="Badge (HE)"><FI value={heroRail.card1_badge_he} onChange={v => setHeroRail({ ...heroRail, card1_badge_he: v })} /></Field>
            </FRow>
            <FRow>
              <Field label="Description (EN)"><FI value={heroRail.card1_desc_en} onChange={v => setHeroRail({ ...heroRail, card1_desc_en: v })} /></Field>
              <Field label="Description (HE)"><FI value={heroRail.card1_desc_he} onChange={v => setHeroRail({ ...heroRail, card1_desc_he: v })} /></Field>
            </FRow>
            <FRow>
              <Field label="Lead time (EN)"><FI value={heroRail.card1_lead_en} onChange={v => setHeroRail({ ...heroRail, card1_lead_en: v })} /></Field>
              <Field label="Lead time (HE)"><FI value={heroRail.card1_lead_he} onChange={v => setHeroRail({ ...heroRail, card1_lead_he: v })} /></Field>
            </FRow>
            <Field label="Card 1 link"><FI value={heroRail.card1_link} onChange={v => setHeroRail({ ...heroRail, card1_link: v })} mono /></Field>

            <Divider label="Card 2 — CNC Services" />
            <FRow>
              <Field label="Title (EN)"><FI value={heroRail.card2_title_en} onChange={v => setHeroRail({ ...heroRail, card2_title_en: v })} /></Field>
              <Field label="Title (HE)"><FI value={heroRail.card2_title_he} onChange={v => setHeroRail({ ...heroRail, card2_title_he: v })} /></Field>
            </FRow>
            <FRow>
              <Field label="Badge (EN)"><FI value={heroRail.card2_badge_en} onChange={v => setHeroRail({ ...heroRail, card2_badge_en: v })} /></Field>
              <Field label="Badge (HE)"><FI value={heroRail.card2_badge_he} onChange={v => setHeroRail({ ...heroRail, card2_badge_he: v })} /></Field>
            </FRow>
            <FRow>
              <Field label="Description (EN)"><FI value={heroRail.card2_desc_en} onChange={v => setHeroRail({ ...heroRail, card2_desc_en: v })} /></Field>
              <Field label="Description (HE)"><FI value={heroRail.card2_desc_he} onChange={v => setHeroRail({ ...heroRail, card2_desc_he: v })} /></Field>
            </FRow>
            <FRow>
              <Field label="Lead time (EN)"><FI value={heroRail.card2_lead_en} onChange={v => setHeroRail({ ...heroRail, card2_lead_en: v })} /></Field>
              <Field label="Lead time (HE)"><FI value={heroRail.card2_lead_he} onChange={v => setHeroRail({ ...heroRail, card2_lead_he: v })} /></Field>
            </FRow>
            <Field label="Card 2 link"><FI value={heroRail.card2_link} onChange={v => setHeroRail({ ...heroRail, card2_link: v })} mono /></Field>

            <Divider label="Card 3 — Custom Order" />
            <FRow>
              <Field label="Title (EN)"><FI value={heroRail.card3_title_en} onChange={v => setHeroRail({ ...heroRail, card3_title_en: v })} /></Field>
              <Field label="Title (HE)"><FI value={heroRail.card3_title_he} onChange={v => setHeroRail({ ...heroRail, card3_title_he: v })} /></Field>
            </FRow>
            <FRow>
              <Field label="Badge (EN)"><FI value={heroRail.card3_badge_en} onChange={v => setHeroRail({ ...heroRail, card3_badge_en: v })} /></Field>
              <Field label="Badge (HE)"><FI value={heroRail.card3_badge_he} onChange={v => setHeroRail({ ...heroRail, card3_badge_he: v })} /></Field>
            </FRow>
            <FRow>
              <Field label="Description (EN)"><FI value={heroRail.card3_desc_en} onChange={v => setHeroRail({ ...heroRail, card3_desc_en: v })} /></Field>
              <Field label="Description (HE)"><FI value={heroRail.card3_desc_he} onChange={v => setHeroRail({ ...heroRail, card3_desc_he: v })} /></Field>
            </FRow>
            <FRow>
              <Field label="Lead time (EN)"><FI value={heroRail.card3_lead_en} onChange={v => setHeroRail({ ...heroRail, card3_lead_en: v })} /></Field>
              <Field label="Lead time (HE)"><FI value={heroRail.card3_lead_he} onChange={v => setHeroRail({ ...heroRail, card3_lead_he: v })} /></Field>
            </FRow>
            <Field label="Card 3 link"><FI value={heroRail.card3_link} onChange={v => setHeroRail({ ...heroRail, card3_link: v })} mono /></Field>

            <Divider label="Footer" />
            <FRow>
              <Field label="Footer text (EN)"><FI value={heroRail.footer_text_en} onChange={v => setHeroRail({ ...heroRail, footer_text_en: v })} /></Field>
              <Field label="Footer text (HE)"><FI value={heroRail.footer_text_he} onChange={v => setHeroRail({ ...heroRail, footer_text_he: v })} /></Field>
            </FRow>
            <FRow>
              <Field label="CTA text (EN)"><FI value={heroRail.footer_cta_en} onChange={v => setHeroRail({ ...heroRail, footer_cta_en: v })} /></Field>
              <Field label="CTA text (HE)"><FI value={heroRail.footer_cta_he} onChange={v => setHeroRail({ ...heroRail, footer_cta_he: v })} /></Field>
            </FRow>
            <Field label="WhatsApp number" hint="Digits only — e.g. 972549222804">
              <FI value={heroRail.whatsapp_number} onChange={v => setHeroRail({ ...heroRail, whatsapp_number: v })} mono />
            </Field>
            <FRow>
              <Field label="Badge 1 (EN)"><FI value={heroRail.badge1_en} onChange={v => setHeroRail({ ...heroRail, badge1_en: v })} /></Field>
              <Field label="Badge 1 (HE)"><FI value={heroRail.badge1_he} onChange={v => setHeroRail({ ...heroRail, badge1_he: v })} /></Field>
            </FRow>
            <FRow>
              <Field label="Badge 2 (EN)"><FI value={heroRail.badge2_en} onChange={v => setHeroRail({ ...heroRail, badge2_en: v })} /></Field>
              <Field label="Badge 2 (HE)"><FI value={heroRail.badge2_he} onChange={v => setHeroRail({ ...heroRail, badge2_he: v })} /></Field>
            </FRow>
          </SectionCard>

          {/* ── Services ── */}
          <SectionCard id="sec-services" title="Services section" savedId={savedId} saving={saving}
            onSave={() => saveSection('services_section', 'sec-services', servicesSection)}>
            <FRow>
              <Field label="Title (EN)">
                <FI value={servicesSection.title_en} onChange={v => setServicesSection({ ...servicesSection, title_en: v })} />
              </Field>
              <Field label="Title (HE)">
                <FI value={servicesSection.title_he} onChange={v => setServicesSection({ ...servicesSection, title_he: v })} />
              </Field>
            </FRow>
            <FRow>
              <Field label="Subtitle (EN)">
                <FI value={servicesSection.subtitle_en} onChange={v => setServicesSection({ ...servicesSection, subtitle_en: v })} />
              </Field>
              <Field label="Subtitle (HE)">
                <FI value={servicesSection.subtitle_he} onChange={v => setServicesSection({ ...servicesSection, subtitle_he: v })} />
              </Field>
            </FRow>
            <Field label="Card descriptions">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" checked={servicesSection.show_descriptions}
                  onChange={e => setServicesSection({ ...servicesSection, show_descriptions: e.target.checked })} />
                Show description text on service cards
              </label>
            </Field>
          </SectionCard>

          {/* ── Partners (Who We Work With) ── */}
          <SectionCard id="sec-partners" title="Who We Work With" savedId={savedId} saving={saving}
            onSave={() => saveSection('partners_section', 'sec-partners', partnersSection)}>
            <FRow>
              <Field label="Section title (EN)">
                <FI value={partnersSection.section_title_en} onChange={v => setPartnersSection({ ...partnersSection, section_title_en: v })} />
              </Field>
              <Field label="Section title (HE)">
                <FI value={partnersSection.section_title_he} onChange={v => setPartnersSection({ ...partnersSection, section_title_he: v })} />
              </Field>
            </FRow>
            <FRow>
              <Field label="Description (EN)">
                <FI value={partnersSection.section_description_en} onChange={v => setPartnersSection({ ...partnersSection, section_description_en: v })} />
              </Field>
              <Field label="Description (HE)">
                <FI value={partnersSection.section_description_he} onChange={v => setPartnersSection({ ...partnersSection, section_description_he: v })} />
              </Field>
            </FRow>
            {partnersSection.boxes.map((box, idx) => {
              const updateBox = (updates: Partial<WhoWeWorkWithBox>) => {
                const newBoxes = [...partnersSection.boxes] as [WhoWeWorkWithBox, WhoWeWorkWithBox, WhoWeWorkWithBox];
                newBoxes[idx] = { ...newBoxes[idx], ...updates };
                setPartnersSection({ ...partnersSection, boxes: newBoxes });
              };
              return (
                <div key={idx}>
                  <Divider label={`Box ${idx + 1}`} />
                  <Field label="Background image">
                    <ImageUpload label="" value={box.image_url} onChange={url => updateBox({ image_url: url })} folder="partners" />
                  </Field>
                  <FRow>
                    <Field label="Title (EN)"><FI value={box.title_en} onChange={v => updateBox({ title_en: v })} /></Field>
                    <Field label="Title (HE)"><FI value={box.title_he} onChange={v => updateBox({ title_he: v })} /></Field>
                  </FRow>
                  <FRow>
                    <Field label="Subtitle (EN)"><FI value={box.subtitle_en} onChange={v => updateBox({ subtitle_en: v })} /></Field>
                    <Field label="Subtitle (HE)"><FI value={box.subtitle_he} onChange={v => updateBox({ subtitle_he: v })} /></Field>
                  </FRow>
                  <FRow>
                    <Field label="Description (EN)"><FI value={box.description_en} onChange={v => updateBox({ description_en: v })} /></Field>
                    <Field label="Description (HE)"><FI value={box.description_he} onChange={v => updateBox({ description_he: v })} /></Field>
                  </FRow>
                  <Field label={`Overlay opacity — ${box.overlay_opacity}%`}>
                    <input type="range" min={0} max={100} value={box.overlay_opacity}
                      onChange={e => updateBox({ overlay_opacity: parseInt(e.target.value) })}
                      style={{ width: '100%' }} />
                  </Field>
                </div>
              );
            })}
          </SectionCard>

          {/* ── Stories ── */}
          <SectionCard id="sec-stories" title="Stories section" savedId={savedId} saving={saving}
            onSave={() => saveSection('stories_section', 'sec-stories', storiesSection)}>
            <FRow>
              <Field label="Title (EN)">
                <FI value={storiesSection.title_en} onChange={v => setStoriesSection({ ...storiesSection, title_en: v })} />
              </Field>
              <Field label="Title (HE)">
                <FI value={storiesSection.title_he} onChange={v => setStoriesSection({ ...storiesSection, title_he: v })} />
              </Field>
            </FRow>
            <FRow>
              <Field label={'"See all" button (EN)'}>
                <FI value={storiesSection.button_text_en} onChange={v => setStoriesSection({ ...storiesSection, button_text_en: v })} />
              </Field>
              <Field label={'"See all" button (HE)'}>
                <FI value={storiesSection.button_text_he} onChange={v => setStoriesSection({ ...storiesSection, button_text_he: v })} />
              </Field>
            </FRow>
            <Field label="Button link">
              <FI value={storiesSection.button_link} onChange={v => setStoriesSection({ ...storiesSection, button_link: v })} mono />
            </Field>
          </SectionCard>

          {/* ── About ── */}
          <SectionCard id="sec-about" title="About section" savedId={savedId} saving={saving}
            onSave={() => saveSection('about_section', 'sec-about', aboutSection)}>
            <FRow>
              <Field label="Title (EN)">
                <FI value={aboutSection.title_en} onChange={v => setAboutSection({ ...aboutSection, title_en: v })} />
              </Field>
              <Field label="Title (HE)">
                <FI value={aboutSection.title_he} onChange={v => setAboutSection({ ...aboutSection, title_he: v })} />
              </Field>
            </FRow>
            <FRow>
              <Field label="Description (EN)">
                <FI value={aboutSection.description_en} onChange={v => setAboutSection({ ...aboutSection, description_en: v })} />
              </Field>
              <Field label="Description (HE)">
                <FI value={aboutSection.description_he} onChange={v => setAboutSection({ ...aboutSection, description_he: v })} />
              </Field>
            </FRow>
            <FRow>
              <Field label="Button text (EN)">
                <FI value={aboutSection.button_text_en} onChange={v => setAboutSection({ ...aboutSection, button_text_en: v })} />
              </Field>
              <Field label="Button text (HE)">
                <FI value={aboutSection.button_text_he} onChange={v => setAboutSection({ ...aboutSection, button_text_he: v })} />
              </Field>
            </FRow>
            <Field label="Button link">
              <FI value={aboutSection.button_link} onChange={v => setAboutSection({ ...aboutSection, button_link: v })} mono />
            </Field>
            <FRow>
              <ColorField label="Background color" value={aboutSection.background_color} onChange={v => setAboutSection({ ...aboutSection, background_color: v })} />
              <ColorField label="Text color" value={aboutSection.text_color} onChange={v => setAboutSection({ ...aboutSection, text_color: v })} />
            </FRow>
          </SectionCard>

          {/* ── Layout ── */}
          <SectionCard id="sec-layout" title="Layout & colors" savedId={savedId} saving={saving}
            onSave={() => saveSection('layout', 'sec-layout', layoutSettings)}>
            <FRow>
              <ColorField label="Primary color" value={layoutSettings.primary_color} onChange={v => setLayoutSettings({ ...layoutSettings, primary_color: v })} />
              <ColorField label="Secondary color" value={layoutSettings.secondary_color} onChange={v => setLayoutSettings({ ...layoutSettings, secondary_color: v })} />
            </FRow>
            <ColorField label="Dark background" value={layoutSettings.background_dark} onChange={v => setLayoutSettings({ ...layoutSettings, background_dark: v })} />
          </SectionCard>

        </div>
      </div>

      </div>
      {/* ── End left column ── */}

      {/* ── Right column (preview placeholder) ── */}
      <div style={{
        width: 300, flexShrink: 0, height: '100%',
        borderLeft: '1px solid var(--border-1)',
        background: '#fff', display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid var(--border-1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
            Page preview
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '2px 7px', borderRadius: 4,
            background: 'var(--bg-3)', color: 'var(--fg-3)',
          }}>
            Coming soon
          </span>
        </div>

        {/* Placeholder — scaled page wireframe */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>

          {/* Browser chrome mockup */}
          <div style={{
            border: '1px solid var(--border-1)', borderRadius: 8, overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            {/* Browser bar */}
            <div style={{
              padding: '7px 12px', background: 'var(--bg-2)',
              borderBottom: '1px solid var(--border-1)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {['#f87171', '#fbbf24', '#34d399'].map(c => (
                  <div key={c} style={{ width: 7, height: 7, borderRadius: 999, background: c }} />
                ))}
              </div>
              <div style={{
                flex: 1, height: 16, background: 'var(--border-1)', borderRadius: 4,
                display: 'flex', alignItems: 'center', paddingLeft: 8,
              }}>
                <span style={{ fontSize: 9, color: 'var(--fg-3)', fontFamily: 'ui-monospace, monospace' }}>
                  hwood.co.il
                </span>
              </div>
            </div>

            {/* Page wireframe */}
            <div style={{ background: '#fff' }}>

              {/* Hero block */}
              <div style={{ height: 80, background: '#1a1a1a', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(135deg, #1a1a1a 70%, #002828 100%)',
                }} />
                <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12 }}>
                  <div style={{ width: '55%', height: 5, background: 'rgba(255,255,255,0.7)', borderRadius: 2, marginBottom: 4 }} />
                  <div style={{ width: '40%', height: 3, background: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
                </div>
                <div style={{
                  position: 'absolute', top: 0, right: 0, bottom: 0, width: '30%',
                  background: '#0d0d0d', borderLeft: '1px solid rgba(255,255,255,0.1)',
                  padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4,
                }}>
                  {(['#00d4aa', '#5b9dff', '#f4a64b'] as const).map((c, i) => (
                    <div key={i} style={{
                      height: 16, background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4,
                      display: 'flex', alignItems: 'center', paddingLeft: 5, gap: 4,
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: 2, background: c, opacity: 0.8 }} />
                      <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.15)', borderRadius: 1 }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sections */}
              {[
                { label: 'Services',          h: 48, bg: '#fff' },
                { label: 'How It Works',      h: 32, bg: 'var(--bg-2)' },
                { label: 'Who We Work With',  h: 40, bg: '#fff' },
                { label: 'Stories',           h: 44, bg: '#111' },
                { label: 'About',             h: 28, bg: '#f4f4f4' },
                { label: 'Footer',            h: 24, bg: '#002828' },
              ].map(s => (
                <div key={s.label} style={{
                  height: s.h, background: s.bg,
                  borderBottom: '1px solid var(--border-1)',
                  display: 'flex', alignItems: 'center', paddingLeft: 12,
                }}>
                  <span style={{
                    fontSize: 8, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: s.bg === '#111' || s.bg === '#002828' ? 'rgba(255,255,255,0.4)' : 'var(--fg-3)',
                  }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Caption */}
          <p style={{
            fontSize: 10, color: 'var(--fg-3)', textAlign: 'center',
            marginTop: 12, lineHeight: 1.5,
          }}>
            Live preview will render here.<br />Changes reflect after save.
          </p>
        </div>
      </div>
      {/* ── End right column ── */}

    </div>
  );
};
