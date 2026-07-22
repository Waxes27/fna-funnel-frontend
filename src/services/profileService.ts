import { ClientProfileDTO, ResidentialAddress } from '../../clients/fNAPlatformAPIClient/models';

import { OnboardingProfileDraft } from '../store/appStore';
import { apiClient, apiService } from './apiService';

const formatDisplayAddress = (address: ResidentialAddress) =>
  [
    address.line1,
    address.line2,
    address.suburb,
    address.city,
    address.provinceOrState,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(', ');

const mapResidentialAddress = (
  address: OnboardingProfileDraft['primaryApplicant']['residentialAddress'],
): ResidentialAddress => ({
  line1: address.addressLine1.trim(),
  line2: address.addressLine2.trim() || undefined,
  suburb: address.suburb.trim(),
  city: address.city.trim(),
  provinceOrState: address.province.trim(),
  postalCode: address.postalCode.trim(),
  country: address.country.trim(),
  displayValue: formatDisplayAddress({
    line1: address.addressLine1.trim(),
    line2: address.addressLine2.trim() || undefined,
    suburb: address.suburb.trim(),
    city: address.city.trim(),
    provinceOrState: address.province.trim(),
    postalCode: address.postalCode.trim(),
    country: address.country.trim(),
  }),
});

const mapOnboardingDraftToClientProfile = (
  userId: string,
  draft: OnboardingProfileDraft,
): ClientProfileDTO => {
  const primaryApplicant = draft.primaryApplicant;
  const address = mapResidentialAddress(primaryApplicant.residentialAddress);
  const grossMonthlyIncome = Number(primaryApplicant.grossMonthlyIncome);
  const hasGrossMonthlyIncome = Number.isFinite(grossMonthlyIncome) && grossMonthlyIncome > 0;

  return {
    userId,
    title: primaryApplicant.title as ClientProfileDTO['title'],
    firstName: primaryApplicant.firstName.trim(),
    lastName: primaryApplicant.surname.trim(),
    fullName: [primaryApplicant.firstName, primaryApplicant.surname].filter(Boolean).join(' ').trim(),
    idNumber: primaryApplicant.idNumber.trim(),
    gender: primaryApplicant.gender as ClientProfileDTO['gender'],
    maritalStatus: primaryApplicant.maritalStatus as ClientProfileDTO['maritalStatus'],
    mobileNumber: primaryApplicant.mobileNumber.trim(),
    email: primaryApplicant.emailAddress.trim(),
    address,
    residentialAddress: address.displayValue,
    occupation: primaryApplicant.occupation.trim(),
    grossMonthlyIncome: hasGrossMonthlyIncome ? grossMonthlyIncome : undefined,
    annualIncome: hasGrossMonthlyIncome ? grossMonthlyIncome * 12 : undefined,
    spouseIncome:
      draft.spouse.applicable && /^\d+$/.test(draft.spouse.grossMonthlyIncome.trim())
        ? Number(draft.spouse.grossMonthlyIncome.trim())
        : undefined,
    smokerStatus: primaryApplicant.smokerStatus as ClientProfileDTO['smokerStatus'],
    highestEducationLevel:
      primaryApplicant.highestEducationLevel as ClientProfileDTO['highestEducationLevel'],
    onboardingStatus: 'COMPLETED',
    currentOnboardingStep: 'COMPLETE',
    completedAt: new Date().toISOString(),
  };
};

export const profileService = {
  getProfile: async (userId: string): Promise<ClientProfileDTO> => {
    return apiService.execute<ClientProfileDTO>(() =>
      apiClient.api.getProfile({ userId }),
    );
  },
  
  createOrUpdateProfile: async (userId: string, data: ClientProfileDTO): Promise<ClientProfileDTO> => {
    return apiService.execute<ClientProfileDTO>(() =>
      apiClient.api.createOrUpdateProfile({ userId }, data),
    );
  },

  submitOnboardingProfile: async (
    userId: string,
    draft: OnboardingProfileDraft,
  ): Promise<ClientProfileDTO> => {
    return profileService.createOrUpdateProfile(userId, mapOnboardingDraftToClientProfile(userId, draft));
  },
};
