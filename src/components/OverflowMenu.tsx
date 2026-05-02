import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

interface OverflowMenuProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  onSettings: () => void;
  onHelp: () => void;
}

export const OverflowMenu: React.FC<OverflowMenuProps> = ({ visible, onClose, onLogout, onSettings, onHelp }) => {
  const { colors, spacing, typography, shadows, layout } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose} accessibilityRole="button" accessibilityLabel="Close menu">
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
          <TouchableWithoutFeedback>
            <View style={[styles.menuContainer, { backgroundColor: colors.surface, paddingVertical: spacing.sm }, shadows.lg]}>
              
              <TouchableOpacity 
                style={[styles.menuItem, { paddingVertical: spacing.md, paddingHorizontal: spacing.md, minHeight: layout.touchTarget }]} 
                onPress={() => { onClose(); onSettings(); }}
                accessibilityRole="button"
                accessibilityLabel="Settings"
              >
                <Ionicons name="settings-outline" size={20} color={colors.icon} />
                <Text style={[styles.menuText, { 
                  color: colors.text, 
                  fontFamily: typography.fontFamily, 
                  fontSize: typography.sizes.md,
                  lineHeight: typography.lineHeights.md,
                  marginLeft: spacing.md 
                }]}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.menuItem, { paddingVertical: spacing.md, paddingHorizontal: spacing.md, minHeight: layout.touchTarget }]} 
                onPress={() => { onClose(); onHelp(); }}
                accessibilityRole="button"
                accessibilityLabel="Help and Support"
              >
                <Ionicons name="help-circle-outline" size={20} color={colors.icon} />
                <Text style={[styles.menuText, { 
                  color: colors.text, 
                  fontFamily: typography.fontFamily, 
                  fontSize: typography.sizes.md,
                  lineHeight: typography.lineHeights.md,
                  marginLeft: spacing.md 
                }]}>Help & Support</Text>
              </TouchableOpacity>
              
              <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: spacing.xs }]} />

              <TouchableOpacity 
                style={[styles.menuItem, { paddingVertical: spacing.md, paddingHorizontal: spacing.md, minHeight: layout.touchTarget }]} 
                onPress={() => { onClose(); onLogout(); }}
                accessibilityRole="button"
                accessibilityLabel="Log Out"
              >
                <Ionicons name="log-out-outline" size={20} color={colors.danger} />
                <Text style={[styles.menuText, { 
                  color: colors.danger, 
                  fontFamily: typography.fontFamily, 
                  fontSize: typography.sizes.md,
                  lineHeight: typography.lineHeights.md,
                  marginLeft: spacing.md 
                }]}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 60, // Relative to header height, typically dynamic, hardcoded for now
    right: 20,
    width: 220,
    borderRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    // Handled by inline tokens
  },
  divider: {
    height: 1,
  }
});
