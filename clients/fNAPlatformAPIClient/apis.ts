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

import {
  AddressRequest,
  AdviserAssignmentResponse,
  BudgetHealthAnalysisDTO,
  ClientProfileDTO,
  EducationLevelRequest,
  FinancialDataDTO,
  GenderRequest,
  IdNumberRequest,
  IncomeRequest,
  JwtResponse,
  LegalIdentityRequest,
  LoginRequest,
  LoginResponse,
  MaritalStatusRequest,
  OccupationRequest,
  OnboardingStatusResponse,
  ProfileDTO,
  RiskProfileDTO,
  SignupRequest,
  SignupResponse,
  SmokerStatusRequest,
  UpsertAdviserAssignmentRequest,
  VerificationChallengeResponse,
  VerificationConfirmRequest,
} from "./models";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Returns the authenticated user's profile using the nested primary-applicant and spouse data model.
   *
   * @tags Profile
   * @name GetCurrentProfile
   * @summary Get Current Profile
   * @request GET:/api/v1/profile/me
   * @secure
   */
  getCurrentProfile = (params: RequestParams = {}) =>
    this.request<ProfileDTO, void>({
      path: `/api/v1/profile/me`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Creates or updates the authenticated user's profile using the frontend profile data model.
   *
   * @tags Profile
   * @name SaveCurrentProfile
   * @summary Save Current Profile
   * @request PUT:/api/v1/profile/me
   * @secure
   */
  saveCurrentProfile = (data: ProfileDTO, params: RequestParams = {}) =>
    this.request<ProfileDTO, void>({
      path: `/api/v1/profile/me`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags onboarding-controller
   * @name SaveSmokerStatus
   * @request PUT:/api/v1/onboarding/me/smoker-status
   * @secure
   */
  saveSmokerStatus = (data: SmokerStatusRequest, params: RequestParams = {}) =>
    this.request<OnboardingStatusResponse, any>({
      path: `/api/v1/onboarding/me/smoker-status`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags onboarding-controller
   * @name SaveOccupation
   * @request PUT:/api/v1/onboarding/me/occupation
   * @secure
   */
  saveOccupation = (data: OccupationRequest, params: RequestParams = {}) =>
    this.request<OnboardingStatusResponse, any>({
      path: `/api/v1/onboarding/me/occupation`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags onboarding-controller
   * @name SaveMaritalStatus
   * @request PUT:/api/v1/onboarding/me/marital-status
   * @secure
   */
  saveMaritalStatus = (
    data: MaritalStatusRequest,
    params: RequestParams = {},
  ) =>
    this.request<OnboardingStatusResponse, any>({
      path: `/api/v1/onboarding/me/marital-status`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags onboarding-controller
   * @name SaveLegalIdentity
   * @request PUT:/api/v1/onboarding/me/legal-identity
   * @secure
   */
  saveLegalIdentity = (
    data: LegalIdentityRequest,
    params: RequestParams = {},
  ) =>
    this.request<OnboardingStatusResponse, any>({
      path: `/api/v1/onboarding/me/legal-identity`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags onboarding-controller
   * @name SaveIncome
   * @request PUT:/api/v1/onboarding/me/income
   * @secure
   */
  saveIncome = (data: IncomeRequest, params: RequestParams = {}) =>
    this.request<OnboardingStatusResponse, any>({
      path: `/api/v1/onboarding/me/income`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags onboarding-controller
   * @name SaveIdNumber
   * @request PUT:/api/v1/onboarding/me/id-number
   * @secure
   */
  saveIdNumber = (data: IdNumberRequest, params: RequestParams = {}) =>
    this.request<OnboardingStatusResponse, any>({
      path: `/api/v1/onboarding/me/id-number`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags onboarding-controller
   * @name SaveGender
   * @request PUT:/api/v1/onboarding/me/gender
   * @secure
   */
  saveGender = (data: GenderRequest, params: RequestParams = {}) =>
    this.request<OnboardingStatusResponse, any>({
      path: `/api/v1/onboarding/me/gender`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags onboarding-controller
   * @name SaveEducation
   * @request PUT:/api/v1/onboarding/me/education
   * @secure
   */
  saveEducation = (data: EducationLevelRequest, params: RequestParams = {}) =>
    this.request<OnboardingStatusResponse, any>({
      path: `/api/v1/onboarding/me/education`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags onboarding-controller
   * @name SaveAddress
   * @request PUT:/api/v1/onboarding/me/address
   * @secure
   */
  saveAddress = (data: AddressRequest, params: RequestParams = {}) =>
    this.request<OnboardingStatusResponse, any>({
      path: `/api/v1/onboarding/me/address`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Adviser Assignments
   * @name GetAssignment
   * @summary Get Adviser Assignment
   * @request GET:/api/v1/admin/adviser-assignments/{clientProfileId}
   * @secure
   */
  getAssignment = (clientProfileId: string, params: RequestParams = {}) =>
    this.request<AdviserAssignmentResponse, any>({
      path: `/api/v1/admin/adviser-assignments/${clientProfileId}`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Adviser Assignments
   * @name UpsertAssignment
   * @summary Assign or Reassign Adviser
   * @request PUT:/api/v1/admin/adviser-assignments/{clientProfileId}
   * @secure
   */
  upsertAssignment = (
    clientProfileId: string,
    data: UpsertAdviserAssignmentRequest,
    params: RequestParams = {},
  ) =>
    this.request<AdviserAssignmentResponse, any>({
      path: `/api/v1/admin/adviser-assignments/${clientProfileId}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Adviser Assignments
   * @name DeleteAssignment
   * @summary Delete Adviser Assignment
   * @request DELETE:/api/v1/admin/adviser-assignments/{clientProfileId}
   * @secure
   */
  deleteAssignment = (clientProfileId: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/admin/adviser-assignments/${clientProfileId}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Retrieves the risk profile for the specified profile ID.
   *
   * @tags Risk Profile
   * @name GetRiskProfile
   * @summary Get Risk Profile
   * @request GET:/api/v1/risk-profile/{profileId}
   * @secure
   */
  getRiskProfile = (profileId: string, params: RequestParams = {}) =>
    this.request<RiskProfileDTO, void>({
      path: `/api/v1/risk-profile/${profileId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Submits questionnaire answers to calculate the risk profile score and category.
   *
   * @tags Risk Profile
   * @name SubmitRiskProfile
   * @summary Submit Risk Profile Answers
   * @request POST:/api/v1/risk-profile/{profileId}
   * @secure
   */
  submitRiskProfile = (
    profileId: string,
    data: Record<string, number>,
    params: RequestParams = {},
  ) =>
    this.request<RiskProfileDTO, void>({
      path: `/api/v1/risk-profile/${profileId}`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Retrieves the client profile for the specified user ID.
   *
   * @tags Client Profile
   * @name GetProfile
   * @summary Get Client Profile
   * @request GET:/api/v1/profile/{userId}
   * @secure
   */
  getProfile = (userId: string, params: RequestParams = {}) =>
    this.request<ClientProfileDTO, void>({
      path: `/api/v1/profile/${userId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Creates or updates the client profile for the specified user ID.
   *
   * @tags Client Profile
   * @name CreateOrUpdateProfile
   * @summary Create or Update Client Profile
   * @request POST:/api/v1/profile/{userId}
   * @secure
   */
  createOrUpdateProfile = (
    userId: string,
    data: ClientProfileDTO,
    params: RequestParams = {},
  ) =>
    this.request<ClientProfileDTO, void>({
      path: `/api/v1/profile/${userId}`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags onboarding-controller
   * @name RequestVerification
   * @request POST:/api/v1/onboarding/me/verification/{channel}/request
   * @secure
   */
  requestVerification = (channel: string, params: RequestParams = {}) =>
    this.request<VerificationChallengeResponse, any>({
      path: `/api/v1/onboarding/me/verification/${channel}/request`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags onboarding-controller
   * @name ConfirmMobile
   * @request POST:/api/v1/onboarding/me/verification/mobile/confirm
   * @secure
   */
  confirmMobile = (
    data: VerificationConfirmRequest,
    params: RequestParams = {},
  ) =>
    this.request<OnboardingStatusResponse, any>({
      path: `/api/v1/onboarding/me/verification/mobile/confirm`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags onboarding-controller
   * @name ConfirmEmail
   * @request POST:/api/v1/onboarding/me/verification/email/confirm
   * @secure
   */
  confirmEmail = (
    data: VerificationConfirmRequest,
    params: RequestParams = {},
  ) =>
    this.request<OnboardingStatusResponse, any>({
      path: `/api/v1/onboarding/me/verification/email/confirm`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags onboarding-controller
   * @name Complete
   * @request POST:/api/v1/onboarding/me/complete
   * @secure
   */
  complete = (params: RequestParams = {}) =>
    this.request<OnboardingStatusResponse, any>({
      path: `/api/v1/onboarding/me/complete`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * @description Retrieves the financial data for the specified profile ID.
   *
   * @tags Financial Data
   * @name GetFinancialData
   * @summary Get Financial Data
   * @request GET:/api/v1/financial-data/{profileId}
   * @secure
   */
  getFinancialData = (profileId: string, params: RequestParams = {}) =>
    this.request<FinancialDataDTO, void>({
      path: `/api/v1/financial-data/${profileId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Creates or updates the financial data for the specified profile ID.
   *
   * @tags Financial Data
   * @name CreateOrUpdateFinancialData
   * @summary Create or Update Financial Data
   * @request POST:/api/v1/financial-data/{profileId}
   * @secure
   */
  createOrUpdateFinancialData = (
    profileId: string,
    data: FinancialDataDTO,
    params: RequestParams = {},
  ) =>
    this.request<FinancialDataDTO, void>({
      path: `/api/v1/financial-data/${profileId}`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Creates a Keycloak user and the linked local draft profile.
   *
   * @tags Authentication
   * @name Register
   * @summary Registration
   * @request POST:/api/v1/auth/register
   * @secure
   */
  register = (data: SignupRequest, params: RequestParams = {}) =>
    this.request<SignupResponse, void>({
      path: `/api/v1/auth/register`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Exchanges email and password for a Keycloak token and returns the linked local user.
   *
   * @tags Authentication
   * @name Login
   * @summary Login
   * @request POST:/api/v1/auth/login
   * @secure
   */
  login = (data: LoginRequest, params: RequestParams = {}) =>
    this.request<LoginResponse, void>({
      path: `/api/v1/auth/login`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Health
   * @name Ping
   * @summary Ping the server to check connectivity
   * @request GET:/api/v1/ping
   * @secure
   */
  ping = (params: RequestParams = {}) =>
    this.request<string, any>({
      path: `/api/v1/ping`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags onboarding-controller
   * @name GetStatus
   * @request GET:/api/v1/onboarding/me
   * @secure
   */
  getStatus = (params: RequestParams = {}) =>
    this.request<OnboardingStatusResponse, any>({
      path: `/api/v1/onboarding/me`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description Calculates budget health based on monthly income and expenses.
   *
   * @tags Financial Data
   * @name GetBudgetHealth
   * @summary Get Budget Health
   * @request GET:/api/v1/financial-data/{profileId}/budget-health
   * @secure
   */
  getBudgetHealth = (profileId: string, params: RequestParams = {}) =>
    this.request<BudgetHealthAnalysisDTO, void>({
      path: `/api/v1/financial-data/${profileId}/budget-health`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Returns the current authenticated local user linked to the Keycloak token.
   *
   * @tags Authentication
   * @name CurrentUser
   * @summary Current User
   * @request GET:/api/v1/auth/me
   * @secure
   */
  currentUser = (params: RequestParams = {}) =>
    this.request<JwtResponse, void>({
      path: `/api/v1/auth/me`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}

