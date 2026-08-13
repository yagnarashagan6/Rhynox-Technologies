import React from 'react';

/**
 * RhynoxLogo Component
 * Renders the official Rhynox Technologies logo with a transparent background.
 * Supports light / dark mode text colors via props or Tailwind classes.
 */
export default function RhynoxLogo({ className = "h-10 sm:h-12 md:h-14 w-auto", textColor = "text-white", ...props }) {
  return (
    <div className={`inline-flex items-center overflow-visible ${textColor} ${className}`} {...props}>
      <img 
        src="/rhynox svg logo.svg" 
        alt="Rhynox Technologies" 
        className="h-full w-auto object-contain transition-all scale-[3.8] sm:scale-[4.2] origin-left filter brightness-125 contrast-125 drop-shadow-[0_0_8px_#ffffff] drop-shadow-[0_0_16px_#ffffff] drop-shadow-[0_0_30px_rgba(255,255,255,0.95)] drop-shadow-[0_0_50px_rgba(255,255,255,0.7)]"
        loading="eager"
      />
    </div>
  );
}
