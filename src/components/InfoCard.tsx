import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { Surface } from './Surface';
import { Typography } from './Typography';

interface InfoCardProps {
  title: string;
  items: { label: string; value?: string | number | null }[];
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, items }) => {
  const { colors, spacing, radii } = useTheme();

  return (
    <Surface
      radius="frame"
      shadow="level1"
      bordered
      style={[styles.card, { backgroundColor: colors.surfaceRaised, padding: spacing.lg, marginBottom: spacing.md, borderRadius: radii.frame }]}
      accessible={true}
    >
      <Typography variant="h3" style={[styles.title, { marginBottom: spacing.md }]}>
        {title}
      </Typography>
      <View style={[styles.divider, { backgroundColor: colors.border, marginBottom: spacing.md }]} />
      {items.map((item, index) => (
        <View
          key={index}
          style={[styles.row, { marginBottom: index === items.length - 1 ? 0 : spacing.md }]}
          accessible={true}
          accessibilityLabel={`${item.label}: ${item.value || 'Not provided'}`}
        >
          <Typography variant="footerLink" style={[styles.label, { color: colors.textSecondary }]}>
            {item.label}
          </Typography>
          <Typography variant="footerLink" style={[styles.value]} numberOfLines={2}>
            {item.value || 'Not provided'}
          </Typography>
        </View>
      ))}
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20, // This will be overridden or managed by parent container's layout
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
