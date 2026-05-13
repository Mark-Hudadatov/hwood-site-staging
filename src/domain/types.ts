/**
 * DOMAIN TYPES - Canonical Data Model
 * ====================================
 * This file defines the stable interfaces for the entire application.
 * All data (mock or real) must conform to these types.
 * 
 * HIERARCHY:
 * Service → Subservice → ProductCategory → Product
 * 
 * EXAMPLE CHAIN:
 * "Modular bodies and cabinets" → "Kitchen modules" → "Upper" → "N1"
 */

// =============================================================================
// CORE DOMAIN ENTITIES
// =============================================================================

export type ServiceBrand = 'hwood' | 'skylum';

export type ServiceOrderType =
  | 'browse-and-order'
  | 'send-file-and-process'
  | 'describe-and-request'
  | 'informational';

/**
 * Service - Top-level offering
 * Examples: "Modular bodies and cabinets", "CNC processing of panels", "Furniture fronts production"
 */
export interface Service {
  id: string;
  slug: string;                    // URL-friendly: "modular-bodies-and-cabinets"
  title: string;                   // Display: "Modular bodies and cabinets"
  description: string;
  imageUrl: string;
  heroImageUrl?: string;           // Optional larger hero image for service page
  accentColor?: string;            // Optional brand color (e.g., "#D48F28")
  subtitle?: string;
  ctaText?: string;
  visibilityStatus?: string;
  brand?: ServiceBrand;
  orderType?: ServiceOrderType;
}

/**
 * Subservice - Specific process within a Service
 * Examples: "Kitchen modules", "Bathrooms and niches", "Wardrobes and closets"
 */
export interface Subservice {
  id: string;
  slug: string;                    // URL-friendly: "kitchen-modules"
  serviceId: string;               // FK to parent Service
  title: string;
  description: string;
  imageUrl: string;
  heroImageUrl?: string;
}

/**
 * ProductCategory - Grouping of products within a Subservice
 * Examples: "Upper", "Lower", "Base", "Islands"
 */
export interface ProductCategory {
  id: string;
  slug: string;                    // URL-friendly: "upper"
  subserviceId: string;            // FK to parent Subservice
  title: string;
  description: string;
  sortOrder?: number;              // For tab ordering
}

/**
 * Product - Actual item/SKU
 * Examples: "N1", "N2", "N3" (kitchen modules)
 */
export interface Product {
  id: string;
  slug: string;                    // URL-friendly: "n1-upper-module"
  categoryId: string;              // FK to parent ProductCategory
  title: string;
  subtitle?: string;               // Short tagline
  description: string;
  imageUrl: string;
  galleryImages?: string[];        // Additional product images
  videoUrl?: string;               // Product video (360° spin, etc.)
  features?: string[];             // Key features list
  specifications?: ProductSpecification[];
  has3DView?: boolean;             // Whether 360° view is available
  modelUrl?: string;               // URL to GLB/glTF 3D model file
  visibilityStatus?: string;
}

/**
 * Product Specification - Key-value pairs for product details
 */
export interface ProductSpecification {
  label: string;                   // e.g., "Working Field Size"
  value: string;                   // e.g., "3000mm"
  unit?: string;                   // e.g., "mm"
}

// =============================================================================
// SUPPORTING ENTITIES (for other sections of the site)
// =============================================================================

/**
 * Story - News/Events items for "What's Next" section
 */
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

/**
 * Quote Request - Form submission data
 */
export interface QuoteRequest {
  id?: string;
  productId: string;
  productTitle: string;
  // Customer info
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  country: string;
  // Configuration
  selectedOptions?: Record<string, string>;
  message?: string;
  // Metadata
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

/**
 * Company Info - Basic company details
 */
export interface CompanyInfo {
  name: string;
  tagline?: string;
  description: string;
  phone: string;
  email: string;
  address: string;
}

/**
 * Hero Slide - Homepage hero carousel items
 */
export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  videoUrl?: string;
  ctaText?: string;
  ctaLink?: string;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Navigation breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;                   // If undefined, rendered as current page (no link)
}

/**
 * API response wrapper (for future real API)
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// =============================================================================
// PRODUCT CONFIGURATION TYPES
// =============================================================================

/**
 * Configuration Option Type - e.g., "Width", "Color", "Drawer System"
 */
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

/**
 * Configuration Option Value - e.g., "60cm", "White", "Soft Close"
 */
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
  isDisabled?: boolean;  // For product-level overrides
}

/**
 * Product Configuration - Complete config for a product
 */
export interface ProductConfiguration {
  productId: string;
  subserviceId: string;
  options: ConfigOptionType[];
  defaults: Record<string, string>;  // optionSlug -> valueSlug
}

/**
 * Selected Configuration - User's selections
 */
export interface SelectedConfiguration {
  [optionSlug: string]: string;  // optionSlug -> valueSlug
}

/**
 * Feature - Product feature from library
 */
export interface Feature {
  id: string;
  slug: string;
  name: string;
  nameHe?: string;
  description?: string;
  descriptionHe?: string;
  iconName?: string;
}
