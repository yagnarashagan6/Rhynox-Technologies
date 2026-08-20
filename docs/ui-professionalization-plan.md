# UI Professionalization Implementation Plan

## Objective
Transform the current landing page into a professional digital IT solutions website with:
- Screen-safe section layouts (no clipped content, no awkward overflow)
- Strong readability and typography hierarchy
- Consistent spacing and visual rhythm across sections
- Better mobile-to-desktop responsiveness

## Problems Identified (Audit)
1. **Typography readability regression**
   - `Press Start 2P` was applied globally, including body and form text.
   - This retro display font reduces legibility for long-form content and UI controls.
2. **Hero headline overflow behavior**
   - Animated headline lines use non-wrapping containers (`inline-flex`) producing over-wide blocks at some breakpoints.
3. **Hero vertical fit constraints**
   - Hero uses `h-screen` with fixed header + large animated content; this risks clipping on smaller heights.
4. **Micro text too small in multiple components**
   - Frequent `text-[10px]` labels and chips are hard to read, especially on mobile.
5. **Visual consistency drift**
   - Typography families and scales do not follow a clear professional system for headings/body/meta text.

## Implementation Strategy
### Phase 1 — Typography system reset
- Restore a professional web typography stack:
  - Headings: `Space Grotesk`
  - Body/UI text: `Inter`
  - Optional code/meta accents: `Space Mono`
- Remove force-overrides that map all Tailwind font utilities to retro display font.

### Phase 2 — Hero section layout hardening
- Replace non-wrapping animated text wrappers with wrapping-safe wrappers.
- Reduce aggressive headline scale at vulnerable breakpoints.
- Change hero sizing from fixed `h-screen` to flexible `min-h-[100svh]`/`h-auto` style behavior to prevent clipping.

### Phase 3 — Readability pass
- Raise minimum functional text size for metadata chips/labels where practical.
- Improve line-height for body paragraphs and key section copy.

### Phase 4 — Verification
- Validate in browser at desktop/tablet/mobile widths.
- Re-check overflow and computed font families.
- Run diagnostics to ensure no introduced code/CSS issues.

## Expected Outcome
- Professional visual tone aligned with digital IT services branding.
- Sections display properly within the screen without awkward clipping.
- Clear, readable typography hierarchy across the full page.
- Improved mobile experience and scannability.
