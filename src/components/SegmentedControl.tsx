import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { Typography } from './Typography';

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, selectedIndex, onChange }) => {
  const { colors, spacing, radii, layout } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceRaised,
          borderColor: colors.border,
          borderRadius: radii.pill,
          marginTop: spacing.lg,
          marginBottom: spacing.sm,
        },
      ]}
    >
      {options.map((option, index) => {
        const isSelected = selectedIndex === index;
        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.tab,
              { minHeight: layout.touchTarget, paddingVertical: spacing.xs },
              isSelected && { backgroundColor: colors.ink },
              index === 0 && styles.leftTab,
              index === options.length - 1 && styles.rightTab,
            ]}
            onPress={() => onChange(index)}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`Switch to ${option} tab`}
          >
            <Typography variant="footerLink" style={[styles.tabText, { color: isSelected ? colors.canvas : colors.textSecondary }]}>
              {option}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 20, // Managed by parent layout wrapper
    borderWidth: 1,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftTab: {
    borderRightWidth: 0,
  },
  rightTab: {
    borderLeftWidth: 0,
  },
  tabText: {
    // Styles handled by inline tokens
  },
});
