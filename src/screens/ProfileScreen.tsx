import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Animated, ActivityIndicator, Alert, Text, TouchableOpacity, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../store/appStore';
import { profileService } from '../services/profileService';
import { financialDataService } from '../services/financialDataService';
import { useApi } from '../hooks/useApi';
import { useTheme } from '../theme';
import { ClientProfileDTO, FinancialDataDTO } from '../../clients/fNAPlatformAPIClient/models';
import { CollapsibleHeader } from '../components/CollapsibleHeader';
import { SegmentedControl } from '../components/SegmentedControl';
import { InfoCard } from '../components/InfoCard';
import { BottomSheet } from '../components/BottomSheet';
import { OverflowMenu } from '../components/OverflowMenu';
import { Ionicons } from '@expo/vector-icons';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  dateOfBirth: z.string().optional(),
  idNumber: z.string().min(5, 'ID number must be at least 5 characters'),
  maritalStatus: z.string().optional(),
  numberOfDependants: z.number().min(0, 'Must be 0 or more').optional(),
  mobileNumber: z.string().min(10, 'Valid mobile number required'),
  email: z.string().email('Invalid email address'),
  residentialAddress: z.string().optional(),
  employmentStatus: z.string().optional(),
  occupation: z.string().optional(),
  employer: z.string().optional(),
});

const financialSchema = z.object({
  monthlyIncome: z.number().min(0).optional(),
  monthlyExpenses: z.number().min(0).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type FinancialFormData = z.infer<typeof financialSchema>;

export default function ProfileScreen() {
  const { user, profile: cachedProfile, setProfile, logout } = useAppStore();
  const { colors, primary, isDark, spacing, typography, layout, shadows } = useTheme();
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState(0); // 0 = Personal, 1 = Financial
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [isEditFinancialVisible, setIsEditFinancialVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const { execute: fetchProfile, isLoading: isFetchingProfile } = useApi(profileService.getProfile);
  const { execute: saveProfile, isLoading: isSavingProfile } = useApi(profileService.createOrUpdateProfile);
  const { data: financialData, execute: fetchFinancialData, isLoading: isFetchingFinancial } = useApi(financialDataService.getFinancialData);
  const { execute: saveFinancialData, isLoading: isSavingFinancial } = useApi(financialDataService.createOrUpdateFinancialData);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: '', email: user?.email || '', mobileNumber: '', idNumber: '', numberOfDependants: 0 }
  });

  const financialForm = useForm<FinancialFormData>({
    resolver: zodResolver(financialSchema),
    defaultValues: { monthlyIncome: 0, monthlyExpenses: 0 }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user?.id) return;
    try {
      const pData = await fetchProfile(user.id);
      if (pData) {
        setProfile(pData);
        profileForm.reset({
          fullName: pData.fullName || '',
          email: pData.email || user.email || '',
          mobileNumber: pData.mobileNumber || '',
          idNumber: pData.idNumber || '',
          dateOfBirth: pData.dateOfBirth || '',
          maritalStatus: pData.maritalStatus || '',
          numberOfDependants: pData.numberOfDependants || 0,
          residentialAddress: pData.residentialAddress || '',
          employmentStatus: pData.employmentStatus || '',
          occupation: pData.occupation || '',
          employer: pData.employer || '',
        });
      }
    } catch (err: any) {
      if (err.status !== 404) console.warn('Failed to load profile', err);
    }

    try {
      const fData = await fetchFinancialData(user.id);
      if (fData) {
        financialForm.reset({
          monthlyIncome: fData.monthlyIncome || 0,
          monthlyExpenses: fData.monthlyExpenses || 0,
        });
      }
    } catch (err: any) {
      if (err.status !== 404) console.warn('Failed to load financials', err);
    }
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    if (!user?.id) return;
    try {
      const dto: ClientProfileDTO = { ...data, userId: user.id };
      const updated = await saveProfile(user.id, dto);
      setProfile(updated);
      setIsEditProfileVisible(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update profile.');
    }
  };

  const onFinancialSubmit = async (data: FinancialFormData) => {
    if (!user?.id) return;
    try {
      const dto: FinancialDataDTO = { 
        ...financialData, // Preserve existing assets/liabilities if any
        profileId: user.id, 
        monthlyIncome: data.monthlyIncome, 
        monthlyExpenses: data.monthlyExpenses 
      };
      await saveFinancialData(user.id, dto);
      await fetchFinancialData(user.id);
      setIsEditFinancialVisible(false);
      Alert.alert('Success', 'Financial data updated successfully.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update financial data.');
    }
  };

  const renderPersonalCards = () => (
    <>
      <InfoCard 
        title="Contact Information" 
        items={[
          { label: 'Email', value: cachedProfile?.email },
          { label: 'Mobile Number', value: cachedProfile?.mobileNumber },
          { label: 'Residential Address', value: cachedProfile?.residentialAddress },
        ]} 
      />
      <InfoCard 
        title="Personal Details" 
        items={[
          { label: 'ID Number', value: cachedProfile?.idNumber },
          { label: 'Date of Birth', value: cachedProfile?.dateOfBirth },
          { label: 'Marital Status', value: cachedProfile?.maritalStatus },
          { label: 'Dependants', value: cachedProfile?.numberOfDependants?.toString() },
        ]} 
      />
      <InfoCard 
        title="Employment" 
        items={[
          { label: 'Status', value: cachedProfile?.employmentStatus },
          { label: 'Occupation', value: cachedProfile?.occupation },
          { label: 'Employer', value: cachedProfile?.employer },
        ]} 
      />
    </>
  );

  const renderFinancialCards = () => (
    <>
      <InfoCard 
        title="Summary" 
        items={[
          { label: 'Monthly Income', value: `ZAR ${financialData?.monthlyIncome || 0}` },
          { label: 'Monthly Expenses', value: `ZAR ${financialData?.monthlyExpenses || 0}` },
        ]} 
      />
      <InfoCard 
        title="Assets" 
        items={
          financialData?.assets?.length 
            ? financialData.assets.map(a => ({ label: a.description || a.type || 'Asset', value: `ZAR ${a.value}` }))
            : [{ label: 'No assets recorded' }]
        } 
      />
      <InfoCard 
        title="Liabilities" 
        items={
          financialData?.liabilities?.length 
            ? financialData.liabilities.map(l => ({ label: l.description || l.type || 'Liability', value: `ZAR ${l.balance}` }))
            : [{ label: 'No liabilities recorded' }]
        } 
      />
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CollapsibleHeader 
        scrollY={scrollY} 
        fullName={cachedProfile?.fullName || ''} 
        email={cachedProfile?.email || user?.email || ''} 
        onSettingsPress={() => setIsMenuVisible(true)}
      />

      <Animated.ScrollView
        contentContainerStyle={{ paddingTop: 230, paddingBottom: 100 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.contentWrapper, { maxWidth: layout.maxWidth }]}>
          <SegmentedControl 
            options={['Personal', 'Financial']} 
            selectedIndex={activeTab} 
            onChange={setActiveTab} 
          />

          <View style={[styles.cardsContainer, { paddingTop: spacing.md }]}>
            {isFetchingProfile || isFetchingFinancial ? (
              <ActivityIndicator size="large" color={primary} style={{ marginTop: spacing.xxl }} accessibilityLabel="Loading data" />
            ) : (
              activeTab === 0 ? renderPersonalCards() : renderFinancialCards()
            )}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Floating Action Button for Editing */}
      <View style={[styles.fabWrapper, { maxWidth: layout.maxWidth }]} pointerEvents="box-none">
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: primary }, shadows.lg]} 
          onPress={() => activeTab === 0 ? setIsEditProfileVisible(true) : setIsEditFinancialVisible(true)}
          accessibilityLabel={activeTab === 0 ? "Edit Personal Information" : "Edit Financial Information"}
          accessibilityRole="button"
        >
          <Ionicons name="pencil" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Edit Profile Bottom Sheet */}
      <BottomSheet visible={isEditProfileVisible} onClose={() => setIsEditProfileVisible(false)}>
        <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sheetTitle, { 
            color: colors.text,
            fontFamily: typography.fontFamily,
            fontSize: typography.sizes.xl,
            fontWeight: typography.weights.bold,
            marginBottom: spacing.lg 
          }]}>Edit Personal Info</Text>
          
          <View style={[styles.inputGroup, { marginBottom: spacing.md }]}>
            <Text style={[styles.label, { 
              color: colors.textSecondary,
              fontFamily: typography.fontFamily,
              fontSize: typography.sizes.sm,
              marginBottom: spacing.sm 
            }]}>Full Name</Text>
            <Controller
              control={profileForm.control}
              name="fullName"
              render={({ field: { onChange, value } }) => (
                <TextInput 
                  style={[styles.input, { 
                    backgroundColor: colors.background, 
                    color: colors.text, 
                    borderColor: colors.border,
                    fontFamily: typography.fontFamily,
                    fontSize: typography.sizes.md,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                  }]} 
                  onChangeText={onChange} 
                  value={value} 
                  accessibilityLabel="Full Name Input"
                />
              )}
            />
            {profileForm.formState.errors.fullName && <Text style={[styles.error, { fontFamily: typography.fontFamily, marginTop: spacing.xs }]}>{profileForm.formState.errors.fullName.message}</Text>}
          </View>

          <View style={[styles.inputGroup, { marginBottom: spacing.md }]}>
            <Text style={[styles.label, { 
              color: colors.textSecondary,
              fontFamily: typography.fontFamily,
              fontSize: typography.sizes.sm,
              marginBottom: spacing.sm 
            }]}>ID Number</Text>
            <Controller
              control={profileForm.control}
              name="idNumber"
              render={({ field: { onChange, value } }) => (
                <TextInput 
                  style={[styles.input, { 
                    backgroundColor: colors.background, 
                    color: colors.text, 
                    borderColor: colors.border,
                    fontFamily: typography.fontFamily,
                    fontSize: typography.sizes.md,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                  }]} 
                  onChangeText={onChange} 
                  value={value} 
                  keyboardType="number-pad" 
                  accessibilityLabel="ID Number Input"
                />
              )}
            />
            {profileForm.formState.errors.idNumber && <Text style={[styles.error, { fontFamily: typography.fontFamily, marginTop: spacing.xs }]}>{profileForm.formState.errors.idNumber.message}</Text>}
          </View>

          <View style={[styles.inputGroup, { marginBottom: spacing.md }]}>
            <Text style={[styles.label, { 
              color: colors.textSecondary,
              fontFamily: typography.fontFamily,
              fontSize: typography.sizes.sm,
              marginBottom: spacing.sm 
            }]}>Mobile Number</Text>
            <Controller
              control={profileForm.control}
              name="mobileNumber"
              render={({ field: { onChange, value } }) => (
                <TextInput 
                  style={[styles.input, { 
                    backgroundColor: colors.background, 
                    color: colors.text, 
                    borderColor: colors.border,
                    fontFamily: typography.fontFamily,
                    fontSize: typography.sizes.md,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                  }]} 
                  onChangeText={onChange} 
                  value={value} 
                  keyboardType="phone-pad" 
                  accessibilityLabel="Mobile Number Input"
                />
              )}
            />
            {profileForm.formState.errors.mobileNumber && <Text style={[styles.error, { fontFamily: typography.fontFamily, marginTop: spacing.xs }]}>{profileForm.formState.errors.mobileNumber.message}</Text>}
          </View>

          <View style={[styles.inputGroup, { marginBottom: spacing.md }]}>
            <Text style={[styles.label, { 
              color: colors.textSecondary,
              fontFamily: typography.fontFamily,
              fontSize: typography.sizes.sm,
              marginBottom: spacing.sm 
            }]}>Email</Text>
            <Controller
              control={profileForm.control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput 
                  style={[styles.input, { 
                    backgroundColor: colors.background, 
                    color: colors.text, 
                    borderColor: colors.border,
                    fontFamily: typography.fontFamily,
                    fontSize: typography.sizes.md,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                  }]} 
                  onChangeText={onChange} 
                  value={value} 
                  keyboardType="email-address" 
                  autoCapitalize="none" 
                  accessibilityLabel="Email Input"
                />
              )}
            />
            {profileForm.formState.errors.email && <Text style={[styles.error, { fontFamily: typography.fontFamily, marginTop: spacing.xs }]}>{profileForm.formState.errors.email.message}</Text>}
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: primary, paddingVertical: spacing.md, marginTop: spacing.sm, marginBottom: spacing.lg }]} 
            onPress={profileForm.handleSubmit(onProfileSubmit)} 
            disabled={isSavingProfile}
            accessibilityRole="button"
            accessibilityLabel="Save Changes"
          >
            {isSavingProfile ? <ActivityIndicator color="#FFF" /> : <Text style={[styles.saveButtonText, { fontFamily: typography.fontFamily, fontSize: typography.sizes.md }]}>Save Changes</Text>}
          </TouchableOpacity>
        </ScrollView>
      </BottomSheet>

      {/* Edit Financial Bottom Sheet */}
      <BottomSheet visible={isEditFinancialVisible} onClose={() => setIsEditFinancialVisible(false)}>
        <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sheetTitle, { 
            color: colors.text,
            fontFamily: typography.fontFamily,
            fontSize: typography.sizes.xl,
            fontWeight: typography.weights.bold,
            marginBottom: spacing.lg 
          }]}>Edit Financial Summary</Text>
          
          <View style={[styles.inputGroup, { marginBottom: spacing.md }]}>
            <Text style={[styles.label, { 
              color: colors.textSecondary,
              fontFamily: typography.fontFamily,
              fontSize: typography.sizes.sm,
              marginBottom: spacing.sm 
            }]}>Monthly Income (ZAR)</Text>
            <Controller
              control={financialForm.control}
              name="monthlyIncome"
              render={({ field: { onChange, value } }) => (
                <TextInput 
                  style={[styles.input, { 
                    backgroundColor: colors.background, 
                    color: colors.text, 
                    borderColor: colors.border,
                    fontFamily: typography.fontFamily,
                    fontSize: typography.sizes.md,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                  }]} 
                  onChangeText={val => onChange(parseInt(val) || 0)} 
                  value={value?.toString()} 
                  keyboardType="numeric" 
                  accessibilityLabel="Monthly Income Input"
                />
              )}
            />
          </View>

          <View style={[styles.inputGroup, { marginBottom: spacing.md }]}>
            <Text style={[styles.label, { 
              color: colors.textSecondary,
              fontFamily: typography.fontFamily,
              fontSize: typography.sizes.sm,
              marginBottom: spacing.sm 
            }]}>Monthly Expenses (ZAR)</Text>
            <Controller
              control={financialForm.control}
              name="monthlyExpenses"
              render={({ field: { onChange, value } }) => (
                <TextInput 
                  style={[styles.input, { 
                    backgroundColor: colors.background, 
                    color: colors.text, 
                    borderColor: colors.border,
                    fontFamily: typography.fontFamily,
                    fontSize: typography.sizes.md,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                  }]} 
                  onChangeText={val => onChange(parseInt(val) || 0)} 
                  value={value?.toString()} 
                  keyboardType="numeric" 
                  accessibilityLabel="Monthly Expenses Input"
                />
              )}
            />
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: primary, paddingVertical: spacing.md, marginTop: spacing.sm, marginBottom: spacing.lg }]} 
            onPress={financialForm.handleSubmit(onFinancialSubmit)} 
            disabled={isSavingFinancial}
            accessibilityRole="button"
            accessibilityLabel="Save Financial Changes"
          >
            {isSavingFinancial ? <ActivityIndicator color="#FFF" /> : <Text style={[styles.saveButtonText, { fontFamily: typography.fontFamily, fontSize: typography.sizes.md }]}>Save Changes</Text>}
          </TouchableOpacity>
        </ScrollView>
      </BottomSheet>

      <OverflowMenu 
        visible={isMenuVisible} 
        onClose={() => setIsMenuVisible(false)} 
        onLogout={logout}
        onSettings={() => Alert.alert('Settings', 'Coming soon')}
        onHelp={() => Alert.alert('Help', 'Contact support at help@momentum.co.za')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  cardsContainer: {
    // Styling handled by inline tokens
  },
  fabWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignSelf: 'center',
    width: '100%',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetScroll: {
    maxHeight: 500,
  },
  sheetTitle: {
    // Styles from tokens
  },
  inputGroup: {
    // Styles from tokens
  },
  label: {
    // Styles from tokens
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
  },
  error: {
    color: '#DC3545',
    fontSize: 12,
  },
  saveButton: {
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  }
});
