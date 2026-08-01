import React from 'react';

/**
 * Comet — Pure CSS recurring comets animation.
 * Render 2 staggered comets so a comet streaks across the sky every 4-5 seconds continuously.
 */
export default function Comet() {
  return (
    <div className="hero-comet-wrapper" aria-hidden="true">
      <div className="hero-comet hero-comet-1" />
      <div className="hero-comet hero-comet-2" />
    </div>
  );
}
