/**
 * ADMIN DASHBOARD — Linear style
 * ================================
 * KPI strip + form type breakdown + quick actions.
 * Data from getDashboardStats() in adminStore.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../adminStore';
import { supabase } from '../../services/supabase';

interface Stats {
  services: number;
  subservices: number;
  categories: number;
  products: number;
  stories: number;
  unreadContacts: number;
  unreadQuotes: number;
}

interface FormBreakdown {
  browse: number;
  file: number;
  describe: number;
  total: number;
}

const P = {
  page: { padding: '28px 32px', maxWidth: 1100 } as React.CSSProperties,
  kpiStrip: {
    display: 'flex',
    borderBottom: '1px solid var(--border-1)',
    borderTop: '1px solid var(--border-1)',
    background: 'var(--bg-2)',
    marginBottom: 28,
  } as React.CSSProperties,
  kpiCell: (last?: boolean) => ({
    flex: 1, padding: '16px 20px',
    borderRight: last ? 'none' : '1px solid var(--border-1)',
  } as React.CSSProperties),
  kpiLabel: {
    fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
    color: 'var(--fg-3)', textTransform: 'uppercase' as const, marginBottom: 6,
  } as React.CSSProperties,
  kpiValue: {
    fontSize: 24, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
    color: 'var(--fg-1)', letterSpacing: '-0.02em',
  } as React.CSSProperties,
  kpiSub: { fontSize: 11, color: 'var(--fg-3)', marginTop: 2 } as React.CSSProperties,
  sectionLabel: {
    fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase' as const, color: 'var(--fg-3)', marginBottom: 12,
  } as React.CSSProperties,
};

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [breakdown, setBreakdown] = useState<FormBreakdown>({ browse: 0, file: 0, describe: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, quotes] = await Promise.all([
          getDashboardStats(),
          supabase.from('quote_submissions').select('order_type'),
        ]);
        setStats(s);
        if (quotes.data) {
          const browse   = quotes.data.filter((q: any) => q.order_type === 'browse-and-order').length;
          const file     = quotes.data.filter((q: any) => q.order_type === 'send-file-and-process').length;
          const describe = quotes.data.filter((q: any) => q.order_type === 'describe-and-request').length;
          setBreakdown({ browse, file, describe, total: quotes.data.length });
        }
      } catch (e) {
        console.error('[Dashboard]', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 32, color: 'var(--fg-3)', fontSize: 13 }}>Loading…</div>
    );
  }

  const KpiCell = ({ label, value, sub, badge, last }: { label: string; value: number | string; sub?: string; badge?: boolean; last?: boolean }) => (
    <div style={P.kpiCell(last)}>
      <div style={P.kpiLabel}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={P.kpiValue}>{value}</span>
        {badge && Number(value) > 0 && (
          <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 4, background: '#fef3e6', color: '#b45309', fontWeight: 700 }}>
            action needed
          </span>
        )}
      </div>
      {sub && <div style={P.kpiSub}>{sub}</div>}
    </div>
  );

  const QuickBtn = ({ label, path, icon }: { label: string; path: string; icon: string }) => (
    <button
      onClick={() => navigate(path)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '9px 14px', borderRadius: 6, border: '1px solid var(--border-1)',
        background: '#fff', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)',
        cursor: 'pointer', whiteSpace: 'nowrap',
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={icon} />
      </svg>
      {label}
    </button>
  );

  const ContentRow = ({ label, value, path }: { label: string; value: number; path: string }) => (
    <div
      onClick={() => navigate(path)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 0', borderBottom: '1px solid var(--border-1)', cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: 13, color: 'var(--fg-1)' }}>{label}</span>
      <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: 'var(--fg-2)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );

  const BarRow = ({ label, value, total, color }: { label: string; value: number; total: number; color: string }) => {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 12, color: 'var(--fg-2)' }}>{label}</span>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: 'var(--fg-3)' }}>{value} · {pct}%</span>
        </div>
        <div style={{ height: 4, background: 'var(--bg-3)', borderRadius: 99 }}>
          <div style={{ height: 4, width: `${pct}%`, background: color, borderRadius: 99, transition: 'width .4s ease' }} />
        </div>
      </div>
    );
  };

  return (
    <div style={P.page}>
      {/* KPI strip */}
      <div style={P.kpiStrip}>
        <KpiCell label="Quote requests" value={breakdown.total} sub="all time" />
        <KpiCell label="Unread quotes" value={stats?.unreadQuotes ?? 0} sub="awaiting review" badge />
        <KpiCell label="Contact messages" value={stats?.unreadContacts ?? 0} sub="unread" badge />
        <KpiCell label="Products" value={stats?.products ?? 0} sub={`across ${stats?.categories ?? 0} categories`} />
        <KpiCell label="Stories" value={stats?.stories ?? 0} last />
      </div>

      {/* Two-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

        {/* Left: Leads by form type */}
        <div>
          <div style={P.sectionLabel}>Leads by order type</div>
          <div style={{ border: '1px solid var(--border-1)', borderRadius: 8, padding: '16px 20px' }}>
            {breakdown.total === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--fg-3)', margin: 0 }}>No submissions yet.</p>
            ) : (
              <>
                <BarRow label="Browse & Order (Catalog)" value={breakdown.browse} total={breakdown.total} color="#005f5f" />
                <BarRow label="Send File & Process" value={breakdown.file} total={breakdown.total} color="#1d4ed8" />
                <BarRow label="Describe & Request (Custom)" value={breakdown.describe} total={breakdown.total} color="#b45309" />
              </>
            )}
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-1)' }}>
              <button
                onClick={() => navigate('/admin/submissions')}
                style={{ fontSize: 12, color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                View all leads
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Site content */}
        <div>
          <div style={P.sectionLabel}>Site content</div>
          <div style={{ border: '1px solid var(--border-1)', borderRadius: 8, padding: '4px 20px' }}>
            <ContentRow label="Services" value={stats?.services ?? 0} path="/admin/services" />
            <ContentRow label="Subservices" value={stats?.subservices ?? 0} path="/admin/subservices" />
            <ContentRow label="Categories" value={stats?.categories ?? 0} path="/admin/categories" />
            <ContentRow label="Products" value={stats?.products ?? 0} path="/admin/products" />
            <ContentRow label="Stories" value={stats?.stories ?? 0} path="/admin/stories" />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: 28 }}>
        <div style={P.sectionLabel}>Quick actions</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <QuickBtn label="Add product" path="/admin/products" icon="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <QuickBtn label="Add story" path="/admin/stories" icon="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" />
          <QuickBtn label="Edit homepage" path="/admin/main-page" icon="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <QuickBtn label="Company info" path="/admin/company-info" icon="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <QuickBtn label="View leads" path="/admin/submissions" icon="M3 7v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7 M3 7l9-4 9 4 M3 7h18" />
        </div>
      </div>
    </div>
  );
};
