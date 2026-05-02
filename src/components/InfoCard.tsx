import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface InfoCardProps {
  title: string;
  items: { label: string; value?: string | number | null }[];
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, items }) => {
  const { colors, spacing, typography, shadows } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, padding: spacing.lg, marginBottom: spacing.md }, shadows.md]} accessible={true}>
      <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily, fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, marginBottom: spacing.md }]}>
        {title}
      </Text>
      <View style={[styles.divider, { backgroundColor: colors.border, marginBottom: spacing.md }]} />
      {items.map((item, index) => (
        <View key={index} style={[styles.row, { marginBottom: index === items.length - 1 ? 0 : spacing.md }]} accessible={true} accessibilityLabel={`${item.label}: ${item.value || 'Not provided'}`}>
          <Text style={[styles.label, { color: colors.textSecondary, fontFamily: typography.fontFamily, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.sm }]}>
            {item.label}
          </Text>
          <Text style={[styles.value, { color: colors.text, fontFamily: typography.fontFamily, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.sm, fontWeight: typography.weights.medium }]} numberOfLines={2}>
            {item.value || 'Not provided'}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20, // This will be overridden or managed by parent container's layout
    borderRadius: 16,
  },
  title: {
    // Styling handled by inline tokens
  },
  divider: {
    height: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    flex: 1,
    paddingRight: 8,
  },
  value: {
    flex: 2,
    textAlign: 'right',
  },
});
