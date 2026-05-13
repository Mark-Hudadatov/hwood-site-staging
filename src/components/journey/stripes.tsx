import React from 'react';

export const Stripes: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', opacity }}
    aria-hidden="true"
  >
    <div style={{ position: 'absolute', top: '-40%', left: '-4rem', width: '16rem', height: '200%', transform: 'skewX(-20deg)', background: '#005f5f' }} />
    <div style={{ position: 'absolute', top: '-40%', left: '8rem', width: '10rem', height: '200%', transform: 'skewX(-20deg)', background: '#004d4d', opacity: 0.7 }} />
  </div>
);
