import { create } from 'zustand';
import { JwtResponse, ClientProfileDTO } from '../../clients/fNAPlatformAPIClient/models';

export type OnboardingStep =
  | 'welcome'
  | 'signupMethod'
  | 'verifyOtp'
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

export interface OnboardingProfileDraft {
  goals: string[];
  fullName: string;
  dateOfBirth: string;
  mobileNumber: string;
  email: string;
  residentialAddress: string;
  maritalStatus: string;
  numberOfDependants: string;
  employmentStatus: string;
  occupation: string;
  employer: string;
  annualIncome: string;
  spouseIncome: string;
  householdExpenses: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  debtEstimate: string;
  riskComfort: string;
  consentAccepted: boolean;
  notificationsEnabled: boolean;
  accountConnectionChoice: AccountConnectionChoice;
}

interface AppState {
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  onboardingStep: OnboardingStep;
  user: JwtResponse | null;
  profile: ClientProfileDTO | null;
  profileDraft: OnboardingProfileDraft;
  login: (user: JwtResponse) => void;
  logout: () => void;
  setOnboardingStep: (step: OnboardingStep) => void;
  completeOnboarding: () => void;
  setProfile: (profile: ClientProfileDTO) => void;
  setProfileDraft: (patch: Partial<OnboardingProfileDraft>) => void;
}

const defaultOnboardingStep: OnboardingStep = 'welcome';
const defaultProfileDraft: OnboardingProfileDraft = {
  goals: [],
  fullName: '',
  dateOfBirth: '',
  mobileNumber: '',
  email: '',
  residentialAddress: '',
  maritalStatus: '',
  numberOfDependants: '',
  employmentStatus: '',
  occupation: '',
  employer: '',
  annualIncome: '',
  spouseIncome: '',
  householdExpenses: '',
  monthlyIncome: '',
  monthlyExpenses: '',
  debtEstimate: '',
  riskComfort: '',
  consentAccepted: false,
  notificationsEnabled: false,
  accountConnectionChoice: 'manual',
};

const createProfileDraftFromProfile = (
  profile: ClientProfileDTO | null | undefined,
  fallbackEmail = '',
): OnboardingProfileDraft => ({
  ...defaultProfileDraft,
  fullName: profile?.fullName ?? '',
  dateOfBirth: profile?.dateOfBirth ?? '',
  mobileNumber: profile?.mobileNumber ?? '',
  email: profile?.email ?? fallbackEmail,
  residentialAddress: profile?.residentialAddress ?? '',
  maritalStatus: profile?.maritalStatus ?? '',
  numberOfDependants:
    profile?.numberOfDependants === undefined || profile?.numberOfDependants === null
      ? ''
      : String(profile.numberOfDependants),
  employmentStatus: profile?.employmentStatus ?? '',
  occupation: profile?.occupation ?? '',
  employer: profile?.employer ?? '',
  annualIncome:
    profile?.annualIncome === undefined || profile?.annualIncome === null
      ? ''
      : String(profile.annualIncome),
  spouseIncome:
    profile?.spouseIncome === undefined || profile?.spouseIncome === null
      ? ''
      : String(profile.spouseIncome),
  householdExpenses:
    profile?.householdExpenses === undefined || profile?.householdExpenses === null
      ? ''
      : String(profile.householdExpenses),
});

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  isOnboardingComplete: false,
  onboardingStep: defaultOnboardingStep,
  user: null,
  profile: null,
  profileDraft: defaultProfileDraft,
  login: (user) => {
    const requiresOnboarding = user.role === 'CLIENT';

    set({
      isAuthenticated: true,
      isOnboardingComplete: !requiresOnboarding,
      onboardingStep: requiresOnboarding ? defaultOnboardingStep : 'summary',
      user,
      profileDraft: createProfileDraftFromProfile(null, user.email ?? ''),
    });
  },
  logout: () =>
    set({
      isAuthenticated: false,
      isOnboardingComplete: false,
      onboardingStep: defaultOnboardingStep,
      user: null,
      profile: null,
      profileDraft: defaultProfileDraft,
    }),
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
        monthlyIncome: state.profileDraft.monthlyIncome,
        monthlyExpenses: state.profileDraft.monthlyExpenses,
        debtEstimate: state.profileDraft.debtEstimate,
        riskComfort: state.profileDraft.riskComfort,
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
}));
