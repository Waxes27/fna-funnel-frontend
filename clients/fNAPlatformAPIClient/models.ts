/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AddressDTO {
  /**
   * @minLength 0
   * @maxLength 255
   */
  addressLine1: string;
  /**
   * @minLength 0
   * @maxLength 255
   */
  addressLine2?: string;
  /**
   * @minLength 0
   * @maxLength 100
   */
  suburb: string;
  /**
   * @minLength 0
   * @maxLength 100
   */
  city: string;
  /**
   * @minLength 0
   * @maxLength 100
   */
  province: string;
  /**
   * @minLength 0
   * @maxLength 20
   */
  postalCode: string;
  /**
   * @minLength 0
   * @maxLength 100
   */
  country: string;
}

export interface ApplicantProfileDTO {
  title: "MR" | "MRS" | "MS" | "MISS" | "DR" | "PROF" | "OTHER";
  /**
   * @minLength 0
   * @maxLength 100
   */
  firstName: string;
  /**
   * @minLength 0
   * @maxLength 100
   */
  surname: string;
  /**
   * @minLength 0
   * @maxLength 50
   * @pattern ^(?!0+$)[A-Za-z0-9-]{6,50}$
   */
  idNumber: string;
  gender: "MALE" | "FEMALE" | "NON_BINARY" | "OTHER" | "PREFER_NOT_TO_SAY";
  maritalStatus:
    | "SINGLE"
    | "MARRIED"
    | "DIVORCED"
    | "WIDOWED"
    | "SEPARATED"
    | "LIFE_PARTNERSHIP"
    | "OTHER";
  /**
   * @minLength 0
   * @maxLength 100
   */
  occupation: string;
  /** @min 0 */
  grossMonthlyIncome: number;
  /**
   * @minLength 0
   * @maxLength 10
   */
  incomeCurrency: string;
  /**
   * @minLength 0
   * @maxLength 255
   */
  emailAddress: string;
  /**
   * @minLength 0
   * @maxLength 30
   */
  mobileNumber: string;
  residentialAddress: AddressDTO;
  smokerStatus: "SMOKER" | "NON_SMOKER" | "FORMER_SMOKER";
  highestEducationLevel:
    | "NO_FORMAL_EDUCATION"
    | "PRIMARY_SCHOOL"
    | "PRIMARY"
    | "SOME_HIGH_SCHOOL"
    | "SECONDARY"
    | "MATRIC"
    | "CERTIFICATE"
    | "DIPLOMA"
    | "BACHELORS_DEGREE"
    | "DEGREE"
    | "HONOURS_DEGREE"
    | "MASTERS_DEGREE"
    | "POSTGRADUATE"
    | "DOCTORAL_DEGREE"
    | "OTHER";
}

export interface ProfileDTO {
  primaryApplicant: ApplicantProfileDTO;
  spouse?: SpouseProfileDTO;
}

export interface SpouseAddressDTO {
  sameAsPrimaryApplicant?: boolean;
  addressLine1?: string;
  addressLine2?: string;
  suburb?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

export interface SpouseProfileDTO {
  applicable?: boolean;
  title?: "MR" | "MRS" | "MS" | "MISS" | "DR" | "PROF" | "OTHER";
  firstName?: string;
  surname?: string;
  idNumber?: string;
  gender?: "MALE" | "FEMALE" | "NON_BINARY" | "OTHER" | "PREFER_NOT_TO_SAY";
  maritalStatus?:
    | "SINGLE"
    | "MARRIED"
    | "DIVORCED"
    | "WIDOWED"
    | "SEPARATED"
    | "LIFE_PARTNERSHIP"
    | "OTHER";
  occupation?: string;
  grossMonthlyIncome?: number;
  incomeCurrency?: string;
  emailAddress?: string;
  mobileNumber?: string;
  residentialAddress?: SpouseAddressDTO;
  smokerStatus?: "SMOKER" | "NON_SMOKER" | "FORMER_SMOKER";
  highestEducationLevel?:
    | "NO_FORMAL_EDUCATION"
    | "PRIMARY_SCHOOL"
    | "PRIMARY"
    | "SOME_HIGH_SCHOOL"
    | "SECONDARY"
    | "MATRIC"
    | "CERTIFICATE"
    | "DIPLOMA"
    | "BACHELORS_DEGREE"
    | "DEGREE"
    | "HONOURS_DEGREE"
    | "MASTERS_DEGREE"
    | "POSTGRADUATE"
    | "DOCTORAL_DEGREE"
    | "OTHER";
}

export interface SmokerStatusRequest {
  smokerStatus: "SMOKER" | "NON_SMOKER" | "FORMER_SMOKER";
}

export interface OnboardingStatusResponse {
  /** @format uuid */
  userId?: string;
  onboardingStatus?: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
  currentStep?:
    | "LEGAL_IDENTITY"
    | "ID_NUMBER"
    | "GENDER"
    | "OCCUPATION"
    | "GROSS_MONTHLY_INCOME"
    | "MARITAL_STATUS"
    | "EMAIL_VERIFICATION"
    | "MOBILE_VERIFICATION"
    | "RESIDENTIAL_ADDRESS"
    | "SMOKER_STATUS"
    | "HIGHEST_EDUCATION_LEVEL"
    | "COMPLETE";
  emailVerified?: boolean;
  mobileVerified?: boolean;
  canAccessFinancialWorkflows?: boolean;
  email?: string;
  mobileNumber?: string;
  firstName?: string;
  lastName?: string;
  idNumber?: string;
  grossMonthlyIncome?: number;
  address?: ResidentialAddress;
  /** @format date-time */
  completedAt?: string;
}

export interface ResidentialAddress {
  line1?: string;
  line2?: string;
  suburb?: string;
  city?: string;
  provinceOrState?: string;
  postalCode?: string;
  country?: string;
  displayValue?: string;
}

export interface OccupationRequest {
  /**
   * @minLength 0
   * @maxLength 100
   */
  occupation: string;
}

export interface MaritalStatusRequest {
  maritalStatus:
    | "SINGLE"
    | "MARRIED"
    | "DIVORCED"
    | "WIDOWED"
    | "SEPARATED"
    | "LIFE_PARTNERSHIP"
    | "OTHER";
}

export interface LegalIdentityRequest {
  title: "MR" | "MRS" | "MS" | "MISS" | "DR" | "PROF" | "OTHER";
  /**
   * @minLength 0
   * @maxLength 100
   */
  firstName: string;
  /**
   * @minLength 0
   * @maxLength 100
   */
  lastName: string;
}

export interface IncomeRequest {
  /** @min 0.01 */
  grossMonthlyIncome: number;
}

export interface IdNumberRequest {
  /**
   * @minLength 0
   * @maxLength 50
   * @pattern ^(?!0+$)[A-Za-z0-9-]{6,50}$
   */
  idNumber: string;
}

export interface GenderRequest {
  gender: "MALE" | "FEMALE" | "NON_BINARY" | "OTHER" | "PREFER_NOT_TO_SAY";
}

export interface EducationLevelRequest {
  highestEducationLevel:
    | "NO_FORMAL_EDUCATION"
    | "PRIMARY_SCHOOL"
    | "PRIMARY"
    | "SOME_HIGH_SCHOOL"
    | "SECONDARY"
    | "MATRIC"
    | "CERTIFICATE"
    | "DIPLOMA"
    | "BACHELORS_DEGREE"
    | "DEGREE"
    | "HONOURS_DEGREE"
    | "MASTERS_DEGREE"
    | "POSTGRADUATE"
    | "DOCTORAL_DEGREE"
    | "OTHER";
}

export interface AddressRequest {
  /**
   * @minLength 0
   * @maxLength 255
   */
  line1: string;
  /**
   * @minLength 0
   * @maxLength 255
   */
  line2?: string;
  /**
   * @minLength 0
   * @maxLength 100
   */
  suburb?: string;
  /**
   * @minLength 0
   * @maxLength 100
   */
  city: string;
  /**
   * @minLength 0
   * @maxLength 100
   */
  provinceOrState?: string;
  /**
   * @minLength 0
   * @maxLength 20
   */
  postalCode: string;
  /**
   * @minLength 0
   * @maxLength 100
   */
  country: string;
}

export interface UpsertAdviserAssignmentRequest {
  /** @format uuid */
  adviserUserId: string;
}

export interface AdviserAssignmentResponse {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  clientProfileId?: string;
  /** @format uuid */
  clientUserId?: string;
  /** @format uuid */
  adviserUserId?: string;
  adviserEmail?: string;
  /** @format uuid */
  assignedByUserId?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface RiskProfileDTO {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  profileId?: string;
  /** @format int32 */
  score?: number;
  category?: string;
  answers?: Record<string, number>;
}

export interface ClientProfileDTO {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  userId?: string;
  title?: "MR" | "MRS" | "MS" | "MISS" | "DR" | "PROF" | "OTHER";
  firstName?: string;
  lastName?: string;
  fullName?: string;
  /** @format date */
  dateOfBirth?: string;
  idNumber?: string;
  gender?: "MALE" | "FEMALE" | "NON_BINARY" | "OTHER" | "PREFER_NOT_TO_SAY";
  maritalStatus?:
    | "SINGLE"
    | "MARRIED"
    | "DIVORCED"
    | "WIDOWED"
    | "SEPARATED"
    | "LIFE_PARTNERSHIP"
    | "OTHER";
  /** @format int32 */
  numberOfDependants?: number;
  mobileNumber?: string;
  email?: string;
  address?: ResidentialAddress;
  residentialAddress?: string;
  employmentStatus?: string;
  occupation?: string;
  employer?: string;
  grossMonthlyIncome?: number;
  annualIncome?: number;
  spouseIncome?: number;
  householdExpenses?: number;
  smokerStatus?: "SMOKER" | "NON_SMOKER" | "FORMER_SMOKER";
  highestEducationLevel?:
    | "NO_FORMAL_EDUCATION"
    | "PRIMARY_SCHOOL"
    | "PRIMARY"
    | "SOME_HIGH_SCHOOL"
    | "SECONDARY"
    | "MATRIC"
    | "CERTIFICATE"
    | "DIPLOMA"
    | "BACHELORS_DEGREE"
    | "DEGREE"
    | "HONOURS_DEGREE"
    | "MASTERS_DEGREE"
    | "POSTGRADUATE"
    | "DOCTORAL_DEGREE"
    | "OTHER";
  onboardingStatus?: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
  currentOnboardingStep?:
    | "LEGAL_IDENTITY"
    | "ID_NUMBER"
    | "GENDER"
    | "OCCUPATION"
    | "GROSS_MONTHLY_INCOME"
    | "MARITAL_STATUS"
    | "EMAIL_VERIFICATION"
    | "MOBILE_VERIFICATION"
    | "RESIDENTIAL_ADDRESS"
    | "SMOKER_STATUS"
    | "HIGHEST_EDUCATION_LEVEL"
    | "COMPLETE";
  /** @format date-time */
  emailVerifiedAt?: string;
  /** @format date-time */
  mobileVerifiedAt?: string;
  /** @format date-time */
  completedAt?: string;
}

export interface VerificationChallengeResponse {
  channel?: string;
  maskedDestination?: string;
  providerReference?: string;
  /** @format date-time */
  expiresAt?: string;
  debugCode?: string;
}

export interface VerificationConfirmRequest {
  /** @pattern ^[0-9]{6}$ */
  code: string;
}

export interface AssetDTO {
  type?: string;
  value?: number;
  description?: string;
}

export interface FinancialDataDTO {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  profileId?: string;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  assets?: AssetDTO[];
  liabilities?: LiabilityDTO[];
}

export interface LiabilityDTO {
  type?: string;
  balance?: number;
  monthlyPayment?: number;
  description?: string;
}

export interface SignupRequest {
  /**
   * @minLength 0
   * @maxLength 100
   */
  firstName: string;
  /**
   * @minLength 0
   * @maxLength 100
   */
  lastName: string;
  email: string;
  /** @pattern ^\+?[1-9][0-9]{7,14}$ */
  mobileNumber: string;
  /**
   * @minLength 8
   * @maxLength 2147483647
   */
  password: string;
  role?: string;
}

export interface SignupResponse {
  id?: string;
  email?: string;
  role?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  refreshToken?: string;
  /** @format int64 */
  expiresIn?: number;
  /** @format int64 */
  refreshExpiresIn?: number;
  type?: string;
  id?: string;
  email?: string;
  role?: string;
}

export interface BudgetHealthAnalysisDTO {
  /** @format uuid */
  profileId?: string;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  monthlySurplus?: number;
  savingsRatePct?: number;
  expenseRatioPct?: number;
  /** @format int32 */
  score?: number;
  category?: "CRITICAL" | "STRETCHED" | "STABLE" | "HEALTHY";
  breakdown?: CashFlowBreakdownItemDTO[];
}

export interface CashFlowBreakdownItemDTO {
  key?: string;
  label?: string;
  amount?: number;
}

export interface JwtResponse {
  token?: string;
  type?: string;
  id?: string;
  email?: string;
  role?: string;
}
