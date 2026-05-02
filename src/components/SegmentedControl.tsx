import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, selectedIndex, onChange }) => {
  const { colors, primary, spacing, typography, layout } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: spacing.lg, marginBottom: spacing.sm }]}>
      {options.map((option, index) => {
        const isSelected = selectedIndex === index;
        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.tab,
              { minHeight: layout.touchTarget, paddingVertical: spacing.md },
              isSelected && { backgroundColor: primary },
              index === 0 && styles.leftTab,
              index === options.length - 1 && styles.rightTab,
            ]}
            onPress={() => onChange(index)}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`Switch to ${option} tab`}
          >
            <Text style={[styles.tabText, { 
              color: isSelected ? '#FFF' : colors.textSecondary,
              fontFamily: typography.fontFamily,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.semibold,
              lineHeight: typography.lineHeights.sm
            }]}>
              {option}
            </Text>
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
    borderRadius: 8,
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
