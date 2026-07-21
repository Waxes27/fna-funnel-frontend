import { Platform, TextStyle, ViewStyle } from 'react-native';

export const palette = {
  canvasCream: '#F3F0EE',
  liftedCream: '#FCFBFA',
  white: '#FFFFFF',
  softBone: '#F4F4F4',

  inkBlack: '#141413',
  charcoal: '#262627',
  slateGray: '#696969',
  granite: '#555555',
  graphite: '#565656',
  dustTaupe: '#D1CDC7',

  signalOrange: '#CF4500',
  lightSignalOrange: '#F37338',
  clayBrown: '#9A3A0A',
  mossGreen: '#4C5A2C',
};

export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
  xxxl: 96,
  xxxxl: 128,
};

export const radii = {
  tiny: 6,
  primary: 20,
  consent: 24,
  frame: 40,
  pill: 999,
  circle: 9999,
};

export const typography = {
  families: {
    primary: 'MarkForMC',
    legal: 'MarkOffcForMC',
    fallback: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
  styles: {
    h1: {
      fontSize: 64,
      fontWeight: '500',
      lineHeight: 64,
      letterSpacing: -1.28,
    } satisfies TextStyle,
    h2: {
      fontSize: 36,
      fontWeight: '500',
      lineHeight: 44,
      letterSpacing: -0.72,
    } satisfies TextStyle,
    h3: {
      fontSize: 24,
      fontWeight: '500',
      lineHeight: 29,
      letterSpacing: -0.48,
    } satisfies TextStyle,
    h4: {
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 18,
    } satisfies TextStyle,
    eyebrow: {
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 14,
      letterSpacing: 0.56,
      textTransform: 'uppercase',
    } satisfies TextStyle,
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 22,
    } satisfies TextStyle,
    buttonLabel: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 16,
      letterSpacing: -0.48,
    } satisfies TextStyle,
    consentLabel: {
      fontSize: 13,
      fontWeight: '400',
      lineHeight: 16,
    } satisfies TextStyle,
    footerLink: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    } satisfies TextStyle,
    footerHeading: {
      fontSize: 12,
      fontWeight: '700',
      lineHeight: 14,
      letterSpacing: 0.48,
      textTransform: 'uppercase',
    } satisfies TextStyle,
  },
};

export const shadows = {
  level1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 2,
  } satisfies ViewStyle,
  level2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.08,
    shadowRadius: 48,
    elevation: 6,
  } satisfies ViewStyle,
  level3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 70 },
    shadowOpacity: 0.25,
    shadowRadius: 110,
    elevation: 12,
  } satisfies ViewStyle,
};

export const layout = {
  maxWidth: 1280,
  touchTarget: 44,
};

export type Theme = {
  colors: {
    background: string;
    surface: string;
    surfaceRaised: string;
    text: string;
    textSecondary: string;
    border: string;
    headerBackground: string;
    icon: string;
    overlay: string;
    ink: string;
    canvas: string;
    signalOrange: string;
    lightSignalOrange: string;
    clayBrown: string;
    dustTaupe: string;
    accent: string;
  };
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
  shadows: typeof shadows;
  layout: typeof layout;
};

export const theme: Theme = {
  colors: {
    background: palette.canvasCream,
    surface: palette.liftedCream,
    surfaceRaised: palette.white,
    text: palette.inkBlack,
    textSecondary: palette.slateGray,
    border: 'rgba(20, 20, 19, 0.12)',
    headerBackground: palette.white,
    icon: palette.inkBlack,
    overlay: 'rgba(20, 20, 19, 0.5)',
    ink: palette.inkBlack,
    canvas: palette.canvasCream,
    signalOrange: palette.signalOrange,
    lightSignalOrange: palette.lightSignalOrange,
    clayBrown: palette.clayBrown,
    dustTaupe: palette.dustTaupe,
    accent: palette.mossGreen,
  },
  spacing,
  radii,
  typography,
  shadows,
  layout,
};

export const useTheme = () => {
  return theme;
};
