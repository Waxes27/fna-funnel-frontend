# Frontend Architecture & Specification

**Project:** AI Financial Advisor Platform (Momentum-Aligned)

This document outlines the client-side architecture, UI/UX specifications, and frontend implementation details. For server-side logic and database architecture, please refer to the `backend-specification.md`.

---

## 1. Technology Stack & Architecture

### 1.1 Client-Side Technologies

- **Framework:** React Native (React)
- **State Management:** Zustand for auth, onboarding gating, and draft persistence
- **Styling:** Theme-token-driven React Native design system built on `Screen`, `Surface`, `Typography`, `Input`, and `Button`
- **Data Fetching:** Axios service layer for backend API integration, with room for query caching as dashboard data grows
- **Charting/Visuals:** Recharts or Chart.js (for Scenario Simulation and Budget breakdown)
- **Form Management:** React Hook Form + Zod (for validation aligning with backend DTOs)

### 1.2 Frontend Architecture

- **Navigation:** React Navigation with `RootNavigator`, `AuthNavigator`, `OnboardingNavigator`, and `MainNavigator`
- **Component Structure:** Shared primitives plus onboarding composition components (`OnboardingShell`, `OnboardingHeader`, `OnboardingCard`, `OnboardingActionBar`, `OnboardingProgress`) layered on top of the base design system
- **Authentication Flow:**
  - Token-based auth state stored in Zustand after login or sign-up
  - Role-based routing (Client vs. Adviser vs. Admin) handled in `RootNavigator`
  - Client users with incomplete setup are routed into onboarding until the setup summary marks completion

---

## 2. UI/UX & Browser Compatibility

### 2.1 UI/UX Specifications

- **Design System:** Consistent Momentum-aligned branding (colors, typography).
- **Accessibility:** WCAG 2.1 AA compliance (ARIA labels, keyboard navigation, screen reader support).
- **Responsiveness:** Mobile-first approach. Onboarding screens are optimized for handheld devices first, while dashboards gracefully degrade on smaller screens.
- **Progressive Disclosure:** Complex onboarding and financial capture forms are divided into one-decision-per-screen steps with persistent progress feedback.
- **Resume Behavior:** Home can reopen onboarding at the first incomplete step when profile setup is missing or interrupted.

### 2.2 Browser Compatibility

- Evergreen browsers (Chrome, Firefox, Safari, Edge) - last 2 major versions.
- iOS Safari 14+ and Android Chrome 90+.

---

## 3. Core Modules (Frontend Implementation)

### 3.1 Authentication & User Management

- **Welcome & Sign-up Entry:** New users start from a welcome carousel and sign-up method selector before entering email credentials.
- **Login/Registration:** Email sign-up and returning-user login remain available as focused secondary entry points.
- **MFA:** OTP input screens integrate with backend verification endpoints before the client profile wizard begins.

### 3.2 Data Capture & Profiling

- **Client Profile Wizard:** Guided onboarding sequence for goals, value explanation, legal name, date of birth, contact details, household/employment, financial snapshot, risk, consent, notifications, account connection, and summary.
- **Draft Persistence:** `useAppStore` tracks `onboardingStep`, `isOnboardingComplete`, and `profileDraft` so users can resume setup coherently.
- **Financial Data:** The first release captures a lightweight monthly snapshot during onboarding, with richer assets/liabilities capture reserved for deeper flows.

### 3.3 Dashboards & Visualizations

- **Client Portal:** Displays Budget Health Score, Expense breakdowns (pie charts), Retirement projections (line graphs).
- **Adviser Dashboard:** Tabular data with advanced filtering/sorting, client overview cards, and "Edit Assumptions" modal.
- **Admin Panel:** Data grids for platform analytics and assumption variable controls.

### 3.4 AI Assistant Interface

- Chat UI component featuring typing indicators, message history, and suggested prompts.
- Handles Markdown rendering for AI responses and strictly routes product queries to "Consult Adviser" CTAs.

---

## 4. Integration Points & Shared Data Models

### 4.1 Communication Protocols

- **RESTful API:** Primary communication with the Spring Boot backend via JSON over HTTPS.
- **WebSockets/SSE:** Optional for real-time AI typing streams (if supported by backend AI layer).

### 4.2 Shared Data Models (TypeScript Interfaces)

To maintain parity with backend DTOs:

```typescript
interface UserProfile {
  id: string;
  role: 'CLIENT' | 'ADVISER' | 'ADMIN';
  email: string;
  firstName: string;
  lastName: string;
}

interface FinancialData {
  monthlyIncome: number;
  monthlyExpenses: number;
  assets: Asset[];
  liabilities: Liability[];
}
```

### 4.3 Authentication Flow Integration

1. New users enter through Welcome -> Sign-up Method -> Email Sign-up -> OTP Verification.
2. Frontend stores the authenticated user and onboarding state in Zustand.
3. `RootNavigator` routes authenticated client users into onboarding until `completeOnboarding()` is called from the setup summary.
4. Existing users or completed clients are routed to `MainNavigator`, while advisers and admins bypass the onboarding flow.

---

## 5. Performance Optimization

- **Image & Asset Optimization:** Next/Image for WebP conversion and lazy loading.
- **Code Splitting:** Dynamic imports for heavy chart libraries (`next/dynamic`).
- **Caching:** React Query caching for dashboard data to minimize redundant backend calls.
- **Debouncing:** Input fields in the AI chat and data capture forms to reduce API thrashing.

---

## 6. Testing Strategy

- **Unit Testing:** Jest and React Testing Library for store gating, onboarding primitives, step validation, and navigator routing.
- **Focused Flow Coverage:** Root navigation, OTP verification, goals selection, onboarding summary completion, and resume behavior are validated with targeted tests.
- **End-to-End (E2E):** Detox or Maestro can cover critical mobile journeys such as sign-up, resume setup, and complete-profile paths.
- **Visual Regression:** Chromatic (optional) to ensure UI consistency.

---

## 7. Deployment & DevOps

### 7.1 Version Control

- **Git Flow:** Feature branching (`feat/`, `fix/`, `chore/`) off the `develop` branch.
- **Code Quality:** Pre-commit hooks using Husky (ESLint, Prettier, TypeScript compilation checks).

### 7.2 Environment Variables

Required `.env.local` configuration:

```env
API_BASE_URL=https://api.momentum-fna.com/v1
AI_ASSISTANT_ENABLED=true
ENVIRONMENT=production
```

### 7.3 Deployment Procedure

- **Platform:** Vercel, AWS Amplify, or Dockerized on AWS ECS (aligning with backend cloud).
- **CI/CD:** GitHub Actions pipeline to run tests, build the React Native app, and deploy to staging/production automatically on branch merges.
