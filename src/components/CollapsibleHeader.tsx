import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

interface CollapsibleHeaderProps {
  scrollY: Animated.Value;
  fullName: string;
  email: string;
  onSettingsPress: () => void;
}

const HEADER_MAX_HEIGHT = 220;
const HEADER_MIN_HEIGHT = 90; // Approx safe area + toolbar

export const CollapsibleHeader: React.FC<CollapsibleHeaderProps> = ({ scrollY, fullName, email, onSettingsPress }) => {
  const { colors, primary, spacing, typography, shadows, layout } = useTheme();

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - 20, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const profileScale = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [1, 0.5],
    extrapolate: 'clamp',
  });

  const profileTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, -40],
    extrapolate: 'clamp',
  });

  const profileOpacity = scrollY.interpolate({
    inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT) / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[
      styles.header, 
      { 
        height: headerHeight, 
        backgroundColor: colors.headerBackground, 
        borderBottomColor: colors.border 
      },
      shadows.sm
    ]}>
      <View style={[styles.contentWrapper, { maxWidth: layout.maxWidth }]}>
        <View style={[styles.topBar, { paddingHorizontal: spacing.lg }]}>
          <View style={styles.topBarLeftPlaceholder} />
          
          <Animated.Text 
            style={[styles.smallTitle, { 
              opacity: headerTitleOpacity, 
              color: colors.text,
              fontFamily: typography.fontFamily,
              fontSize: typography.sizes.lg,
              fontWeight: typography.weights.bold,
              lineHeight: typography.lineHeights.lg
            }]}
            accessibilityRole="header"
            numberOfLines={1}
          >
            {fullName || 'Profile'}
          </Animated.Text>
          
          <View style={styles.topBarRightContainer}>
            <TouchableOpacity 
              style={[styles.iconButton, { minHeight: layout.touchTarget, minWidth: layout.touchTarget }]} 
              onPress={onSettingsPress} 
              accessibilityLabel="Settings Menu"
              accessibilityRole="button"
            >
              <Ionicons name="ellipsis-vertical" size={28} color={colors.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View 
          style={[
            styles.profileSection, 
            { 
              opacity: profileOpacity,
              transform: [
                { scale: profileScale },
                { translateY: profileTranslateY }
              ],
            }
          ]}
          accessible={true}
          accessibilityLabel={`Profile for ${fullName || 'New User'}, ${email}`}
        >
          <View style={[styles.avatarContainer, { marginBottom: spacing.md }]}>
            <View style={[styles.avatar, { backgroundColor: primary }]}>
              <Text style={[styles.avatarText, { fontFamily: typography.fontFamily, fontSize: typography.sizes.xxxl }]}>
                {fullName ? fullName.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.success, borderColor: colors.headerBackground }]}>
              <Ionicons name="checkmark-sharp" size={14} color="#FFF" />
            </View>
          </View>
          <Text style={[styles.name, { 
            color: colors.text,
            fontFamily: typography.fontFamily,
            fontSize: typography.sizes.xl,
            fontWeight: typography.weights.bold,
            lineHeight: typography.lineHeights.xl,
            marginBottom: spacing.xs,
            textAlign: 'center'
          }]} numberOfLines={1}>{fullName || 'Complete your profile'}</Text>
          <Text style={[styles.email, { 
            color: colors.textSecondary,
            fontFamily: typography.fontFamily,
            fontSize: typography.sizes.sm,
            lineHeight: typography.lineHeights.sm,
            textAlign: 'center'
          }]} numberOfLines={1}>{email}</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    zIndex: 10,
    overflow: 'hidden',
  },
  contentWrapper: {
    width: '100%',
    alignSelf: 'center',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center', // Center vertically within the top bar height
    height: HEADER_MIN_HEIGHT,
    paddingTop: 30, // Approximate status bar height padding
    zIndex: 2,
  },
  topBarLeftPlaceholder: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    width: 44, // Match touchTarget size to balance centering
    height: 44,
  },
  topBarRightContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16, // Center the icon button within the safe area padding
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallTitle: {
    textAlign: 'center',
    marginTop: 10, // Adjust title to be perfectly vertically aligned with the icon
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: HEADER_MIN_HEIGHT - 30, // Offset to visually center within the remaining max height space
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  name: {
    // Styles from tokens
  },
  email: {
    // Styles from tokens
  }
});
