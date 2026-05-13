/**
 * SERVICE CONTEXT MAP — Design System Static Content
 * ====================================================
 * Bilingual static content for ServicePage informational blocks.
 * Used in the next sprint (ServicePage redesign).
 * Not imported anywhere yet.
 */

import type { ServiceOrderType } from '../../domain/types';

// ============================================================================
// HOW TO ORDER MAP
// ============================================================================

export interface HowToOrderStep {
  num: string;
  title: string;
  titleHe: string;
  desc: string;
  descHe: string;
}

export const HOW_TO_ORDER_MAP: Record<ServiceOrderType, HowToOrderStep[]> = {
  'browse-and-order': [
    {
      num: '01',
      title: 'Browse the Catalog',
      titleHe: 'עיון בקטלוג',
      desc: 'Browse our product catalog and find the item that fits your needs.',
      descHe: 'עיינו בקטלוג המוצרים שלנו ומצאו את הפריט המתאים לצרכיכם.',
    },
    {
      num: '02',
      title: 'Configure & Select',
      titleHe: 'הגדרה ובחירה',
      desc: 'Choose dimensions, materials, and finish options using the configurator.',
      descHe: 'בחרו מידות, חומרים ואפשרויות גימור באמצעות הקונפיגורטור.',
    },
    {
      num: '03',
      title: 'Request a Quote',
      titleHe: 'בקשת הצעת מחיר',
      desc: 'Submit your configuration and we\'ll respond with a detailed quote.',
      descHe: 'שלחו את הקונפיגורציה שלכם ונחזיר לכם הצעת מחיר מפורטת.',
    },
  ],
  'send-file-and-process': [
    {
      num: '01',
      title: 'Describe the Job',
      titleHe: 'תארו את העבודה',
      desc: 'Tell us the operation type, material, and quantity — text is enough.',
      descHe: 'ספרו לנו על סוג הפעולה, החומר והכמות — טקסט מספיק.',
    },
    {
      num: '02',
      title: 'Upload a File (Optional)',
      titleHe: 'העלאת קובץ (אופציונלי)',
      desc: 'Attach a DXF, Excel, or PDF file for more precise processing.',
      descHe: 'צרפו קובץ DXF, Excel או PDF לעיבוד מדויק יותר.',
    },
    {
      num: '03',
      title: "We'll Contact You",
      titleHe: 'ניצור איתכם קשר',
      desc: 'We confirm details and send a quote within 1–2 business days.',
      descHe: 'נאשר פרטים ונשלח הצעת מחיר תוך 1–2 ימי עסקים.',
    },
  ],
  'describe-and-request': [
    {
      num: '01',
      title: 'Describe the Project',
      titleHe: 'תארו את הפרויקט',
      desc: 'Share the object type, material preferences, and approximate scope.',
      descHe: 'שתפו את סוג האובייקט, העדפות החומר והיקף משוער.',
    },
    {
      num: '02',
      title: 'Share References',
      titleHe: 'שתפו חומרי עזר',
      desc: 'Attach photos, sketches, or drawings — optional but helpful.',
      descHe: 'צרפו תמונות, סקיצות או שרטוטים — אופציונלי אך מועיל.',
    },
    {
      num: '03',
      title: "We'll Get Back to You",
      titleHe: 'נחזור אליכם',
      desc: 'Our team reviews your request and responds within 1–2 business days.',
      descHe: 'הצוות שלנו בוחן את בקשתכם ומגיב תוך 1–2 ימי עסקים.',
    },
  ],
  informational: [
    {
      num: '01',
      title: 'Learn About the Service',
      titleHe: 'למדו על השירות',
      desc: 'Read about the service and what we offer.',
      descHe: 'קראו על השירות ומה שאנו מציעים.',
    },
    {
      num: '02',
      title: 'Contact Us',
      titleHe: 'צרו קשר',
      desc: 'Reach out with your questions or requirements.',
      descHe: 'פנו אלינו עם שאלות או דרישות.',
    },
  ],
};

// ============================================================================
// WHO ORDERS MAP
// ============================================================================

export interface WhoOrdersEntry {
  role: string;
  roleHe: string;
  desc: string;
  descHe: string;
  icon: string;
}

export const WHO_ORDERS_MAP: Record<ServiceOrderType, WhoOrdersEntry[]> = {
  'browse-and-order': [
    { role: 'Contractors', roleHe: 'קבלנים', desc: 'Order standard modules for multiple projects at once.', descHe: 'הזמינו מודולים סטנדרטיים לפרויקטים מרובים בבת-אחת.', icon: 'hard-hat' },
    { role: 'Designers', roleHe: 'מעצבים', desc: 'Select and configure products to match your design specs.', descHe: 'בחרו והגדירו מוצרים התואמים את מפרט העיצוב שלכם.', icon: 'pencil-ruler' },
    { role: 'Private Clients', roleHe: 'לקוחות פרטיים', desc: 'Order furniture for your home — easy and fast.', descHe: 'הזמינו ריהוט לבית שלכם — בקלות ובמהירות.', icon: 'home' },
  ],
  'send-file-and-process': [
    { role: 'Manufacturers', roleHe: 'יצרנים', desc: 'Send DXF files for precise CNC processing.', descHe: 'שלחו קבצי DXF לעיבוד CNC מדויק.', icon: 'factory' },
    { role: 'Carpenters', roleHe: 'נגרים', desc: 'Outsource cutting and edge-banding to our facility.', descHe: 'הוציאו קניין חיצוני של חיתוך וסיכוך לקצה למתקן שלנו.', icon: 'tool' },
    { role: 'Contractors', roleHe: 'קבלנים', desc: 'Process large panel orders with fast turnaround.', descHe: 'עבדו הזמנות לוחות גדולות עם זמן אספקה מהיר.', icon: 'hard-hat' },
  ],
  'describe-and-request': [
    { role: 'Designers', roleHe: 'מעצבים', desc: 'Bring your custom furniture concepts to life.', descHe: 'הוציאו לפועל את רעיונות הריהוט המותאם שלכם.', icon: 'pencil-ruler' },
    { role: 'Developers', roleHe: 'יזמים', desc: 'Furnish entire projects with bespoke solutions.', descHe: 'ריהטו פרויקטים שלמים עם פתרונות ייחודיים.', icon: 'building' },
    { role: 'Private Clients', roleHe: 'לקוחות פרטיים', desc: 'Get exactly the furniture you imagined.', descHe: 'קבלו בדיוק את הריהוט שדמיינתם.', icon: 'home' },
  ],
  informational: [
    { role: 'Anyone', roleHe: 'כולם', desc: 'This service is open to all inquiries.', descHe: 'שירות זה פתוח לכל פנייה.', icon: 'info' },
  ],
};

// ============================================================================
// CTA MAP
// ============================================================================

export interface CtaConfig {
  primary: string;
  primaryHe: string;
  primaryHref: (serviceSlug: string) => string;
  secondary?: string;
  secondaryHe?: string;
  secondaryHref?: string;
}

export const CTA_MAP: Record<ServiceOrderType, CtaConfig> = {
  'browse-and-order': {
    primary: 'Browse Catalog',
    primaryHe: 'עיון בקטלוג',
    primaryHref: (slug) => `/subservices/${slug}`,
  },
  'send-file-and-process': {
    primary: 'Send File / Describe Job',
    primaryHe: 'שלח קובץ / תאר עבודה',
    primaryHref: (slug) => `/quote?service=${slug}`,
    secondary: 'Contact Us',
    secondaryHe: 'צרו קשר',
    secondaryHref: '/contact',
  },
  'describe-and-request': {
    primary: 'Describe My Project',
    primaryHe: 'תאר את הפרויקט שלי',
    primaryHref: (slug) => `/quote?service=${slug}`,
    secondary: 'Contact Us',
    secondaryHe: 'צרו קשר',
    secondaryHref: '/contact',
  },
  informational: {
    primary: 'Contact Us',
    primaryHe: 'צרו קשר',
    primaryHref: () => '/contact',
  },
};
