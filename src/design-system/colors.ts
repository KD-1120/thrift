// Design System - Colors

export const colors = {
  // Primary palette
  primary: {
    50: '#FAF8F5',
    100: '#F5F1EB',
    200: '#E8DFD3',
    300: '#D4C4B0',
    400: '#C0A88D',
    500: '#8B7355',
    600: '#6D5942',
    700: '#4F4130',
    800: '#312920',
    900: '#1A1510',
  },

  // Neutral grays
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Semantic colors with extended palette
  success: {
    50: '#F0FDF4',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
    light: '#D1FAE5',
    main: '#10B981',
    dark: '#059669',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    light: '#FEE2E2',
    main: '#EF4444',
    dark: '#DC2626',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    light: '#FEF3C7',
    main: '#F59E0B',
    dark: '#D97706',
  },

  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    light: '#DBEAFE',
    main: '#3B82F6',
    dark: '#2563EB',
  },

  // Base colors
  white: '#FFFFFF',
  black: '#000000',

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F1EB',
    tertiary: '#FAF8F5',
    card: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Text colors
  text: {
    primary: '#1A1510',
    secondary: '#525252',
    tertiary: '#737373',
    inverse: '#FFFFFF',
    disabled: '#A3A3A3',
    placeholder: '#A3A3A3',
  },

  // Border colors
  border: {
    light: '#E5E5E5',
    main: '#D4D4D4',
    dark: '#A3A3A3',
  },

  // Semantic helper colors
  semantic: {
    success: '#10B981',
    successBackground: '#D1FAE5',
    error: '#EF4444',
    errorBackground: '#FEE2E2',
    warning: '#F59E0B',
    warningBackground: '#FEF3C7',
    info: '#3B82F6',
    infoBackground: '#DBEAFE',
  },
};

export type ColorPalette = typeof colors;
