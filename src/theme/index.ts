import { useColorScheme, Platform, ViewStyle, TextStyle } from 'react-native';

export const palette = {
  primary: '#007BFF', // Momentum Blue
  primaryDark: '#0056b3',
  success: '#28A745',
  successDark: '#1e7e34',
  danger: '#DC3545',
  warning: '#FFC107',
  
  light: {
    background: '#F0F2F5',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
    border: '#E0E0E0',
    headerBackground: '#FFFFFF',
    icon: '#333333',
    overlay: 'rgba(0,0,0,0.5)',
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    text: '#F5F5F5',
    textSecondary: '#AAAAAA',
    border: '#333333',
    headerBackground: '#1A1A1A',
    icon: '#F5F5F5',
    overlay: 'rgba(0,0,0,0.7)',
  }
};

// 8-pt grid system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography tokens
export const typography = {
  fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 40,
  }
};

// Standardized shadow tokens
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  } as ViewStyle,
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  } as ViewStyle,
};

// Responsive Layout Max-Widths
export const layout = {
  maxWidth: 768, // Optimal reading width for tablets/desktop
  touchTarget: 44, // WCAG 2.1 AA minimum touch target size
};

export const useTheme = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = isDark ? palette.dark : palette.light;

  return {
    isDark,
    colors: {
      ...colors,
      primary: palette.primary,
      primaryDark: palette.primaryDark,
      success: palette.success,
      successDark: palette.successDark,
      danger: palette.danger,
      warning: palette.warning,
    },
    spacing,
    typography,
    shadows,
    layout,
  };
};
