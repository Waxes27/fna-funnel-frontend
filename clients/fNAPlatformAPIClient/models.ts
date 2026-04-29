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
  fullName?: string;
  /** @format date */
  dateOfBirth?: string;
  idNumber?: string;
  maritalStatus?: string;
  /** @format int32 */
  numberOfDependants?: number;
  mobileNumber?: string;
  email?: string;
  residentialAddress?: string;
  employmentStatus?: string;
  occupation?: string;
  employer?: string;
  annualIncome?: number;
  spouseIncome?: number;
  householdExpenses?: number;
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

/** Registration details */
export interface SignupRequest {
  email: string;
  /**
   * @minLength 8
   * @maxLength 2147483647
   */
  password: string;
  role?: string;
}

export interface MessageResponse {
  message?: string;
}

/** Login credentials */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface JwtResponse {
  token?: string;
  type?: string;
  id?: string;
  email?: string;
  role?: string;
}
