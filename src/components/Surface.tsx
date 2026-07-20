import React from 'react';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

type SurfaceProps = ViewProps & {
  variant?: 'canvas' | 'surface' | 'raised' | 'ink';
  radius?: keyof ReturnType<typeof useTheme>['radii'];
  shadow?: keyof ReturnType<typeof useTheme>['shadows'];
  bordered?: boolean;
  padding?: number;
  style?: StyleProp<ViewStyle>;
};

export const Surface: React.FC<SurfaceProps> = ({
  variant = 'surface',
  radius = 'frame',
  shadow,
  bordered,
  padding,
  style,
  ...props
}) => {
  const { colors, radii, shadows } = useTheme();

  const backgroundColor =
    variant === 'canvas'
      ? colors.canvas
      : variant === 'raised'
        ? colors.surfaceRaised
        : variant === 'ink'
          ? colors.ink
          : colors.surface;

  return (
    <View
      style={[
        styles.base,
        { backgroundColor, borderRadius: radii[radius] },
        bordered ? { borderWidth: 1, borderColor: colors.border } : null,
        shadow ? shadows[shadow] : null,
        typeof padding === 'number' ? { padding } : null,
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    width: '100%',
  },
});

