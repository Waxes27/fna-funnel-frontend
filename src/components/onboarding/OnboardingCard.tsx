import React, { PropsWithChildren } from 'react';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { Surface } from '../Surface';

type SpacingToken = keyof ReturnType<typeof useTheme>['spacing'];
type ShadowToken = keyof ReturnType<typeof useTheme>['shadows'];

type OnboardingCardProps = PropsWithChildren<
  ViewProps & {
    padding?: SpacingToken;
    shadow?: ShadowToken;
    style?: StyleProp<ViewStyle>;
  }
>;

export const OnboardingCard: React.FC<OnboardingCardProps> = ({
  children,
  padding = 'lg',
  shadow = 'level2',
  style,
  ...props
}) => {
  const { colors, spacing } = useTheme();

  return (
    <Surface
      variant="raised"
      radius="frame"
      shadow={shadow}
      bordered
      padding={spacing[padding]}
      style={[{ backgroundColor: colors.surfaceRaised }, style]}
      {...props}
    >
      {children}
    </Surface>
  );
};
