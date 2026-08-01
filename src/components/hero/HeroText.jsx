import React from 'react';
import { motion } from 'framer-motion';

/* ─── Word-by-word animation helper ──────────────────── */
const wordVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 18,
      delay: 0.5 + i * 0.1,
    },
  }),
};

const HEADLINE = 'We Build the Stuff That Gets You Noticed';
const SUBHEADING = 'Websites, apps, and video ads — done fast, done right, done to grow with you.';

export default function HeroText() {
  const words = HEADLINE.split(' ');

  return (
    <div className="relative z-10 max-w-3xl">


      {/* Headline — word by word */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] mb-6 tracking-tight overflow-hidden">
        {words.map((word, i) => (
          <React.Fragment key={i}>
            <motion.span
              custom={i}
              initial="hidden"
              animate="visible"
              variants={wordVariant}
              className="inline-block mr-[0.25em]"
              style={{
                color:
                  i >= 3 && i <= 5
                    ? 'transparent'
                    : 'white',
                backgroundImage:
                  i >= 3 && i <= 5
                    ? 'linear-gradient(135deg, #60a5fa, #a78bfa, #34d399)'
                    : 'none',
                WebkitBackgroundClip: i >= 3 && i <= 5 ? 'text' : 'unset',
                backgroundClip: i >= 3 && i <= 5 ? 'text' : 'unset',
              }}
            >
              {word}
            </motion.span>
            {/* Line break after "Stuff" for better layout */}
            {i === 3 && <br className="hidden md:block" />}
          </React.Fragment>
        ))}
      </h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-xl"
      >
        {SUBHEADING}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.7 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* Primary — gradient */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          onClick={() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="px-8 py-4 rounded-xl text-white font-semibold text-base sm:text-lg transition-shadow"
          style={{
            background: 'linear-gradient(135deg, #34d399, #60a5fa, #a78bfa)',
            boxShadow: '0 0 24px rgba(96,165,250,0.25)',
          }}
        >
          Let's build something
        </motion.button>

        {/* Secondary — outlined */}
        <motion.button
          whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.45)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          onClick={() =>
            document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })
          }
          className="px-8 py-4 rounded-xl text-white font-semibold text-base sm:text-lg transition-all"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1.5px solid rgba(255,255,255,0.2)',
          }}
        >
          See what we've shipped
        </motion.button>
      </motion.div>

    </div>
  );
}
