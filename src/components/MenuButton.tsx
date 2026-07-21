import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

type MenuButtonProps = {
  onPress: () => void;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export const MenuButton: React.FC<MenuButtonProps> = ({
  onPress,
  iconName = 'ellipsis-horizontal',
  accessibilityLabel = 'Menu',
  style,
}) => {
  const { colors, layout, radii } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: colors.surfaceRaised,
          borderColor: colors.border,
          borderRadius: radii.circle,
          minHeight: layout.touchTarget,
          minWidth: layout.touchTarget,
        },
        pressed ? styles.pressed : null,
        style,
      ]}
      onPress={onPress}
    >
      <Ionicons name={iconName} size={22} color={colors.ink} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});
