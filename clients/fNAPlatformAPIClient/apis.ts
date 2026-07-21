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

export type GetCurrentProfileData = ProfileDTO;

export type SaveCurrentProfileData = ProfileDTO;

export type SaveSmokerStatusData = OnboardingStatusResponse;

export type SaveOccupationData = OnboardingStatusResponse;

export type SaveMaritalStatusData = OnboardingStatusResponse;

export type SaveLegalIdentityData = OnboardingStatusResponse;

export type SaveIncomeData = OnboardingStatusResponse;

export type SaveIdNumberData = OnboardingStatusResponse;

export type SaveGenderData = OnboardingStatusResponse;

export type SaveEducationData = OnboardingStatusResponse;

export type SaveAddressData = OnboardingStatusResponse;

export interface GetAssignmentParams {
  /**
   * UUID of the client profile
   * @format uuid
   */
  clientProfileId: string;
}

export type GetAssignmentData = AdviserAssignmentResponse;

export interface UpsertAssignmentParams {
  /**
   * UUID of the client profile
   * @format uuid
   */
  clientProfileId: string;
}

export type UpsertAssignmentData = AdviserAssignmentResponse;

export interface DeleteAssignmentParams {
  /**
   * UUID of the client profile
   * @format uuid
   */
  clientProfileId: string;
}

export type DeleteAssignmentData = any;

export interface GetRiskProfileParams {
  /**
   * UUID of the profile
   * @format uuid
   */
  profileId: string;
}

export type GetRiskProfileData = RiskProfileDTO;

/** Map of question identifiers to scores */
export type SubmitRiskProfilePayload = Record<string, number>;

export interface SubmitRiskProfileParams {
  /**
   * UUID of the profile
   * @format uuid
   */
  profileId: string;
}

export type SubmitRiskProfileData = RiskProfileDTO;

export interface GetProfileParams {
  /**
   * UUID of the user
   * @format uuid
   */
  userId: string;
}

export type GetProfileData = ClientProfileDTO;

export interface CreateOrUpdateProfileParams {
  /**
   * UUID of the user
   * @format uuid
   */
  userId: string;
}

export type CreateOrUpdateProfileData = ClientProfileDTO;

export interface RequestVerificationParams {
  channel: string;
}

export type RequestVerificationData = VerificationChallengeResponse;

export type ConfirmMobileData = OnboardingStatusResponse;

export type ConfirmEmailData = OnboardingStatusResponse;

export type CompleteData = OnboardingStatusResponse;

export interface GetFinancialDataParams {
  /**
   * UUID of the profile
   * @format uuid
   */
  profileId: string;
}

export type GetFinancialDataData = FinancialDataDTO;

export interface CreateOrUpdateFinancialDataParams {
  /**
   * UUID of the profile
   * @format uuid
   */
  profileId: string;
}

export type CreateOrUpdateFinancialDataData = FinancialDataDTO;

export type RegisterData = SignupResponse;

export type LoginData = LoginResponse;

export type PingData = string;

export type GetStatusData = OnboardingStatusResponse;

export interface GetBudgetHealthParams {
  /**
   * UUID of the profile
   * @format uuid
   */
  profileId: string;
}

export type GetBudgetHealthData = BudgetHealthAnalysisDTO;

export type CurrentUserData = JwtResponse;

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8080",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title FNA Platform API
 * @version v1.0.0
 * @license Apache 2.0 (http://springdoc.org)
 * @baseUrl http://localhost:8080
 * @contact Tech Team <tech@momentum-aligned.com>
 *
 * AI Financial Advisor Platform API Documentation
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Returns the authenticated user's profile using the nested primary-applicant and spouse data model.
     *
     * @tags Profile
     * @name GetCurrentProfile
     * @summary Get Current Profile
     * @request GET:/api/v1/profile/me
     * @secure
     * @response `200` `GetCurrentProfileData` Profile retrieved successfully
     * @response `401` `void` Authentication required
     * @response `404` `void` Profile not found
     */
    getCurrentProfile: (params: RequestParams = {}) =>
      this.request<GetCurrentProfileData, void>({
        path: `/api/v1/profile/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates or updates the authenticated user's profile using the frontend profile data model.
     *
     * @tags Profile
     * @name SaveCurrentProfile
     * @summary Save Current Profile
     * @request PUT:/api/v1/profile/me
     * @secure
     * @response `200` `SaveCurrentProfileData` Profile saved successfully
     * @response `400` `void` Validation failed
     * @response `401` `void` Authentication required
     */
    saveCurrentProfile: (data: ProfileDTO, params: RequestParams = {}) =>
      this.request<SaveCurrentProfileData, void>({
        path: `/api/v1/profile/me`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags onboarding-controller
     * @name SaveSmokerStatus
     * @request PUT:/api/v1/onboarding/me/smoker-status
     * @secure
     * @response `200` `SaveSmokerStatusData` OK
     */
    saveSmokerStatus: (data: SmokerStatusRequest, params: RequestParams = {}) =>
      this.request<SaveSmokerStatusData, any>({
        path: `/api/v1/onboarding/me/smoker-status`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags onboarding-controller
     * @name SaveOccupation
     * @request PUT:/api/v1/onboarding/me/occupation
     * @secure
     * @response `200` `SaveOccupationData` OK
     */
    saveOccupation: (data: OccupationRequest, params: RequestParams = {}) =>
      this.request<SaveOccupationData, any>({
        path: `/api/v1/onboarding/me/occupation`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags onboarding-controller
     * @name SaveMaritalStatus
     * @request PUT:/api/v1/onboarding/me/marital-status
     * @secure
     * @response `200` `SaveMaritalStatusData` OK
     */
    saveMaritalStatus: (
      data: MaritalStatusRequest,
      params: RequestParams = {},
    ) =>
      this.request<SaveMaritalStatusData, any>({
        path: `/api/v1/onboarding/me/marital-status`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags onboarding-controller
     * @name SaveLegalIdentity
     * @request PUT:/api/v1/onboarding/me/legal-identity
     * @secure
     * @response `200` `SaveLegalIdentityData` OK
     */
    saveLegalIdentity: (
      data: LegalIdentityRequest,
      params: RequestParams = {},
    ) =>
      this.request<SaveLegalIdentityData, any>({
        path: `/api/v1/onboarding/me/legal-identity`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags onboarding-controller
     * @name SaveIncome
     * @request PUT:/api/v1/onboarding/me/income
     * @secure
     * @response `200` `SaveIncomeData` OK
     */
    saveIncome: (data: IncomeRequest, params: RequestParams = {}) =>
      this.request<SaveIncomeData, any>({
        path: `/api/v1/onboarding/me/income`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags onboarding-controller
     * @name SaveIdNumber
     * @request PUT:/api/v1/onboarding/me/id-number
     * @secure
     * @response `200` `SaveIdNumberData` OK
     */
    saveIdNumber: (data: IdNumberRequest, params: RequestParams = {}) =>
      this.request<SaveIdNumberData, any>({
        path: `/api/v1/onboarding/me/id-number`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags onboarding-controller
     * @name SaveGender
     * @request PUT:/api/v1/onboarding/me/gender
     * @secure
     * @response `200` `SaveGenderData` OK
     */
    saveGender: (data: GenderRequest, params: RequestParams = {}) =>
      this.request<SaveGenderData, any>({
        path: `/api/v1/onboarding/me/gender`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags onboarding-controller
     * @name SaveEducation
     * @request PUT:/api/v1/onboarding/me/education
     * @secure
     * @response `200` `SaveEducationData` OK
     */
    saveEducation: (data: EducationLevelRequest, params: RequestParams = {}) =>
      this.request<SaveEducationData, any>({
        path: `/api/v1/onboarding/me/education`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags onboarding-controller
     * @name SaveAddress
     * @request PUT:/api/v1/onboarding/me/address
     * @secure
     * @response `200` `SaveAddressData` OK
     */
    saveAddress: (data: AddressRequest, params: RequestParams = {}) =>
      this.request<SaveAddressData, any>({
        path: `/api/v1/onboarding/me/address`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Adviser Assignments
     * @name GetAssignment
     * @summary Get Adviser Assignment
     * @request GET:/api/v1/admin/adviser-assignments/{clientProfileId}
     * @secure
     * @response `200` `GetAssignmentData` OK
     */
    getAssignment: (
      { clientProfileId }: GetAssignmentParams,
      params: RequestParams = {},
    ) =>
      this.request<GetAssignmentData, any>({
        path: `/api/v1/admin/adviser-assignments/${clientProfileId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Adviser Assignments
     * @name UpsertAssignment
     * @summary Assign or Reassign Adviser
     * @request PUT:/api/v1/admin/adviser-assignments/{clientProfileId}
     * @secure
     * @response `200` `UpsertAssignmentData` OK
     */
    upsertAssignment: (
      { clientProfileId }: UpsertAssignmentParams,
      data: UpsertAdviserAssignmentRequest,
      params: RequestParams = {},
    ) =>
      this.request<UpsertAssignmentData, any>({
        path: `/api/v1/admin/adviser-assignments/${clientProfileId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Adviser Assignments
     * @name DeleteAssignment
     * @summary Delete Adviser Assignment
     * @request DELETE:/api/v1/admin/adviser-assignments/{clientProfileId}
     * @secure
     * @response `200` `DeleteAssignmentData` OK
     */
    deleteAssignment: (
      { clientProfileId }: DeleteAssignmentParams,
      params: RequestParams = {},
    ) =>
      this.request<DeleteAssignmentData, any>({
        path: `/api/v1/admin/adviser-assignments/${clientProfileId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieves the risk profile for the specified profile ID.
     *
     * @tags Risk Profile
     * @name GetRiskProfile
     * @summary Get Risk Profile
     * @request GET:/api/v1/risk-profile/{profileId}
     * @secure
     * @response `200` `GetRiskProfileData` Successfully retrieved risk profile
     * @response `401` `void` Unauthorized access
     * @response `403` `void` Forbidden access
     * @response `404` `void` Risk profile not found
     */
    getRiskProfile: (
      { profileId }: GetRiskProfileParams,
      params: RequestParams = {},
    ) =>
      this.request<GetRiskProfileData, void>({
        path: `/api/v1/risk-profile/${profileId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Submits questionnaire answers to calculate the risk profile score and category.
     *
     * @tags Risk Profile
     * @name SubmitRiskProfile
     * @summary Submit Risk Profile Answers
     * @request POST:/api/v1/risk-profile/{profileId}
     * @secure
     * @response `200` `SubmitRiskProfileData` Successfully processed risk profile answers
     * @response `400` `void` Invalid request payload
     * @response `401` `void` Unauthorized access
     * @response `403` `void` Forbidden access
     */
    submitRiskProfile: (
      { profileId }: SubmitRiskProfileParams,
      data: SubmitRiskProfilePayload,
      params: RequestParams = {},
    ) =>
      this.request<SubmitRiskProfileData, void>({
        path: `/api/v1/risk-profile/${profileId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves the client profile for the specified user ID.
     *
     * @tags Client Profile
     * @name GetProfile
     * @summary Get Client Profile
     * @request GET:/api/v1/profile/{userId}
     * @secure
     * @response `200` `GetProfileData` Successfully retrieved client profile
     * @response `401` `void` Unauthorized access
     * @response `403` `void` Forbidden access
     * @response `404` `void` Client profile not found
     */
    getProfile: ({ userId }: GetProfileParams, params: RequestParams = {}) =>
      this.request<GetProfileData, void>({
        path: `/api/v1/profile/${userId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates or updates the client profile for the specified user ID.
     *
     * @tags Client Profile
     * @name CreateOrUpdateProfile
     * @summary Create or Update Client Profile
     * @request POST:/api/v1/profile/{userId}
     * @secure
     * @response `200` `CreateOrUpdateProfileData` Successfully created or updated client profile
     * @response `400` `void` Invalid request payload
     * @response `401` `void` Unauthorized access
     * @response `403` `void` Forbidden access
     */
    createOrUpdateProfile: (
      { userId }: CreateOrUpdateProfileParams,
      data: ClientProfileDTO,
      params: RequestParams = {},
    ) =>
      this.request<CreateOrUpdateProfileData, void>({
        path: `/api/v1/profile/${userId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags onboarding-controller
     * @name RequestVerification
     * @request POST:/api/v1/onboarding/me/verification/{channel}/request
     * @secure
     * @response `200` `RequestVerificationData` OK
     */
    requestVerification: (
      { channel }: RequestVerificationParams,
      params: RequestParams = {},
    ) =>
      this.request<RequestVerificationData, any>({
        path: `/api/v1/onboarding/me/verification/${channel}/request`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags onboarding-controller
     * @name ConfirmMobile
     * @request POST:/api/v1/onboarding/me/verification/mobile/confirm
     * @secure
     * @response `200` `ConfirmMobileData` OK
     */
    confirmMobile: (
      data: VerificationConfirmRequest,
      params: RequestParams = {},
    ) =>
      this.request<ConfirmMobileData, any>({
        path: `/api/v1/onboarding/me/verification/mobile/confirm`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags onboarding-controller
     * @name ConfirmEmail
     * @request POST:/api/v1/onboarding/me/verification/email/confirm
     * @secure
     * @response `200` `ConfirmEmailData` OK
     */
    confirmEmail: (
      data: VerificationConfirmRequest,
      params: RequestParams = {},
    ) =>
      this.request<ConfirmEmailData, any>({
        path: `/api/v1/onboarding/me/verification/email/confirm`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags onboarding-controller
     * @name Complete
     * @request POST:/api/v1/onboarding/me/complete
     * @secure
     * @response `200` `CompleteData` OK
     */
    complete: (params: RequestParams = {}) =>
      this.request<CompleteData, any>({
        path: `/api/v1/onboarding/me/complete`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieves the financial data for the specified profile ID.
     *
     * @tags Financial Data
     * @name GetFinancialData
     * @summary Get Financial Data
     * @request GET:/api/v1/financial-data/{profileId}
     * @secure
     * @response `200` `GetFinancialDataData` Successfully retrieved financial data
     * @response `401` `void` Unauthorized access
     * @response `403` `void` Forbidden access
     * @response `404` `void` Financial data not found
     */
    getFinancialData: (
      { profileId }: GetFinancialDataParams,
      params: RequestParams = {},
    ) =>
      this.request<GetFinancialDataData, void>({
        path: `/api/v1/financial-data/${profileId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates or updates the financial data for the specified profile ID.
     *
     * @tags Financial Data
     * @name CreateOrUpdateFinancialData
     * @summary Create or Update Financial Data
     * @request POST:/api/v1/financial-data/{profileId}
     * @secure
     * @response `200` `CreateOrUpdateFinancialDataData` Successfully created or updated financial data
     * @response `400` `void` Invalid request payload
     * @response `401` `void` Unauthorized access
     * @response `403` `void` Forbidden access
     */
    createOrUpdateFinancialData: (
      { profileId }: CreateOrUpdateFinancialDataParams,
      data: FinancialDataDTO,
      params: RequestParams = {},
    ) =>
      this.request<CreateOrUpdateFinancialDataData, void>({
        path: `/api/v1/financial-data/${profileId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a Keycloak user and the linked local draft profile.
     *
     * @tags Authentication
     * @name Register
     * @summary Registration
     * @request POST:/api/v1/auth/register
     * @secure
     * @response `201` `RegisterData` User provisioned successfully
     * @response `409` `void` Email already exists
     */
    register: (data: SignupRequest, params: RequestParams = {}) =>
      this.request<RegisterData, void>({
        path: `/api/v1/auth/register`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Exchanges email and password for a Keycloak token and returns the linked local user.
     *
     * @tags Authentication
     * @name Login
     * @summary Login
     * @request POST:/api/v1/auth/login
     * @secure
     * @response `200` `LoginData` Authentication succeeded
     * @response `401` `void` Invalid credentials
     * @response `403` `void` Local account is not active
     * @response `409` `void` Keycloak account is not provisioned locally
     */
    login: (data: LoginRequest, params: RequestParams = {}) =>
      this.request<LoginData, void>({
        path: `/api/v1/auth/login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Health
     * @name Ping
     * @summary Ping the server to check connectivity
     * @request GET:/api/v1/ping
     * @secure
     * @response `200` `PingData` OK
     */
    ping: (params: RequestParams = {}) =>
      this.request<PingData, any>({
        path: `/api/v1/ping`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags onboarding-controller
     * @name GetStatus
     * @request GET:/api/v1/onboarding/me
     * @secure
     * @response `200` `GetStatusData` OK
     */
    getStatus: (params: RequestParams = {}) =>
      this.request<GetStatusData, any>({
        path: `/api/v1/onboarding/me`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Calculates budget health based on monthly income and expenses.
     *
     * @tags Financial Data
     * @name GetBudgetHealth
     * @summary Get Budget Health
     * @request GET:/api/v1/financial-data/{profileId}/budget-health
     * @secure
     * @response `200` `GetBudgetHealthData` Successfully calculated budget health
     * @response `400` `void` Budget health inputs are missing or invalid
     * @response `401` `void` Unauthorized access
     * @response `403` `void` Forbidden access
     * @response `404` `void` Financial data not found
     * @response `409` `void` Onboarding incomplete
     */
    getBudgetHealth: (
      { profileId }: GetBudgetHealthParams,
      params: RequestParams = {},
    ) =>
      this.request<GetBudgetHealthData, void>({
        path: `/api/v1/financial-data/${profileId}/budget-health`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the current authenticated local user linked to the Keycloak token.
     *
     * @tags Authentication
     * @name CurrentUser
     * @summary Current User
     * @request GET:/api/v1/auth/me
     * @secure
     * @response `200` `CurrentUserData` Current user resolved successfully
     * @response `401` `void` Authentication required
     */
    currentUser: (params: RequestParams = {}) =>
      this.request<CurrentUserData, void>({
        path: `/api/v1/auth/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
