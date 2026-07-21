import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

type ScreenProps = ViewProps & {
  children: React.ReactNode;
};

export const Screen: React.FC<ScreenProps> = ({ style, children, ...props }) => {
  const { colors, layout, spacing } = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.canvas }, style]} {...props}>
      <View style={styles.center}>
        <View
          style={[styles.content, { maxWidth: layout.maxWidth, paddingHorizontal: spacing.lg }]}
        >
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
  },
});
