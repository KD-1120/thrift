// Design System - Spacing

export const spacing = {
  xs: 6,     // Minimal gap, icon offset
  sm: 10,    // Tight spacing, small gaps between related items
  md: 16,    // Standard spacing between elements
  lg: 20,    // Default component padding
  xl: 24,    // Card padding, generous spacing
  xxl: 32,   // Section padding, inter-component spacing
  xxxl: 40,  // Major section breaks
  huge: 56,  // Hero spacing, large separators
};

export const radius = {
  none: 0,
  sm: 6,     // Small elements, badges, tags
  md: 10,    // Buttons, inputs, chips
  lg: 12,    // Cards, small modals
  xl: 16,    // Large cards, containers
  xxl: 20,   // Hero sections, prominent cards
  full: 9999,
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    // For web compatibility
    boxShadow: 'none',
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    // For web compatibility
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    // For web compatibility
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    // For web compatibility
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    // For web compatibility
    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.12)',
  },
};

export type Spacing = typeof spacing;
export type Radius = typeof radius;
export type Shadows = typeof shadows;