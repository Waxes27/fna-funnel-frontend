import React, { PropsWithChildren, isValidElement } from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { Screen } from '../Screen';
import { Typography } from '../Typography';
import { OnboardingProgress } from './OnboardingProgress';

type OnboardingShellProps = PropsWithChildren<{
  step: number;
  totalSteps: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

const renderShellChild = (child: React.ReactNode, index: number): React.ReactNode => {
  if (typeof child === 'string' || typeof child === 'number') {
    return (
      <Typography key={`onboarding-shell-text-${index}`} variant="body">
        {child}
      </Typography>
    );
  }

  if (isValidElement(child)) {
    if (child.type === React.Fragment) {
      return React.Children.map(child.props.children, renderShellChild);
    }

    return child;
  }

  return null;
};

export const OnboardingShell: React.FC<OnboardingShellProps> = ({
  step,
  totalSteps,
  children,
  contentContainerStyle,
}) => {
  const { spacing } = useTheme();

  return (
    <Screen>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingVertical: spacing.lg },
          contentContainerStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.stack, { gap: spacing.lg }]}>
          <OnboardingProgress step={step} totalSteps={totalSteps} />
          {React.Children.map(children, renderShellChild)}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
  contentContainer: {
    flexGrow: 1,
  },
  stack: {
    width: '100%',
  },
});
