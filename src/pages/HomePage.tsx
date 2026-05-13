/**
 * HOME PAGE - WITH COMING SOON SUPPORT
 * =====================================
 * ✅ Services with Coming Soon overlay
 * ✅ Stories with Coming Soon overlay
 * ✅ Direct image tags (no complex wrappers)
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Pause, Clock } from 'lucide-react';
import { Service, Story } from '../domain/types';
import { getServices, getStories } from '../services/data/dataService';
import { supabase } from '../services/supabase';
import { ROUTES } from '../router';
import { ScrollReveal, StaggerReveal } from '../components/premium';

// =============================================================================
// CONSTANTS
// =============================================================================

// Icon-based fallback images as data URIs (no external dependencies)
const FALLBACK = {
  // Carpentry/cabinet icon - small centered on dark background
  service: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" fill="none"><rect width="800" height="1000" fill="#1a1a1a"/><g transform="translate(360, 460)" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.4"><rect x="0" y="0" width="80" height="50" rx="3"/><rect x="8" y="12" width="20" height="30" rx="2"/><rect x="33" y="12" width="20" height="30" rx="2"/><rect x="58" y="12" width="15" height="20" rx="2"/><circle cx="18" cy="27" r="2" fill="#ffffff" fill-opacity="0.4"/><circle cx="43" cy="27" r="2" fill="#ffffff" fill-opacity="0.4"/><circle cx="65" cy="22" r="1.5" fill="#ffffff" fill-opacity="0.4"/></g></svg>`)}`,
  // Camera icon for stories - dark background
  story: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" fill="none"><rect width="800" height="1000" fill="#1a1a1a"/><g transform="translate(360, 460)" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.4"><rect x="5" y="20" width="70" height="50" rx="6"/><circle cx="40" cy="45" r="15"/><circle cx="40" cy="45" r="8"/><rect x="25" y="10" width="30" height="14" rx="3"/><circle cx="62" cy="30" r="4"/></g></svg>`)}`,
  // Industrial/CNC hero background
  hero: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" fill="none"><rect width="1600" height="900" fill="#1a1a1a"/><g opacity="0.15"><pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="#005f5f" stroke-width="1"/></pattern><rect width="1600" height="900" fill="url(#grid)"/></g><g transform="translate(600, 300)" stroke="#005f5f" stroke-width="4" fill="none" opacity="0.4"><rect x="0" y="0" width="400" height="300" rx="20"/><circle cx="200" cy="150" r="80"/><circle cx="200" cy="150" r="40"/><path d="M120 150 L80 150 M280 150 L320 150 M200 70 L200 30 M200 230 L200 270"/></g></svg>`)}`,
};

// =============================================================================
// TYPES
// =============================================================================

interface ServiceWithStatus extends Service {
  visibilityStatus?: string;
  subtitle?: string;
  accentColor?: string;
  ctaText?: string;
}

interface StoryWithStatus extends Story {
  visibilityStatus?: string;
}

interface HomepageSettings {
  hero: {
    left_image_url: string;
    left_video_url?: string;
    left_title_en: string;
    left_title_he: string;
    left_subtitle_en?: string;
    left_subtitle_he?: string;
    right_image_url: string;
    right_title_en: string;
    right_title_he: string;
    right_link: string;
    hero_height: string;
  };
  services_section: {
    title_en: string;
    title_he: string;
    subtitle_en?: string;
    subtitle_he?: string;
    show_descriptions: boolean;
  };
  stories_section: {
    title_en: string;
    title_he: string;
    button_text_en: string;
    button_text_he: string;
    button_link: string;
  };
  about_section: {
    title_en: string;
    title_he: string;
    description_en: string;
    description_he: string;
    button_text_en: string;
    button_text_he: string;
    button_link: string;
    background_color: string;
    text_color: string;
  };
  layout: {
    primary_color: string;
    secondary_color: string;
    background_dark: string;
  };
  partners_section: {
    section_title_en: string;
    section_title_he: string;
    section_description_en: string;
    section_description_he: string;
    boxes: Array<{
      title_en: string;
      title_he: string;
      subtitle_en: string;
      subtitle_he: string;
      description_en: string;
      description_he: string;
      image_url: string;
      overlay_opacity: number;
    }>;
  };
  hero_rail: {
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
  };
}

const DEFAULT_SETTINGS: HomepageSettings = {
  hero: {
    left_image_url: FALLBACK.hero,
    left_video_url: '',
    left_title_en: 'CNC Production Systems',
    left_title_he: 'מערכות ייצור CNC',
    left_subtitle_en: 'Modular systems and CNC processing for kitchen and interior production.',
    left_subtitle_he: 'מערכות מודולריות ועיבוד CNC לייצור מטבחים ופנים.',
    right_image_url: '',
    right_title_en: '',
    right_title_he: '',
    right_link: '/services',
    hero_height: '90vh',
  },
  services_section: { title_en: 'Our Services', title_he: 'השירותים שלנו', subtitle_en: 'Precision services designed for the modern industrial workflow.', subtitle_he: 'שירותי דיוק המיועדים לתהליכי העבודה התעשייתיים המודרניים.', show_descriptions: true },
  stories_section: { title_en: 'Recent Projects and News', title_he: '', button_text_en: 'See all', button_text_he: '', button_link: '/portfolio' },
  about_section: { title_en: 'About HWOOD', title_he: '', description_en: 'Modern production powerhouse.', description_he: '', button_text_en: 'Discover', button_text_he: '', button_link: '/about', background_color: '#EAEAEA', text_color: '#005f5f' },
  layout: { primary_color: '#005f5f', secondary_color: '#004d4d', background_dark: '#002828' },
  partners_section: {
    section_title_en: 'Who We Work With',
    section_title_he: 'עם מי אנחנו עובדים',
    section_description_en: 'If you produce cabinets for real clients — not concepts — we speak the same language.',
    section_description_he: 'אם אתם מייצרים ארונות עבור לקוחות אמיתיים — לא קונספטים — אנחנו מדברים באותה שפה.',
    boxes: [
      { title_en: 'Kitchen & Cabinet Manufacturers', title_he: 'יצרני מטבחים וארונות', subtitle_en: 'Series & Project-based Production', subtitle_he: 'ייצור סדרתי ופרויקטאלי', description_en: 'Focused on repeatable manufacturing, dimensional consistency, and CNC-based workflows.', description_he: 'התמקדות בייצור חוזר, עקביות מידות ותהליכי עבודה מבוססי CNC.', image_url: '', overlay_opacity: 70 },
      { title_en: 'Professional Carpentry & Joinery', title_he: 'נגרות מקצועית', subtitle_en: 'Custom Interior Fabrication', subtitle_he: 'ייצור פנים מותאם אישית', description_en: 'Using CNC machining to improve accuracy and stabilize non-standard production.', description_he: 'שימוש בעיבוד CNC לשיפור דיוק וייצוב ייצור לא סטנדרטי.', image_url: '', overlay_opacity: 75 },
      { title_en: 'Interior & Fit-Out Contractors', title_he: 'קבלני פנים והתאמות', subtitle_en: 'Residential & Commercial Delivery', subtitle_he: 'אספקה למגורים ומסחר', description_en: 'Requiring predictable production, system-compatible cabinetry, and reliable integration.', description_he: 'דורשים ייצור צפוי, ארונות תואמי מערכת ואינטגרציה אמינה.', image_url: '', overlay_opacity: 80 },
    ],
  },
  hero_rail: {
    heading_en: 'What kind of project\nare you working on?',
    heading_he: 'על איזה סוג פרויקט\nאתה עובד?',
    eyebrow_en: 'Start your order',
    eyebrow_he: 'התחל הזמנה',
    card1_title_en: 'Browse & Order', card1_title_he: 'עיון והזמנה',
    card1_badge_en: 'Catalog', card1_badge_he: 'קטלוג',
    card1_desc_en: '30+ ready cabinet modules — in stock, dispatched same week.',
    card1_desc_he: '30+ מודולי ארונות מוכנים — במלאי, משלוח באותו שבוע.',
    card1_lead_en: 'Lead time · from 5 days', card1_lead_he: 'זמן אספקה · מ-5 ימים',
    card1_link: '/quote?type=browse',
    card2_title_en: 'CNC Services', card2_title_he: 'שירותי CNC',
    card2_badge_en: 'Service', card2_badge_he: 'שירות',
    card2_desc_en: 'DXF, sketches or panel list — we run it through our line and ship the parts.',
    card2_desc_he: 'DXF, סקיצות או רשימת לוחות — אנחנו מעבדים ומשלחים.',
    card2_lead_en: 'Lead time · from 72h', card2_lead_he: 'זמן אספקה · מ-72 שעות',
    card2_link: '/quote?type=file',
    card3_title_en: 'Custom Order', card3_title_he: 'הזמנה מותאמת',
    card3_badge_en: 'Project', card3_badge_he: 'פרויקט',
    card3_desc_en: 'Brief, design, engineering and install — we handle the build end-to-end.',
    card3_desc_he: 'בריף, עיצוב, הנדסה והתקנה — אנחנו מטפלים בהכל.',
    card3_lead_en: 'Lead time · from 4 weeks', card3_lead_he: 'זמן אספקה · מ-4 שבועות',
    card3_link: '/quote?type=describe',
    footer_text_en: 'Not sure where to start?', footer_text_he: 'לא בטוח מאיפה להתחיל?',
    footer_cta_en: 'Get a callback', footer_cta_he: 'קבל שיחה חזרה',
    whatsapp_number: '972549222804',
    badge1_en: 'Reply within 1 business day', badge1_he: 'תגובה תוך יום עסקים',
    badge2_en: 'EN / HE', badge2_he: 'עב / אנ',
  },
};

const getCurrentLang = (): 'en' | 'he' => {
  if (typeof window === 'undefined') return 'en';
  const lang = localStorage.getItem('i18nextLng') || 'en';
  return lang.startsWith('he') ? 'he' : 'en';
};

// =============================================================================
// COMING SOON OVERLAY
// =============================================================================

const ComingSoonOverlay: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
  const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10">
      <Clock className={`${iconSize} text-white mb-2`} />
      <span className={`text-white ${textSize} font-bold uppercase tracking-wider`}>Coming Soon</span>
    </div>
  );
};

// =============================================================================
// PARTNERS SECTION (DYNAMIC FROM SUPABASE)
// =============================================================================

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
}

const PartnersSection: React.FC<{ partners: Partner[] }> = ({ partners }) => {
  // If no partners, show nothing or fallback text
  if (partners.length === 0) {
    return null;
  }

  // Triple the partners for seamless loop
  const displayPartners = [...partners, ...partners, ...partners];

  return (
    <section className="w-full bg-white py-6 md:py-10 overflow-hidden border-b border-gray-100">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white to-transparent z-10" />
        <div className="flex animate-marquee">
          {displayPartners.map((partner, i) => (
            partner.website_url ? (
              <a
                key={`${partner.id}-${i}`}
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 mx-8 md:mx-12 flex items-center justify-center h-12 md:h-16 opacity-60 hover:opacity-100 transition-opacity"
              >
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="h-8 md:h-12 w-auto max-w-[120px] md:max-w-[160px] object-contain grayscale hover:grayscale-0 transition-all"
                />
              </a>
            ) : (
              <div
                key={`${partner.id}-${i}`}
                className="flex-shrink-0 mx-8 md:mx-12 flex items-center justify-center h-12 md:h-16 opacity-60 hover:opacity-100 transition-opacity"
              >
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="h-8 md:h-12 w-auto max-w-[120px] md:max-w-[160px] object-contain grayscale hover:grayscale-0 transition-all"
                />
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// SERVICE CARD WITH COMING SOON
// =============================================================================

// =============================================================================
// SERVICE CARD - CNC INDUSTRIAL STYLE V2
// =============================================================================

const ServiceCard: React.FC<{
  service: ServiceWithStatus;
  onClick: () => void;
  showDescription: boolean;
  isPrimary?: boolean;
}> = ({ service, onClick, showDescription, isPrimary = false }) => {
  const isComingSoon = service.visibilityStatus === 'coming_soon';
  const imgSrc = service.imageUrl || FALLBACK.service;

  // Get subtitle from service if available (technical descriptor)
  const technicalDescriptor = service.subtitle || 'Industrial Service';
  // Get CTA text from service
  const ctaText = service.ctaText || 'Explore Services';

  return (
    <div 
      className={`relative flex flex-col justify-between overflow-hidden rounded-3xl
        w-[280px] h-[420px] sm:w-[320px] sm:h-[480px] md:w-[380px] md:h-[530px] lg:w-[350px] lg:h-[500px] xl:w-[400px] xl:h-[560px]
        group transition-all duration-300
        border-4 border-transparent
        ${isComingSoon ? 'opacity-70' : 'hover:border-black hover:shadow-2xl cursor-pointer'}
      `}
      onClick={isComingSoon ? undefined : onClick}
    >
      {/* Full-color Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={imgSrc} 
          alt={service.title} 
          loading="eager"
          className={`w-full h-full object-cover ${isComingSoon ? 'grayscale' : ''}`}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK.service; }}
        />
        {/* Gradient for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80" />
      </div>

      {isComingSoon && <ComingSoonOverlay />}

      {/* Content Container - p-10 = 40px padding */}
      <div className="relative z-10 p-6 md:p-10 flex flex-col h-full text-white">
        {/* Technical Descriptor Badge */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold bg-[#005f5f] px-3 py-2 rounded-sm text-white truncate max-w-[70%]">
            {technicalDescriptor}
          </span>
          {isPrimary && (
            <span className="w-2 h-2 flex-shrink-0 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]"></span>
          )}
        </div>

        {/* Main Content pushed to bottom */}
        <div className="mt-auto">
          <h4 className="text-xl md:text-2xl font-bold mb-4 tracking-tight leading-tight truncate">
            {service.title}
          </h4>
          {showDescription && service.description && (
            <p className="text-sm leading-relaxed font-light text-white/70 mb-8 group-hover:text-white transition-colors line-clamp-2">
              {service.description}
            </p>
          )}
          
          {!isComingSoon && (
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold inline-flex items-center gap-3 group/link transition-all">
                {ctaText}
                <svg className="w-5 h-5 transition-transform group-hover/link:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// STORY CARD WITH COMING SOON
// =============================================================================

const StoryCard: React.FC<{ story: StoryWithStatus; lang?: 'en' | 'he' }> = ({ story, lang = 'en' }) => {
  const isComingSoon = story.visibilityStatus === 'coming_soon';
  const imgSrc = story.imageUrl || FALLBACK.story;
  const isRTL = lang === 'he';

  const content = (
    <div className={`flex-shrink-0 w-[280px] md:w-[320px] lg:w-[290px] xl:w-[320px] 2xl:w-[340px] flex flex-col ${isRTL ? 'items-end' : 'items-start'} ${isComingSoon ? '' : 'group cursor-pointer'} transition-transform duration-300 ${isComingSoon ? '' : 'hover:-translate-y-2'}`}>
      <div className="relative w-full aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-2xl md:rounded-3xl lg:rounded-[2rem] shadow-lg mb-4 md:mb-6">
        <img
          src={imgSrc}
          alt={story.title}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
            isComingSoon ? 'grayscale brightness-75' : 'group-hover:scale-110'
          }`}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK.story; }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        
        {/* Type label inside image - top */}
        <div className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'}`}>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold bg-[#005f5f] px-3 py-2 rounded-sm text-white">
            {story.type}
          </span>
        </div>
        
        {isComingSoon && <ComingSoonOverlay />}
        {!isComingSoon && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ArrowRight className={`w-6 h-6 text-white ${isRTL ? 'rotate-180' : ''}`} />
            </div>
          </div>
        )}
      </div>

      <h3 className={`text-base md:text-lg font-bold leading-tight mb-3 px-2 line-clamp-2 transition-colors duration-300 ${isRTL ? 'text-right' : 'text-left'} ${
        isComingSoon ? 'text-white/60' : 'text-white group-hover:text-[#00d4aa]'
      }`}>
        {story.title}
      </h3>

      <div className={`text-white/80 text-sm font-medium px-2 ${isRTL ? 'text-right' : 'text-left'}`}>{story.date}</div>
    </div>
  );

  if (isComingSoon) {
    return content;
  }

  return (
    <Link to={ROUTES.STORY(story.slug || story.id)}>
      {content}
    </Link>
  );
};

// =============================================================================
// HERO SECTION
// =============================================================================

const HeroSection: React.FC<{ settings: HomepageSettings['hero']; railSettings: HomepageSettings['hero_rail']; lang: 'en' | 'he' }> = ({ settings, railSettings, lang }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const leftTitle = lang === 'he' && settings.left_title_he ? settings.left_title_he : settings.left_title_en;
  const leftSubtitle = lang === 'he' && settings.left_subtitle_he ? settings.left_subtitle_he : settings.left_subtitle_en || '';
  const leftImg = settings.left_image_url || FALLBACK.hero;
  const buttonText = lang === 'he' ? 'צפה בקטלוג המודולים' : 'View Module Catalog';

  const rl = railSettings;
  const L = (en: string, he: string) => (lang === 'he' && he ? he : en);
  const rail = {
    heading: L(rl.heading_en, rl.heading_he).split('\n'),
    eyebrow: L(rl.eyebrow_en, rl.eyebrow_he),
    c1title: L(rl.card1_title_en, rl.card1_title_he),
    c1badge: L(rl.card1_badge_en, rl.card1_badge_he),
    c1desc:  L(rl.card1_desc_en,  rl.card1_desc_he),
    c1lead:  L(rl.card1_lead_en,  rl.card1_lead_he),
    c2title: L(rl.card2_title_en, rl.card2_title_he),
    c2badge: L(rl.card2_badge_en, rl.card2_badge_he),
    c2desc:  L(rl.card2_desc_en,  rl.card2_desc_he),
    c2lead:  L(rl.card2_lead_en,  rl.card2_lead_he),
    c3title: L(rl.card3_title_en, rl.card3_title_he),
    c3badge: L(rl.card3_badge_en, rl.card3_badge_he),
    c3desc:  L(rl.card3_desc_en,  rl.card3_desc_he),
    c3lead:  L(rl.card3_lead_en,  rl.card3_lead_he),
    footerText: L(rl.footer_text_en, rl.footer_text_he),
    footerCta:  L(rl.footer_cta_en,  rl.footer_cta_he),
    badge1: L(rl.badge1_en, rl.badge1_he),
    badge2: L(rl.badge2_en, rl.badge2_he),
    waUrl: `https://wa.me/${rl.whatsapp_number}`,
  };

  useEffect(() => { setTimeout(() => setIsVisible(true), 100); }, []);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#121212]" style={{ height: settings.hero_height, minHeight: '600px' }}>
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* Left Panel - full width on mobile, 70% on desktop */}
        <div className="relative w-full md:w-[70%] h-full overflow-hidden border-r border-white/5">
          {settings.left_video_url ? (
            <video ref={videoRef} autoPlay loop muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover">
              <source src={settings.left_video_url} type="video/mp4" />
            </video>
          ) : (
            <img src={leftImg} alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK.hero; }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
          
          <div className={`absolute inset-0 flex flex-col justify-end p-6 md:p-16 lg:p-20 pb-28 md:pb-20 ${lang === 'he' ? 'text-right' : 'text-left'}`}>
            <h1 className={`text-white font-bold mb-4 md:mb-6 tracking-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ fontSize: 'clamp(1.75rem, 4vw, 3.75rem)' }}>
              {leftTitle}
            </h1>
            {leftSubtitle && (
              <p className={`text-white/80 text-sm md:text-lg lg:text-xl font-light leading-relaxed max-w-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
                {leftSubtitle}
              </p>
            )}
            
            {/* Button - visible on mobile inside left panel */}
            <div className={`md:hidden mt-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
              <Link 
                to={settings.right_link || '/services'} 
                className={`inline-flex items-center gap-3 bg-white text-black px-6 py-3.5 rounded-full font-bold hover:bg-emerald-500 hover:text-white transition-all text-sm ${lang === 'he' ? 'flex-row-reverse' : ''}`}
              >
                {buttonText}
                <span className="bg-black text-white rounded-full p-1">
                  <ArrowRight className={`w-4 h-4 ${lang === 'he' ? 'rotate-180' : ''}`} />
                </span>
              </Link>
            </div>
          </div>
          
          {settings.left_video_url && (
            <button onClick={toggleVideo} className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
          )}
        </div>

        {/* ── Right Panel — Version A: Refined Stack ────────────────── */}
        <div className="hidden md:flex relative w-[30%] h-full flex-col bg-[#0d0d0d] overflow-hidden">

          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px),
                linear-gradient(to right, rgba(255,255,255,.04) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 flex flex-col h-full px-7 py-6">

            {/* Top utility row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.14em] uppercase">
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>Start order</span>
                <span style={{ width: 4, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                <span className="text-white">Pick a type</span>
              </div>
              <span
                className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.04em] select-none"
                style={{ color: 'rgba(255,255,255,0.3)', padding: '4px 10px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, cursor: 'default' }}
              >
                <span style={{ width: 5, height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.25)' }} />
                Client login
              </span>
            </div>

            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 mb-3">
              <span style={{ width: 18, height: 1.5, background: '#00d4aa', borderRadius: 99, flexShrink: 0 }} />
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase" style={{ color: '#00d4aa' }}>
                {rail.eyebrow}
              </span>
            </div>

            {/* Heading */}
            <h3 className="font-semibold leading-snug mb-5 text-white" style={{ fontSize: 'clamp(17px, 1.6vw, 22px)' }}>
              {rail.heading[0]}{rail.heading[1] && <><br />{rail.heading[1]}</>}
            </h3>

            {/* Cards */}
            <div className="flex flex-col gap-4 flex-1 justify-center">

              {/* Card 1 — Browse & Order */}
              <Link
                to={railSettings.card1_link}
                className="group flex items-start gap-3.5 rounded-xl p-3.5 transition-all duration-200 no-underline"
                style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,170,0.4)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,170,0.05)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateX(2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                }}
              >
                <span className="flex items-center justify-center flex-shrink-0 rounded-[10px] mt-0.5"
                  style={{ width: 38, height: 38, background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.18)', color: '#00d4aa' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold text-[13px] leading-none">{rail.c1title}</span>
                    <span className="text-[9px] font-bold tracking-[0.14em] uppercase px-1.5 py-0.5 rounded-sm"
                      style={{ background: 'rgba(0,212,170,0.15)', color: '#00d4aa' }}>{rail.c1badge}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {rail.c1desc}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <span style={{ width: 3, height: 3, borderRadius: 999, background: '#00d4aa', flexShrink: 0 }} />
                    {rail.c1lead}
                  </div>
                </div>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="flex-shrink-0 mt-1 transition-transform duration-200 group-hover:translate-x-0.5">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </Link>

              {/* Card 2 — CNC Services */}
              <Link
                to={railSettings.card2_link}
                className="group flex items-start gap-3.5 rounded-xl p-3.5 transition-all duration-200 no-underline"
                style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(91,157,255,0.4)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(91,157,255,0.05)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateX(2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                }}
              >
                <span className="flex items-center justify-center flex-shrink-0 rounded-[10px] mt-0.5"
                  style={{ width: 38, height: 38, background: 'rgba(91,157,255,0.1)', border: '1px solid rgba(91,157,255,0.18)', color: '#5b9dff' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <path d="M14 2v6h6M9 13h6M9 17h4"/>
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold text-[13px] leading-none">{rail.c2title}</span>
                    <span className="text-[9px] font-bold tracking-[0.14em] uppercase px-1.5 py-0.5 rounded-sm"
                      style={{ background: 'rgba(91,157,255,0.15)', color: '#5b9dff' }}>{rail.c2badge}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {rail.c2desc}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <span style={{ width: 3, height: 3, borderRadius: 999, background: '#5b9dff', flexShrink: 0 }} />
                    {rail.c2lead}
                  </div>
                </div>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="flex-shrink-0 mt-1 transition-transform duration-200 group-hover:translate-x-0.5">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </Link>

              {/* Card 3 — Describe a Custom Order */}
              <Link
                to={railSettings.card3_link}
                className="group flex items-start gap-3.5 rounded-xl p-3.5 transition-all duration-200 no-underline"
                style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,166,75,0.4)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(244,166,75,0.05)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateX(2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                }}
              >
                <span className="flex items-center justify-center flex-shrink-0 rounded-[10px] mt-0.5"
                  style={{ width: 38, height: 38, background: 'rgba(244,166,75,0.1)', border: '1px solid rgba(244,166,75,0.18)', color: '#f4a64b' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold text-[13px] leading-none">{rail.c3title}</span>
                    <span className="text-[9px] font-bold tracking-[0.14em] uppercase px-1.5 py-0.5 rounded-sm"
                      style={{ background: 'rgba(244,166,75,0.15)', color: '#f4a64b' }}>{rail.c3badge}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {rail.c3desc}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <span style={{ width: 3, height: 3, borderRadius: 999, background: '#f4a64b', flexShrink: 0 }} />
                    {rail.c3lead}
                  </div>
                </div>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="flex-shrink-0 mt-1 transition-transform duration-200 group-hover:translate-x-0.5">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 flex flex-col gap-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2.5 text-[12px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <span className="flex items-center justify-center flex-shrink-0 rounded-full"
                  style={{ width: 28, height: 28, background: 'rgba(0,212,170,0.12)', color: '#00d4aa' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                <span>
                  {rail.footerText}{' '}
                  <a href={rail.waUrl} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#00d4aa', borderBottom: '1px dashed rgba(0,212,170,0.4)', paddingBottom: 1 }}>
                    {rail.footerCta}
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <span className="flex items-center gap-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#00d4aa' }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {rail.badge1}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#00d4aa' }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {rail.badge2}
                </span>
              </div>
            </div>

          </div>
        </div>
        {/* ── End Right Panel ─────────────────────────────────────────── */}
      </div>
    </section>
  );
};

// =============================================================================
// CONTENT BLOCK SECTION (NEW)
// =============================================================================

const ContentBlockSection: React.FC<{ lang: 'en' | 'he'; primaryColor: string }> = ({ lang, primaryColor }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const content = {
    en: {
      title: 'Work starts from the',
      highlight: 'inside',
      p1: 'Production is rarely static. Layouts change, dimensions vary, and each project introduces new constraints that must be handled without disrupting the workflow.',
      p2: 'We focus on the internal logic of CNC-based production. We bring order where complexity is unavoidable — enabling stable throughput, fewer errors, and predictable results even in variable and custom manufacturing environments.',
      link: 'Explore Our Engineering'
    },
    he: {
      title: 'העבודה מתחילה',
      highlight: 'מבפנים',
      p1: 'הייצור לעיתים רחוקות סטטי. פריסות משתנות, מידות משתנות, וכל פרויקט מציג אילוצים חדשים שיש לטפל בהם מבלי לשבש את זרימת העבודה.',
      p2: 'אנחנו מתמקדים בלוגיקה הפנימית של ייצור מבוסס CNC. אנחנו מביאים סדר במקום שבו מורכבות בלתי נמנעת — מאפשרים תפוקה יציבה, פחות שגיאות, ותוצאות צפויות גם בסביבות ייצור משתנות ומותאמות אישית.',
      link: 'לחקור את ההנדסה שלנו'
    }
  };

  const c = content[lang];
  const isRTL = lang === 'he';

  return (
    <section ref={sectionRef} className="bg-white py-16 md:py-24 xl:py-32 px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-40" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        <h2 className={`mb-8 md:mb-12 text-gray-900 leading-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3.25rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          {c.title} <span style={{ color: '#10b981' }}>{c.highlight}</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 lg:gap-16 xl:gap-20 2xl:gap-24">
          <div className="space-y-6 md:space-y-8">
            <p className={`text-sm md:text-base text-gray-600 leading-relaxed font-normal transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
              {c.p1}
            </p>
            <p className={`text-sm md:text-base text-gray-600 leading-relaxed font-normal transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
              {c.p2}
            </p>
          </div>
          
          <div className={`flex flex-col justify-end ${isRTL ? 'lg:items-start' : 'lg:items-end'}`}>
            <button 
              onClick={() => navigate('/about')}
              className={`relative group cursor-pointer inline-flex items-center gap-4 text-black font-bold uppercase tracking-widest text-sm py-4 border-b-2 border-black transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${isRTL ? 'flex-row-reverse' : ''}`}
              style={{ transitionDelay: '600ms' }}
            >
              {c.link}
              <ArrowRight className={`w-5 h-5 transform group-hover:translate-x-2 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-2 group-hover:translate-x-0' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// ABOUT SECTION
// =============================================================================

const AboutSection: React.FC<{ settings: HomepageSettings['about_section']; lang: 'en' | 'he' }> = ({ settings, lang }) => {
  const navigate = useNavigate();
  const title = lang === 'he' && settings.title_he ? settings.title_he : settings.title_en;
  const description = lang === 'he' && settings.description_he ? settings.description_he : settings.description_en;
  const buttonText = lang === 'he' && settings.button_text_he ? settings.button_text_he : settings.button_text_en;

  return (
    <section className="relative w-full min-h-[400px] md:min-h-[500px] flex md:pt-12">
      <div className="relative z-10 flex-1 rounded-l-[40px] md:rounded-l-[80px] lg:rounded-l-[100px] xl:rounded-l-[120px] 2xl:rounded-l-[160px] ml-4 md:ml-16 lg:ml-24 xl:ml-36 2xl:ml-48 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12 md:py-16 shadow-2xl" style={{ backgroundColor: settings.background_color }}>
        <h2 className="mb-6 md:mb-8" style={{ fontSize: 'clamp(1.25rem, 2vw, 2rem)', fontWeight: 400, color: settings.text_color }}>{title}</h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed font-normal mb-8 md:mb-12 max-w-2xl">{description}</p>
        <button onClick={() => navigate(settings.button_link)} className="group relative text-white px-8 py-3.5 rounded-md font-semibold text-sm tracking-wide overflow-hidden self-start" style={{ backgroundColor: settings.text_color }}>
          <span className="relative z-10">{buttonText}</span>
          <div className="absolute inset-0 bg-black/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>
    </section>
  );
};

// =============================================================================
// MAIN HOME PAGE
// =============================================================================

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceWithStatus[]>([]);
  const [stories, setStories] = useState<StoryWithStatus[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [settings, setSettings] = useState<HomepageSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const storiesScrollRef = useRef<HTMLDivElement>(null);
  const lang = getCurrentLang();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch partners
        const { data: partnersData } = await supabase
          .from('partners')
          .select('*')
          .eq('is_visible', true)
          .order('sort_order', { ascending: true });
        
        if (partnersData) {
          setPartners(partnersData);
        }

        // Fetch services with visibility_status
        const { data: servicesData } = await supabase
          .from('services')
          .select('*')
          .in('visibility_status', ['visible', 'coming_soon'])
          .order('sort_order', { ascending: true });

        if (servicesData) {
          const mapped = servicesData.map((s: any) => ({
            id: s.id,
            slug: s.slug,
            title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
            subtitle: lang === 'he' && s.subtitle_he ? s.subtitle_he : s.subtitle_en || '',
            description: lang === 'he' && s.description_he ? s.description_he : s.description_en || '',
            ctaText: lang === 'he' && s.cta_text_he ? s.cta_text_he : s.cta_text_en || 'Explore Services',
            imageUrl: s.image_url || '',
            heroImageUrl: s.hero_image_url,
            accentColor: s.accent_color,
            visibilityStatus: s.visibility_status,
            orderType: s.order_type,
          }));
          setServices(mapped);
        }

        // Fetch stories with visibility_status
        const { data: storiesData } = await supabase
          .from('stories')
          .select('*')
          .order('date', { ascending: false });

        if (storiesData) {
          const mapped = storiesData
            .filter((s: any) => {
              const status = s.visibility_status || (s.is_visible !== false ? 'visible' : 'hidden');
              return status === 'visible' || status === 'coming_soon';
            })
            .map((s: any) => ({
              id: s.id,
              slug: s.slug,
              title: lang === 'he' && s.title_he ? s.title_he : s.title_en,
              date: new Date(s.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
              type: s.type || 'EVENTS',
              imageUrl: s.image_url || '',
              excerpt: lang === 'he' && s.excerpt_he ? s.excerpt_he : s.excerpt_en,
              visibilityStatus: s.visibility_status || (s.is_visible !== false ? 'visible' : 'hidden'),
            }));
          setStories(mapped.slice(0, 6));
        }

        // Load settings
        const { data: settingsData } = await supabase.from('homepage_settings').select('*');
        if (settingsData && settingsData.length > 0) {
          const newSettings = { ...DEFAULT_SETTINGS };
          settingsData.forEach((row: { section: string; settings: any }) => {
            if (row.section in newSettings) {
              if (row.section === 'partners_section' && row.settings?.boxes) {
                // Deep merge boxes - don't let empty strings from DB override Hebrew defaults
                const defaultBoxesHe = [
                  { title_he: 'יצרני מטבחים וארונות', subtitle_he: 'ייצור סדרתי ופרויקטאלי', description_he: 'התמקדות בייצור חוזר, עקביות מידות ותהליכי עבודה מבוססי CNC.' },
                  { title_he: 'נגרות מקצועית', subtitle_he: 'ייצור פנים מותאם אישית', description_he: 'שימוש בעיבוד CNC לשיפור דיוק וייצוב ייצור לא סטנדרטי.' },
                  { title_he: 'קבלני פנים והתאמות', subtitle_he: 'אספקה למגורים ומסחר', description_he: 'דורשים ייצור צפוי, ארונות תואמי מערכת ואינטגרציה אמינה.' },
                ];
                const mergedBoxes = DEFAULT_SETTINGS.partners_section.boxes.map((defaultBox: any, i: number) => {
                  const dbBox = row.settings.boxes[i] || {};
                  return {
                    ...defaultBox,
                    ...dbBox,
                    // If DB has empty Hebrew, use hardcoded defaults
                    title_he: dbBox.title_he || defaultBoxesHe[i]?.title_he || defaultBox.title_he || '',
                    subtitle_he: dbBox.subtitle_he || defaultBoxesHe[i]?.subtitle_he || defaultBox.subtitle_he || '',
                    description_he: dbBox.description_he || defaultBoxesHe[i]?.description_he || defaultBox.description_he || '',
                  };
                });
                (newSettings as any)[row.section] = { ...DEFAULT_SETTINGS.partners_section, ...row.settings, boxes: mergedBoxes };
              } else {
                (newSettings as any)[row.section] = { ...(DEFAULT_SETTINGS as any)[row.section], ...row.settings };
              }
            }
          });
          setSettings(newSettings);
        }
      } catch (error) {
        console.error('[HomePage] Error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [lang]);

  const scrollStories = (direction: 'left' | 'right') => {
    storiesScrollRef.current?.scrollBy({ left: direction === 'right' ? 400 : -400, behavior: 'smooth' });
  };

  // Services scroll handler with drag support
  const servicesScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const [activeOrderTypeFilter, setActiveOrderTypeFilter] = useState<string>('all');

  const scrollServices = (direction: 'left' | 'right') => {
    servicesScrollRef.current?.scrollBy({ left: direction === 'right' ? 440 : -440, behavior: 'smooth' });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!servicesScrollRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - servicesScrollRef.current.offsetLeft);
    setScrollLeft(servicesScrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    // Reset hasDragged after a short delay to allow click prevention
    setTimeout(() => setHasDragged(false), 100);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !servicesScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - servicesScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    // Only mark as dragged if we moved more than 5px
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    servicesScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleServiceClick = (slug: string) => {
    if (hasDragged) return; // Don't navigate if we just dragged
    navigate(ROUTES.SERVICE(slug));
  };

  const servicesTitle = lang === 'he' && settings.services_section.title_he ? settings.services_section.title_he : settings.services_section.title_en;
  const servicesSubtitle = lang === 'he' && settings.services_section.subtitle_he ? settings.services_section.subtitle_he : (settings.services_section.subtitle_en || 'Precision services designed for the modern industrial workflow.');
  const storiesTitle = lang === 'he' && settings.stories_section.title_he ? settings.stories_section.title_he : settings.stories_section.title_en;
  const storiesButtonText = lang === 'he' && settings.stories_section.button_text_he ? settings.stories_section.button_text_he : settings.stories_section.button_text_en;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-2 border-[#005f5f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <HeroSection settings={settings.hero} railSettings={settings.hero_rail} lang={lang} />
      <ContentBlockSection lang={lang} primaryColor={settings.layout.primary_color} />
      <PartnersSection partners={partners} />

      {/* Services Section - CNC Industrial Style V2 */}
      <section id="services" className="bg-[#f8f8f8] py-16 md:py-24 xl:py-32 px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-40 overflow-hidden select-none">
        {/* Header with Title and Subtitle stacked vertically */}
        <div className="max-w-7xl mx-auto mb-12 md:mb-16 lg:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 pb-12 border-b border-gray-200">
            <div className="flex flex-col">
              <h3 className="text-gray-900 leading-none mb-3 md:mb-4 lg:mb-6" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {servicesTitle}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                {servicesSubtitle}
              </p>
            </div>

            <div className={`flex items-center gap-3 ${lang === 'he' ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => scrollServices('left')}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all text-gray-400"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                onClick={() => scrollServices('right')}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all text-gray-400"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>

          {/* Filter chips — order type filter */}
          <div className="flex flex-wrap gap-2 mt-6">
            {[
              { key: 'all', label: lang === 'he' ? 'הכל' : 'All services', count: services.length, color: null },
              { key: 'browse-and-order', label: lang === 'he' ? 'עיון והזמנה' : 'Browse & Order', count: services.filter(s => s.orderType === 'browse-and-order').length, color: '#005f5f' },
              { key: 'send-file-and-process', label: lang === 'he' ? 'שלח קובץ' : 'Send File & Process', count: services.filter(s => s.orderType === 'send-file-and-process').length, color: '#1d4ed8' },
              { key: 'describe-and-request', label: lang === 'he' ? 'תאר ובקש' : 'Describe & Request', count: services.filter(s => s.orderType === 'describe-and-request').length, color: '#b45309' },
              { key: 'coming_soon', label: lang === 'he' ? 'בקרוב' : 'Coming soon', count: services.filter(s => s.visibilityStatus === 'coming_soon').length, color: '#737373' },
            ].filter(chip => chip.count > 0).map((chip) => {
              const isActive = activeOrderTypeFilter === chip.key;
              return (
                <button
                  key={chip.key}
                  onClick={() => setActiveOrderTypeFilter(chip.key)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-[11px] font-semibold tracking-wide border transition-all"
                  style={{
                    background: isActive ? '#0a0a0a' : '#fff',
                    color: isActive ? '#fff' : '#262626',
                    borderColor: isActive ? '#0a0a0a' : '#e0e0e0',
                    cursor: 'pointer',
                  }}
                >
                  {chip.color && (
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: chip.color }}
                    />
                  )}
                  {chip.label}
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: isActive ? 'rgba(255,255,255,0.5)' : '#a3a3a3' }}
                  >
                    {chip.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Cards Slider - no max-w to allow cards to extend */}
        <div 
          ref={servicesScrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-5 md:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide pb-12 cursor-grab active:cursor-grabbing -mx-6 md:-mx-12 lg:-mx-20 xl:-mx-32 2xl:-mx-40 px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-40"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {services
            .filter(service => {
              if (activeOrderTypeFilter === 'all') return true;
              if (activeOrderTypeFilter === 'coming_soon') return service.visibilityStatus === 'coming_soon';
              return service.orderType === activeOrderTypeFilter;
            })
            .map((service, index) => (
              <div key={service.id} className="flex-shrink-0">
                <ServiceCard
                  service={service}
                  onClick={() => handleServiceClick(service.slug)}
                  showDescription={settings.services_section.show_descriptions}
                  isPrimary={index === 0}
                />
              </div>
            ))}
          
          {/* Spacer for scroll end */}
          <div className="flex-shrink-0 w-32 md:w-64" />
        </div>
        
        {services.length === 0 && (
          <p className="text-center py-12 text-gray-500 max-w-[1280px] mx-auto px-8">No services found</p>
        )}
      </section>

      {/* How It Works — PASS B dark block */}
      <section className="relative w-full py-16 md:py-24 overflow-hidden" style={{ background: '#0a0a0a' }}>
        <div className="teal-stripes" style={{ opacity: 0.35 }} />
        <div className="relative z-10 px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-40 max-w-[1920px] mx-auto">
          {/* Header */}
          <div className="mb-10 md:mb-16">
            <span className="eyebrow" style={{ color: '#00d4aa' }}>
              {lang === 'he' ? 'איך זה עובד' : 'How it works'}
            </span>
            <h2 className="mt-3 text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-white max-w-3xl"
                style={{ letterSpacing: '-0.02em' }}>
              {lang === 'he'
                ? 'מהקובץ שלך או מהרעיון — לתוכנית עם מחיר תוך 24 שעות.'
                : 'From your file or your idea — to a costed plan in under 24 hours.'}
            </h2>
          </div>

          {/* 4-step grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative">
            {[
              {
                n: '01',
                en: { t: 'Pick your route', b: 'Catalog, project DXF, or custom brief — three doors, one team.' },
                he: { t: 'בחר את המסלול שלך', b: 'קטלוג, DXF פרויקט, או בריף מותאם — שלושה פתחים, צוות אחד.' },
              },
              {
                n: '02',
                en: { t: 'Send what you have', b: 'DXF · XLS · PDF · or a description in your own words.' },
                he: { t: 'שלח מה שיש לך', b: 'DXF · XLS · PDF · או תיאור במילים שלך.' },
              },
              {
                n: '03',
                en: { t: 'Get a costed plan', b: 'Within one business day. Materials, lead time, breakdown.' },
                he: { t: 'קבל הצעת מחיר', b: 'תוך יום עסקים אחד. חומרים, זמן אספקה, פירוט.' },
              },
              {
                n: '04',
                en: { t: 'Production & delivery', b: 'You track the job. We deliver to your site or workshop.' },
                he: { t: 'ייצור ואספקה', b: 'אתה עוקב אחרי הפרויקט. אנחנו מספקים לאתר או הסדנה שלך.' },
              },
            ].map((step, i) => (
              <div
                key={step.n}
                className="relative flex flex-col gap-4 p-6 md:p-7 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <span className="font-mono text-sm font-semibold" style={{ color: '#00d4aa' }}>{step.n}</span>
                <h3 className="text-lg md:text-xl font-semibold text-white" style={{ letterSpacing: '-0.01em' }}>
                  {lang === 'he' ? step.he.t : step.en.t}
                </h3>
                <p className="text-sm leading-relaxed font-light" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {lang === 'he' ? step.he.b : step.en.b}
                </p>
                {/* Arrow between steps (desktop) */}
                {i < 3 && (
                  <span
                    className="hidden lg:block absolute -right-4 top-8 z-10"
                    style={{ color: 'rgba(255,255,255,0.2)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* File formats banner */}
          <div
            className="mt-8 md:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 md:p-6 rounded-xl"
            style={{
              background: 'rgba(0,212,170,0.07)',
              border: '1px solid rgba(0,212,170,0.22)',
            }}
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,212,170,0.15)', color: '#00d4aa' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm md:text-base font-semibold text-white mb-1">
                {lang === 'he'
                  ? 'אין קובץ CAD? שלח סקיצה, תמונה, או תאר את העבודה במילים.'
                  : 'No CAD file? Send a sketch, a photo, or describe the job in words.'}
              </div>
              <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {lang === 'he' ? 'מקובל: DXF · DWG · XLS · CSV · PDF · טקסט חופשי' : 'Accepted: DXF · DWG · XLS · CSV · PDF · plain text'}
              </span>
            </div>
            <button
              onClick={() => navigate('/quote')}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-colors"
              style={{ background: '#fff', color: '#0a0a0a', border: 0 }}
            >
              {lang === 'he' ? 'התחל בריף' : 'Start a brief'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Who We Work With Section */}
      <section className="bg-white pt-16 md:pt-24 xl:pt-32">
        {/* Header - aligned with other sections */}
        <div className="px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-40 mb-10 md:mb-16 lg:mb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-gray-900 leading-none mb-3 md:mb-4 lg:mb-6" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {lang === 'he' && settings.partners_section.section_title_he ? settings.partners_section.section_title_he : settings.partners_section.section_title_en}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              {lang === 'he' && settings.partners_section.section_description_he ? settings.partners_section.section_description_he : settings.partners_section.section_description_en}
            </p>
          </div>
        </div>

        {/* Partner Cards Grid - Full Width */}
        <div className="grid grid-cols-1 lg:grid-cols-3 w-full">
          {settings.partners_section.boxes.map((partner, index) => (
            <div 
              key={index}
              className="relative h-[280px] md:h-[360px] lg:h-[420px] xl:h-[440px] 2xl:h-[480px] overflow-hidden group cursor-pointer transition-all duration-500 hover:brightness-110 border-r border-white/5 last:border-r-0"
              style={{ backgroundColor: '#0a0a0a' }}
            >
              {/* Background Image */}
              {partner.image_url && (
                <img
                  src={partner.image_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black" style={{ opacity: (partner.overlay_opacity ?? 70) / 100 }} />

              {/* Content */}
              <div className="absolute inset-0 p-6 md:p-10 lg:p-10 xl:p-12 2xl:p-14 flex flex-col justify-end z-10">
                {/* Subtitle */}
                <span className="inline-block text-[10px] uppercase tracking-[0.25em] font-bold text-amber-500/80 mb-4">
                  {lang === 'he' && partner.subtitle_he ? partner.subtitle_he : partner.subtitle_en}
                </span>
                
                {/* Title */}
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-5 tracking-tight leading-tight text-white">
                  {lang === 'he' && partner.title_he ? partner.title_he : partner.title_en}
                </h3>
                
                {/* Divider */}
                <div className="w-10 h-[1px] bg-white/20 mb-4 md:mb-6"></div>
                
                {/* Description */}
                <p className="text-sm leading-relaxed font-light text-white/60 max-w-[90%] group-hover:text-white/90 transition-colors">
                  {lang === 'he' && partner.description_he ? partner.description_he : partner.description_en}
                </p>
              </div>

              {/* Top accent for first card */}
              {index === 0 && (
                <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-600/30 z-10" />
              )}
              
              {/* Internal border */}
              <div className="absolute top-0 right-0 h-full w-[1px] bg-white/5 z-10" />
            </div>
          ))}
        </div>
      </section>

      {/* Stories & About */}
      <div className="relative w-full overflow-hidden" style={{ backgroundColor: settings.layout.background_dark }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-16 -top-40 h-[200%] w-64 transform -skew-x-[20deg]" style={{ backgroundColor: settings.layout.primary_color }} />
          <div className="absolute left-32 -top-40 h-[200%] w-40 transform -skew-x-[20deg] opacity-60" style={{ backgroundColor: settings.layout.secondary_color }} />
        </div>

        <section className="relative z-10 w-full text-white py-12 md:py-20 xl:py-24 px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-40 overflow-hidden">
          <div className="max-w-7xl mx-auto mb-10 md:mb-16 lg:mb-20">
            <ScrollReveal animation="fade-up">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <h1 className="text-white" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', fontWeight: 600, letterSpacing: '-0.02em' }}>{storiesTitle}</h1>
                <div className={`flex items-center gap-4 ${lang === 'he' ? 'flex-row-reverse' : ''}`}>
                  <div className={`hidden md:flex gap-2 ${lang === 'he' ? 'flex-row-reverse' : ''}`}>
                    <button onClick={() => scrollStories('left')} className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-all"><ChevronLeft className="w-5 h-5" /></button>
                    <button onClick={() => scrollStories('right')} className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-all"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                  <button onClick={() => navigate(settings.stories_section.button_link)} className="group relative px-6 md:px-8 py-2 rounded-lg border border-white text-white overflow-hidden transition-all">
                    <span className="relative z-10 text-sm font-medium group-hover:text-[#005f5f] transition-colors">{storiesButtonText}</span>
                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Stories slider - extends beyond max-w */}
          <div ref={storiesScrollRef} className="flex overflow-x-auto no-scrollbar pb-10 scroll-smooth snap-x snap-mandatory gap-5 md:gap-6 lg:gap-8 xl:gap-10 -mx-6 md:-mx-12 lg:-mx-20 xl:-mx-32 2xl:-mx-40 px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-40">
            {stories.map((story) => (
              <div key={story.id} className="snap-start"><StoryCard story={story} lang={lang} /></div>
            ))}
            <div className="w-12 flex-shrink-0" />
          </div>
          {stories.length === 0 && <p className="text-center py-12 text-white/50">No stories found</p>}
        </section>

        <AboutSection settings={settings.about_section} lang={lang} />

        {/* Masters of Materials Section */}
        <section className="relative w-full py-12 md:py-20 xl:py-24">
          <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 text-center">
            <h2 className="text-xl md:text-2xl font-normal text-white leading-tight mb-4 md:mb-5">
              {lang === 'he' ? (
                <>אנחנו עובדים עם חומרים ברמה שבה <span className="text-emerald-400">החלטות הייצור מגדירות את התוצאה הסופית.</span></>
              ) : (
                <>We work with materials at the level where <span className="text-emerald-400">production decisions define the final result.</span></>
              )}
            </h2>
            <p className="text-sm md:text-base text-white/60 leading-relaxed mb-10 md:mb-16 max-w-3xl mx-auto">
              {lang === 'he'
                ? 'ממערכות ארונות מבניות ועד רכיבים מעובדי CNC ומשטחים גמורים, המומחיות שלנו מבטיחה עקביות, דיוק ואמינות בתהליכי ייצור אמיתיים.'
                : 'From structural cabinet systems to CNC-processed components and finished surfaces, our expertise ensures consistency, precision, and reliability across real manufacturing workflows.'}
            </p>
            <button
              onClick={() => navigate('/contact')}
              className={`inline-flex items-center gap-3 px-8 py-3.5 border border-white/70 text-white/70 rounded-md font-semibold text-sm tracking-wide uppercase hover:bg-white hover:text-neutral-900 hover:border-white transition-all ${lang === 'he' ? 'flex-row-reverse' : ''}`}
            >
              {lang === 'he' ? 'צור קשר' : 'Get in Touch'}
              <ChevronRight className={`w-4 h-4 ${lang === 'he' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </section>
      </div>
    </>
  );
};
