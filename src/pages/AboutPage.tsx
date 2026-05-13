/**
 * ABOUT PAGE — HWOOD × SKYLUM
 * =============================
 * Factory story, production capability, team, Skylum group section.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Factory, Users, Award, Truck } from 'lucide-react';
import { CompanyInfo } from '../domain/types';
import { getCompanyInfo } from '../services/data/dataService';
import { ROUTES } from '../router';
import { useTranslation } from 'react-i18next';
import { Stripes } from '../components/journey/stripes';
import { BRAND_NEUTRAL, SKYLUM_BLUE, SKYLUM_DEEP } from '../lib/OrderTypes';

export const AboutPage: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('he') ? 'he' : 'en';
  const [info, setInfo] = useState<CompanyInfo | null>(null);

  useEffect(() => { getCompanyInfo().then(setInfo); }, []);

  const stats = [
    { k: '12', unit: 'yrs', v: lang === 'he' ? 'ייצור CNC' : 'in CNC production', sub: lang === 'he' ? 'נתניה · מאז 2014' : 'Netanya · since 2014' },
    { k: '2,400', unit: 'm²', v: lang === 'he' ? 'שטח מפעל' : 'facility footprint', sub: lang === 'he' ? 'אתר יחיד' : 'Single-site delivery' },
    { k: '180+', unit: '', v: lang === 'he' ? 'מטבחים / שנה' : 'kitchens / yr', sub: lang === 'he' ? 'סדרתי ומיוחד' : 'Series & custom' },
    { k: '72', unit: 'h', v: lang === 'he' ? 'זמן אספקה ממוצע' : 'avg. lead time', sub: lang === 'he' ? 'מקובץ לפנל מוכן' : 'From file to panel' },
  ];

  const machines = [
    { name: 'Biesse Rover A', type: 'CNC Machining Centre', desc: '5-axis routing, boring, pocketing for complex cabinet work.' },
    { name: 'Biesse Selco EB', type: 'Panel Saw', desc: 'Optimised cutting of full-size MDF, Egger, and composite sheets.' },
    { name: 'Biesse Akron', type: 'Edge Banding', desc: 'ABS, ACR, PVC edges from 0.4mm to 3mm — zero-joint finish.' },
    { name: 'Homag Profiline', type: 'Drilling Line', desc: 'Multi-spindle hardware drilling and dowel insertion.' },
  ];

  const timeline = [
    { year: '2014', event: lang === 'he' ? 'ייסוד HWOOD בנתניה' : 'HWOOD founded in Netanya', sub: lang === 'he' ? 'מתחיל עם מכונת CNC אחת, 3 עובדים' : 'Starting with one CNC machine, 3 staff' },
    { year: '2017', event: lang === 'he' ? 'הרחבת המפעל ל-1,200 מ"ר' : 'Factory expansion to 1,200 m²', sub: lang === 'he' ? 'הוספת קו כרזה וסגירת קצה' : 'Added panel saw line and edge banding' },
    { year: '2019', event: lang === 'he' ? 'השקת מותג Skylum' : 'Skylum brand launched', sub: lang === 'he' ? 'חלוקת ACP ומערכות חזית' : 'ACP and facade systems division' },
    { year: '2022', event: lang === 'he' ? 'הרחבה ל-2,400 מ"ר' : 'Expansion to 2,400 m²', sub: lang === 'he' ? 'קו Biesse חדש, יכולת 180+ מטבחים/שנה' : 'New Biesse line, capacity 180+ kitchens/yr' },
    { year: '2026', event: lang === 'he' ? 'פלטפורמת B2B חדשה' : 'New B2B platform', sub: lang === 'he' ? 'הזמנות מקוונות, הגדרות, מעקב' : 'Online ordering, configuration, tracking' },
  ];

  return (
    <div style={{ background: '#fff' }}>
      {/* ── HERO ── */}
      <section style={{ background: `linear-gradient(135deg, #0a1414, #002828)`, padding: '100px 32px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <Stripes opacity={0.4} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#00d4aa', display: 'block', marginBottom: 16 }}>
                {lang === 'he' ? 'אודות HWOOD' : 'About HWOOD'}
              </span>
              <h1 style={{ fontSize: 72, fontWeight: 600, letterSpacing: '-.025em', lineHeight: 1.05, margin: '0 0 24px', fontFamily: "'Inter Display', Inter, sans-serif" }}>
                {lang === 'he'
                  ? <>ייצור<br />תעשייתי.<br /><em style={{ color: '#00d4aa', fontStyle: 'italic', fontWeight: 500 }}>תשומת<br />לב של סטודיו.</em></>
                  : <>Industrial<br />discipline.<br /><em style={{ color: '#00d4aa', fontStyle: 'italic', fontWeight: 500 }}>Studio<br />attention.</em></>
                }
              </h1>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,.75)', fontWeight: 300, lineHeight: 1.65, margin: '0 0 36px', maxWidth: 480 }}>
                {lang === 'he'
                  ? 'מאז 2014 אנחנו מייצרים ארונות, מטבחים ומערכות CNC לשוק הישראלי — מנתניה, בדיוק תעשייתי.'
                  : 'Since 2014 we have manufactured cabinets, kitchens, and CNC systems for the Israeli market — from Netanya, at industrial precision.'}
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <Link to={ROUTES.QUOTE} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '13px 22px', borderRadius: 999, background: '#fff', color: '#0a0a0a', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  {lang === 'he' ? 'קבל הצעת מחיר' : 'Request a quote'} <ArrowRight size={14} />
                </Link>
                <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '13px 22px', borderRadius: 999, background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,.4)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                  {lang === 'he' ? 'צור קשר' : 'Contact us'}
                </Link>
              </div>
            </div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {stats.map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,.05)', borderRadius: 16, padding: '24px 20px', border: '1px solid rgba(255,255,255,.08)' }}>
                  <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-.02em', color: '#fff', fontFamily: "'Inter Display', Inter, sans-serif" }}>
                    {s.k}<span style={{ fontSize: 22, color: '#00d4aa' }}>{s.unit}</span>
                  </div>
                  <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#00d4aa', display: 'block', marginTop: 8 }}>{s.v}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', fontWeight: 300, display: 'block', marginTop: 4 }}>{s.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STORY / PHILOSOPHY ── */}
      <section style={{ padding: '100px 64px', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 48 }}>
            <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: BRAND_NEUTRAL }}>01 · Philosophy</span>
            <span style={{ flex: 1, height: 1, background: '#e5e5e5' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
            <div>
              <h2 style={{ fontSize: 52, fontWeight: 600, letterSpacing: '-.022em', lineHeight: 1.08, fontFamily: "'Inter Display', Inter, sans-serif", margin: '0 0 32px' }}>
                {lang === 'he' ? 'העבודה מתחילה מבפנים.' : 'Work starts from the inside.'}
              </h2>
              <p style={{ fontSize: 18, lineHeight: 1.7, color: '#262626', fontWeight: 300, margin: '0 0 20px' }}>
                {lang === 'he'
                  ? 'ייצור אף פעם אינו סטטי. פריסות משתנות, מידות מגוונות, וכל פרויקט מציג אתגרים חדשים.'
                  : 'Production is rarely static. Layouts change, dimensions vary, and each project introduces constraints that must be handled without breaking throughput.'}
              </p>
              <p style={{ fontSize: 18, lineHeight: 1.7, color: '#525252', fontWeight: 300, margin: 0 }}>
                {lang === 'he'
                  ? 'אנחנו מתמקדים בלוגיקה הפנימית של ייצור מבוסס CNC — תפוקה יציבה, פחות שגיאות, תוצאות צפויות.'
                  : 'We focus on the internal logic of CNC-based production — stable throughput, fewer errors, and predictable results for every client.'}
              </p>
            </div>
            <div style={{ background: `linear-gradient(135deg, #0a1414, #002828)`, borderRadius: 24, padding: 40, color: '#fff', display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', overflow: 'hidden' }}>
              <Stripes opacity={0.35} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: '#00d4aa' }}>What we focus on</span>
                {[
                  [lang === 'he' ? 'דיוק CNC' : 'CNC precision', lang === 'he' ? 'סבולות ±0.1mm על כל חיתוך' : '±0.1mm tolerance on every cut'],
                  [lang === 'he' ? 'תזמון אמין' : 'Reliable timing', lang === 'he' ? 'זמני אספקה ממוצעים של 72 שעות' : '72h average lead times, consistently met'],
                  [lang === 'he' ? 'קנה מידה עם גמישות' : 'Scale with flexibility', lang === 'he' ? 'סדרות וייחודיות — אותו קו ייצור' : 'Series runs and one-offs on the same line'],
                ].map(([t, d], i) => (
                  <div key={i} style={{ marginTop: 20 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{t}</div>
                    <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.65)', fontWeight: 300, margin: 0, lineHeight: 1.55 }}>{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FACTORY + MACHINES ── */}
      <section style={{ padding: '96px 32px', background: '#f8f8f8' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 48 }}>
            <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: BRAND_NEUTRAL }}>02 · The factory</span>
            <span style={{ flex: 1, height: 1, background: '#e5e5e5' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 64 }}>
            <div>
              <h2 style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.1, fontFamily: "'Inter Display', Inter, sans-serif", margin: '0 0 20px' }}>
                {lang === 'he' ? '2,400 מ"ר. ציוד Biesse. אתר יחיד.' : '2,400 m². Biesse equipment. Single site.'}
              </h2>
              <p style={{ fontSize: 16, color: '#525252', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
                {lang === 'he'
                  ? 'כל תהליך — מחיתוך ועד כרסום, מסגירת קצה ועד אריזה — מתבצע תחת קורת גג אחת בנתניה. אין קבלני משנה, אין יד שניה.'
                  : 'Every process — from cutting to routing, edge banding to packing — happens under one roof in Netanya. No subcontractors, no second hands.'}
              </p>
            </div>
            <div style={{ background: '#1a1a1a', borderRadius: 20, overflow: 'hidden', minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)' }}>Factory floor · image placeholder</span>
            </div>
          </div>

          {/* Machine list */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {machines.map((m, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e5e5' }}>
                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#a3a3a3', display: 'block', marginBottom: 8 }}>{m.type}</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0a0a0a', margin: '0 0 10px', fontFamily: "'Inter Display', Inter, sans-serif" }}>{m.name}</h3>
                <p style={{ fontSize: 13, color: '#525252', lineHeight: 1.55, fontWeight: 300, margin: 0 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section style={{ padding: '96px 32px', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 64 }}>
            <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: BRAND_NEUTRAL }}>03 · Our story</span>
            <span style={{ flex: 1, height: 1, background: '#e5e5e5' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {timeline.map((ev, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 32, position: 'relative', paddingBottom: i < timeline.length - 1 ? 48 : 0 }}>
                {i < timeline.length - 1 && (
                  <span style={{ position: 'absolute', left: 58, top: 28, bottom: 0, width: 2, background: '#e5e5e5' }} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingTop: 4 }}>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: BRAND_NEUTRAL }}>{ev.year}</span>
                  <span style={{ width: 10, height: 10, borderRadius: 99, background: BRAND_NEUTRAL, marginTop: 8, marginRight: -5, zIndex: 2, position: 'relative' }} />
                </div>
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontSize: 17, fontWeight: 600, color: '#0a0a0a', marginBottom: 4 }}>{ev.event}</div>
                  <p style={{ fontSize: 13.5, color: '#737373', fontWeight: 300, margin: 0 }}>{ev.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKYLUM GROUP ── */}
      <section style={{ padding: '96px 32px', background: `linear-gradient(135deg, ${SKYLUM_DEEP}, #0e2a4a)`, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <Stripes opacity={0.3} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: SKYLUM_BLUE, display: 'block', marginBottom: 16 }}>04 · Part of the group</span>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg, ${SKYLUM_BLUE}, ${SKYLUM_DEEP})`, padding: '6px 14px', borderRadius: 6, marginBottom: 20 }}>
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.18em', textTransform: 'uppercase', color: '#fff' }}>SKYLUM</span>
              </div>
              <h2 style={{ fontSize: 48, fontWeight: 600, letterSpacing: '-.022em', lineHeight: 1.1, fontFamily: "'Inter Display', Inter, sans-serif", margin: '0 0 20px' }}>
                {lang === 'he' ? 'חזיתות בנייה ולוחות ACP' : 'Building facades & ACP panels'}
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,.75)', fontWeight: 300, lineHeight: 1.7, margin: '0 0 32px' }}>
                {lang === 'he'
                  ? 'Skylum היא מותג הגג לאספקת לוחות חזיתות ועיבוד ACP. אותו מפעל, אותו קו ייצור — עם יכולות נוספות לאלומיניום מרוכב ו-HPL.'
                  : 'Skylum is the umbrella brand for facade panel supply and ACP processing. Same factory, same production line — with added capabilities for aluminium composite and HPL.'}
              </p>
              <Link to="/services/facade-systems-acp" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '13px 22px', borderRadius: 999, background: SKYLUM_BLUE, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                {lang === 'he' ? 'גלה את Skylum' : 'Explore Skylum'} <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                ['ACP panels', lang === 'he' ? 'אלומיניום מרוכב לחזיתות' : 'Aluminium composite for facades'],
                ['HPL supply', lang === 'he' ? 'למינט בלחץ גבוהי' : 'High-pressure laminate'],
                ['CNC cutting', lang === 'he' ? 'חיתוך מדויק של פנלים' : 'Precision cutting of panels'],
                ['Full install', lang === 'he' ? 'מערכות התקנה מוכנות' : 'Ready-to-install systems'],
              ].map(([t, d]) => (
                <div key={t} style={{ background: 'rgba(255,255,255,.07)', borderRadius: 14, padding: '20px 18px', border: '1px solid rgba(255,255,255,.1)' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{t}</div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', fontWeight: 300, margin: 0 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 32px', background: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 700, color: BRAND_NEUTRAL, display: 'block', marginBottom: 16 }}>
            {lang === 'he' ? 'מוכן להתחיל?' : 'Ready to start?'}
          </span>
          <h2 style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.1, fontFamily: "'Inter Display', Inter, sans-serif", margin: '0 0 16px' }}>
            {lang === 'he' ? 'בואו נדבר על הפרויקט שלך.' : "Let's talk about your project."}
          </h2>
          <p style={{ fontSize: 16, color: '#737373', fontWeight: 300, lineHeight: 1.6, margin: '0 0 36px' }}>
            {lang === 'he'
              ? 'קבל הצעת מחיר, תאם שיחה, או בקר במפעל בנתניה.'
              : 'Request a quote, schedule a call, or visit the factory in Netanya.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={ROUTES.QUOTE} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 24px', borderRadius: 999, background: BRAND_NEUTRAL, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              {lang === 'he' ? 'קבל הצעת מחיר' : 'Get a quote'} <ArrowRight size={14} />
            </Link>
            <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 24px', borderRadius: 999, background: 'transparent', color: '#0a0a0a', border: '1px solid #d4d4d4', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              {lang === 'he' ? 'צור קשר' : 'Contact us'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
