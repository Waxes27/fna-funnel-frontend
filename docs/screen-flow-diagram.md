# Application Screen Flow & Navigation Architecture

This document maps the complete application navigation flow and user journeys based on roles and permissions.

## High-Level Screen Flow Diagram

```mermaid
graph TD
    %% Public / Unauthenticated Flow
    Start((Start)) --> AuthRouter{Authenticated?}
    AuthRouter -- No --> Welcome[Welcome Carousel]
    Welcome --> SignupMethod[Sign-up Method]
    SignupMethod --> EmailSignup[Email Sign-up]
    SignupMethod --> Login[Login Screen]
    EmailSignup --> OTP[OTP Verification]
    Login --> OTP

    %% Client Onboarding Gateway
    AuthRouter -- "ROLE_CLIENT + Incomplete Setup" --> Goals[Goals]
    OTP --> Goals
    Goals --> ValueExplainer[Value Explainer]
    ValueExplainer --> LegalName[Legal Name]
    LegalName --> DateOfBirth[Date of Birth]
    DateOfBirth --> ContactDetails[Contact Details]
    ContactDetails --> HouseholdEmployment[Household & Employment]
    HouseholdEmployment --> FinancialSnapshot[Financial Snapshot]
    FinancialSnapshot --> RiskQuiz[Risk Quiz]
    RiskQuiz --> Consent[Consent]
    Consent --> NotificationPrompt[Notification Prompt]
    NotificationPrompt --> AccountConnection[Account Connection]
    AccountConnection --> SetupSummary[Setup Summary]
    SetupSummary --> ClientDash[Client Dashboard]
    ClientDash --> ResumeSetup[Continue Setup CTA]
    ResumeSetup --> Goals

    %% Completed Client Journey
    AuthRouter -- "ROLE_CLIENT + Complete Setup" --> ClientDash
    ClientDash --> AnalysisResults[Financial Analysis Results]
    AnalysisResults --> BudgetView[Budget Analysis View]
    AnalysisResults --> FNAView[FNA & Insurance Gaps]
    AnalysisResults --> RetirementView[Retirement Projection]
    AnalysisResults --> EstateView[Estate Planning Analysis]
    
    RetirementView --> ScenarioSim[Scenario Simulation Engine]
    
    ClientDash --> AIAssistant[AI Financial Assistant Chat]
    
    ClientDash --> Reports[Reports Center]
    Reports --> DownloadReport[Download Financial Health PDF]
    
    ClientDash --> Booking[Book Adviser Consultation]

    %% Adviser User Journey
    AuthRouter -- "ROLE_ADVISER" --> AdviserDash[Adviser Dashboard]
    
    AdviserDash --> ClientList[Assigned Clients List]
    ClientList --> ClientFile[Client File Overview]
    
    ClientFile --> ReviewAnalysis[Review Financial Analysis]
    ClientFile --> EditAssumptions[Edit Financial Assumptions]
    ClientFile --> PrepareAdvice[Prepare Advice & Notes]
    
    PrepareAdvice --> ExportAdviserReport[Export Adviser Report PDF]

    %% Admin User Journey
    AuthRouter -- "ROLE_ADMIN" --> AdminDash[Admin Dashboard]
    
    AdminDash --> ManageUsers[User Management]
    AdminDash --> PlatformSettings[Platform Settings]
    PlatformSettings --> GlobalAssumptions[Manage Global Assumptions<br>Inflation, Returns]
    AdminDash --> Analytics[Platform Analytics Monitoring]

    %% Global Elements
    ClientDash -.-> Notifications[Notifications Center]
    AdviserDash -.-> Notifications
    AdminDash -.-> Notifications
    
    %% Audit Logic (Background Process)
    EditAssumptions -.-> AuditLog[(Audit Log)]
    AIAssistant -.-> AuditLog
    ContactDetails -.-> AuditLog
    FinancialSnapshot -.-> AuditLog
```

## User Journeys & Navigation Patterns

### 1. Unauthenticated Journey (Public Flow)
- **Entry Point:** New users start in the mobile-first welcome carousel rather than a flat landing/login split.
- **Primary Path:** Welcome -> Sign-up method -> Email sign-up -> OTP verification.
- **Secondary Path:** Returning users can jump from the sign-up method screen into Login and re-enter the guided setup at the correct authenticated step.

### 2. Client User Journey (`ROLE_CLIENT`)
- **Onboarding Gate:** Authenticated client users stay inside `OnboardingNavigator` until `isOnboardingComplete` is true.
- **Guided Setup:** The flow progresses through goals, explanation, identity, contact, household/employment, financial snapshot, risk, consent, notifications, account connection, and summary.
- **Resume Entry:** If profile data is missing from Home, the dashboard exposes a Continue Setup CTA that reopens onboarding at the first incomplete setup step.
- **Exploration:** Once setup is complete, clients can branch out to view specific analysis modules (Budget, FNA, Retirement, Estate).
- **Interactive Tools:** From the Retirement view, users can navigate into the Scenario Simulation Engine. The AI Financial Assistant is accessible directly from the dashboard.
- **Output:** Clients can visit the Reports Center to download their health PDF or proceed to book a consultation.

### 3. Financial Adviser Journey (`ROLE_ADVISER`)
- **Dashboard:** Advisers land on a specialized dashboard featuring key alerts and an overview of their assigned clients.
- **Client Management:** Advisers navigate from the Client List into a specific Client File.
- **Advising Flow:** Inside the Client File, advisers can review the client's analysis, edit financial assumptions specific to that client, and prepare advice.
- **Output:** The flow culminates in the ability to export a comprehensive Adviser Report for the consultation.

### 4. System Administrator Journey (`ROLE_ADMIN`)
- **Dashboard:** Admins access an overview of system health and platform analytics.
- **Management:** Navigation is divided into managing user access and modifying global platform settings (like default inflation and return rates).

### 5. Cross-Cutting Concerns
- **Notifications:** A persistent notification center is accessible from all authenticated dashboards, providing alerts for profile completion, identified financial risks, or new client registrations.
- **Compliance Logging:** Background processes capture changes made in Profile Setup, Data Capture, Assumption Editing, and AI Chats, routing them securely to the Audit Log.
