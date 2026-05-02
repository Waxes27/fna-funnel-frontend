import React from 'react';
import { 
  Modal, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useTheme } from '../theme';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ visible, onClose, children }) => {
  const { colors, spacing, shadows, layout } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={onClose} accessibilityRole="button" accessibilityLabel="Close bottom sheet">
            <View style={[styles.background, { backgroundColor: colors.overlay }]} />
          </TouchableWithoutFeedback>
          <View style={[styles.sheetContainer, { 
            backgroundColor: colors.surface, 
            paddingTop: spacing.md, 
            paddingHorizontal: spacing.lg, 
            paddingBottom: spacing.xxl 
          }, shadows.lg]}>
            <View style={[styles.contentWrapper, { maxWidth: layout.maxWidth }]}>
              <View style={[styles.handleContainer, { marginBottom: spacing.lg }]}>
                <View style={[styles.handle, { backgroundColor: colors.border }]} />
              </View>
              {children}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  contentWrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  handleContainer: {
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
});
