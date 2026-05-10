# HWOOD CMS - Complete Website + Admin Panel

## Overview
This is the complete HWOOD website with:
- ✅ Public website (bilingual EN/HE)
- ✅ Admin panel at `/admin`
- ✅ Supabase integration (database + storage)
- ✅ All Kitchen Module products seeded

## Quick Start

### 1. Run Supabase Migrations

In your Supabase SQL Editor (https://supabase.com/dashboard), run these files **in order**:

1. **supabase-migration.sql** - Adds new tables and columns
2. **supabase-seed.sql** - Seeds all product data with Hebrew translations

### 2. Environment Variables

Create `.env.local` (or update existing):

```env
VITE_SUPABASE_URL=https://phtstjwdplkdkypvkgjh.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install & Run

```bash
npm install
npm run dev
```

### 4. Access Admin

- URL: http://localhost:5173/admin
- Email: `admin@hwood.co.il`
- Password: `Hwood2024!`

## Project Structure

```
src/
├── admin/                  # Admin panel
│   ├── AdminLayout.tsx     # Sidebar + layout
│   ├── adminStore.ts       # All Supabase CRUD operations
│   ├── components/         # Shared admin components
│   └── pages/              # Admin pages
├── components/             # Public site components
├── domain/                 # TypeScript types
├── i18n/                   # Internationalization
├── layouts/                # Main layout
├── pages/                  # Public pages
├── services/
│   ├── supabase.ts         # Supabase client
│   └── data/
│       ├── dataService.ts  # Data fetching (Supabase + fallback)
│       └── mockData.ts     # Fallback data
└── router.tsx              # All routes
```

## Admin Features

| Page | Features |
|------|----------|
| Dashboard | Stats overview, quick actions |
| Services | CRUD, visibility, reorder, bilingual |
| Subservices | CRUD, parent selection, bilingual |
| Categories | CRUD, parent selection, bilingual |
| Products | Full CRUD, gallery, specs, features, duplicate |
| Stories | Full articles with Markdown editor |
| Hero Slides | Max 3 slides, video URL support |
| Company Info | All company details + social links |
| Submissions | View contact & quote requests |

## Visibility States

- **Services/Subservices/Categories**: Visible / Hidden / Coming Soon
- **Products**: Visible / Hidden / Not in Stock
- Cascade behavior: Hidden parent = hidden children

## Image Upload

- Max 5MB per image
- Formats: JPG, PNG, WebP, GIF
- Auto-resized to 1920×1080 max
- Auto-compressed to 85% quality
- Stored in Supabase Storage `images` bucket

## Database Tables

### Core Content
- `services` - Top-level services
- `subservices` - Service subcategories
- `product_categories` - Product groupings
- `products` - Individual products
- `stories` - News/articles with full content
- `hero_slides` - Homepage hero carousel

### Supporting
- `company_info` - Company details
- `social_links` - Social media URLs
- `story_types` - Customizable story categories
- `specification_types` - Product spec master list

### Submissions
- `contact_submissions` - Contact form entries
- `quote_submissions` - Quote request entries

### Auth
- `admin_users` - Simple email/password auth

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Manual
```bash
npm run build
# Upload 'dist' folder to your server
```

## Notes

- Admin is desktop-only (blocks mobile access)
- Session lasts 7 days (no auto-logout)
- All data has EN/HE support
- Mock data fallback if Supabase unavailable

## File Sizes

- Hero slides video: URL only (not uploaded)
- Images: 5MB max, auto-compressed
- Total storage depends on Supabase plan (1GB free)

---

Built for HWOOD Industrial Carpentry
