// Shared animation constants — enforces luxury motion rules
// Rule: No bounce. No elastic. No spring physics.

export const LUXURY_EASE = [0.25, 0.1, 0.25, 1.0] as const;
export const LUXURY_EASE_OUT = [0.0, 0.0, 0.2, 1.0] as const;
export const LUXURY_DURATION = 0.8;
export const STAGGER_DELAY = 0.1;

// Reusable fade-up variant for scroll reveals
export const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: LUXURY_DURATION, ease: LUXURY_EASE },
  },
};

// Stagger container variant
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_DELAY,
    },
  },
};

// Fade-up child variant (for use inside stagger containers)
export const fadeUpChild = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: LUXURY_EASE },
  },
};

// Fade from left
export const fadeLeftVariant = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: LUXURY_DURATION, ease: LUXURY_EASE },
  },
};

// Fade from right
export const fadeRightVariant = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: LUXURY_DURATION, ease: LUXURY_EASE },
  },
};
