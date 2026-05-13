/**
 * PRODUCT PAGE
 * ============
 * Displays a single product with:
 * - 3D model as hero (left), with gallery thumbnails overlaying bottom
 * - Right column: Configurations → Description → Buttons → Features
 * - Dynamic configurator options (loaded from database)
 * - Quote request CTA
 * 
 * Route: /products/:productSlug
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check, Rotate3d, Info, ChevronLeft, ChevronDown } from 'lucide-react';
import { 
  Product, 
  ProductCategory, 
  Subservice, 
  Service,
  ProductConfiguration,
  ConfigOptionType,
  SelectedConfiguration 
} from '../domain/types';
import { getProductWithBreadcrumb, getProductConfiguration } from '../services/data/dataService';
import { ROUTES } from '../router';

// Fallback image for products - dark background with small wood plank icon
const PRODUCT_FALLBACK = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="none"><rect width="800" height="600" fill="#1a1a1a"/><g transform="translate(360, 260)" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.4"><rect x="0" y="5" width="80" height="12" rx="2"/><rect x="0" y="22" width="80" height="12" rx="2"/><rect x="0" y="39" width="80" height="12" rx="2"/><rect x="0" y="56" width="80" height="12" rx="2"/><line x1="20" y1="5" x2="20" y2="68" stroke-width="1" opacity="0.3"/><line x1="40" y1="5" x2="40" y2="68" stroke-width="1" opacity="0.3"/><line x1="60" y1="5" x2="60" y2="68" stroke-width="1" opacity="0.3"/></g></svg>`)}`;

// =============================================================================
// LOADING SKELETON
// =============================================================================

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen w-full bg-white animate-pulse">
    <div className="max-w-[1600px] mx-auto px-4 md:px-16 py-4 md:py-8">
      <div className="h-3 md:h-4 w-48 md:w-96 bg-neutral-200 rounded mb-4 md:mb-8" />
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-16">
        <div className="w-full lg:w-3/5">
          <div className="h-6 md:h-10 w-40 md:w-64 bg-neutral-200 rounded mb-4 md:mb-8" />
          <div className="aspect-[3/4] md:aspect-[4/3] bg-neutral-200 rounded-2xl" />
        </div>
        <div className="w-full lg:w-2/5">
          <div className="h-6 w-32 bg-neutral-200 rounded mb-4" />
          <div className="h-24 w-full bg-neutral-200 rounded mb-10" />
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i}>
                <div className="h-4 w-24 bg-neutral-200 rounded mb-3" />
                <div className="flex gap-4">
                  <div className="h-10 w-10 bg-neutral-200 rounded-full" />
                  <div className="h-10 w-10 bg-neutral-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// =============================================================================
// CONFIGURATOR OPTION COMPONENT
// =============================================================================

interface ConfiguratorOptionProps {
  option: ConfigOptionType;
  selectedValue: string;
  onSelect: (value: string) => void;
}

const ConfiguratorOption: React.FC<ConfiguratorOptionProps> = ({
  option,
  selectedValue,
  onSelect,
}) => {
  const selectedLabel = option.values.find(v => v.slug === selectedValue)?.label || '';

  // Color picker rendering
  if (option.inputType === 'color_picker') {
    return (
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-meta font-medium text-neutral-900 uppercase tracking-wide">
            {option.name}
          </span>
          <span className="text-meta-sm text-neutral-400 capitalize">{selectedLabel}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {option.values.map((value) => (
            <button
              key={value.id}
              onClick={() => onSelect(value.slug)}
              className={`w-10 h-10 rounded-full ring-2 ring-offset-2 transition-all ${
                selectedValue === value.slug
                  ? 'ring-brand'
                  : 'ring-transparent hover:ring-neutral-200'
              }`}
              style={{ backgroundColor: value.colorHex || '#ccc' }}
              title={value.label}
            />
          ))}
        </div>
      </div>
    );
  }

  // Dropdown rendering
  if (option.inputType === 'dropdown') {
    return (
      <div>
        <label className="block text-meta font-medium text-neutral-900 uppercase tracking-wide mb-2">
          {option.name}
        </label>
        <div className="relative">
          <select
            value={selectedValue}
            onChange={(e) => onSelect(e.target.value)}
            className="w-full appearance-none px-4 py-3 pr-10 border border-neutral-200 rounded-lg text-body text-neutral-700 bg-white focus:ring-2 focus:ring-brand/30 focus:border-brand outline-none transition-all cursor-pointer"
          >
            {option.values.map((value) => (
              <option key={value.id} value={value.slug}>
                {value.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        </div>
      </div>
    );
  }

  // Checkbox group rendering
  if (option.inputType === 'checkbox_group') {
    return (
      <div>
        <span className="block text-meta font-medium text-neutral-900 uppercase tracking-wide mb-3">
          {option.name}
        </span>
        <div className="space-y-2">
          {option.values.map((value) => (
            <label
              key={value.id}
              className="flex items-center gap-3 cursor-pointer py-1"
            >
              <input
                type="checkbox"
                checked={selectedValue === value.slug}
                onChange={() => onSelect(value.slug)}
                className="w-4 h-4 text-brand rounded border-neutral-300 focus:ring-brand"
              />
              <span className="text-body text-neutral-600">
                {value.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // Button group rendering (default)
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="text-meta font-medium text-neutral-900 uppercase tracking-wide">
          {option.name}
        </span>
        {option.description && (
          <Info className="w-4 h-4 text-neutral-300 cursor-pointer hover:text-brand" />
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {option.values.map((value) => (
          <button
            key={value.id}
            onClick={() => onSelect(value.slug)}
            className={`
              px-5 py-3 rounded-lg border text-meta font-medium transition-all
              ${selectedValue === value.slug
                ? 'border-brand bg-brand/5 text-brand'
                : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }
            `}
          >
            {value.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ProductPage: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();

  // Core data state
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [subservice, setSubservice] = useState<Subservice | null>(null);
  const [service, setService] = useState<Service | null>(null);

  // Configuration state
  const [configuration, setConfiguration] = useState<ProductConfiguration | null>(null);
  const [selections, setSelections] = useState<SelectedConfiguration>({});

  // View state: '3d' or image index (0, 1, 2...)
  const [activeView, setActiveView] = useState<'3d' | number>('3d');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      if (!productSlug) return;

      setLoading(true);
      try {
        const breadcrumbData = await getProductWithBreadcrumb(productSlug);
        if (!breadcrumbData) {
          console.error('Product not found:', productSlug);
          setLoading(false);
          return;
        }

        const { service, subservice, category, product } = breadcrumbData;

        // Guard: ProductPage only for browse-and-order
        if (service.orderType && service.orderType !== 'browse-and-order') {
          navigate(ROUTES.SERVICE(service.slug), { replace: true });
          return;
        }

        setService(service);
        setSubservice(subservice);
        setCategory(category);
        setProduct(product);

        // Default to 3D if available, otherwise first image
        if (product.modelUrl && product.has3DView) {
          setActiveView('3d');
        } else {
          setActiveView(0);
        }

        // Load configuration
        const config = await getProductConfiguration(product.id, subservice.id);
        if (config) {
          setConfiguration(config);
          setSelections(config.defaults);
        }
      } catch (error) {
        console.error('Failed to load product data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productSlug]);

  const handleSelectionChange = (optionSlug: string, valueSlug: string) => {
    setSelections(prev => ({ ...prev, [optionSlug]: valueSlug }));
  };

  const getQuoteUrl = () => {
    const params = new URLSearchParams();
    if (service) params.set('service', service.slug);
    params.set('product', product?.slug || '');
    params.set('productTitle', product?.title || '');
    Object.entries(selections).forEach(([optionSlug, valueSlug]) => {
      params.set(`config_${optionSlug}`, valueSlug);
    });
    return `${ROUTES.QUOTE}?${params.toString()}`;
  };

  if (loading) return <LoadingSkeleton />;

  if (!product || !service || !subservice || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-h1 font-medium text-neutral-900 mb-4">Product Not Found</h1>
          <Link to={ROUTES.HOME} className="text-brand hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const allImages = [product.imageUrl, ...(product.galleryImages || [])].filter(Boolean);
  const has3D = !!(product.modelUrl && product.has3DView);

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="max-w-[1600px] mx-auto px-4 md:px-16 py-3 md:py-8">
        
        {/* Breadcrumb - smaller on mobile */}
        <nav className="flex items-center gap-1 md:gap-2 text-[10px] md:text-meta text-neutral-500 mb-3 md:mb-8 flex-wrap">
          <Link to={ROUTES.HOME} className="hover:text-brand">Home</Link>
          <span>/</span>
          <Link to={ROUTES.SERVICE(service.slug)} className="hover:text-brand">{service.title}</Link>
          <span>/</span>
          <Link to={ROUTES.SUBSERVICE(subservice.slug)} className="hover:text-brand">{subservice.title}</Link>
          <span>/</span>
          <span className="text-neutral-900">{product.title}</span>
        </nav>

        {/* Back - smaller on mobile */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 md:gap-2 text-xs md:text-base text-neutral-500 hover:text-brand mb-3 md:mb-6 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Back
        </button>

        {/* Main content grid */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 xl:gap-16">
          
          {/* ========================================================== */}
          {/* LEFT: 3D Hero with overlay thumbnails                       */}
          {/* ========================================================== */}
          <div className="w-full lg:w-3/5">
            <div className="lg:sticky lg:top-4">
            <h1 className="text-lg md:text-display-sm font-medium text-neutral-900 mb-1 md:mb-2">{product.title}</h1>
            {product.subtitle && (
              <p className="text-sm md:text-body-lg text-neutral-500 mb-3 md:mb-6">{product.subtitle}</p>
            )}

            {/* Hero viewer area — tall portrait on mobile for better interaction, capped on desktop */}
            <div className="relative aspect-[3/4] md:aspect-[4/3] lg:aspect-auto lg:h-[calc(100vh-12rem)] rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-200">
              
              {/* 3D Viewer */}
              {activeView === '3d' && has3D && (
                <>
                  {/* @ts-ignore */}
                  <model-viewer
                    src={product.modelUrl}
                    alt={product.title}
                    auto-rotate
                    camera-controls
                    shadow-intensity="1"
                    environment-image="neutral"
                    style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5' }}
                    loading="eager"
                    poster={allImages[0] || PRODUCT_FALLBACK}
                  >
                  {/* @ts-ignore */}
                  </model-viewer>
                  <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                    <Rotate3d className="w-3.5 h-3.5" />
                    3D Interactive
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full">
                    Drag to rotate · Scroll to zoom
                  </div>
                </>
              )}

              {/* Image Viewer */}
              {typeof activeView === 'number' && (
                <>
                  <img
                    src={allImages[activeView] || PRODUCT_FALLBACK}
                    alt={product.title}
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).src = PRODUCT_FALLBACK; }}
                  />
                  {has3D && (
                    <button 
                      onClick={() => setActiveView('3d')}
                      className="absolute top-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 hover:bg-black/80 transition-colors cursor-pointer"
                    >
                      <Rotate3d className="w-3.5 h-3.5" />
                      Back to 3D
                    </button>
                  )}
                </>
              )}

              {/* Overlay Thumbnails */}
              {(allImages.length > 0 || has3D) && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                  <div className="flex gap-2 bg-black/40 backdrop-blur-sm rounded-xl p-2">
                    {/* 3D thumb */}
                    {has3D && (
                      <button
                        onClick={() => setActiveView('3d')}
                        className={`flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center transition-all border-2 ${
                          activeView === '3d' 
                            ? 'border-white bg-white/20' 
                            : 'border-transparent bg-white/10 hover:bg-white/20'
                        }`}
                        title="3D View"
                      >
                        <Rotate3d className="w-5 h-5 text-white" />
                      </button>
                    )}
                    {/* Image thumbs */}
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveView(idx)}
                        className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all border-2 ${
                          activeView === idx 
                            ? 'border-white' 
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Video - hidden on desktop to keep sticky panel within viewport */}
            {product.videoUrl && (
              <div className="mt-6 lg:hidden">
                <video src={product.videoUrl} controls className="w-full rounded-xl" />
              </div>
            )}
            </div>{/* end sticky wrapper */}
          </div>

          {/* ========================================================== */}
          {/* RIGHT: Config → Description → Buttons → Features           */}
          {/* ========================================================== */}
          <div className="w-full lg:w-2/5">

            {/* 1. CONFIGURATIONS */}
            {configuration && configuration.options.length > 0 ? (
              <div className="mb-10">
                <h2 className="text-h2 font-medium text-neutral-900 mb-5">Configure</h2>
                <div className="flex flex-col gap-5">
                  {configuration.options.map((option) => (
                    <ConfiguratorOption
                      key={option.id}
                      option={option}
                      selectedValue={selections[option.slug] || ''}
                      onSelect={(value) => handleSelectionChange(option.slug, value)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-neutral-50 rounded-xl mb-10">
                <p className="text-meta text-neutral-500">Configuration options not available for this product.</p>
              </div>
            )}

            <div className="w-full h-px bg-neutral-200 mb-10" />

            {/* 2. DESCRIPTION */}
            <div className="mb-10">
              <h2 className="text-h2 font-medium text-neutral-900 mb-3">Description</h2>
              <p className="text-body text-neutral-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mb-10">
                <h3 className="text-h2 font-medium text-neutral-900 mb-4">Technical Specifications</h3>
                <div className="space-y-3">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-neutral-100">
                      <span className="text-meta text-neutral-500">{spec.label}</span>
                      <span className="text-body font-medium text-neutral-900">
                        {spec.value}{spec.unit ? ` ${spec.unit}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. ACTION BUTTONS */}
            <div className="flex flex-col gap-4 mb-10">
              <button 
                onClick={() => navigate(getQuoteUrl())}
                className="w-full bg-brand text-white py-3 rounded-xl font-medium hover:bg-brand/90 transition-colors"
              >
                Request Quote
              </button>
              <button 
                onClick={() => navigate(ROUTES.CONTACT)}
                className="w-full border border-brand text-brand py-3 rounded-xl font-medium hover:bg-brand/5 transition-colors"
              >
                Contact
              </button>
            </div>

            {/* 4. FEATURES */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-h2 font-medium text-neutral-900 mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                      <span className="text-body text-neutral-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
