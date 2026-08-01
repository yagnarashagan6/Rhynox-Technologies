import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import BackgroundGlow from './BackgroundGlow';
import ParticleNetwork from './ParticleNetwork';
import HeroText from './HeroText';
import Comet from './Comet';

/* ─── Logo with gentle float ──────────────────────────── */
const LogoFloat = () => (
  <motion.div
    initial={{ opacity: 0, y: -16 }}
    animate={{ opacity: 1, y: [0, -4, 0] }}
    transition={{
      opacity: { duration: 0.8, ease: 'easeOut' },
      y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 },
    }}
    className="cursor-pointer flex-shrink-0"
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    aria-label="Rhynox Technologies — Home"
  >
    <img
      src="/rhynox-logo.svg"
      alt="Rhynox Technologies"
      className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto"
      loading="eager"
      decoding="async"
    />
  </motion.div>
);

/* ─── Main Hero ───────────────────────────────────────── */
export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollY } = useScroll();

  // Content drifts up gently on scroll
  const contentY = useTransform(scrollY, [0, 500], [0, -60]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col overflow-hidden snap-start"
      aria-label="Hero section"
    >
      {/* ── Layer 0: CSS dark background + orbs ── */}
      <BackgroundGlow />

      {/* ── Layer 1: Canvas 2D particle network ── */}
      <ParticleNetwork />

      {/* ── Layer 2: Pure CSS Comet animation ── */}
      <Comet />

      {/* ── Top bar: Logo only ── */}
      <div
        className="relative z-20 flex items-center px-6 md:px-10 pt-4 md:pt-6"
        style={{ pointerEvents: 'auto' }}
      >
        <LogoFloat />
      </div>

      {/* ── Hero content ── */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 flex-1 flex items-center px-6 md:px-16 lg:px-24 pb-24"
      >
        <HeroText />
      </motion.div>

      {/* ── Bottom fade into next section ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #030810 90%)',
          zIndex: 5,
        }}
      />
    </section>
  );
}
