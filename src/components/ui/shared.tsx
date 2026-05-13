import React from 'react';
import type { CSSProperties } from 'react';

// ─── Eyebrow ────────────────────────────────────────────────────────────────

interface EyebrowProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export const Eyebrow: React.FC<EyebrowProps> = ({ children, color = '#00d4aa', className = '' }) => (
  <p
    className={className}
    style={{
      fontSize: 10,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      fontWeight: 700,
      color,
      marginBottom: 12,
    }}
  >
    {children}
  </p>
);

// ─── ContentTagPill ─────────────────────────────────────────────────────────

interface ContentTagPillProps {
  label: string;
  bg?: string;
  fg?: string;
}

export const ContentTagPill: React.FC<ContentTagPillProps> = ({
  label,
  bg = 'rgba(0,95,95,0.12)',
  fg = '#005f5f',
}) => (
  <span
    style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: 999,
      background: bg,
      color: fg,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
    }}
  >
    {label}
  </span>
);

// ─── StatusDot ──────────────────────────────────────────────────────────────

export const StatusDot: React.FC<{ color?: string }> = ({ color = '#00d4aa' }) => (
  <span
    style={{
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: color,
      flexShrink: 0,
    }}
  />
);

// ─── Form style objects ──────────────────────────────────────────────────────

export const formInput: CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #d1d5db',
  borderRadius: 12,
  fontSize: 15,
  outline: 'none',
  background: '#fff',
  color: '#111',
  fontFamily: 'inherit',
};

export const formLabel: CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  color: '#374151',
  marginBottom: 6,
};

export const formSection: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
};

export function btnPrimary(accent: string): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '14px 32px',
    background: accent,
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'opacity 0.15s',
  };
}

export const btnGhost: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '14px 32px',
  background: 'transparent',
  color: '#fff',
  border: '1.5px solid rgba(255,255,255,0.35)',
  borderRadius: 12,
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s, background 0.15s',
};

// ─── StatCard ───────────────────────────────────────────────────────────────

interface StatCardProps {
  value: string;
  label: string;
  accent?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, accent = '#00d4aa' }) => (
  <div
    style={{
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 16,
      padding: '28px 24px',
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: 40, fontWeight: 700, color: accent, lineHeight: 1, marginBottom: 8 }}>
      {value}
    </div>
    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      {label}
    </div>
  </div>
);
