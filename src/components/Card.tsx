import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Surface } from './Surface';

type CardProps = Omit<
  React.ComponentProps<typeof Surface>,
  'variant' | 'radius' | 'bordered' | 'shadow'
> & {
  variant?: React.ComponentProps<typeof Surface>['variant'];
  radius?: React.ComponentProps<typeof Surface>['radius'];
  bordered?: boolean;
  shadow?: React.ComponentProps<typeof Surface>['shadow'];
  style?: StyleProp<ViewStyle>;
};

export const Card: React.FC<CardProps> = ({
  variant = 'raised',
  radius = 'frame',
  bordered = true,
  shadow = 'level1',
  style,
  ...props
}) => {
  return (
    <Surface
      variant={variant}
      radius={radius}
      bordered={bordered}
      shadow={shadow}
      style={style}
      {...props}
    />
  );
};
