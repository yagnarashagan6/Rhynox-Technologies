import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { trackButtonClick } from '../../utils/analytics.js';

/* ─── Magnetic wrapper ────────────────────────────────── */
function MagneticButton({ children, className, onClick, id }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      id={id}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* ─── Primary CTA ─────────────────────────────────────── */
export function PrimaryButton({ label = 'Get Started', onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <MagneticButton
      id="hero-cta-primary"
      onClick={onClick}
      className="relative group overflow-hidden px-8 py-4 rounded-full text-white font-semibold text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      style={{}}
    >
      {/* Glow background */}
      <span
        className="absolute inset-0 rounded-full transition-all duration-300"
        style={{
          background: hovered
            ? 'linear-gradient(135deg, #1d4ed8, #2563eb, #3b82f6)'
            : 'linear-gradient(135deg, #1e40af, #2563eb)',
          boxShadow: hovered
            ? '0 0 40px rgba(59,130,246,0.7), 0 0 80px rgba(37,99,235,0.3)'
            : '0 0 20px rgba(59,130,246,0.4)',
        }}
        aria-hidden
      />
      {/* Shine sweep */}
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
          x: hovered ? '100%' : '-100%',
          transition: 'x 0.5s ease',
        }}
        aria-hidden
      />

      <span
        className="relative flex items-center gap-2"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {label}
        <motion.span
          animate={{ x: hovered ? 5 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <ArrowRight size={20} />
        </motion.span>
      </span>
    </MagneticButton>
  );
}

/* ─── Secondary CTA (glassmorphism) ──────────────────── */
export function SecondaryButton({ label = 'View Portfolio', onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      id="hero-cta-secondary"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative px-8 py-4 rounded-full text-white font-semibold text-lg overflow-hidden transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      style={{
        background: hovered
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? 'rgba(147,197,253,0.5)' : 'rgba(255,255,255,0.15)'}`,
        backdropFilter: 'blur(12px)',
        boxShadow: hovered
          ? '0 0 20px rgba(147,197,253,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
          : 'inset 0 1px 0 rgba(255,255,255,0.05)',
        transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
      }}
    >
      {label}
    </motion.button>
  );
}
