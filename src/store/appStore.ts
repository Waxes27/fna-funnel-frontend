import { create } from 'zustand';
import { JwtResponse, ClientProfileDTO } from '../../clients/fNAPlatformAPIClient/models';
import { apiService } from '../services/apiService';
import { normalizeAuthenticatedUser, normalizeAuthRole } from '../services/authUser';
import { clearPersistedAuthSession } from '../services/authSessionStore';

export type OnboardingStep =
  | 'welcome'
  | 'goals'
  | 'valueExplainer'
  | 'legalName'
  | 'dateOfBirth'
  | 'contactDetails'
  | 'householdEmployment'
  | 'financialSnapshot'
  | 'riskQuiz'
  | 'consent'
  | 'notificationPrompt'
  | 'accountConnection'
  | 'summary';

export type AccountConnectionChoice = 'manual' | 'secureLink' | 'later';

export interface OnboardingResidentialAddressDraft {
  addressLine1: string;
  addressLine2: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface OnboardingApplicantDraft {
  title: string;
  firstName: string;
  surname: string;
  idNumber: string;
  gender: string;
  maritalStatus: string;
  smokerStatus: string;
  highestEducationLevel: string;
  occupation: string;
  grossMonthlyIncome: string;
  incomeCurrency: string;
  emailAddress: string;
  mobileNumber: string;
  residentialAddress: OnboardingResidentialAddressDraft;
}

export interface OnboardingSpouseDraft extends OnboardingApplicantDraft {
  applicable: boolean;
  sameAsPrimaryApplicant: boolean;
}

export interface OnboardingProfileDraft {
  goals: string[];
  primaryApplicant: OnboardingApplicantDraft;
  spouse: OnboardingSpouseDraft;
  consentAccepted: boolean;
  notificationsEnabled: boolean;
  accountConnectionChoice: AccountConnectionChoice;
}

interface AppState {
  isAuthenticated: boolean;
  isAuthBootstrapping: boolean;
  isOnboardingComplete: boolean;
  onboardingStep: OnboardingStep;
  user: JwtResponse | null;
  profile: ClientProfileDTO | null;
  profileDraft: OnboardingProfileDraft;
  login: (user: JwtResponse) => void;
  logout: () => void;
  applyAuthenticatedUser: (user: JwtResponse) => void;
  finishAuthBootstrap: () => void;
  setOnboardingStep: (step: OnboardingStep) => void;
  completeOnboarding: () => void;
  setProfile: (profile: ClientProfileDTO) => void;
  setProfileDraft: (patch: Partial<OnboardingProfileDraft>) => void;
  setPrimaryApplicantDraft: (patch: Partial<OnboardingApplicantDraft>) => void;
  setPrimaryApplicantAddressDraft: (patch: Partial<OnboardingResidentialAddressDraft>) => void;
  setSpouseDraft: (patch: Partial<OnboardingSpouseDraft>) => void;
  setSpouseAddressDraft: (patch: Partial<OnboardingResidentialAddressDraft>) => void;
}

const defaultOnboardingStep: OnboardingStep = 'welcome';

const defaultResidentialAddressDraft: OnboardingResidentialAddressDraft = {
  addressLine1: '',
  addressLine2: '',
  suburb: '',
  city: '',
  province: '',
  postalCode: '',
  country: 'South Africa',
};

const defaultApplicantDraft: OnboardingApplicantDraft = {
  title: '',
  firstName: '',
  surname: '',
  idNumber: '',
  gender: '',
  maritalStatus: '',
  smokerStatus: '',
  highestEducationLevel: '',
  occupation: '',
  grossMonthlyIncome: '',
  incomeCurrency: 'ZAR',
  emailAddress: '',
  mobileNumber: '',
  residentialAddress: { ...defaultResidentialAddressDraft },
};

export const createEmptySpouseDraft = (): OnboardingSpouseDraft => ({
  applicable: false,
  sameAsPrimaryApplicant: true,
  ...defaultApplicantDraft,
  residentialAddress: { ...defaultResidentialAddressDraft },
});

const defaultProfileDraft: OnboardingProfileDraft = {
  goals: [],
  primaryApplicant: {
    ...defaultApplicantDraft,
    residentialAddress: { ...defaultResidentialAddressDraft },
  },
  spouse: createEmptySpouseDraft(),
  consentAccepted: false,
  notificationsEnabled: false,
  accountConnectionChoice: 'manual',
};

const splitFullName = (fullName?: string | null) => {
  const trimmedName = (fullName ?? '').trim();
  if (!trimmedName) {
    return { firstName: '', surname: '' };
  }

  const [firstName, ...rest] = trimmedName.split(/\s+/);

  return {
    firstName,
    surname: rest.join(' '),
  };
};

const createProfileDraftFromProfile = (
  profile: ClientProfileDTO | null | undefined,
  fallbackEmail = '',
) => {
  const { firstName, surname } = splitFullName(profile?.fullName);

  return {
    ...defaultProfileDraft,
    primaryApplicant: {
      ...defaultApplicantDraft,
      firstName,
      surname,
      idNumber: profile?.idNumber ?? '',
      maritalStatus: profile?.maritalStatus ?? '',
      occupation: profile?.occupation ?? '',
      grossMonthlyIncome:
        profile?.annualIncome === undefined || profile?.annualIncome === null
          ? ''
          : String(profile.annualIncome),
      emailAddress: profile?.email ?? fallbackEmail,
      mobileNumber: profile?.mobileNumber ?? '',
      residentialAddress: {
        ...defaultResidentialAddressDraft,
        addressLine1: profile?.residentialAddress ?? '',
      },
    },
  };
};

const applyUserToState = (user: JwtResponse) => {
  const normalizedUser = normalizeAuthenticatedUser(user);
  const requiresOnboarding = normalizeAuthRole(normalizedUser.role) === 'CLIENT';
  apiService.setToken(normalizedUser.token ?? null);

  return {
    isAuthenticated: true,
    isAuthBootstrapping: false,
    isOnboardingComplete: !requiresOnboarding,
    onboardingStep: requiresOnboarding ? defaultOnboardingStep : 'summary' as OnboardingStep,
    user: normalizedUser,
    profile: null,
    profileDraft: createProfileDraftFromProfile(null, normalizedUser.email ?? ''),
  };
};

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  isAuthBootstrapping: true,
  isOnboardingComplete: false,
  onboardingStep: defaultOnboardingStep,
  user: null,
  profile: null,
  profileDraft: defaultProfileDraft,
  login: (user) => set(() => applyUserToState(user)),
  applyAuthenticatedUser: (user) => set(() => applyUserToState(user)),
  finishAuthBootstrap: () => set({ isAuthBootstrapping: false }),
  logout: () => {
    apiService.setToken(null);
    void clearPersistedAuthSession();
    set({
      isAuthenticated: false,
      isAuthBootstrapping: false,
      isOnboardingComplete: false,
      onboardingStep: defaultOnboardingStep,
      user: null,
      profile: null,
      profileDraft: defaultProfileDraft,
    });
  },
  setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
  completeOnboarding: () =>
    set({
      isOnboardingComplete: true,
      onboardingStep: 'summary',
    }),
  setProfile: (profile) =>
    set((state) => ({
      profile,
      profileDraft: {
        ...createProfileDraftFromProfile(profile, state.user?.email ?? ''),
        goals: state.profileDraft.goals,
        spouse: state.profileDraft.spouse,
        consentAccepted: state.profileDraft.consentAccepted,
        notificationsEnabled: state.profileDraft.notificationsEnabled,
        accountConnectionChoice: state.profileDraft.accountConnectionChoice,
      },
    })),
  setProfileDraft: (patch) =>
    set((state) => ({
      profileDraft: {
        ...state.profileDraft,
        ...patch,
      },
    })),
  setPrimaryApplicantDraft: (patch) =>
    set((state) => ({
      profileDraft: {
        ...state.profileDraft,
        primaryApplicant: {
          ...state.profileDraft.primaryApplicant,
          ...patch,
        },
      },
    })),
  setPrimaryApplicantAddressDraft: (patch) =>
    set((state) => ({
      profileDraft: {
        ...state.profileDraft,
        primaryApplicant: {
          ...state.profileDraft.primaryApplicant,
          residentialAddress: {
            ...state.profileDraft.primaryApplicant.residentialAddress,
            ...patch,
          },
        },
      },
    })),
  setSpouseDraft: (patch) =>
    set((state) => ({
      profileDraft: {
        ...state.profileDraft,
        spouse: {
          ...state.profileDraft.spouse,
          ...patch,
        },
      },
    })),
  setSpouseAddressDraft: (patch) =>
    set((state) => ({
      profileDraft: {
        ...state.profileDraft,
        spouse: {
          ...state.profileDraft.spouse,
          residentialAddress: {
            ...state.profileDraft.spouse.residentialAddress,
            ...patch,
          },
        },
      },
    })),
}));
