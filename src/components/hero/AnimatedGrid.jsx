import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * AnimatedGrid — a futuristic perspective grid that:
 *  • Uses CSS 3D perspective to create a floor-receding-into-distance illusion
 *  • Scrolls slowly using CSS @keyframes (GPU-composited)
 *  • Fades out as the user scrolls away from the hero
 */
export default function AnimatedGrid({ containerRef }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <motion.div
      style={{ opacity, zIndex: 1, pointerEvents: 'none' }}
      className="absolute inset-0 overflow-hidden"
    >
      {/* Perspective wrapper */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '65%',
          perspective: '600px',
          perspectiveOrigin: '50% 0%',
        }}
      >
        {/* Grid plane */}
        <div
          className="hero-grid-plane"
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'top center',
            transform: 'rotateX(75deg)',
            backgroundImage: `
              linear-gradient(rgba(56,120,255,0.10) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56,120,255,0.10) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Fade vignette at bottom so grid blends naturally */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to bottom, transparent 0%, #020408 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Fade vignette at sides */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 100% at 50% 100%, transparent 40%, #020408 100%)',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  );
}
