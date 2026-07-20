import React from 'react';
import { Text, TextProps, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type TypographyVariant = keyof ReturnType<typeof useTheme>['typography']['styles'];

type TypographyProps = TextProps & {
  variant?: TypographyVariant;
  color?: string;
  withDot?: boolean;
  dotColor?: string;
  containerStyle?: ViewStyle;
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color,
  withDot,
  dotColor,
  style,
  containerStyle,
  ...props
}) => {
  const { colors, typography } = useTheme();

  const fontFamily = typography.families.primary ?? typography.families.fallback;
  const baseStyle: TextStyle = { fontFamily, color: color ?? colors.text };

  if (variant === 'eyebrow' && withDot) {
    return (
      <View style={[{ flexDirection: 'row', alignItems: 'center' }, containerStyle]}>
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            marginRight: 10,
            backgroundColor: dotColor ?? colors.lightSignalOrange,
          }}
        />
        <Text style={[baseStyle, typography.styles[variant], style]} {...props} />
      </View>
    );
  }

  return <Text style={[baseStyle, typography.styles[variant], style]} {...props} />;
};

