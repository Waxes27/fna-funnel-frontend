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
  ClientProfileDTO,
  FinancialDataDTO,
  JwtResponse,
  LoginRequest,
  MessageResponse,
  RiskProfileDTO,
  SignupRequest,
} from "./models";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
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
   * @description Registers a new user on the platform.
   *
   * @tags Authentication
   * @name RegisterUser
   * @summary User Registration
   * @request POST:/api/v1/auth/register
   * @secure
   */
  registerUser = (data: SignupRequest, params: RequestParams = {}) =>
    this.request<MessageResponse, void>({
      path: `/api/v1/auth/register`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Authenticates a user and returns a JWT token.
   *
   * @tags Authentication
   * @name AuthenticateUser
   * @summary User Login
   * @request POST:/api/v1/auth/login
   * @secure
   */
  authenticateUser = (data: LoginRequest, params: RequestParams = {}) =>
    this.request<JwtResponse, void>({
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
}

