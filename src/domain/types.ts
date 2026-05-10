/**
 * DOMAIN TYPES - Canonical Data Model
 * ====================================
 */

export type ServiceBrand = 'hwood' | 'skylum';

export type ServiceOrderType =
  | 'browse-and-order'
  | 'send-file-and-process'
  | 'describe-and-request'
  | 'informational';

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  heroImageUrl?: string;
  accentColor?: string;
  subtitle?: string;
  ctaText?: string;
  visibilityStatus?: string;
  brand?: ServiceBrand;
  orderType?: ServiceOrderType;
}

export interface Subservice {
  id: string;
  slug: string;
  serviceId: string;
  title: string;
  description: string;
  imageUrl: string;
  heroImageUrl?: string;
}

export interface ProductCategory {
  id: string;
  slug: string;
  subserviceId: string;
  title: string;
  description: string;
  sortOrder?: number;
}

export interface Product {
  id: string;
  slug: string;
  categoryId: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  galleryImages?: string[];
  videoUrl?: string;
  features?: string[];
  specifications?: ProductSpecification[];
  has3DView?: boolean;
  modelUrl?: string;
  visibilityStatus?: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
  unit?: string;
}

export type StoryType = 'EVENTS' | 'CUSTOMER STORY';

export interface Story {
  id: string;
  slug: string;
  title: string;
  date: string;
  type: StoryType;
  imageUrl: string;
  excerpt?: string;
  content?: string;
  isGenerated?: boolean;
}

export interface QuoteRequest {
  id?: string;
  productId: string;
  productTitle: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  country: string;
  selectedOptions?: Record<string, string>;
  message?: string;
  submittedAt?: string;
}

export interface OrderContact {
  name: string;
  phone: string;
  company?: string;
}

export interface BrowseOrderSubmission extends OrderContact {
  orderType: 'browse-and-order';
  serviceSlug: string;
  productId?: string;
  productTitle?: string;
  selectedConfiguration?: Record<string, string>;
  quantity?: string;
  comment?: string;
}

export interface SendFileSubmission extends OrderContact {
  orderType: 'send-file-and-process';
  serviceSlug: string;
  subserviceSlug?: string;
  operationType?: string;
  material?: string;
  thickness?: string;
  volume?: string;
  deadline?: string;
  description?: string;
  fileUrl?: string;
}

export interface DescribeRequestSubmission extends OrderContact {
  orderType: 'describe-and-request';
  serviceSlug: string;
  clientRole: 'designer' | 'contractor' | 'developer' | 'private';
  objectType?: string;
  material?: string;
  approximateVolume?: string;
  description: string;
  fileUrl?: string;
}

export type OrderSubmission =
  | BrowseOrderSubmission
  | SendFileSubmission
  | DescribeRequestSubmission;

export interface QuoteSubmissionResult {
  success: boolean;
  error?: string;
}

export interface CompanyInfo {
  name: string;
  tagline?: string;
  description: string;
  phone: string;
  email: string;
  address: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  videoUrl?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface ConfigOptionType {
  id: string;
  slug: string;
  name: string;
  nameHe?: string;
  description?: string;
  descriptionHe?: string;
  inputType: 'button_group' | 'color_picker' | 'dropdown' | 'checkbox_group';
  unit?: string;
  sortOrder: number;
  values: ConfigOptionValue[];
}

export interface ConfigOptionValue {
  id: string;
  slug: string;
  label: string;
  labelHe?: string;
  value: string;
  colorHex?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  isDisabled?: boolean;
}

export interface ProductConfiguration {
  productId: string;
  subserviceId: string;
  options: ConfigOptionType[];
  defaults: Record<string, string>;
}

export interface SelectedConfiguration {
  [optionSlug: string]: string;
}

export interface Feature {
  id: string;
  slug: string;
  name: string;
  nameHe?: string;
  description?: string;
  descriptionHe?: string;
  iconName?: string;
}
