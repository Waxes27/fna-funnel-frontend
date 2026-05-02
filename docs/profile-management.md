# Profile Management System

## Overview
This document outlines the Profile Management System developed for `CLIENT` role users in the Momentum FNA application.

## Components

### 1. `ProfileScreen`
**Location:** `src/screens/ProfileScreen.tsx`
- **Purpose:** A clean, minimalistic, and responsive form where the user can view and edit their profile details.
- **Dependencies:** Uses `react-hook-form` for efficient form state management and `@hookform/resolvers/zod` + `zod` for strict schema-based validation.
- **Features:** 
  - On mount, fetches profile data using `profileService.getProfile`.
  - Maps API response (`ClientProfileDTO`) to form default values. If a 404 is encountered (no profile exists yet), it initializes an empty form populated with the user's login email.
  - Submits data via `profileService.createOrUpdateProfile` with a comprehensive set of validations:
    - Full Name (required)
    - Mobile Number (required, min 10 chars)
    - ID Number (required, min 5 chars)
    - Email (required, valid email format)
  - Features loading states utilizing the centralized `useApi` hook.

### 2. `ClientTabNavigator` (inside `MainNavigator`)
**Location:** `src/navigation/MainNavigator.tsx`
- **Purpose:** Renders a bottom tab navigation bar for `CLIENT` role users, granting them prominent and quick access to their Home and Profile screens.
- **Dependencies:** `@react-navigation/bottom-tabs` and `@expo/vector-icons` (Ionicons).
- **Behavior:** 
  - Replaces the generic stack navigator if the user logged in holds the `'CLIENT'` role.
  - Displays "Home" and "Profile" tabs.
  - Keeps the app scalable by allowing role-based navigation rendering without duplicating screen code.

### 3. `useAppStore` enhancements
**Location:** `src/store/appStore.ts`
- **Purpose:** Globally cache profile data to minimize API calls and synchronize UI elements that might rely on the user's latest name or avatar.
- **Enhancements:** Added `profile` state variable alongside the authentication state, plus a `setProfile` action.

## API Integrations
- **`profileService.ts`**: Provides `getProfile(userId)` and `createOrUpdateProfile(userId, dto)`.
- It relies on `apiService.ts` to ensure that standard error handling, authentication headers (`Authorization: Bearer <token>`), and automatic network retries are applied transparently.

## Unit Tests
- Fully tested the `ProfileScreen` logic (`src/screens/__tests__/ProfileScreen.test.tsx`):
  - Validates correct loading of the `getProfile` API call.
  - Validates graceful handling of the `404 Not Found` state.
  - Validates required form fields trigger error messages and prevent API submission.
  - Validates successful form submission and global state updating.
