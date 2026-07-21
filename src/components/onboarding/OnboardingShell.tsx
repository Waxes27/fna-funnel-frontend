import React, { PropsWithChildren, isValidElement } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

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
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingTop: spacing.lg, paddingBottom: spacing.xxl },
            contentContainerStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.stack, { gap: spacing.lg }]}>
            <OnboardingProgress step={step} totalSteps={totalSteps} />
            {React.Children.map(children, renderShellChild)}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    flexGrow: 1,
  },
  stack: {
    width: '100%',
  },
});
