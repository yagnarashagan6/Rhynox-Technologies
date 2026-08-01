import React from 'react';

/**
 * BackgroundGlow — pure CSS dark background.
 * SpanTAG-style: near-black with subtle deep-blue radial gradient.
 * No canvas layers here — particle network handles animation.
 */
export default function BackgroundGlow() {
  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>

      {/* Base: near-black with deep navy tint */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 110% 70% at 50% 0%,
            #050d1a 0%,
            #030810 45%,
            #010305 100%
          )`,
        }}
      />

      {/* Subtle blue glow — top center */}
      <div
        className="absolute hero-orb-blue"
        style={{
          width: '55vw',
          height: '40vw',
          top: '-8vw',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(30,80,200,0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Very subtle purple — bottom left */}
      <div
        className="absolute hero-orb-purple"
        style={{
          width: '40vw',
          height: '35vw',
          bottom: '-5vw',
          left: '-5vw',
          background: 'radial-gradient(circle, rgba(80,40,180,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

    </div>
  );
}
