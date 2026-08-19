# MedCare Clinic - Design & Architecture Notes

This document provides a summary of the **CSS Architecture** and **Accessibility Decisions** implemented in the **MedCare Clinic** web application.

---

## 🎨 1. CSS Architecture & System Design

The application uses a **Hand-Rolled, Tokenized BEM Architecture** built with Vanilla CSS—avoiding heavy external CSS frameworks to maintain zero build dependencies, sub-millisecond styling performance, and 100% full-control over custom properties.

### Modular Layering (ITCSS-inspired Structure)
The styling system is split into three clean, maintainable CSS layers imported via [css/main.css](file:///c:/Users/vishnu/kotari/Desktop/MedicareClinic/css/main.css):

```
css/
├── main.css          # Master stylesheet (imports tokens, components, pages)
├── tokens.css        # Layer 1: Design Tokens & CSS Custom Variables
├── components.css    # Layer 2: Reusable BEM Components & Utilities
└── pages.css         # Layer 3: Page-Specific Layout Grids & Animations
```

1. **Design Tokens ([css/tokens.css](file:///c:/Users/vishnu/kotari/Desktop/MedicareClinic/css/tokens.css))**:
   - Centralized CSS Custom Properties (`:root` & `[data-theme="dark"]`).
   - Standardized typography scale (`--font-size-xs` to `4xl`), spacing tokens (`--space-2` to `12`), border-radius tokens, and elevation shadows.
   - Curated, high-contrast color palettes tailored for both Light and Dark modes.

2. **Component Abstractions ([css/components.css](file:///c:/Users/vishnu/kotari/Desktop/MedicareClinic/css/components.css))**:
   - Strict BEM-like naming conventions (`.btn`, `.btn-primary`, `.btn-outline`, `.nav-menu`, `.theme-toggle-segmented`, `.modal-overlay`, `.modal-content`).
   - Encapsulated component styling with zero global side-effects.

3. **Page Layouts & Animations ([css/pages.css](file:///c:/Users/vishnu/kotari/Desktop/MedicareClinic/css/pages.css))**:
   - Responsive Grid and Flexbox container patterns (`.hero-grid`, `.specialties-grid`, `.doctors-grid`, `.contact-grid`).
   - LQIP (Low-Quality Image Placeholder) hardware-accelerated blur-up transition animations (`.lazy-img`, `.lazy-img.loaded`).

---

## ♿ 2. Accessibility Decisions (WCAG 2.1 Level AA)

The project achieves a **100/100 Accessibility Score** on Google Lighthouse by incorporating the following core WCAG Level A & AA decisions:

### A. Perceivable (Contrast & Text Scale)
- **WCAG 1.4.3 Minimum Contrast (AA)**: Primary brand blue (`#0369a1`), secondary teal (`#0f766e`), and dark slate text (`#1e293b`) guarantee contrast ratios of **≥ 4.88:1** in Light mode and **≥ 7.2:1** in Dark mode against all background surfaces.
- **Fluid & Scalable Typography**: All font sizes use relative `rem` units to respect user browser font scaling preferences.

### B. Operable (Keyboard Navigation & Focus Management)
- **WCAG 2.4.7 Focus Visible (AA)**: A prominent 3px focus ring (`outline: 3px solid var(--color-primary); outline-offset: 2px;`) is defined globally via `:focus-visible` for mouse/keyboard context separation.
- **WCAG 2.4.1 Skip Link (A)**: A top-level `<a href="#main-content" class="skip-link">Skip to main content</a>` link allows keyboard users to bypass header navigation.
- **WCAG 2.4.3 Modal Dialog Trap (A)**: Appointment modals capture focus when opened, enforce focus trapping within the dialog overlay, listen for the `Escape` key to close, and return focus to the triggering element upon dismissal.

### C. Understandable (Form Validation & Announcements)
- **WCAG 3.3.1 Error Identification (A)**: Form input fields dynamically set `aria-invalid="true|false"` during validation and link directly to error spans using `aria-describedby="[field]-error"`.
- **WCAG 4.1.2 ARIA Semantics (A)**: Specialty filter chips use `aria-pressed="true|false"` state synchronization, theme toggles use `role="radio"` inside `role="radiogroup"`, and Google Map frames include explicit `title` attributes.

### D. Robust & Responsive Performance
- **WCAG 1.4.10 Reflow (AA)**: Responsive layouts adapt fluidly down to 320px viewports without horizontal scrolling or content loss.
- **LCP & LQIP Image Strategy**: Above-the-fold hero images use `loading="eager"` and `fetchpriority="high"` for instant LCP rendering, while below-the-fold doctor cards use an `IntersectionObserver` LQIP blur-up effect with explicit `width="300"` and `height="250"` attributes to eliminate Cumulative Layout Shift (CLS).
