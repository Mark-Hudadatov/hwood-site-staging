/**
 * ADMIN LAYOUT — Linear-style shell
 * ===================================
 * Sidebar + topbar + content area.
 * Design: white surface, hairline borders, dense grid, monospace IDs.
 */

import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Monitor } from 'lucide-react';
import { isAdminLoggedIn, adminLogout, getAdminSession } from './adminStore';
import { supabase } from '../services/supabase';

// ─── CSS variables (injected once) ──────────────────────────────────────────
const ADMIN_VARS = `
  .admin-root {
    --fg-1: #0a0a0a;
    --fg-2: #525252;
    --fg-3: #a3a3a3;
    --bg-1: #ffffff;
    --bg-2: #fafaf8;
    --bg-3: #f1efea;
    --border-1: #e5e5e5;
    --brand: #005f5f;
    --brand-light: #e5f5f5;
    --brand-text: #0a4d4d;
    font-family: 'Inter', system-ui, sans-serif;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Tailwind override layer — aligns CRUD pages to Linear shell ── */

  .admin-root .shadow-sm,
  .admin-root .shadow-md,
  .admin-root .shadow-lg { box-shadow: none !important; }

  .admin-root .rounded-xl {
    border-radius: 8px !important;
    border: 1px solid var(--border-1) !important;
  }

  .admin-root .text-gray-900,
  .admin-root .text-gray-800 { color: var(--fg-1) !important; }

  .admin-root .text-gray-600,
  .admin-root .text-gray-500 { color: var(--fg-2) !important; }

  .admin-root .text-gray-400,
  .admin-root .text-gray-300 { color: var(--fg-3) !important; }

  .admin-root .hover\\:bg-gray-50:hover,
  .admin-root .hover\\:bg-gray-100:hover { background: var(--bg-2) !important; }

  .admin-root .bg-gray-50 { background: var(--bg-2) !important; }
  .admin-root .bg-gray-100 { background: var(--bg-3) !important; }

  .admin-root .border-gray-200,
  .admin-root .border-gray-300 { border-color: var(--border-1) !important; }

  .admin-root .bg-blue-50 {
    background: #f0f7ff !important;
    border-color: #c7dcf5 !important;
  }
  .admin-root .text-blue-700 { color: #1e4d8c !important; }
  .admin-root .bg-green-50 { background: #f0faf4 !important; }
  .admin-root .bg-red-50 { background: #fff5f5 !important; }

  .admin-root input[type="text"],
  .admin-root input[type="email"],
  .admin-root input[type="url"],
  .admin-root input[type="number"],
  .admin-root input[type="tel"],
  .admin-root textarea,
  .admin-root select {
    border-color: var(--border-1) !important;
    border-radius: 6px !important;
    font-size: 13px !important;
    color: var(--fg-1) !important;
  }
  .admin-root input:focus,
  .admin-root textarea:focus,
  .admin-root select:focus {
    outline: none !important;
    border-color: var(--brand) !important;
    box-shadow: 0 0 0 2px rgba(0,95,95,0.1) !important;
  }

  .admin-root .bg-red-500 { background: var(--brand) !important; }
`;

// ─── Desktop gate ────────────────────────────────────────────────────────────
const DesktopOnlyGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', background: '#005f5f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 48, maxWidth: 400, textAlign: 'center' }}>
          <Monitor style={{ width: 48, height: 48, color: '#005f5f', margin: '0 auto 20px' }} />
          <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Desktop required</h1>
          <p style={{ color: '#525252', marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
            The admin panel requires a screen of at least 1024px.
          </p>
          <Link to="/" style={{ color: '#005f5f', fontSize: 14 }}>← Back to website</Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

// ─── Sidebar nav item ────────────────────────────────────────────────────────
interface NavItemProps {
  path: string;
  label: string;
  icon: string;
  badge?: number | null;
  exact?: boolean;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, badge, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 10px', borderRadius: 6, width: '100%', textAlign: 'left',
      fontSize: 13, fontWeight: isActive ? 600 : 500,
      color: isActive ? 'var(--fg-1)' : 'var(--fg-2)',
      background: isActive ? 'var(--bg-3)' : 'transparent',
      border: 'none', cursor: 'pointer',
    }}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d={icon} />
    </svg>
    <span style={{ flex: 1 }}>{label}</span>
    {badge != null && badge > 0 && (
      <span style={{
        fontSize: 11, padding: '1px 6px', borderRadius: 4, fontVariantNumeric: 'tabular-nums', fontWeight: 600,
        background: isActive ? '#0a0a0a' : 'var(--bg-2)',
        color: isActive ? '#fff' : 'var(--fg-2)',
      }}>{badge}</span>
    )}
  </button>
);

// ─── Sidebar section heading ─────────────────────────────────────────────────
const NavSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
      color: 'var(--fg-3)', textTransform: 'uppercase', padding: '0 10px 8px',
    }}>{title}</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>{children}</div>
  </div>
);

// ─── Admin nav structure ─────────────────────────────────────────────────────
const NAV = {
  inbox: [
    { path: '/admin/submissions', label: 'All leads', icon: 'M3 7v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7 M3 7l9-4 9 4 M3 7h18', badgeKey: 'submissions' },
  ],
  content: [
    { path: '/admin/main-page',    label: 'Homepage',    icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
    { path: '/admin/services',     label: 'Services',    icon: 'M14 2H6a2 2 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' },
    { path: '/admin/subservices',  label: 'Subservices', icon: 'M4 6h16M4 12h16M4 18h7' },
    { path: '/admin/categories',   label: 'Categories',  icon: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z' },
    { path: '/admin/products',     label: 'Products',    icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' },
    { path: '/admin/stories',      label: 'Stories',     icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M16 13H8 M16 17H8 M10 9H8' },
    { path: '/admin/partners',     label: 'Partners',    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75' },
    { path: '/admin/hero-slides',  label: 'Hero slides', icon: 'M15 10l4.553-2.07A2 2 0 0 1 22 9.74v4.52a2 2 0 0 1-2.447 1.81L15 14M1 8h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H1z' },
  ],
  system: [
    { path: '/admin/company-info', label: 'Company info', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  ],
};

// ─── All nav items flattened (for topbar label lookup) ───────────────────────
const ALL_NAV = [...NAV.inbox, ...NAV.content, ...NAV.system];

// ─── Main AdminLayout ────────────────────────────────────────────────────────
export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getAdminSession();
  const [unreadCount, setUnreadCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn()) { navigate('/admin/login'); return; }
    supabase.from('quote_submissions').select('*', { count: 'exact', head: true }).eq('is_read', false)
      .then(({ count }) => setUnreadCount(count ?? 0));
  }, [navigate]);

  if (!isAdminLoggedIn()) return null;

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const initials = session?.name
    ? session.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : session?.email?.slice(0, 2).toUpperCase() ?? 'AD';

  return (
    <DesktopOnlyGate>
      <style>{ADMIN_VARS}</style>
      <div className="admin-root" style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', background: 'var(--bg-1)' }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: 240, flexShrink: 0, height: '100%',
          borderRight: '1px solid var(--border-1)', background: 'var(--bg-2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>

          {/* Brand */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-1)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--fg-1)' }}>HWOOD</span>
            <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--brand)', flexShrink: 0 }} />
            <span style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg-3)', textTransform: 'uppercase', fontWeight: 700 }}>Admin</span>
            <span style={{ marginLeft: 'auto', fontSize: 10, padding: '2px 6px', background: 'var(--brand-light)', color: 'var(--brand-text)', borderRadius: 3, fontWeight: 600 }}>v3</span>
          </div>

          {/* Search */}
          <div style={{ padding: 12, borderBottom: '1px solid var(--border-1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: '#fff', border: '1px solid var(--border-1)', borderRadius: 6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--fg-3)', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <span style={{ fontSize: 12, color: 'var(--fg-3)', flex: 1 }}>Search…</span>
              <kbd style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, padding: '1px 5px', border: '1px solid var(--border-1)', borderRadius: 3, color: 'var(--fg-3)' }}>⌘K</kbd>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ padding: 12, flex: 1, overflowY: 'auto' }}>
            <NavSection title="Inbox">
              {NAV.inbox.map(item => (
                <NavItem key={item.path} {...item} isActive={isActive(item.path)}
                  badge={item.badgeKey === 'submissions' ? unreadCount : null}
                  onClick={() => navigate(item.path)} />
              ))}
            </NavSection>

            <NavSection title="Site content">
              {NAV.content.map(item => (
                <NavItem key={item.path} {...item} isActive={isActive(item.path)}
                  onClick={() => navigate(item.path)} />
              ))}
            </NavSection>

            <NavSection title="System">
              {NAV.system.map(item => (
                <NavItem key={item.path} {...item} isActive={isActive(item.path)}
                  onClick={() => navigate(item.path)} />
              ))}
            </NavSection>
          </nav>

          {/* User + logout */}
          <div style={{ borderTop: '1px solid var(--border-1)', padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 999, background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {session?.name || session?.email || 'Admin'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>Admin</div>
            </div>
            <button
              onClick={() => { adminLogout(); navigate('/admin/login'); }}
              title="Log out"
              style={{ width: 26, height: 26, borderRadius: 6, background: 'transparent', border: '1px solid var(--border-1)', color: 'var(--fg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />
              </svg>
            </button>
          </div>
        </aside>

        {/* ── Main area ── */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

          {/* Topbar */}
          <div style={{ borderBottom: '1px solid var(--border-1)', background: '#fff', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div>
              <h1 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--fg-1)', margin: 0 }}>
                {ALL_NAV.find(n => isActive(n.path))?.label ?? 'Admin'}
              </h1>
            </div>
            <a href="/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--brand)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View site
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </a>
          </div>

          {/* Page content */}
          <div style={{ flex: 1, overflow: 'auto', background: '#fff' }}>
            <Outlet />
          </div>
        </main>

      </div>
    </DesktopOnlyGate>
  );
};
