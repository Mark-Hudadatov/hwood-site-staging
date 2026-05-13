/**
 * ORDER TYPE CONFIG — Design System
 * Central source for order-type theming and navigation labels.
 */

import type { ServiceBrand, ServiceOrderType } from '../domain/types';
export type { ServiceBrand, ServiceOrderType };

export interface OrderTypeConfig {
  key: string;
  label: string;
  labelHe: string;
  sub: string;
  subHe: string;
  heroFrom: string;
  heroTo: string;
  accent: string;
  accentDark: string;
  tagBg: string;
  tagFg: string;
  surface: string;
}

export const ORDER_TYPE_CONFIG: Record<ServiceOrderType, OrderTypeConfig> = {
  'browse-and-order': {
    key: 'catalog',
    label: 'Catalog Order',
    labelHe: 'הזמנה מקטלוג',
    sub: 'Browse & Order',
    subHe: 'עיון והזמנה',
    heroFrom: '#3d5a3a',
    heroTo: '#1f2e1d',
    accent: '#a8c47a',
    accentDark: '#6b8a4a',
    tagBg: 'rgba(168,196,122,.18)',
    tagFg: '#3d5a3a',
    surface: '#f4f6ee',
  },
  'send-file-and-process': {
    key: 'project',
    label: 'Project Order',
    labelHe: 'הזמנת פרויקט',
    sub: 'Send & Process',
    subHe: 'שלח ועבד',
    heroFrom: '#1e3a5f',
    heroTo: '#0a1f3d',
    accent: '#5fa8d3',
    accentDark: '#2c6ea3',
    tagBg: 'rgba(95,168,211,.16)',
    tagFg: '#1e3a5f',
    surface: '#eef3f7',
  },
  'describe-and-request': {
    key: 'custom',
    label: 'Custom Order',
    labelHe: 'הזמנה מותאמת',
    sub: 'Describe & Request',
    subHe: 'תאר ובקש',
    heroFrom: '#7a3a1a',
    heroTo: '#3d1a0a',
    accent: '#e8a87c',
    accentDark: '#b87149',
    tagBg: 'rgba(232,168,124,.18)',
    tagFg: '#7a3a1a',
    surface: '#f5ede5',
  },
  informational: {
    key: 'informational',
    label: 'Information',
    labelHe: 'מידע',
    sub: 'Informational',
    subHe: 'מידע',
    heroFrom: '#1a2820',
    heroTo: '#0a1410',
    accent: '#00d4aa',
    accentDark: '#005f5f',
    tagBg: 'rgba(0,95,95,.12)',
    tagFg: '#005f5f',
    surface: '#f4f8f8',
  },
};

export const SKYLUM_HERO = {
  heroFrom: '#0e2a4a',
  heroTo: '#141A5C',
  accent: '#0091DB',
  accentDark: '#0070C0',
  tagBg: 'rgba(0,145,219,.15)',
  tagFg: '#0e2a4a',
};

export function getOrderTypeConfig(orderType?: ServiceOrderType | string | null): OrderTypeConfig {
  return ORDER_TYPE_CONFIG[(orderType as ServiceOrderType) || 'browse-and-order']
    ?? ORDER_TYPE_CONFIG['browse-and-order'];
}

export function getHeroColors(
  orderType?: ServiceOrderType | string | null,
  brand?: ServiceBrand | string | null,
) {
  const t = getOrderTypeConfig(orderType);
  if (brand === 'skylum') return { ...t, ...SKYLUM_HERO };
  return t;
}

export const BRAND_NEUTRAL = '#005f5f';
export const SKYLUM_BLUE = '#0091DB';
export const SKYLUM_DEEP = '#141A5C';

export const NAV_ORDER_TYPES = [
  { orderType: 'browse-and-order' as ServiceOrderType, label: 'Catalog Order', labelHe: 'הזמנה מקטלוג', sub: 'Browse', subHe: 'עיון' },
  { orderType: 'send-file-and-process' as ServiceOrderType, label: 'Project Order', labelHe: 'הזמנת פרויקט', sub: 'Send DXF', subHe: 'שלח קובץ' },
  { orderType: 'describe-and-request' as ServiceOrderType, label: 'Custom Order', labelHe: 'הזמנה מותאמת', sub: 'Describe', subHe: 'תאר' },
];
