---
name: Atelier Luxury Editorial
colors:
  surface: '#faf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#faf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f0'
  surface-container: '#efeeea'
  surface-container-high: '#e9e8e4'
  surface-container-highest: '#e3e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#4c463f'
  inverse-surface: '#2f312e'
  inverse-on-surface: '#f2f1ed'
  outline: '#7e766f'
  outline-variant: '#cfc5bc'
  surface-tint: '#645d58'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1f1b17'
  on-primary-container: '#8a827d'
  inverse-primary: '#cec5be'
  secondary: '#625e56'
  on-secondary: '#ffffff'
  secondary-container: '#e6dfd5'
  on-secondary-container: '#67625a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c1c18'
  on-tertiary-container: '#86847e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eae1da'
  primary-fixed-dim: '#cec5be'
  on-primary-fixed: '#1f1b17'
  on-primary-fixed-variant: '#4b4641'
  secondary-fixed: '#e9e1d7'
  secondary-fixed-dim: '#ccc6bc'
  on-secondary-fixed: '#1e1b15'
  on-secondary-fixed-variant: '#4a463f'
  tertiary-fixed: '#e6e2db'
  tertiary-fixed-dim: '#cac6bf'
  on-tertiary-fixed: '#1c1c18'
  on-tertiary-fixed-variant: '#484742'
  background: '#faf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e3e2df'
typography:
  display-xl:
    fontFamily: Cormorant Garamond
    fontSize: 96px
    fontWeight: '300'
    lineHeight: '0.9'
    letterSpacing: -0.02em
  display-lg:
    fontFamily: Cormorant Garamond
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.0'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Cormorant Garamond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.1'
  headline-md:
    fontFamily: Cormorant Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-uppercase:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.3em
  button:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  section-v: 80px
  container-max: 1440px
  gutter: 32px
---

## Brand & Style

The design system embodies a **Minimalist Editorial Luxury** aesthetic, drawing heavy inspiration from high-fashion print media like *Vogue* and *Kinfolk*. It is defined by an uncompromising structural sharpness and a disciplined architectural approach to layout.

The visual narrative focuses on "prestige through restraint." By utilizing razor-sharp edges and avoiding modern digital tropes like soft shadows or rounded corners, the system evokes the feeling of a curated museum or an upscale physical showroom. The emotional response should be one of sophistication, craftsmanship, and serious luxury.

**Design Style: Minimalism / High-Contrast Editorial**
- **Sharpness:** Strictly square edges across all UI primitives.
- **Contrast:** Juxtaposition of warm ivory canvases with deep charcoal blocks.
- **Whitespace:** Generous breathing room and high tracking values to maintain an elite, unhurried atmosphere.

## Colors

The palette is composed of organic, warm neutrals that avoid the clinical feel of pure digital white.

- **Primary (Espresso Charcoal):** Used for headlines, primary buttons, and core branding. It provides high contrast without the harshness of pure black.
- **Secondary (Sandstone Beige):** Used for interactive outlines, hover states, and secondary visual elements.
- **Tertiary (Ivory Silk):** A soft clay tone for passive background fills and section highlights.
- **Neutral (Warm Alabaster):** The primary page canvas color, providing a sophisticated, tactile base.
- **Functional:** A vivid "Lipstick Red" is reserved exclusively for destructive actions or urgent alerts.

## Typography

The typography system relies on a high-contrast pairing between an elegant, classical serif and a clean, geometric sans-serif.

- **Serif (Cormorant Garamond):** Reserved for display headlines and editorial emphasis. It uses tight leading (`0.9` to `1.1`) to create cohesive graphical blocks of text. Italics should be used rhythmically within headlines to highlight specific words.
- **Sans-serif (Be Vietnam Pro):** Used for functional UI elements, body copy, and navigation. 
- **Tracking:** Small labels and navigation items should utilize extreme tracking (`widest`) to enhance the breathable, premium aesthetic.
- **Mobile Scaling:** For mobile devices, `display-xl` should scale down to `headline-lg` (approx 40-48px) to ensure legibility and prevent layout breakage.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy within a centered container, mimicking a high-fashion spread.

- **Grid System:** 12-column desktop grid with a wide 32px gutter to prevent content from feeling crowded. 
- **Vertical Rhythm:** Sections are separated by generous vertical padding (`80px` to `120px`) and often demarcated by thin hairline borders.
- **Responsive Behavior:** 
  - **Desktop:** 4-column product grids.
  - **Tablet:** 2-column product grids.
  - **Mobile:** 1-column stream with reduced horizontal margins (16px).
- **Asymmetry:** Use asymmetrical background blocks (e.g., a color block covering only 55% of the width) to create visual interest and an editorial feel.

## Elevation & Depth

This design system rejects digital shadows in favor of structural layering and tonal depth.

- **Low-Contrast Outlines:** Hierarchy is established through thin, hairline borders (`1px`) using the Sandstone Beige (`#dbd6d0`) color. 
- **Tonal Layers:** Surfaces are stacked using color rather than shadow. For example, a "floating" modal or card uses a pure white (`#ffffff`) background to sit subtly above the warm Alabaster cream canvas.
- **Glassmorphism:** A subtle backdrop blur (`blur-sm` or `backdrop-blur-md`) is used exclusively on the sticky navigation header to maintain context during scroll without breaking the minimalist aesthetic.

## Shapes

The shape language is **Strictly Sharp (0px)**. 

- All buttons, input fields, cards, and selection chips must have `0px` border radius (`rounded-none`).
- The only exception is social media icons in the footer, which may use a circular border (`rounded-full`) to enclose simple symbols, providing a singular point of organic contrast against the otherwise rigid grid.

## Components

### Buttons
- **Primary:** Solid Espresso Charcoal fill with Alabaster text. Large actions (CTA) should be `h-14` with a sharp, heavy presence.
- **Secondary:** Hairline border in Sandstone Beige. Hover states should invert to a soft Tertiary fill.

### Cards (Product)
- **Aspect Ratio:** Always use a `3:4` portrait ratio for product imagery to mimic fashion photography.
- **Interaction:** On hover, a bottom action panel (Quick Add) should slide up smoothly. The entire card is wrapped in a hairline border with no shadow.

### Inputs & Selection
- **Input Fields:** Rectangular, `rounded-none`, with a light beige border. Focus states use a high-contrast charcoal border.
- **Variant Chips:** Size and color selectors are rectangular boxes. Active states should be completely inverted (Solid black background).

### Navigation
- **Header:** High-profile (`80px`) with a thin bottom border. The logo should always be in the serif typeface.
- **Mobile Menu:** A full-screen overlay with a dark, semi-transparent blurred background to maintain focus on the editorial links.